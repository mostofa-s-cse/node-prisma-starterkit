import express from 'express';
import {
  createPermissionController,
  getPermissions,
  getPermission,
  updatePermissionController,
  deletePermissionController,
} from '../../controllers/permissionController';
import { protect, restrictTo } from '../../middleware/auth';

const router = express.Router();

// Protect all routes
router.use(protect);

// Restrict to admin role
router.use(restrictTo('admin'));

router.route('/')
  .post(createPermissionController)
  .get(getPermissions);

router.route('/:id')
  .get(getPermission)
  .patch(updatePermissionController)
  .delete(deletePermissionController);

export default router; 