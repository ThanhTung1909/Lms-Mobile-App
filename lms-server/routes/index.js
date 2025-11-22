
import express from 'express';
import authRoutes from './auth.routes.js';
import courseRoutes from './course.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);


export default router;