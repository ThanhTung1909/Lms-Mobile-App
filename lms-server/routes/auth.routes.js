import express from "express";
import { changePassword, getProfile, login, register } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Tạo các router định nghĩa endpoints
router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/change-password", verifyToken, changePassword);

export default router;
