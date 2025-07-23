import Queue from 'bull';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { logToFile } from '../utils/logger';
import { AppError } from '../middleware/errorHandler.middleware';

const prisma = new PrismaClient();

interface EmailJob {
  email: string;
  subject: string;
  message: string;
  priority?: number;
  delay?: number;
}

interface RetryConfig {
  maxAttempts: number;
  backoffDelay: number;
  exponentialBackoff: boolean;
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,
  backoffDelay: 1000,
  exponentialBackoff: true,
};

// Create email queue
export const emailQueue = new Queue<EmailJob>('email-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  defaultJobOptions: {
    attempts: DEFAULT_RETRY_CONFIG.maxAttempts,
    backoff: {
      type: DEFAULT_RETRY_CONFIG.exponentialBackoff ? 'exponential' : 'fixed',
      delay: DEFAULT_RETRY_CONFIG.backoffDelay,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Track email failure in database
const trackEmailFailure = async (jobId: string, emailData: EmailJob, error: any, attempts: number) => {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    await prisma.emailFailure.upsert({
      where: { jobId },
      update: {
        attempts,
        lastAttempt: new Date(),
        error: errorMessage,
        nextRetry: calculateNextRetry(attempts),
        isResolved: false,
      },
      create: {
        jobId,
        email: emailData.email,
        subject: emailData.subject,
        message: emailData.message,
        error: errorMessage,
        attempts,
        lastAttempt: new Date(),
        nextRetry: calculateNextRetry(attempts),
      },
    });
    
    logToFile('emailQueue', `Email failure tracked for job ${jobId} (attempt ${attempts})`);
  } catch (dbError) {
    logToFile('emailQueue', `Failed to track email failure in database for job ${jobId}`, dbError);
  }
};

// Calculate next retry time based on exponential backoff
const calculateNextRetry = (attempts: number): Date => {
  const baseDelay = DEFAULT_RETRY_CONFIG.backoffDelay;
  const delay = DEFAULT_RETRY_CONFIG.exponentialBackoff 
    ? baseDelay * Math.pow(2, attempts - 1)
    : baseDelay;
  
  return new Date(Date.now() + delay);
};

// Mark email failure as resolved
const markEmailFailureResolved = async (jobId: string) => {
  try {
    await prisma.emailFailure.update({
      where: { jobId },
      data: { isResolved: true },
    });
    logToFile('emailQueue', `Email failure marked as resolved for job ${jobId}`);
  } catch (error) {
    logToFile('emailQueue', `Failed to mark email failure as resolved for job ${jobId}`, error);
  }
};

// Process email jobs
emailQueue.process(async (job) => {
  const { email, subject, message } = job.data;
  const attempts = job.attemptsMade + 1;

  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    logToFile('emailQueue', `Email sent successfully to ${email} (attempt ${attempts})`);
    
    // Mark as resolved if it was previously failed
    await markEmailFailureResolved(job.id.toString());
    
    return { success: true, attempts };
  } catch (error) {
    logToFile('emailQueue', `Failed to send email to ${email} (attempt ${attempts})`, error);
    
    // Track failure in database
    await trackEmailFailure(job.id.toString(), job.data, error, attempts);
    
    throw error;
  }
});

// Handle queue events
emailQueue.on('completed', (job) => {
  logToFile('emailQueue', `Job ${job.id} completed for ${job.data.email}`);
});

emailQueue.on('failed', (job, error) => {
  if (job) {
    logToFile('emailQueue', `Job ${job.id} failed for ${job.data.email} (attempt ${job.attemptsMade})`, error);
  }
});

emailQueue.on('stalled', (job) => {
  logToFile('emailQueue', `Job ${job?.id} stalled for ${job?.data.email}`);
});

// Add email to queue
export const addToEmailQueue = async (emailData: EmailJob, retryConfig?: Partial<RetryConfig>) => {
  try {
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    
    const job = await emailQueue.add(emailData, {
      attempts: config.maxAttempts,
      backoff: {
        type: config.exponentialBackoff ? 'exponential' : 'fixed',
        delay: config.backoffDelay,
      },
      delay: emailData.delay || 0,
      priority: emailData.priority || 0,
    });
    
    logToFile('emailQueue', `Email job ${job.id} added to queue for ${emailData.email}`);
    return job;
  } catch (error) {
    logToFile('emailQueue', `Failed to add email job to queue for ${emailData.email}`, error);
    throw error;
  }
};

// Retry failed email
export const retryFailedEmail = async (failureId: string) => {
  try {
    const failure = await prisma.emailFailure.findUnique({
      where: { id: failureId },
    });

    if (!failure) {
      throw new AppError('Email failure not found', 404);
    }

    if (failure.isResolved) {
      throw new AppError('Email failure is already resolved', 400);
    }

    if (failure.attempts >= failure.maxAttempts) {
      throw new AppError('Maximum retry attempts reached', 400);
    }

    // Add to queue for retry
    const job = await addToEmailQueue({
      email: failure.email,
      subject: failure.subject,
      message: failure.message,
    });

    // Update failure record with new job ID
    await prisma.emailFailure.update({
      where: { id: failureId },
      data: {
        jobId: job.id.toString(),
        attempts: 0,
        lastAttempt: new Date(),
        nextRetry: null,
      },
    });

    logToFile('emailQueue', `Failed email ${failureId} queued for retry with job ${job.id}`);
    return job;
  } catch (error) {
    logToFile('emailQueue', `Failed to retry email ${failureId}`, error);
    throw error;
  }
};

// Retry all failed emails
export const retryAllFailedEmails = async () => {
  try {
    const failedEmails = await prisma.emailFailure.findMany({
      where: {
        isResolved: false,
        attempts: { lt: 5 },
        OR: [
          { nextRetry: { lte: new Date() } },
          { nextRetry: null },
        ],
      },
    });

    const results = [];
    for (const failure of failedEmails) {
      try {
        const job = await retryFailedEmail(failure.id);
        results.push({ failureId: failure.id, jobId: job.id, status: 'queued' });
      } catch (error) {
        results.push({ failureId: failure.id, status: 'failed', error: error.message });
      }
    }

    logToFile('emailQueue', `Retried ${results.length} failed emails`);
    return results;
  } catch (error) {
    logToFile('emailQueue', 'Failed to retry all failed emails', error);
    throw error;
  }
};

// Get queue status
export const getQueueStatus = async () => {
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      emailQueue.getWaitingCount(),
      emailQueue.getActiveCount(),
      emailQueue.getCompletedCount(),
      emailQueue.getFailedCount(),
    ]);

    // Get database failure counts
    const [totalFailures, unresolvedFailures, pendingRetries] = await Promise.all([
      prisma.emailFailure.count(),
      prisma.emailFailure.count({ where: { isResolved: false } }),
      prisma.emailFailure.count({
        where: {
          isResolved: false,
          attempts: { lt: 5 },
          OR: [
            { nextRetry: { lte: new Date() } },
            { nextRetry: null },
          ],
        },
      }),
    ]);

    return { 
      waiting, 
      active, 
      completed, 
      failed,
      totalFailures,
      unresolvedFailures,
      pendingRetries,
    };
  } catch (error) {
    logToFile('emailQueue', 'Error getting queue status', error);
    throw error;
  }
};

// Get job details
export const getJobDetails = async (jobId: string) => {
  try {
    const job = await emailQueue.getJob(jobId);
    if (!job) throw new AppError('Job not found', 404);
    
    // Get failure details from database
    const failure = await prisma.emailFailure.findUnique({
      where: { jobId },
    });

    return {
      id: job.id,
      data: job.data,
      status: await job.getState(),
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      failureDetails: failure,
    };
  } catch (error) {
    logToFile('emailQueue', `Error getting job details for ${jobId}`, error);
    throw error;
  }
};

// Get all jobs
export const getAllJobs = async () => {
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      emailQueue.getWaiting(),
      emailQueue.getActive(),
      emailQueue.getCompleted(),
      emailQueue.getFailed()
    ]);

    return { waiting, active, completed, failed };
  } catch (error) {
    logToFile('emailQueue', 'Error getting all jobs', error);
    throw error;
  }
};

// Get all email failures
export const getAllEmailFailures = async (page = 1, limit = 10, resolved?: boolean) => {
  try {
    const skip = (page - 1) * limit;
    
    const where = resolved !== undefined ? { isResolved: resolved } : {};
    
    const [failures, total] = await Promise.all([
      prisma.emailFailure.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastAttempt: 'desc' },
      }),
      prisma.emailFailure.count({ where }),
    ]);

    return {
      failures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logToFile('emailQueue', 'Error getting email failures', error);
    throw error;
  }
};

// Get email failure by ID
export const getEmailFailureById = async (failureId: string) => {
  try {
    const failure = await prisma.emailFailure.findUnique({
      where: { id: failureId },
    });

    if (!failure) {
      throw new AppError('Email failure not found', 404);
    }

    return failure;
  } catch (error) {
    logToFile('emailQueue', `Error getting email failure ${failureId}`, error);
    throw error;
  }
};

// Clean up resolved failures (older than specified days)
export const cleanupResolvedFailures = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.emailFailure.deleteMany({
      where: {
        isResolved: true,
        updatedAt: { lt: cutoffDate },
      },
    });

    logToFile('emailQueue', `Cleaned up ${result.count} resolved email failures older than ${daysOld} days`);
    return result.count;
  } catch (error) {
    logToFile('emailQueue', 'Error cleaning up resolved failures', error);
    throw error;
  }
};

// Scheduled retry mechanism
let retryInterval: NodeJS.Timeout | null = null;

export const startScheduledRetries = (intervalMinutes = 5) => {
  if (retryInterval) {
    clearInterval(retryInterval);
  }

  retryInterval = setInterval(async () => {
    try {
      const results = await retryAllFailedEmails();
      if (results.length > 0) {
        logToFile('emailQueue', `Scheduled retry: ${results.length} emails queued for retry`);
      }
    } catch (error) {
      logToFile('emailQueue', 'Scheduled retry failed', error);
    }
  }, intervalMinutes * 60 * 1000);

  logToFile('emailQueue', `Scheduled retries started with ${intervalMinutes} minute interval`);
};

export const stopScheduledRetries = () => {
  if (retryInterval) {
    clearInterval(retryInterval);
    retryInterval = null;
    logToFile('emailQueue', 'Scheduled retries stopped');
  }
};

// Initialize scheduled retries on service startup
startScheduledRetries(5); // Retry every 5 minutes 