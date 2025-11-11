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

// ============================================
// GET /enrolled-courses - Lấy danh sách khóa học đã đăng ký
// ============================================
export const getEnrolledCourses = async (req, res) => {
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

        const { status, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const courseWhereConditions = {};
        if (status) {
            courseWhereConditions.status = status;
        }

        const enrollments = await Enrollment.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: Course,
                    where: courseWhereConditions,
                    include: [
                        {
                            model: User,
                            as: 'creator',
                            attributes: ['userId', 'fullName', 'avatarUrl']
                        },
                        {
                            model: Chapter,
                            include: [{
                                model: Lecture,
                                attributes: ['lectureId', 'title', 'duration']
                            }]
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['enrolledAt', 'DESC']]
        });

        const coursesWithProgress = await Promise.all(
            enrollments.rows.map(async (enrollment) => {
                const course = enrollment.Course;

                const totalLectures = course.Chapters.reduce(
                    (sum, chapter) => sum + chapter.Lectures.length,
                    0
                );

                const completedLectures = await UserProgress.count({
                    where: { userId },
                    include: [{
                        model: Lecture,
                        include: [{
                            model: Chapter,
                            where: { courseId: course.courseId }
                        }]
                    }]
                });

                const progressPercentage = totalLectures > 0
                    ? Math.round((completedLectures / totalLectures) * 100)
                    : 0;

                return {
                    enrollmentId: enrollment.enrollmentId,
                    enrolledAt: enrollment.enrolledAt,
                    pricePaid: enrollment.pricePaid,
                    course: {
                        ...course.toJSON(),
                        progress: {
                            completed: completedLectures,
                            total: totalLectures,
                            percentage: progressPercentage
                        }
                    }
                };
            })
        );

        res.status(200).json({
            success: true,
            message: "Lấy danh sách khóa học đã đăng ký thành công",
            data: {
                enrollments: coursesWithProgress,
                pagination: {
                    total: enrollments.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(enrollments.count / limit)
                }
            }
        });

    } catch (error) {
        console.error("Error in getEnrolledCourses:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách khóa học",
            error: error.message
        });
    }
};

// ============================================
// GET /progress - Lấy tiến độ học tập
// ============================================
export const getUserProgress = async (req, res) => {
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

        const { courseId } = req.query;

        const whereConditions = { userId };
        const includeConditions = [
            {
                model: Lecture,
                attributes: ['lectureId', 'title', 'duration', 'lectureType'],
                include: [
                    {
                        model: Chapter,
                        attributes: ['chapterId', 'title', 'courseId'],
                        include: [{
                            model: Course,
                            attributes: ['courseId', 'title', 'thumbnailUrl']
                        }]
                    }
                ]
            }
        ];

        if (courseId) {
            includeConditions[0].include[0].where = { courseId };
        }

        const progressRecords = await UserProgress.findAll({
            where: whereConditions,
            include: includeConditions,
            order: [['completedAt', 'DESC']]
        });

        const progressByCourse = {};

        progressRecords.forEach(record => {
            const course = record.Lecture.Chapter.Course;
            const courseId = course.courseId;

            if (!progressByCourse[courseId]) {
                progressByCourse[courseId] = {
                    courseId: course.courseId,
                    courseTitle: course.title,
                    courseThumbnail: course.thumbnailUrl,
                    completedLectures: [],
                    totalCompleted: 0,
                    totalDuration: 0
                };
            }

            progressByCourse[courseId].completedLectures.push({
                lectureId: record.Lecture.lectureId,
                lectureTitle: record.Lecture.title,
                duration: record.Lecture.duration,
                completedAt: record.completedAt,
                chapterTitle: record.Lecture.Chapter.title
            });

            progressByCourse[courseId].totalCompleted++;
            progressByCourse[courseId].totalDuration += record.Lecture.duration || 0;
        });

        res.status(200).json({
            success: true,
            message: "Lấy tiến độ học tập thành công",
            data: {
                progressByCourse: Object.values(progressByCourse),
                totalCompleted: progressRecords.length
            }
        });

    } catch (error) {
        console.error("Error in getUserProgress:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy tiến độ học tập",
            error: error.message
        });
    }
};

// ============================================
// POST /progress/:lectureId - Đánh dấu bài học đã hoàn thành
// ============================================
export const markLectureComplete = async (req, res) => {
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

        const { lectureId } = req.params;

        const lecture = await Lecture.findByPk(lectureId, {
            include: [{
                model: Chapter,
                include: [{ model: Course }]
            }]
        });

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài học"
            });
        }

        const courseId = lecture.Chapter.Course.courseId;
        const enrollment = await Enrollment.findOne({
            where: { userId, courseId }
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "Bạn chưa đăng ký khóa học này"
            });
        }

        let progress = await UserProgress.findOne({
            where: { userId, lectureId }
        });

        if (progress) {
            return res.status(200).json({
                success: true,
                message: "Bài học đã được đánh dấu hoàn thành trước đó",
                data: progress
            });
        }

        progress = await UserProgress.create({
            userId,
            lectureId,
            completedAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Đánh dấu bài học hoàn thành thành công",
            data: progress
        });

    } catch (error) {
        console.error("Error in markLectureComplete:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đánh dấu bài học hoàn thành",
            error: error.message
        });
    }
};