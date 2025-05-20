import express from 'express';
import { protect } from '../../middleware/auth';
import { updateProfileController, getProfileController } from '../../controllers/userController';
import upload from '../../utils/multer';

const router = express.Router();

// Protect all routes
router.use(protect);

// Profile routes
router.get('/profile', getProfileController);
router.patch('/profile', upload.single('profileImage'), updateProfileController);

export default router; 