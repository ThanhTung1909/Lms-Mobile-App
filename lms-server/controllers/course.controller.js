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

// ============================================
// POST / - Tạo khóa học mới (educator)
// ============================================
export const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            discount = 0,
            thumbnailUrl,
            categoryIds = []
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin bắt buộc (title, description)"
            });
        }
        // Nếu chưa có auth, dùng user mặc định từ database
        let creatorId;

        if (req.user && req.user.userId) {
            creatorId = req.user.userId;
        } else {
            // Tạm thời dùng educator mặc định khi test
            const defaultEducator = await User.findOne({
                where: { email: 'dinotimo@gmail.com' }
            });

            if (!defaultEducator) {
                return res.status(401).json({
                    success: false,
                    message: "Vui lòng đăng nhập để tạo khóa học"
                });
            }

            creatorId = defaultEducator.userId;
            console.log('Warning: Sử dụng educator mặc định (chưa có auth)');
        }

        const newCourse = await Course.create({
            title,
            description,
            price: price || 0,
            discount,
            thumbnailUrl,
            status: 'draft',
            creatorId
        });

        if (categoryIds.length > 0) {
            const categories = await Category.findAll({
                where: { categoryId: categoryIds }
            });
            await newCourse.addCategories(categories);
        }

        res.status(201).json({
            success: true,
            message: "Tạo khóa học thành công",
            data: newCourse
        });

    } catch (error) {
        console.error("Error in createCourse:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi tạo khóa học",
            error: error.message
        });
    }
};

// ============================================
// PUT /:id - Cập nhật khóa học
// ============================================
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            price,
            discount,
            thumbnailUrl,
            status,
            categoryIds
        } = req.body;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khóa học"
            });
        }

        // if (course.creatorId !== req.user?.userId && req.user?.role !== 'admin') {
        //   return res.status(403).json({
        //     success: false,
        //     message: "Bạn không có quyền cập nhật khóa học này"
        //   });
        // }

        await course.update({
            title: title || course.title,
            description: description || course.description,
            price: price !== undefined ? price : course.price,
            discount: discount !== undefined ? discount : course.discount,
            thumbnailUrl: thumbnailUrl || course.thumbnailUrl,
            status: status || course.status
        });

        if (categoryIds && Array.isArray(categoryIds)) {
            const categories = await Category.findAll({
                where: { categoryId: categoryIds }
            });
            await course.setCategories(categories);
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật khóa học thành công",
            data: course
        });

    } catch (error) {
        console.error("Error in updateCourse:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật khóa học",
            error: error.message
        });
    }
};

// ============================================
// DELETE /:id - Xóa khóa học
// ============================================
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khóa học"
            });
        }

        // if (course.creatorId !== req.user?.userId && req.user?.role !== 'admin') {
        //   return res.status(403).json({
        //     success: false,
        //     message: "Bạn không có quyền xóa khóa học này"
        //   });
        // }

        await course.destroy();

        res.status(200).json({
            success: true,
            message: "Xóa khóa học thành công"
        });

    } catch (error) {
        console.error("Error in deleteCourse:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa khóa học",
            error: error.message
        });
    }
};

// ============================================
// POST /:id/enroll - Đăng ký khóa học
// ============================================
export const enrollCourse = async (req, res) => {
    try {
        const { id: courseId } = req.params;

        let userId;

        if (req.user && req.user.userId) {
            userId = req.user.userId;
        } else {
            const defaultStudent = await User.findOne({
                where: { email: 'thanhtung@gmail.com' }
            });
            userId = defaultStudent.userId;
            console.log(' Warning: Sử dụng student mặc định (chưa có auth)');
        }

        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khóa học"
            });
        }

        const existingEnrollment = await Enrollment.findOne({
            where: { userId, courseId }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã đăng ký khóa học này rồi"
            });
        }

        const finalPrice = course.price - (course.price * course.discount / 100);

        const enrollment = await Enrollment.create({
            userId,
            courseId,
            pricePaid: finalPrice,
            enrolledAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Đăng ký khóa học thành công",
            data: enrollment
        });

    } catch (error) {
        console.error("Error in enrollCourse:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đăng ký khóa học",
            error: error.message
        });
    }
};

