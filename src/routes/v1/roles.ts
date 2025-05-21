import express from 'express';
import {
  createRoleController,
  getRoles,
  getRole,
  updateRoleController,
  deleteRoleController,
  assignPermissionsController,
} from '../../controllers/roleController';
import { protect, restrictTo } from '../../middleware/auth';

const router = express.Router();

// Protect all routes
router.use(protect);

// Restrict to admin role
// router.use(restrictTo('admin'));

router.route('/')
  .post(createRoleController)
  .get(getRoles);

router.route('/:id')
  .get(getRole)
  .patch(updateRoleController)
  .delete(deleteRoleController);

router.post('/:roleId/permissions', assignPermissionsController);

export default router; 