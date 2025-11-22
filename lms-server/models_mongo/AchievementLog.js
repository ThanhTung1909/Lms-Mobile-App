import mongoose from "mongoose";

const AchievementLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  badgeCode: { type: String, required: true },

  title: String,
  aiCongratulation: String,

  earnedAt: { type: Date, default: Date.now },

  metadata: mongoose.Schema.Types.Mixed,
});

export default mongoose.model("AchievementLog", AchievementLogSchema);
