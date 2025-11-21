import { Op } from "sequelize";
import db from "../models/index.js";
import { verifyCommentAI } from "../utils/aiModeration.js";

const Course = db.Course;
const User = db.User;
const Category = db.Category;
const Chapter = db.Chapter;
const Lecture = db.Lecture;
const Enrollment = db.Enrollment;
const CourseRating = db.CourseRating;

export const getAllCourses = async (req, res) => {
  try {
    const courses = await db.Course.findAll({
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["userId", "fullName", "email"],
        },
        {
          model: db.Category,
          as: "categories",
          attributes: ["categoryId", "name"],
          through: { attributes: [] },
        },
        {
          model: db.Chapter,
          as: "chapters",
          attributes: ["chapterId", "title", "orderIndex"],
          include: [
            {
              model: db.Lecture,
              as: "lectures",
              attributes: ["lectureId", "title", "videoUrl", "orderIndex"],
            },
          ],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [{ model: db.Chapter, as: "chapters" }, "orderIndex", "ASC"],
        [
          { model: db.Chapter, as: "chapters" },
          { model: db.Lecture, as: "lectures" },
          "orderIndex",
          "ASC",
        ],
      ],
    });

    return res.json({ success: true, data: courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách khóa học",
      error: error.message,
    });
  }
};

// GET /:id - Lấy chi tiết khóa học
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await db.Course.findByPk(id, {
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["userId", "fullName", "email", "avatarUrl"],
        },
        // {
        //   model: db.User,
        //   as: "instructors",
        //   attributes: ["userId", "fullName", "avatarUrl"],
        //   through: { attributes: [] },
        // },
        {
          model: db.Category,
          as: "categories",
          attributes: ["categoryId", "name"],
          through: { attributes: [] },
        },
        {
          model: db.Chapter,
          as: "chapters",
          attributes: ["chapterId", "title", "orderIndex"],
          include: [
            {
              model: db.Lecture,
              as: "lectures",
              attributes: [
                "lectureId",
                "title",
                "videoUrl",
                "content",
                "duration",
                "lectureType",
                "orderIndex",
              ],
            },
          ],
        },
        {
          model: db.CourseRating,
          as: "ratings",
          attributes: ["ratingId", "rating", "comment", "createdAt"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["userId", "fullName", "avatarUrl"],
            },
          ],
        },
        {
          model: db.User,
          as: "students",
          attributes: ["userId"], // chỉ dùng để đếm
          through: { attributes: [] },
        },
      ],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    // Tính trung bình đánh giá
    const avgRating =
      (course.ratings?.length || 0) > 0
        ? course.ratings.reduce((sum, r) => sum + r.rating, 0) /
          course.ratings.length
        : 0;

    res.status(200).json({
      success: true,
      message: "Lấy chi tiết khóa học thành công",
      data: {
        ...course.toJSON(),
        avgRating: avgRating.toFixed(1),
        totalRatings: course.ratings.length,
        studentCount: course.students.length,
      },
    });
  } catch (error) {
    console.error("Error in getCourseById:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết khóa học",
      error: error.message,
    });
  }
};

// POST / - Tạo khóa học mới (educator)
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price = 0,
      discount = 0,
      thumbnailUrl,
      categoryIds = [],
    } = req.body;

    const user = req.userData;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: title, description",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Giá khóa học (price) không được âm",
      });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: "discount phải nằm trong khoảng 0 - 100",
      });
    }

    let categories = [];
    if (categoryIds.length > 0) {
      categories = await db.Category.findAll({
        where: { categoryId: categoryIds },
      });

      if (categories.length !== categoryIds.length) {
        return res.status(400).json({
          success: false,
          message: "Một hoặc nhiều categoryId không tồn tại",
        });
      }
    }

    const newCourse = await db.Course.create({
      title,
      description,
      price,
      discount,
      thumbnailUrl,
      creatorId: user.userId,
      status: "draft",
    });

    if (categories.length > 0) {
      await newCourse.addCategories(categories);
    }

    return res.status(201).json({
      success: true,
      message: "Tạo khóa học thành công",
      data: {
        ...newCourse.toJSON(),
        creator: {
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Error in createCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo khóa học",
      error: error.message,
    });
  }
};

// PUT /:id - Cập nhật khóa học
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
      categoryIds,
    } = req.body;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    if (
      course.creatorId !== req.user.userId &&
      !req.user.roles.includes("admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật khóa học này",
      });
    }

    await course.update({
      title: title || course.title,
      description: description || course.description,
      price: price !== undefined ? price : course.price,
      discount: discount !== undefined ? discount : course.discount,
      thumbnailUrl: thumbnailUrl || course.thumbnailUrl,
      status: status || course.status,
    });

    if (categoryIds && Array.isArray(categoryIds)) {
      const categories = await Category.findAll({
        where: { categoryId: categoryIds },
      });
      await course.setCategories(categories);
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật khóa học thành công",
      data: course,
    });
  } catch (error) {
    console.error("Error in updateCourse:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật khóa học",
      error: error.message,
    });
  }
};

// DELETE /:id - Xóa khóa học
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    if (
      course.creatorId !== req.user.userId &&
      !req.user.roles.includes("admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa khóa học này",
      });
    }

    await course.destroy();

    res.status(200).json({
      success: true,
      message: "Xóa khóa học thành công",
    });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa khóa học",
      error: error.message,
    });
  }
};

// POST /:id/rate - Đánh giá khóa học
export const rateCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating phải từ 1 đến 5",
      });
    }

    // Kiểm tra nội dung bình luận bằng AI
    if (comment && comment.trim() !== "") {
      const moderation = await verifyCommentAI(comment);

      if (moderation.violate) {
        return res.status(400).json({
          success: false,
          message: "Nội dung bình luận vi phạm tiêu chuẩn cộng đồng",
          ai_reason: moderation.reason,
          raw_ai: moderation, // debug
        });
      }
    }

    // Kiểm tra user đã enroll chưa
    const enrollment = await db.Enrollment.findOne({
      where: { userId, courseId },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "Bạn phải đăng ký khóa học trước khi đánh giá",
      });
    }

    // Kiểm tra xem user đã đánh giá trước chưa
    let existingRating = await db.CourseRating.findOne({
      where: { userId, courseId },
    });

    if (existingRating) {
      await existingRating.update({ rating, comment });
      return res.status(200).json({
        success: true,
        message: "Cập nhật đánh giá thành công",
        data: existingRating,
      });
    }

    // Tạo đánh giá mới
    const newRating = await db.CourseRating.create({
      userId,
      courseId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Đánh giá khóa học thành công",
      data: newRating,
    });
  } catch (error) {
    console.error("Error in rateCourse:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đánh giá khóa học",
      error: error.message,
    });
  }
};
