import express from 'express';
import {
    getProfile,
    updateProfile,
    getEnrolledCourses,
    getUserProgress,
    markLectureComplete
} from '../controllers/user.controller.js';

// import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();


// GET /profile - Xem profile của user hiện tại
// router.get('/profile', authenticate, getProfile);
router.get('/profile', getProfile);  // Tạm thời chưa có middleware

// PUT /profile - Cập nhật profile
// router.put('/profile', authenticate, updateProfile);
router.put('/profile', updateProfile);

// GET /enrolled-courses - Lấy danh sách khóa học đã đăng ký
// Query params: ?status=published&page=1&limit=10
// router.get('/enrolled-courses', authenticate, getEnrolledCourses);
router.get('/enrolled-courses', getEnrolledCourses);

// GET /progress - Lấy tiến độ học tập
// Query params: ?courseId=xxx (optional - lọc theo khóa học)
// router.get('/progress', authenticate, getUserProgress);
router.get('/progress', getUserProgress);

// POST /progress/:lectureId - Đánh dấu bài học đã hoàn thành
// router.post('/progress/:lectureId', authenticate, markLectureComplete);
router.post('/progress/:lectureId', markLectureComplete);

export default router;