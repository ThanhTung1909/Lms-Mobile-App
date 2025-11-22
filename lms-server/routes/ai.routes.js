import express from "express";
import { getDailyAiReport } from "../controllers/ai.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const aiRouter = express.Router();

aiRouter.get("/daily-report", verifyToken, getDailyAiReport);

export default aiRouter;