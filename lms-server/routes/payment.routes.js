import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createPaymentIntent,
  stripeWebhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Tạo các router định nghĩa endpoints
router.post("/create-intent", verifyToken, createPaymentIntent);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
