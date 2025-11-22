import db from "../models/index.js";
import StudyLog from "../models_mongo/StudyLog.js";

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
      include: [
        {
          model: Course,
          as: "enrolledCourses",
          through: {
            attributes: ["enrollmentId", "enrolledAt", "pricePaid"],
          },
          where: status ? { status } : {},
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["userId", "fullName", "avatarUrl"],
            },
            {
              model: Chapter,
              as: "chapters",
              include: [
                {
                  model: Lecture,
                  as: "lectures",
                  attributes: ["lectureId", "title", "duration"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user",
      });
    }

    const enrolledCourses = user.enrolledCourses || [];

    const coursesWithProgress = await Promise.all(
      enrolledCourses.map(async (course) => {
        const courseChapters = course.chapters || [];

        const totalLectures = courseChapters.reduce(
          (sum, chapter) =>
            sum + (chapter.lectures ? chapter.lectures.length : 0),
          0
        );

        const lectureIds = [];
        courseChapters.forEach((chapter) => {
          if (chapter.lectures) {
            chapter.lectures.forEach((lecture) => {
              lectureIds.push(lecture.lectureId);
            });
          }
        });

        const completedLectures =
          lectureIds.length > 0
            ? await UserProgress.count({
                where: {
                  userId,
                  lectureId: lectureIds,
                },
              })
            : 0;

        const progressPercentage =
          totalLectures > 0
            ? Math.round((completedLectures / totalLectures) * 100)
            : 0;

        return {
          enrollmentId: course.Enrollment?.enrollmentId,
          enrolledAt: course.Enrollment?.enrolledAt,
          pricePaid: course.Enrollment?.pricePaid,
          course: {
            ...course.toJSON(),
            Enrollment: undefined,

            chapters: undefined,
            progress: {
              completed: completedLectures,
              total: totalLectures,
              percentage: progressPercentage,
            },
          },
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
          totalPages: Math.ceil(enrolledCourses.length / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error in getEnrolledCourses:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách khóa học",
      error: error.message,
    });
  }
};

// GET /progress
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.query;

    const whereConditions = { userId };
    const includeConditions = [
      {
        model: Lecture,

        attributes: ["lectureId", "title", "duration", "lectureType"],
        required: false,
        include: [
          {
            model: Chapter,
            as: "chapter",
            attributes: ["chapterId", "title", "courseId"],
            required: false,
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["courseId", "title", "thumbnailUrl"],
                required: false,
              },
            ],
          },
        ],
      },
    ];

    if (courseId) {
      includeConditions[0].include[0].include[0].where = { courseId };
    }

    const progressRecords = await UserProgress.findAll({
      where: whereConditions,
      include: includeConditions,
      order: [["completedAt", "DESC"]],
    });

    const progressByCourse = {};

    progressRecords.forEach((record) => {
      if (!record.Lecture) return;
      if (!record.Lecture.chapter) return;
      if (!record.Lecture.chapter.course) return;

      const course = record.Lecture.chapter.course;
      const cId = course.courseId;

      if (!progressByCourse[cId]) {
        progressByCourse[cId] = {
          courseId: course.courseId,
          courseTitle: course.title,
          courseThumbnail: course.thumbnailUrl,
          completedLectures: [],
          totalCompleted: 0,
          totalDuration: 0,
        };
      }

      progressByCourse[cId].completedLectures.push({
        lectureId: record.Lecture.lectureId,
        lectureTitle: record.Lecture.title,
        duration: record.Lecture.duration,
        completedAt: record.completedAt,
        chapterTitle: record.Lecture.chapter.title,
      });

      progressByCourse[cId].totalCompleted++;
      progressByCourse[cId].totalDuration += record.Lecture.duration || 0;
    });

    res.status(200).json({
      success: true,
      message: "Lấy tiến độ học tập thành công",
      data: {
        progressByCourse: Object.values(progressByCourse),
        totalCompleted: progressRecords.filter(
          (r) => r.Lecture && r.Lecture.chapter && r.Lecture.chapter.course
        ).length,
      },
    });
  } catch (error) {
    console.error("Error in getUserProgress:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tiến độ học tập",
      error: error.message,
    });
  }
};

// POST /progress/:lectureId
export const markLectureComplete = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lectureId } = req.params;

    const lecture = await Lecture.findByPk(lectureId, {
      include: [
        {
          model: Chapter,
          as: "chapter",
          include: [
            {
              model: Course,
              as: "course",
            },
          ],
        },
      ],
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài học",
      });
    }

    const courseId = lecture.chapter.course.courseId;

    const enrollment = await Enrollment.findOne({
      where: { userId, courseId },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "Bạn chưa đăng ký khóa học này",
      });
    }

    let progress = await UserProgress.findOne({
      where: { userId, lectureId },
    });

    if (progress) {
      return res.status(200).json({
        success: true,
        message: "Bài học đã được đánh dấu hoàn thành trước đó",
        data: progress,
      });
    }

    progress = await UserProgress.create({
      userId,
      lectureId,
      completedAt: new Date(),
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Đánh dấu bài học hoàn thành thành công",
      data: progress,
    });
  } catch (error) {
    console.error("Error in markLectureComplete:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đánh dấu bài học hoàn thành",
      error: error.message,
    });
  }
};

// [POST] /api/v1/users/progress/sync
// Body: { lectureId, currentSecond, totalDuration, deviceInfo }
export const syncProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lectureId, courseId, currentSecond, totalDuration, deviceInfo } =
      req.body;

    if (!lectureId || !courseId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    try {
      await StudyLog.create({
        userId,
        lectureId,
        courseId,
        action: "heartbeat",
        position: currentSecond,
        duration: totalDuration,
        deviceInfo: deviceInfo || "unknown",
      });
    } catch (mongoError) {
      console.error("⚠️ Mongo Log Error:", mongoError.message);
    }

    const progressPercent =
      totalDuration > 0 ? currentSecond / totalDuration : 0;
    const isCompletedNow = progressPercent >= 0.9;

    let userProgress = await db.UserProgress.findOne({
      where: { userId, lectureId },
    });

    if (userProgress) {
      userProgress.lastWatchedSecond = currentSecond;

      if (isCompletedNow && !userProgress.isCompleted) {
        userProgress.isCompleted = true;
        userProgress.status = "completed";
        userProgress.completedAt = new Date();
      }

      await userProgress.save();
    } else {
      userProgress = await db.UserProgress.create({
        userId,
        lectureId,
        lastWatchedSecond: currentSecond,
        isCompleted: isCompletedNow,
        status: isCompletedNow ? "completed" : "in_progress",
        completedAt: isCompletedNow ? new Date() : null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Synced successfully",
      data: {
        isCompleted: userProgress.isCompleted,
        lastPosition: userProgress.lastWatchedSecond,
      },
    });
  } catch (error) {
    console.error("Error in syncProgress:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi đồng bộ tiến độ",
      error: error.message,
    });
  }
};
