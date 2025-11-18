import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const User = db.User;

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Vui lòng đăng nhập để tiếp tục"
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['passwordHash'] },
            include: [{
                model: db.Role,
                attributes: ['roleId', 'name'],
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User không tồn tại"
            });
        }

        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: "Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa"
            });
        }

        req.user = {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            roles: user.Roles.map(r => r.name),
            role: user.Roles[0]?.name || 'student'
        };

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ"
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token đã hết hạn"
            });
        }

        console.error("Error in authenticate middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi xác thực",
            error: error.message
        });
    }
};

export const isEducator = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập"
        });
    }

    if (!req.user.roles.includes('educator') && !req.user.roles.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập. Chỉ educator mới được phép."
        });
    }

    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập"
        });
    }

    if (!req.user.roles.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập. Chỉ admin mới được phép."
        });
    }

    next();
};

export const isStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập"
        });
    }

    if (!req.user.roles.includes('student')) {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền truy cập. Chỉ student mới được phép."
        });
    }

    next();
};