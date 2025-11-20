import express from 'express';
import {
    getProfile,
    updateProfile,
    getEnrolledCourses,
    getUserProgress,
    markLectureComplete
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// TẤT CẢ ROUTES ĐỀU CẦN AUTH
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/enrolled-courses', authenticate, getEnrolledCourses);
router.get('/progress', authenticate, getUserProgress);
router.post('/progress/:lectureId', authenticate, markLectureComplete);

export default router;