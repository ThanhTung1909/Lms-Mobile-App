import express from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

// Tạo các router định nghĩa endpoints
router.post("/register", register);
router.post("/login", login);

export default router;
