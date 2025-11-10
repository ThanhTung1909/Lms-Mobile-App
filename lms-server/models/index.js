import { Sequelize, DataTypes } from "sequelize";
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

const db = {};

// Khởi tạo các model bằng cách gọi hàm và truyền sequelize instance vào
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

// User (Creator) - Course (One-to-Many)
db.User.hasMany(db.Course, { foreignKey: "creatorId", as: "createdCourses" });
db.Course.belongsTo(db.User, { foreignKey: "creatorId", as: "creator" });

// User (Instructor) - Course (Many-to-Many)
db.User.belongsToMany(db.Course, {
  through: "CourseInstructor",
  as: "instructingCourses",
});
db.Course.belongsToMany(db.User, {
  through: "CourseInstructor",
  as: "instructors",
});

// User - Course (Enrollment)
db.User.belongsToMany(db.Course, {
  through: db.Enrollment,
  as: "enrolledCourses",
});
db.Course.belongsToMany(db.User, { through: db.Enrollment, as: "students" });

// User - Course (Rating)
db.User.hasMany(db.CourseRating);
db.CourseRating.belongsTo(db.User);
db.Course.hasMany(db.CourseRating);
db.CourseRating.belongsTo(db.Course);

// Course - Category (Many-to-Many)
db.Category.belongsToMany(db.Course, { through: "CourseCategory" });
db.Course.belongsToMany(db.Category, { through: "CourseCategory" });

// Course - Chapter - Lecture (Hierarchy)
db.Course.hasMany(db.Chapter);
db.Chapter.belongsTo(db.Course);

db.Chapter.hasMany(db.Lecture);
db.Lecture.belongsTo(db.Chapter);

// User - Lecture (UserProgress)
db.User.belongsToMany(db.Lecture, {
  through: db.UserProgress,
  as: "completedLectures",
});
db.Lecture.belongsToMany(db.User, {
  through: db.UserProgress,
  as: "completedByUsers",
});

// User - Testimonial (One-to-Many)
db.User.hasMany(db.Testimonial);
db.Testimonial.belongsTo(db.User);

db.sequelize = sequelizeConfig;
db.Sequelize = Sequelize;

export default db;
