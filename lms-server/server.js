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
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/v1", mainRouter);

// connect cloudinary
connectCloudinary();

const startServer = async () => {
  const PORT = process.env.DB_PORT;
  try {
    // Test a connection
    await db.sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sync all models with the database.
    // { force: true } sẽ xóa bảng cũ và tạo lại, chỉ dùng trong môi trường dev.
    // Bỏ { force: true } trong môi trường production.
    await db.sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");

    await connectDB();
    console.log("MongoDB Connect successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();

export default app;
