import mongoose from "mongoose";


let isConnected = false;

const connectDB = async () => {

  if (isConnected) {
    console.log("=> Using existing MongoDB connection");
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "lms-app",
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("=> New MongoDB connection established");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);

  }
};

export default connectDB;
