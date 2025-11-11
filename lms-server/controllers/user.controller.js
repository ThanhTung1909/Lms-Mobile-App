import db from "../models/index.js";

const User = db.User;
const Course = db.Course;
const Enrollment = db.Enrollment;
const UserProgress = db.UserProgress;
const Lecture = db.Lecture;
const Chapter = db.Chapter;

// ============================================
// GET /profile - Xem profile của user hiện tại
// ============================================
export const getProfile = async (req, res) => {
    try {
        let userId;

        if (req.user && req.user.userId) {
            userId = req.user.userId;
        } else {
            const defaultUser = await User.findOne({
                where: { email: 'thanhtung@gmail.com' }
            });

            if (!defaultUser) {
                return res.status(401).json({
                    success: false,
                    message: "Vui lòng đăng nhập"
                });
            }

            userId = defaultUser.userId;
            console.log('Warning: Sử dụng user mặc định (chưa có auth)');
        }

        const user = await User.findByPk(userId, {
            attributes: {
                exclude: ['passwordHash']
            },
            include: [
                {
                    model: db.Role,
                    attributes: ['roleId', 'name'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }

        const enrolledCoursesCount = await Enrollment.count({
            where: { userId }
        });

        const createdCoursesCount = await Course.count({
            where: { creatorId: userId }
        });

        res.status(200).json({
            success: true,
            message: "Lấy thông tin profile thành công",
            data: {
                ...user.toJSON(),
                stats: {
                    enrolledCourses: enrolledCoursesCount,
                    createdCourses: createdCoursesCount
                }
            }
        });

    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy thông tin profile",
            error: error.message
        });
    }
};

// ============================================
// PUT /profile - Cập nhật profile
// ============================================
export const updateProfile = async (req, res) => {
    try {
        let userId;

        if (req.user && req.user.userId) {
            userId = req.user.userId;
        } else {
            const defaultUser = await User.findOne({
                where: { email: 'thanhtung@gmail.com' }
            });
            userId = defaultUser.userId;
            console.log('Warning: Sử dụng user mặc định (chưa có auth)');
        }

        const {
            fullName,
            avatarUrl,
        } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }

        await user.update({
            fullName: fullName || user.fullName,
            avatarUrl: avatarUrl || user.avatarUrl
        });

        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.passwordHash;

        res.status(200).json({
            success: true,
            message: "Cập nhật profile thành công",
            data: userWithoutPassword
        });

    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật profile",
            error: error.message
        });
    }
};
