import express from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,
    rateCourse
} from '../controllers/course.controller.js';

// import { authenticate, isEducator } from '../middlewares/auth.middleware.js';

const router = express.Router();


// GET / - Lấy danh sách khóa học
router.get('/', getAllCourses);

// GET /:id - Lấy chi tiết khóa học
router.get('/:id', getCourseById);

// POST / - Tạo khóa học mới (chỉ educator)
// router.post('/', authenticate, isEducator, createCourse);
router.post('/', createCourse);  // Tạm thời chưa có middleware

// PUT /:id - Cập nhật khóa học (chỉ creator hoặc admin)
// router.put('/:id', authenticate, updateCourse);
router.put('/:id', updateCourse);

// DELETE /:id - Xóa khóa học (chỉ creator hoặc admin)
// router.delete('/:id', authenticate, deleteCourse);
router.delete('/:id', deleteCourse);

// POST /:id/enroll - Đăng ký khóa học (student)
// router.post('/:id/enroll', authenticate, enrollCourse);
router.post('/:id/enroll', enrollCourse);

// POST /:id/rate - Đánh giá khóa học (student đã enroll)
// router.post('/:id/rate', authenticate, rateCourse);
router.post('/:id/rate', rateCourse);

export default router;