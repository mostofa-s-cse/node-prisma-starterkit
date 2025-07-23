import express from 'express';
import { 
  getEmailQueueStatus, 
  getJobInfo, 
  getAllQueueJobs,
  getEmailFailures,
  getEmailFailure,
  retryEmail,
  retryAllEmails,
  cleanupFailures
} from '../../controllers/email.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

// Queue management
router.get('/queue-status', getEmailQueueStatus);
router.get('/', protect, getAllQueueJobs);
router.get('/:jobId', protect, getJobInfo);

// Failure management
router.get('/failures', protect, getEmailFailures);
router.get('/failures/:failureId', protect, getEmailFailure);

// Retry operations
router.post('/failures/:failureId/retry', protect, retryEmail);
router.post('/failures/retry-all', protect, retryAllEmails);

// Cleanup
router.delete('/failures/cleanup', protect, cleanupFailures);

export default router; 