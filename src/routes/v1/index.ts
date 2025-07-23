import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import roleRoutes from './roles.routes';
import permissionRoutes from './permissions.routes';
import emailRoutes from './email.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/queue-jobs', emailRoutes);

export default router; 