import express from "express";
import {
  getProfile,
  updateProfile,
  getEnrolledCourses,
  getUserProgress,
  markLectureComplete,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// TẤT CẢ ROUTES ĐỀU CẦN AUTH
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.get("/enrolled-courses", verifyToken, getEnrolledCourses);
router.get("/progress", verifyToken, getUserProgress);
router.post("/progress/:lectureId", verifyToken, markLectureComplete);

export default router;
