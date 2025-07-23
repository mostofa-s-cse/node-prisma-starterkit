import Queue from 'bull';
import nodemailer from 'nodemailer';
import { logToFile } from '../utils/logger';

interface EmailJob {
  email: string;
  subject: string;
  message: string;
}

// Create email queue
export const emailQueue = new Queue<EmailJob>('email-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
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

// Process email jobs
emailQueue.process(async (job) => {
  const { email, subject, message } = job.data;

  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    logToFile('emailQueue', `Email sent successfully to ${email}`);
    return { success: true };
  } catch (error) {
    logToFile('emailQueue', `Failed to send email to ${email}`, error);
    throw error;
  }
});

// Handle queue events
emailQueue.on('completed', (job) => {
  logToFile('emailQueue', `Job ${job.id} completed for ${job.data.email}`);
});

emailQueue.on('failed', (job, error) => {
  logToFile('emailQueue', `Job ${job?.id} failed for ${job?.data.email}`, error);
});

// Add email to queue
export const addToEmailQueue = async (emailData: EmailJob) => {
  try {
    const job = await emailQueue.add(emailData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
    logToFile('emailQueue', `Email job ${job.id} added to queue for ${emailData.email}`);
    return job;
  } catch (error) {
    logToFile('emailQueue', `Failed to add email job to queue for ${emailData.email}`, error);
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

    return { waiting, active, completed, failed };
  } catch (error) {
    logToFile('emailQueue', 'Error getting queue status', error);
    throw error;
  }
};

// Get job details
export const getJobDetails = async (jobId: string) => {
  try {
    const job = await emailQueue.getJob(jobId);
    if (!job) throw new Error('Job not found');
    return {
      id: job.id,
      data: job.data,
      status: await job.getState(),
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason
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