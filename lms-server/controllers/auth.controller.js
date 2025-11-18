import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const User = db.User;
const Role = db.Role;

// POST /register
export const register = async (req, res) => {
    try {
        const { fullName, email, password, role = "student" } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin bắt buộc (fullName, email, password)",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email đã được sử dụng",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            passwordHash,
            status: "active",
        });

        const userRole = await Role.findOne({ where: { name: role } });
        if (userRole) {
            await newUser.addRole(userRole);
        }

        const token = jwt.sign(
            {
                userId: newUser.userId,
                email: newUser.email,
                role: role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Đăng ký tài khoản thành công",
            data: {
                user: {
                    userId: newUser.userId,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    avatarUrl: newUser.avatarUrl,
                    status: newUser.status,
                    role: role,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đăng ký tài khoản",
            error: error.message,
        });
    }
};

// POST /login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Thiếu email hoặc password",
            });
        }

        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    attributes: ["roleId", "name"],
                    through: { attributes: [] },
                },
            ],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng",
            });
        }

        if (user.status === "banned") {
            return res.status(403).json({
                success: false,
                message: "Tài khoản của bạn đã bị khóa",
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Tài khoản của bạn chưa được kích hoạt",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng",
            });
        }

        await user.update({ lastLoginAt: new Date() });

        const token = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
                roles: user.Roles.map((r) => r.name),
                role: user.Roles[0]?.name || "student",
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                user: {
                    userId: user.userId,
                    fullName: user.fullName,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    status: user.status,
                    roles: user.Roles.map((r) => r.name),
                },
                token,
            },
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đăng nhập",
            error: error.message,
        });
    }
};

// GET /me
export const getMe = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ["passwordHash"] },
            include: [
                {
                    model: Role,
                    attributes: ["roleId", "name"],
                    through: { attributes: [] },
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user",
            });
        }

        res.status(200).json({
            success: true,
            message: "Lấy thông tin user thành công",
            data: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                avatarUrl: user.avatarUrl,
                status: user.status,
                roles: user.Roles.map((r) => r.name),
                emailVerifiedAt: user.emailVerifiedAt,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Error in getMe:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy thông tin user",
            error: error.message,
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
        const userId = req.user.userId;
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

        const user = await User.findByPk(userId);
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

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

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