import express from 'express';
import {
  createRoleController,
  getRoles,
  getRole,
  updateRoleController,
  deleteRoleController,
  assignPermissionsController,
} from '../../controllers/role.controller';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import {
  createRoleSchema,
  updateRoleSchema,
} from '../../validation/schemas';

const router = express.Router();

// Protect all routes
router.use(protect);

// Restrict to admin role
// router.use(restrictTo('admin'));

router.route('/')
  .post(validate(createRoleSchema), createRoleController)
  .get(getRoles);

router.route('/:id')
  .get(getRole)
  .patch(validate(updateRoleSchema), updateRoleController)
  .delete(deleteRoleController);

router.post('/:roleId/permissions', assignPermissionsController);

export default router; 