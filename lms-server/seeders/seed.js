// seeders/seed.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import defineUser from "../models/user.model.js";
import defineRole from "../models/role.model.js";
import defineCourse from "../models/course.model.js";
import defineCategory from "../models/category.model.js";
import defineChapter from "../models/chapter.model.js";
import defineLecture from "../models/lecture.model.js";
import defineEnrollment from "../models/enrollment.model.js";
import defineCourseRating from "../models/courseRating.model.js";
import defineUserProgress from "../models/userProgress.model.js";
import defineTestimonial from "../models/testimonial.model.js";
import defineCourseCategory from "../models/courseCategory.model.js";

dotenv.config();

// --- Kết nối DB ---
const sequelizeServer = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
  }
);

const sequelizeRoot = new Sequelize(
  null,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
  }
);

const seedData = async () => {
  try {
    await sequelizeRoot.query(
      `DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`
    );
    await sequelizeRoot.query(`CREATE DATABASE \`${process.env.DB_NAME}\`;`);
    console.log("✅ Database dropped and created");

    await sequelizeServer.authenticate();
    console.log("✅ Connected to DB");

    // --- Define models ---
    const User = defineUser(sequelizeServer);
    const Role = defineRole(sequelizeServer);
    const Course = defineCourse(sequelizeServer);
    const Category = defineCategory(sequelizeServer);
    const Chapter = defineChapter(sequelizeServer);
    const Lecture = defineLecture(sequelizeServer);
    const Enrollment = defineEnrollment(sequelizeServer);
    const CourseRating = defineCourseRating(sequelizeServer);
    const UserProgress = defineUserProgress(sequelizeServer);
    const Testimonial = defineTestimonial(sequelizeServer);
    const CourseCategory = defineCourseCategory(sequelizeServer);

    // --- Define relationships ---
    User.belongsToMany(Role, { through: "UserRole", as: "roles" });
    Role.belongsToMany(User, { through: "UserRole", as: "users" });

    User.hasMany(Course, { foreignKey: "creatorId", as: "createdCourses" });
    Course.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

    User.belongsToMany(Course, {
      through: "CourseInstructor",
      as: "instructingCourses",
    });
    Course.belongsToMany(User, {
      through: "CourseInstructor",
      as: "instructors",
    });

    User.belongsToMany(Course, {
      through: Enrollment,
      as: "enrolledCourses",
      foreignKey: "userId",
      otherKey: "courseId",
    });
    Course.belongsToMany(User, {
      through: Enrollment,
      as: "students",
      foreignKey: "courseId",
      otherKey: "userId",
    });

    User.hasMany(CourseRating);
    CourseRating.belongsTo(User);
    Course.hasMany(CourseRating);
    CourseRating.belongsTo(Course);

    Course.belongsToMany(Category, {
      through: CourseCategory,
      as: "categories",
      foreignKey: "courseId",
      otherKey: "categoryId",
    });
    Category.belongsToMany(Course, {
      through: CourseCategory,
      as: "courses",
      foreignKey: "categoryId",
      otherKey: "courseId",
    });

    Course.hasMany(Chapter, { foreignKey: "courseId", as: "chapters" });
    Chapter.belongsTo(Course, { foreignKey: "courseId", as: "course" });
    Chapter.hasMany(Lecture, { foreignKey: "chapterId", as: "lectures" });
    Lecture.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

    User.belongsToMany(Lecture, {
      through: UserProgress,
      as: "completedLectures",
    });
    Lecture.belongsToMany(User, {
      through: UserProgress,
      as: "completedByUsers",
    });

    User.hasMany(Testimonial);
    Testimonial.belongsTo(User);

    await sequelizeServer.sync({ force: true });
    console.log("✅ Database synchronized");

    // --- Dummy data ---
    const DEFAULT_PASSWORD = "password123";
    const allUsers = [
      {
        _id: "user_educator_01",
        name: "DinoTimo",
        email: "dinotimo@gmail.com",
        imageUrl: "https://img.clerk.com/...",
        role: "educator",
      },
      {
        _id: "user_student_01",
        name: "Thanh Tung",
        email: "thanhtung@gmail.com",
        imageUrl: "https://i.pravatar.cc/150?u=user_student_01",
        role: "student",
      },
      {
        _id: "user_student_02",
        name: "Minh Tien",
        email: "minhtien@gmail.com",
        imageUrl: "https://i.pravatar.cc/150?u=user_student_02",
        role: "student",
      },
      {
        _id: "user_student_03",
        name: "Khoi Nguyen",
        email: "khoinguyen@gmail.com",
        imageUrl: "https://i.pravatar.cc/150?u=user_student_03",
        role: "student",
      },
    ];

    const dummyCategories = [
      { _id: "cat_programming", name: "Programming", slug: "programming" },
      { _id: "cat_web_dev", name: "Web Development", slug: "web-development" },
    ];

    const dummyCourses = [
      {
        _id: "course_js_intro",
        title: "Introduction to JavaScript",
        description: "<p>Learn JavaScript basics</p>",
        price: 49.99,
        discount: 20,
        isPublished: true,
        educatorId: "user_educator_01",
        enrolledStudentIds: ["user_student_01", "user_student_02"],
        ratingsData: [{ userId: "user_student_01", rating: 5 }],
        courseThumbnail:
          "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg",
        courseContent: [
          {
            chapterId: "js_ch1",
            chapterOrder: 1,
            chapterTitle: "Getting Started",
            chapterContent: [
              {
                lectureId: "js_ch1_lec1",
                lectureTitle: "What is JS?",
                lectureDuration: 16,
                lectureUrl: "https://youtu.be/CBWnBi-awSA",
                lectureOrder: 1,
              },
              {
                lectureId: "js_ch1_lec2",
                lectureTitle: "Setup Env",
                lectureDuration: 19,
                lectureUrl: "https://youtu.be/4l87c2aeB4I",
                lectureOrder: 2,
              },
            ],
          },
        ],
      },
    ];

    // --- Seed roles ---
    await Role.bulkCreate([
      { roleId: 1, name: "student" },
      { roleId: 2, name: "educator" },
      { roleId: 3, name: "admin" },
    ]);

    // --- Seed users ---
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    for (const u of allUsers) {
      const user = await User.create({
        userId: u._id,
        fullName: u.name,
        email: u.email,
        passwordHash: hashedPassword,
        avatarUrl: u.imageUrl,
        status: "active",
      });
      const role = await Role.findOne({ where: { name: u.role } });
      if (role) await user.addRole(role);
    }

    // --- Seed categories ---
    for (const c of dummyCategories) {
      await Category.create({ categoryId: c._id, name: c.name, slug: c.slug });
    }

    // --- Seed courses, chapters, lectures, enrollments, ratings ---
    for (const c of dummyCourses) {
      const course = await Course.create({
        courseId: c._id,
        title: c.title,
        description: c.description,
        price: c.price,
        discount: c.discount,
        status: c.isPublished ? "published" : "draft",
        creatorId: c.educatorId,
        thumbnailUrl: c.courseThumbnail,
      });

      // Categories
      if (c.title.toLowerCase().includes("javascript")) {
        const cat = await Category.findByPk("cat_programming");
        if (cat) await course.addCategory(cat);
      }

      // Chapters & lectures
      for (const ch of c.courseContent || []) {
        const chapter = await Chapter.create({
          chapterId: ch.chapterId,
          courseId: course.courseId,
          title: ch.chapterTitle,
          orderIndex: ch.chapterOrder,
        });
        for (const lec of ch.chapterContent || []) {
          await Lecture.create({
            lectureId: lec.lectureId,
            chapterId: chapter.chapterId,
            title: lec.lectureTitle,
            videoUrl: lec.lectureUrl,
            duration: lec.lectureDuration,
            lectureType: "video",
            orderIndex: lec.lectureOrder,
          });
        }
      }

      // Enrollments (cập nhật đúng cột userId & courseId)
      for (const studentId of c.enrolledStudentIds || []) {
        await Enrollment.create({
          userId: studentId,
          courseId: course.courseId,
          pricePaid: c.price,
          enrolledAt: new Date(),
          status: "active",
        });
      }

      // Ratings
      for (const rating of c.ratingsData || []) {
        await CourseRating.create({
          userId: rating.userId,
          courseId: course.courseId,
          rating: rating.rating,
          comment: "Great course!",
        });
      }
    }

    console.log("✅ Full seeding completed!");
    await sequelizeServer.close();
    await sequelizeRoot.close();
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

seedData();
