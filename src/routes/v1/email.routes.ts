import express from 'express';
import { getEmailQueueStatus, getJobInfo, getAllQueueJobs } from '../../controllers/email.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/queue-status', getEmailQueueStatus);
router.get('/', protect, getAllQueueJobs);
router.get('/:jobId', protect, getJobInfo);

export default router; 