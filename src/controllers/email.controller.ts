import { Request, Response, NextFunction } from 'express';
import { 
  getQueueStatus, 
  getJobDetails, 
  getAllJobs,
  retryFailedEmail,
  retryAllFailedEmails,
  getAllEmailFailures,
  getEmailFailureById,
  cleanupResolvedFailures
} from '../services/emailQueue.service';

export const getEmailQueueStatus = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = await getQueueStatus();
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
};

export const getJobInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = req.params;
    const jobInfo = await getJobDetails(jobId);
    res.status(200).json({
      success: true,
      data: jobInfo
    });
  } catch (error) {
    next(error);
  }
};

export const getAllQueueJobs = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await getAllJobs();
    res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// Get all email failures with pagination
export const getEmailFailures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const resolved = req.query.resolved !== undefined 
      ? req.query.resolved === 'true' 
      : undefined;

    const result = await getAllEmailFailures(page, limit, resolved);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get specific email failure by ID
export const getEmailFailure = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { failureId } = req.params;
    const failure = await getEmailFailureById(failureId);
    res.status(200).json({
      success: true,
      data: failure
    });
  } catch (error) {
    next(error);
  }
};

// Retry a specific failed email
export const retryEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { failureId } = req.params;
    const job = await retryFailedEmail(failureId);
    res.status(200).json({
      success: true,
      message: 'Email queued for retry',
      data: {
        failureId,
        jobId: job.id,
        status: 'queued'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Retry all failed emails
export const retryAllEmails = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await retryAllFailedEmails();
    res.status(200).json({
      success: true,
      message: `Retried ${results.length} failed emails`,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// Clean up resolved failures
export const cleanupFailures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const daysOld = parseInt(req.query.daysOld as string) || 30;
    const cleanedCount = await cleanupResolvedFailures(daysOld);
    res.status(200).json({
      success: true,
      message: `Cleaned up ${cleanedCount} resolved email failures`,
      data: { cleanedCount, daysOld }
    });
  } catch (error) {
    next(error);
  }
}; 