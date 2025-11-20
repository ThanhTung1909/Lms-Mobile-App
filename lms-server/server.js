import express from "express";
import cors from "cors";
import "dotenv/config";

import db from "./models/index.js";
import mainRouter from "./routes/index.js";
import connectCloudinary from "./configs/cloudinary.js";

// Initialize Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// connect cloudinary
await connectCloudinary()

// Routes
app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/v1", mainRouter);

// Port
const PORT = process.env.PORT || 5000;

const startServer = async () => {
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

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
