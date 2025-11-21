import axios from "axios";

export const verifyCommentAI = async (text) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
                    Bạn là hệ thống kiểm duyệt bình luận.

                    Nhiệm vụ:
                    - Nhận diện TẤT CẢ từ ngữ thô tục, xúc phạm, nhục mạ (ví dụ: "con chó" với ngữ nghĩa miệt thị, "thằng", "đồ ngu", "cmm", "dm", "bitch", "fuck", "óc chó", v.v.)
                    - Nhận diện lời lẽ thô lỗ ngay cả khi thiếu ngữ cảnh.
                    - Chỉ cần chứa 1 từ nhạy cảm → xem là vi phạm.
                    - Ưu tiên an toàn tuyệt đối, không được suy diễn ý tốt.

                    Nếu bình luận có VI PHẠM → trả:
                    {"violate": true, "reason": "Giải thích ngắn gọn"}

                    Nếu KHÔNG vi phạm → trả:
                    {"violate": false, "reason": "ok"}

                    KHÔNG được trả thêm chữ nào khác ngoài JSON.

                    Bình luận: "${text}"
                    `,
              },
            ],
          },
        ],
      }
    );

    let raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    raw = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    // console.log("AI Moderation Raw Response:", raw);     // Debug log

    if (!jsonMatch) {
      return { violate: false, reason: "parse_failed" };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("AI moderation error:", err.response?.data || err.message);
    return { violate: false, reason: "ai_error" };
  }
};
