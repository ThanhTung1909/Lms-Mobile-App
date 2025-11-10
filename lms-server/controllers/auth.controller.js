import db from "../models/index.js";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
      fullName,
      email,
      passwordHash: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        id: newUser.userId,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Lỗi đăng ký:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đùng",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đùng",
      });
    }

    const token = jwt.sign(
      { id: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.userId,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Lỗi đăng ký:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
