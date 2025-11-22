import express from "express";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
import userRoutes from "./user.routes.js";
import adminRoutes from "./admin.routes.js";
import paymentRoutes from "./payment.routes.js";
import aiRouter from "./ai.routes.js";
import socialRouter from "./social.routes.js";
import notifiRouter from "./notification.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/payment", paymentRoutes);
router.use("/ai", aiRouter);
router.use("/community", socialRouter);
router.use("/notifi", notifiRouter);

export default router;
