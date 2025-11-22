import db from "../models/index.js";
import StudyLog from "../models_mongo/StudyLog.js";
import AiInsight from "../models_mongo/AiInsight.js";
import { aiService } from "../services/gemini.service.js";
import { createNotification } from "./notification.controller.js";

export const getDailyAiReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().split("T")[0];

    let insight = await AiInsight.findOne({ userId, date: dateStr });

    const forceRefresh = req.query.refresh === "true";

    if (insight && !forceRefresh) {
      return res.status(200).json({
        success: true,
        data: insight,
        source: "cache_mongo",
      });
    }

    const logs = await StudyLog.find({
      userId,
      timestamp: { $gte: today },
    }).sort({ timestamp: 1 });

    if (!logs || logs.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Hôm nay bạn chưa học gì cả.",
      });
    }

    const lectureMap = {};
    let totalSeconds = 0;

    logs.forEach((log) => {
      if (!lectureMap[log.lectureId]) {
        lectureMap[log.lectureId] = { count: 0, actions: [] };
      }
      lectureMap[log.lectureId].count++;

      if (log.action !== "heartbeat") {
        lectureMap[log.lectureId].actions.push(log.action);
      }
    });

    totalSeconds = logs.length * 10;

    const user = await db.User.findByPk(userId);

    const summaryData = {
      totalTime: `${Math.floor(totalSeconds / 60)} phút`,
      lecturesInteracted: Object.keys(lectureMap).length,
      details: lectureMap,
    };

    const aiResult = await aiService.analyzeStudyBehavior(
      user.fullName,
      summaryData
    );

    if (insight) {
      insight.dailyMessage = aiResult.feedback;
      insight.mood = aiResult.mood;
      insight.score = aiResult.score;
      await insight.save();
    } else {
      insight = await AiInsight.create({
        userId,
        date: dateStr,
        dailyMessage: aiResult.feedback,
        mood: aiResult.mood,
      });
    }

    await createNotification({
      recipientId: userId,
      senderId: "AI_GEMINI",
      type: "AI_INSIGHT",
      title: `Điểm số hôm nay: ${aiResult.score}/10 🌟`,
      message: aiResult.feedback, 
      metadata: { date: dateStr },
    });

    return res.status(200).json({
      success: true,
      data: {
        ...insight.toObject(),
        score: aiResult.score,
        actionItem: aiResult.actionItem,
      },
      source: "gemini_live",
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ success: false, message: "Lỗi phân tích AI" });
  }
};
