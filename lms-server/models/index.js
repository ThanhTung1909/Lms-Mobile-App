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

// Khởi tạo các model
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

// 1. User - Role (Many-to-Many)
db.User.belongsToMany(db.Role, {
    through: 'UserRole',
    foreignKey: 'userId',
    otherKey: 'roleId'
});
db.Role.belongsToMany(db.User, {
    through: 'UserRole',
    foreignKey: 'roleId',
    otherKey: 'userId'
});

// 2. User (Creator) - Course (One-to-Many)
db.User.hasMany(db.Course, {
    foreignKey: 'creatorId',
    as: 'createdCourses'
});
db.Course.belongsTo(db.User, {
    foreignKey: 'creatorId',
    as: 'creator'
});

// 3. User (Instructor) - Course (Many-to-Many)
db.User.belongsToMany(db.Course, {
    through: 'CourseInstructor',
    foreignKey: 'userId',
    otherKey: 'courseId',
    as: 'instructingCourses'
});
db.Course.belongsToMany(db.User, {
    through: 'CourseInstructor',
    foreignKey: 'courseId',
    otherKey: 'userId',
    as: 'instructors'
});

// 4. User - Course (Enrollment) - Many-to-Many + Direct
// Many-to-Many
db.User.belongsToMany(db.Course, {
    through: db.Enrollment,
    foreignKey: 'userId',
    otherKey: 'courseId',
    as: 'enrolledCourses'
});
db.Course.belongsToMany(db.User, {
    through: db.Enrollment,
    foreignKey: 'courseId',
    otherKey: 'userId',
    as: 'students'
});
// Direct associations (for include queries)
db.Enrollment.belongsTo(db.User, {
    foreignKey: 'userId'
});
db.Enrollment.belongsTo(db.Course, {
    foreignKey: 'courseId'
});
db.User.hasMany(db.Enrollment, {
    foreignKey: 'userId'
});
db.Course.hasMany(db.Enrollment, {
    foreignKey: 'courseId'
});

// 5. User - Course (Rating)
db.User.hasMany(db.CourseRating, {
    foreignKey: 'userId'
});
db.CourseRating.belongsTo(db.User, {
    foreignKey: 'userId'
});
db.Course.hasMany(db.CourseRating, {
    foreignKey: 'courseId'
});
db.CourseRating.belongsTo(db.Course, {
    foreignKey: 'courseId'
});

// 6. Course - Category (Many-to-Many)
db.Category.belongsToMany(db.Course, {
    through: 'CourseCategory',
    foreignKey: 'categoryId',
    otherKey: 'courseId'
});
db.Course.belongsToMany(db.Category, {
    through: 'CourseCategory',
    foreignKey: 'courseId',
    otherKey: 'categoryId'
});

// 7. Course - Chapter - Lecture (Hierarchy)
db.Course.hasMany(db.Chapter, {
    foreignKey: 'courseId'
});
db.Chapter.belongsTo(db.Course, {
    foreignKey: 'courseId'
});
db.Chapter.hasMany(db.Lecture, {
    foreignKey: 'chapterId'
});
db.Lecture.belongsTo(db.Chapter, {
    foreignKey: 'chapterId'
});

// 8. User - Lecture (UserProgress) - Many-to-Many + Direct
// Many-to-Many
db.User.belongsToMany(db.Lecture, {
    through: db.UserProgress,
    foreignKey: 'userId',
    otherKey: 'lectureId',
    as: 'completedLectures'
});
db.Lecture.belongsToMany(db.User, {
    through: db.UserProgress,
    foreignKey: 'lectureId',
    otherKey: 'userId',
    as: 'completedByUsers'
});
// Direct associations (for include queries)
db.UserProgress.belongsTo(db.User, {
    foreignKey: 'userId'
});
db.UserProgress.belongsTo(db.Lecture, {
    foreignKey: 'lectureId'
});
db.User.hasMany(db.UserProgress, {
    foreignKey: 'userId'
});
db.Lecture.hasMany(db.UserProgress, {
    foreignKey: 'lectureId'
});

// 9. User - Testimonial (One-to-Many)
db.User.hasMany(db.Testimonial, {
    foreignKey: 'userId'
});
db.Testimonial.belongsTo(db.User, {
    foreignKey: 'userId'
});

db.sequelize = sequelizeConfig;
db.Sequelize = Sequelize;

export default db;