import express from 'express';
import authRoutes from './auth';
import roleRoutes from './roles';
import permissionRoutes from './permissions';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

export default router; 