import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  rateCourse,
} from "../controllers/course.controller.js";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// PROTECTED ROUTES
router.post(
  "/",
  verifyToken,
  authorizeRoles("educator", "admin"),
  createCourse
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("educator", "admin"),
  updateCourse
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("educator", "admin"),
  deleteCourse
);
router.post("/:id/rate", verifyToken, rateCourse);

export default router;
