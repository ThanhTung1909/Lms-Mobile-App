import mongoose from "mongoose";

const PostLikeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Đảm bảo 1 user chỉ like 1 bài 1 lần
PostLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model("PostLike", PostLikeSchema);
