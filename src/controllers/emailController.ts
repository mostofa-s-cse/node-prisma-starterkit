import { Request, Response, NextFunction } from 'express';
import { getQueueStatus, getJobDetails, getAllJobs } from '../services/emailQueueService';

export const getEmailQueueStatus = async (
  req: Request,
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
  req: Request,
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