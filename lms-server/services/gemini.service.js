import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const aiService = {

  analyzeLearningSession: async (userName, logs, totalStudyTime) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const logSummary = logs.map(l => 
        `- Bài: ${l.lectureId}, Hành động: ${l.action}, Giây thứ: ${l.position}/${l.duration}`
      ).join("\n");

      const prompt = `
        Đóng vai một gia sư riêng thân thiện, vui tính (Gen Z).
        Học viên tên: ${userName}.
        Hôm nay đã học tổng cộng: ${Math.floor(totalStudyTime / 60)} phút.
        
        Dưới đây là log hành vi xem video chi tiết:
        ${logSummary}
        
        Hãy phân tích và trả về kết quả dưới dạng JSON (không markdown):
        {
          "score": (số nguyên 1-10 chấm điểm độ tập trung),
          "comment": (Nhận xét ngắn gọn dưới 30 từ. Ví dụ: Khen nếu xem liền mạch, Nhắc nhở nếu hay tua hoặc bỏ dở),
          "badge": (Gợi ý 1 danh hiệu vui: "Thánh Cày Cuốc", "Người Tua Video", "Siêu Tập Trung" hoặc null nếu bình thường)
        }
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonStr = responseText.replace(/```json|```/g, "").trim();
      
      return JSON.parse(jsonStr);

    } catch (error) {
      console.error("Gemini AI Error:", error);
      return {
        score: 5,
        comment: "Hệ thống đang bận, nhưng bạn đã làm rất tốt hôm nay!",
        badge: null
      };
    }
  }
};