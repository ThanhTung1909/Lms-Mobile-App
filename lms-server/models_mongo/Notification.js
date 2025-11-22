import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true, index: true },
  senderId: { type: String, default: "SYSTEM" },
  type: {
    type: String,
    enum: ["AI_INSIGHT", "LIKE", "COMMENT", "SYSTEM"],
    required: true,
  },

  title: { type: String, required: true },
  message: { type: String, required: true },

  metadata: {
    postId: String,
    courseId: String,
    aiInsightId: String,
  },

  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
