import db from "../models/index.js";

const User = db.User;
const Course = db.Course;
const Enrollment = db.Enrollment;
const UserProgress = db.UserProgress;
const Lecture = db.Lecture;
const Chapter = db.Chapter;

// GET /enrolled-courses
export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        const user = await User.findByPk(userId, {
            include: [{
                model: Course,
                as: 'enrolledCourses',
                through: {
                    attributes: ['enrollmentId', 'enrolledAt', 'pricePaid']
                },
                where: status ? { status } : {},
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
            }]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }

        const enrolledCourses = user.enrolledCourses || [];

        const coursesWithProgress = await Promise.all(
            enrolledCourses.map(async (course) => {
                const totalLectures = course.Chapters.reduce(
                    (sum, chapter) => sum + chapter.Lectures.length,
                    0
                );

                // Lấy tất cả lecture IDs của course này
                const lectureIds = [];
                course.Chapters.forEach(chapter => {
                    chapter.Lectures.forEach(lecture => {
                        lectureIds.push(lecture.lectureId);
                    });
                });

                // Đếm số lectures đã hoàn thành
                const completedLectures = lectureIds.length > 0
                    ? await UserProgress.count({
                        where: {
                            userId,
                            lectureId: lectureIds
                        }
                    })
                    : 0;

                const progressPercentage = totalLectures > 0
                    ? Math.round((completedLectures / totalLectures) * 100)
                    : 0;

                return {
                    enrollmentId: course.Enrollment?.enrollmentId,
                    enrolledAt: course.Enrollment?.enrolledAt,
                    pricePaid: course.Enrollment?.pricePaid,
                    course: {
                        ...course.toJSON(),
                        Enrollment: undefined,
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
                    total: enrolledCourses.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(enrolledCourses.length / limit)
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

// GET /progress
export const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { courseId } = req.query;

        const whereConditions = { userId };
        const includeConditions = [{
            model: Lecture,
            attributes: ['lectureId', 'title', 'duration', 'lectureType'],
            required: false, // Cho phép null
            include: [{
                model: Chapter,
                attributes: ['chapterId', 'title', 'courseId'],
                required: false, //  Cho phép null
                include: [{
                    model: Course,
                    attributes: ['courseId', 'title', 'thumbnailUrl'],
                    required: false // Cho phép null
                }]
            }]
        }];

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
            // KIỂM TRA TỪNG LEVEL
            if (!record.Lecture) {
                console.log(`Skipping progress ${record.progressId}: Lecture is null`);
                return;
            }

            if (!record.Lecture.Chapter) {
                console.log(`Skipping progress ${record.progressId}: Chapter is null`);
                return;
            }

            if (!record.Lecture.Chapter.Course) {
                console.log(`Skipping progress ${record.progressId}: Course is null`);
                return;
            }

            const course = record.Lecture.Chapter.Course;
            const cId = course.courseId;

            if (!progressByCourse[cId]) {
                progressByCourse[cId] = {
                    courseId: course.courseId,
                    courseTitle: course.title,
                    courseThumbnail: course.thumbnailUrl,
                    completedLectures: [],
                    totalCompleted: 0,
                    totalDuration: 0
                };
            }

            progressByCourse[cId].completedLectures.push({
                lectureId: record.Lecture.lectureId,
                lectureTitle: record.Lecture.title,
                duration: record.Lecture.duration,
                completedAt: record.completedAt,
                chapterTitle: record.Lecture.Chapter.title
            });

            progressByCourse[cId].totalCompleted++;
            progressByCourse[cId].totalDuration += record.Lecture.duration || 0;
        });

        res.status(200).json({
            success: true,
            message: "Lấy tiến độ học tập thành công",
            data: {
                progressByCourse: Object.values(progressByCourse),
                totalCompleted: progressRecords.filter(r => r.Lecture && r.Lecture.Chapter && r.Lecture.Chapter.Course).length
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

// POST /progress/:lectureId
export const markLectureComplete = async (req, res) => {
    try {
        const userId = req.user.userId;
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