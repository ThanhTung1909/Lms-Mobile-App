import jwt from "jsonwebtoken";
import db from "../models/index.js";

// Middleware kiểm tra đăng nhập
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không có token xác thực",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

// Middleware kiểm tra role
export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await db.User.findByPk(req.user.id, {
        include: [{ model: db.Role, as: "roles" }],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy user",
        });
      }

      const userRoles = user.roles.map((r) => r.name);

      const allowed = roles.some((role) => userRoles.includes(role));

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập",
        });
      }

      // Gắn user Sequelize vào req để controller dùng
      req.userData = user;

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: error.message,
      });
    }
  };
};
