
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

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

// ====== Database Connection ======
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
    // ====== Reset Database ======
    await sequelizeRoot.query(
      `DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`
    );
    await sequelizeRoot.query(`CREATE DATABASE \`${process.env.DB_NAME}\`;`);
    console.log("✅ Database recreated");

    await sequelizeServer.authenticate();
    console.log("✅ Database connected");

    // ====== Define Models ======
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

    // ====== Associations ======
    User.belongsToMany(Role, { through: "user_roles", as: "roles" });
    Role.belongsToMany(User, { through: "user_roles", as: "users" });

    User.hasMany(Course, { foreignKey: "creatorId", as: "createdCourses" });
    Course.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

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

    Course.hasMany(Chapter, { foreignKey: "courseId", as: "chapters" });
    Chapter.belongsTo(Course, { foreignKey: "courseId", as: "course" });

    Chapter.hasMany(Lecture, { foreignKey: "chapterId", as: "lectures" });
    Lecture.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

    Course.belongsToMany(Category, {
      through: CourseCategory,
      foreignKey: "courseId",
      otherKey: "categoryId",
      as: "categories",
    });
    Category.belongsToMany(Course, {
      through: CourseCategory,
      foreignKey: "categoryId",
      otherKey: "courseId",
      as: "courses",
    });

    User.belongsToMany(Lecture, {
      through: UserProgress,
      as: "completedLectures",
    });

    Lecture.belongsToMany(User, {
      through: UserProgress,
      as: "completedByUsers",
    });

    User.hasMany(CourseRating);
    CourseRating.belongsTo(User);

    Course.hasMany(CourseRating);
    CourseRating.belongsTo(Course);

    User.hasMany(Testimonial);
    Testimonial.belongsTo(User);

    // ====== Sync ======
    await sequelizeServer.sync({ force: true });
    console.log("✅ Tables synced");

    // ====== Seed Roles ======
    await Role.bulkCreate([
      { roleId: uuidv4(), name: "student" },
      { roleId: uuidv4(), name: "educator" },
      { roleId: uuidv4(), name: "admin" },
    ]);

    const roleStudent = await Role.findOne({ where: { name: "student" } });
    const roleEducator = await Role.findOne({ where: { name: "educator" } });

    // ====== Seed Users ======
    const password = await bcrypt.hash("password123", 10);

    const userEducator = await User.create({
      userId: uuidv4(),
      fullName: "Dino Timo",
      email: "dinotimo@gmail.com",
      passwordHash: password,
      avatarUrl: "https://img.clerk.com/...",
    });

    const student1 = await User.create({
      userId: uuidv4(),
      fullName: "Thanh Tung",
      email: "thanhtung@gmail.com",
      passwordHash: password,
      avatarUrl: "https://i.pravatar.cc/150?u=001",
    });

    const student2 = await User.create({
      userId: uuidv4(),
      fullName: "Minh Tien",
      email: "minhtien@gmail.com",
      passwordHash: password,
      avatarUrl: "https://i.pravatar.cc/150?u=002",
    });

    await userEducator.addRole(roleEducator);
    await student1.addRole(roleStudent);
    await student2.addRole(roleStudent);

    // ====== Seed Categories ======
    const catProgramming = await Category.create({
      categoryId: uuidv4(),
      name: "Programming",
      slug: "programming",
    });

    // ====== Seed Course ======
    const course = await Course.create({
      courseId: uuidv4(),
      title: "Introduction to JavaScript",
      description: "<p>Learn JavaScript basics</p>",
      price: 49.99,
      discount: 20,
      status: "published",
      thumbnailUrl: "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg",
      creatorId: userEducator.userId,
    });

    await course.addCategory(catProgramming);

    // ====== Seed Chapters & Lectures ======
    const chapter1 = await Chapter.create({
      chapterId: uuidv4(),
      courseId: course.courseId,
      title: "Getting Started",
      orderIndex: 1,
    });

    const lec1 = await Lecture.create({
      lectureId: uuidv4(),
      chapterId: chapter1.chapterId,
      title: "What is JS?",
      videoUrl: "https://youtu.be/CBWnBi-awSA",
      duration: 16,
      lectureType: "video",
      orderIndex: 1,
    });

    const lec2 = await Lecture.create({
      lectureId: uuidv4(),
      chapterId: chapter1.chapterId,
      title: "Setup Env",
      videoUrl: "https://youtu.be/4l87c2aeB4I",
      duration: 19,
      lectureType: "video",
      orderIndex: 2,
    });

    // ====== Seed Enrollments ======
    await Enrollment.create({
      enrollmentId: uuidv4(),
      userId: student1.userId,
      courseId: course.courseId,
      pricePaid: 49.99,
      status: "active",
    });

    // ====== Seed Rating ======
    await CourseRating.create({
      ratingId: uuidv4(),
      userId: student1.userId,
      courseId: course.courseId,
      rating: 5,
      comment: "Great course!",
    });

    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY!");
    await sequelizeServer.close();
    await sequelizeRoot.close();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

seedData();
