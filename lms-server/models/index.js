import { Sequelize } from "sequelize";
import sequelizeConfig from "../configs/database.js";

import defineUser from "./user.model.js";
import defineRole from "./role.model.js";
import defineCourse from "./course.model.js";
import defineCategory from "./category.model.js";
import defineChapter from "./chapter.model.js";
import defineLecture from "./lecture.model.js";
import defineEnrollment from "./enrollment.model.js";
import defineCourseRating from "./courseRating.model.js";
import defineUserProgress from "./userProgress.model.js";
import defineTestimonial from "./testimonial.model.js";
import definePayment from "./payment.model.js";
import defineCourseCategory from "./courseCategory.model.js";

const db = {};

// Init models
db.User = defineUser(sequelizeConfig);
db.Role = defineRole(sequelizeConfig);
db.Course = defineCourse(sequelizeConfig);
db.Category = defineCategory(sequelizeConfig);
db.Chapter = defineChapter(sequelizeConfig);
db.Lecture = defineLecture(sequelizeConfig);
db.Enrollment = defineEnrollment(sequelizeConfig);
db.CourseRating = defineCourseRating(sequelizeConfig);
db.UserProgress = defineUserProgress(sequelizeConfig);
db.Testimonial = defineTestimonial(sequelizeConfig);
db.Payment = definePayment(sequelizeConfig);
db.CourseCategory = defineCourseCategory(sequelizeConfig);

// ========================= Associations ========================= //

// User - Role (Many-to-Many)
db.User.belongsToMany(db.Role, {
  through: "UserRole",
  as: "roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.Role.belongsToMany(db.User, {
  through: "UserRole",
  as: "users",
  foreignKey: "roleId",
  otherKey: "userId",
});

// User (Creator) - Course

db.User.hasMany(db.Course, { foreignKey: "creatorId", as: "createdCourses" });
db.Course.belongsTo(db.User, { foreignKey: "creatorId", as: "creator" });

// User (Instructor) - Course (Many-to-Many)
db.User.belongsToMany(db.Course, {
  through: "CourseInstructor",
  as: "instructingCourses",
  foreignKey: "instructorId",
  otherKey: "courseId",
});

db.Course.belongsToMany(db.User, {
  through: "CourseInstructor",
  as: "instructors",
  foreignKey: "courseId",
  otherKey: "instructorId",
});

// Enrollment (User - Course)
db.User.belongsToMany(db.Course, {
  through: db.Enrollment,
  as: "enrolledCourses",
  foreignKey: "userId",
  otherKey: "courseId",
});

db.Course.belongsToMany(db.User, {
  through: db.Enrollment,
  as: "students",
  foreignKey: "courseId",
  otherKey: "userId",
});

db.Enrollment.belongsTo(db.User, { foreignKey: "userId" });
db.Enrollment.belongsTo(db.Course, { foreignKey: "courseId" });

db.User.hasMany(db.Enrollment, { foreignKey: "userId" });
db.Course.hasMany(db.Enrollment, { foreignKey: "courseId" });

// Course Rating
db.Course.hasMany(db.CourseRating, { foreignKey: "courseId", as: "ratings" });
db.CourseRating.belongsTo(db.Course, { foreignKey: "courseId", as: "course" });

db.User.hasMany(db.CourseRating, { foreignKey: "userId", as: "ratings" });
db.CourseRating.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// Course - Category (Many-to-Many)
db.Course.belongsToMany(db.Category, {
  through: db.CourseCategory,
  as: "categories",
  foreignKey: "courseId",
  otherKey: "categoryId",
});

db.Category.belongsToMany(db.Course, {
  through: db.CourseCategory,
  as: "courses",
  foreignKey: "categoryId",
  otherKey: "courseId",
});

// Course -> Chapter -> Lecture
db.Course.hasMany(db.Chapter, { foreignKey: "courseId", as: "chapters" });
db.Chapter.belongsTo(db.Course, { foreignKey: "courseId", as: "course" });

db.Chapter.hasMany(db.Lecture, { foreignKey: "chapterId", as: "lectures" });
db.Lecture.belongsTo(db.Chapter, { foreignKey: "chapterId", as: "chapter" });

// User - Lecture (UserProgress)
db.User.belongsToMany(db.Lecture, {
  through: db.UserProgress,
  as: "completedLectures",
  foreignKey: "userId",
  otherKey: "lectureId",
});

db.Lecture.belongsToMany(db.User, {
  through: db.UserProgress,
  as: "completedByUsers",
  foreignKey: "lectureId",
  otherKey: "userId",
});

// Explicit FK for UserProgress
db.UserProgress.belongsTo(db.User, { foreignKey: "userId" });
db.UserProgress.belongsTo(db.Lecture, { foreignKey: "lectureId" });

db.User.hasMany(db.UserProgress, { foreignKey: "userId" });
db.Lecture.hasMany(db.UserProgress, { foreignKey: "lectureId" });

// Testimonial
db.User.hasMany(db.Testimonial, { foreignKey: "userId" });
db.Testimonial.belongsTo(db.User, { foreignKey: "userId" });

// Payments
db.User.hasMany(db.Payment, { foreignKey: "userId" });
db.Payment.belongsTo(db.User, { foreignKey: "userId" });

db.Course.hasMany(db.Payment, { foreignKey: "courseId" });
db.Payment.belongsTo(db.Course, { foreignKey: "courseId" });

// Export

db.sequelize = sequelizeConfig;
db.Sequelize = Sequelize;

export default db;
