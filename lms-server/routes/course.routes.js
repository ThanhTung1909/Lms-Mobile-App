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
import { authenticate, isEducator } from '../middlewares/auth.middleware.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// PROTECTED ROUTES
router.post('/', authenticate, isEducator, createCourse);
router.put('/:id', authenticate, updateCourse);
router.delete('/:id', authenticate, deleteCourse);
router.post('/:id/enroll', authenticate, enrollCourse);
router.post('/:id/rate', authenticate, rateCourse);

export default router;