import db from "../models/index.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await db.User.findOne({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      passwordHash: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        id: newUser.userId,
        fullName: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Lỗi đăng ký:".error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
