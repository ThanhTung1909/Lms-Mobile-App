import express from "express";
import {
  getNotifications,
  markAllAsRead,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.put("/read-all", verifyToken, markAllAsRead);

router.patch("/:id/read", verifyToken, markNotificationAsRead);

export default router;
