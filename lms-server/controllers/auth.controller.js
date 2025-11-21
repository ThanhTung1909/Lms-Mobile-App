import db from "../models/index.js";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
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

    const studentRole = await db.Role.findOne({ where: { name: "student" } });
    if (studentRole) await newUser.addRole(studentRole);

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        id: newUser.userId,
        fullName: newUser.fullName,
        email: newUser.email,
        roles: studentRole
          ? [{ roleId: studentRole.roleId, name: studentRole.name }]
          : [],
      },
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.Role,
          as: "roles",
          attributes: ["roleId", "name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    const token = jwt.sign(
      { id: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const mainRole =
      user.roles && user.roles.length > 0 ? user.roles[0].name : "student";

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.userId,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: mainRole,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ["passwordHash"] },
      include: [
        {
          model: db.Role,
          as: "roles",
          attributes: ["roleId", "name"],
          through: { attributes: [] },
        },
        {
          model: db.Course,
          as: "createdCourses",
          attributes: ["courseId", "title"],
        },
        {
          model: db.Course,
          as: "instructingCourses",
          attributes: ["courseId", "title"],
          through: { attributes: [] },
        },
        {
          model: db.Course,
          as: "enrolledCourses",
          attributes: ["courseId", "title"],
          through: { attributes: [] },
        },
        {
          model: db.CourseRating,
          as: "ratings",
          attributes: ["ratingId", "courseId", "rating", "comment"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Thông tin người dùng",
      user,
    });
  } catch (error) {
    console.error("Lỗi getProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

// POST /logout
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng xuất",
      error: error.message,
    });
  }
};
// POST /change-password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash: newPasswordHash });

    res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đổi mật khẩu",
      error: error.message,
    });
  }
};
