import express from "express";
import {
  getEnrolledCourses,
  getUserProgress,
  markLectureComplete,
  syncProgress,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// TẤT CẢ ROUTES ĐỀU CẦN AUTH

router.get("/enrolled-courses", verifyToken, getEnrolledCourses);
router.get("/progress", verifyToken, getUserProgress);

router.post("/progress/sync", verifyToken, syncProgress);

router.post("/progress/:lectureId", verifyToken, markLectureComplete);


export default router;
