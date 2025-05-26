import express from 'express';
import {
  createPermissionController,
  getPermissions,
  getPermission,
  updatePermissionController,
  deletePermissionController,
} from '../../controllers/permissionController';
import { protect } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import {
  createPermissionSchema,
  updatePermissionSchema,
} from '../../validation/schemas';

const router = express.Router();

// Protect all routes
router.use(protect);

// Restrict to admin role
// router.use(restrictTo('admin'));

// Permission routes
router.post('/', validate(createPermissionSchema), createPermissionController);
router.get('/', getPermissions);
router.get('/:id', getPermission);
router.patch('/:id', validate(updatePermissionSchema), updatePermissionController);
router.delete('/:id', deletePermissionController);

export default router; 