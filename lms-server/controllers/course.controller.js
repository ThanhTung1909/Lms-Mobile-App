import db from "../models/index.js";

const Course = db.Course;
const User = db.User;
const Category = db.Category;
const Chapter = db.Chapter;
const Lecture = db.Lecture;
const Enrollment = db.Enrollment;
const CourseRating = db.CourseRating;

// ============================================
// GET / - Lấy danh sách khóa học
// ============================================
export const getAllCourses = async (req, res) => {
    try {
        const {
            status = 'published',
            categoryId,
            search,
            page = 1,
            limit = 10
        } = req.query;

        const whereConditions = {};

        if (status) {
            whereConditions.status = status;
        }

        if (search) {
            whereConditions.title = {
                [db.Sequelize.Op.like]: `%${search}%`
            };
        }

        const include = [
            {
                model: User,
                as: 'creator',
                attributes: ['userId', 'fullName', 'email', 'avatarUrl']
            },
            {
                model: Category,
                attributes: ['categoryId', 'name', 'slug']
            },
            {
                model: Chapter,
                attributes: ['chapterId', 'title', 'orderIndex'],
                include: [{
                    model: Lecture,
                    attributes: ['lectureId', 'title', 'duration', 'lectureType']
                }]
            }
        ];

        if (categoryId) {
            include[1].where = { categoryId };
        }

        const offset = (page - 1) * limit;

        const { count, rows: courses } = await Course.findAndCountAll({
            where: whereConditions,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: "Lấy danh sách khóa học thành công",
            data: {
                courses,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error("Error in getAllCourses:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách khóa học",
            error: error.message
        });
    }
};

// ============================================
// GET /:id - Lấy chi tiết khóa học
// ============================================
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['userId', 'fullName', 'email', 'avatarUrl']
                },
                {
                    model: User,
                    as: 'instructors',
                    attributes: ['userId', 'fullName', 'avatarUrl'],
                    through: { attributes: [] }
                },
                {
                    model: Category,
                    attributes: ['categoryId', 'name', 'slug'],
                    through: { attributes: [] }
                },
                {
                    model: Chapter,
                    attributes: ['chapterId', 'title', 'orderIndex'],
                    include: [{
                        model: Lecture,
                        attributes: ['lectureId', 'title', 'videoUrl', 'content', 'duration', 'lectureType', 'orderIndex']
                    }],
                    order: [['orderIndex', 'ASC']]
                },
                {
                    model: CourseRating,
                    attributes: ['ratingId', 'rating', 'comment', 'createdAt'],
                    include: [{
                        model: User,
                        attributes: ['userId', 'fullName', 'avatarUrl']
                    }]
                }
            ]
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khóa học"
            });
        }

        const avgRating = course.CourseRatings.length > 0
            ? course.CourseRatings.reduce((sum, r) => sum + r.rating, 0) / course.CourseRatings.length
            : 0;

        const studentCount = await Enrollment.count({
            where: { courseId: id }
        });

        res.status(200).json({
            success: true,
            message: "Lấy chi tiết khóa học thành công",
            data: {
                ...course.toJSON(),
                avgRating: avgRating.toFixed(1),
                totalRatings: course.CourseRatings.length,
                studentCount
            }
        });

    } catch (error) {
        console.error("Error in getCourseById:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy chi tiết khóa học",
            error: error.message
        });
    }
};
