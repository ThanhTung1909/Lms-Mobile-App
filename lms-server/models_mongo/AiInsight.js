import mongoose from "mongoose";

const AiInsightSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },

  dailyMessage: String,
  mood: String,

  suggestedLectureId: String,

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AiInsight", AiInsightSchema);
