import express from "express";
import cors from "cors";
import "dotenv/config";

import db from "./models/index.js";
import connectDB from "./configs/mongoCofig.js";
import mainRouter from "./routes/index.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhook } from "./controllers/payment.controller.js";

// Initialize Express
const app = express();

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use(async (req, res, next) => {
  try {
    await connectDB();

    await db.sequelize.authenticate();

    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/v1", mainRouter);

// connect cloudinary
connectCloudinary();

if (process.env.NODE_ENV !== "production") {
  
  const PORT = process.env.DB_PORT || 5000;

  db.sequelize.sync({ force: false }).then(() => {
    console.log("SQL Synced Local");
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is running locally on port ${PORT}`);
  });
}

export default app;
