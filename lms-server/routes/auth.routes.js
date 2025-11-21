import express from "express";
import {
  changePassword,
  getProfile,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Tạo các router định nghĩa endpoints
router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/profile/change-password", verifyToken, changePassword);
router.post("/logout", verifyToken, logout);

export default router;
