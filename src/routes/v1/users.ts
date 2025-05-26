import express from 'express';
import {
  createUserController,
  getUsers,
  getUser,
  searchUsersController,
  updateUserController,
  deleteUserController,
} from '../../controllers/userController';
import { protect } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import {
  createUserSchema,
  updateUserSchema,
} from '../../validation/schemas';
import upload from '../../utils/multer';

const router = express.Router();

// Protect all routes
router.use(protect);

// Restrict to admin role
// router.use(restrictTo('admin'));

// Search users
router.get('/search', searchUsersController);

// Get all users with pagination
router.get('/', getUsers);

// Create user
router.post('/', validate(createUserSchema), upload.single('profileImage'), createUserController);

// Get, update, and delete specific user
router.route('/:id')
  .get(getUser)
  .patch(validate(updateUserSchema), upload.single('profileImage'), updateUserController)
  .delete(deleteUserController);

export default router; 