import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, 
  content: { type: String, required: true },
  imageUrls: [{ type: String }],

  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", PostSchema);
