// seeders/seed.js
import { Sequelize, DataTypes, Op } from "sequelize";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// ... (phần import và khởi tạo Sequelize giữ nguyên) ...
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

dotenv.config();

const sequelize = new Sequelize(
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

const User = defineUser(sequelize);
const Role = defineRole(sequelize);
const Course = defineCourse(sequelize);
const Category = defineCategory(sequelize);
const Chapter = defineChapter(sequelize);
const Lecture = defineLecture(sequelize);
const Enrollment = defineEnrollment(sequelize);
const CourseRating = defineCourseRating(sequelize);
const UserProgress = defineUserProgress(sequelize);
const Testimonial = defineTestimonial(sequelize);

// ... (phần định nghĩa quan hệ giữ nguyên) ...
// User - Role
User.belongsToMany(Role, {
  through: "UserRole",
  foreignKey: "userId",
  otherKey: "roleId",
});
Role.belongsToMany(User, {
  through: "UserRole",
  foreignKey: "roleId",
  otherKey: "userId",
});

// User (Creator) - Course
User.hasMany(Course, { foreignKey: "creatorId", as: "createdCourses" });
Course.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

// User (Instructor) - Course
User.belongsToMany(Course, {
  through: "CourseInstructor",
  foreignKey: "userId",
  otherKey: "courseId",
  as: "instructingCourses",
});
Course.belongsToMany(User, {
  through: "CourseInstructor",
  foreignKey: "courseId",
  otherKey: "userId",
  as: "instructors",
});

// User - Course (Enrollment)
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: "userId",
  otherKey: "courseId",
  as: "enrolledCourses",
});
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: "courseId",
  otherKey: "userId",
  as: "students",
});

// User - Course (Rating)
User.hasMany(CourseRating, { foreignKey: "userId" });
CourseRating.belongsTo(User, { foreignKey: "userId" });
Course.hasMany(CourseRating, { foreignKey: "courseId" });
CourseRating.belongsTo(Course, { foreignKey: "courseId" });

// Course - Category
Category.belongsToMany(Course, {
  through: "CourseCategory",
  foreignKey: "categoryId",
  otherKey: "courseId",
});
Course.belongsToMany(Category, {
  through: "CourseCategory",
  foreignKey: "courseId",
  otherKey: "categoryId",
});

// Course - Chapter - Lecture
Course.hasMany(Chapter, { foreignKey: "courseId" });
Chapter.belongsTo(Course, { foreignKey: "courseId" });

Chapter.hasMany(Lecture, { foreignKey: "chapterId" });
Lecture.belongsTo(Chapter, { foreignKey: "chapterId" });

// User - Lecture (UserProgress)
User.belongsToMany(Lecture, {
  through: UserProgress,
  foreignKey: "userId",
  otherKey: "lectureId",
  as: "completedLectures",
});
Lecture.belongsToMany(User, {
  through: UserProgress,
  foreignKey: "lectureId",
  otherKey: "userId",
  as: "completedByUsers",
});

// User - Testimonial
User.hasMany(Testimonial, { foreignKey: "userId" });
Testimonial.belongsTo(User, { foreignKey: "userId" });

// --- Dữ liệu mẫu ---
const allUsers = [
  {
    _id: "user_educator_01",
    name: "DinoTimo",
    email: "dinotimo@gmail.com",
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yclFkaDBOMmFqWnBoTTRBOXZUanZxVlo0aXYifQ",
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

const DEFAULT_PASSWORD = "password123";

const dummyTestimonial = [
  {
    userId: "user_student_01",
    content:
      "This LMS platform is fantastic! The courses are well-structured and the interface is very intuitive. Highly recommended!",
    isApproved: true,
  },
  {
    userId: "user_student_02",
    content:
      "I learned so much from the Web Development Bootcamp. The hands-on projects were incredibly helpful for my career.",
    isApproved: true,
  },
];

const dummyCategories = [
  { _id: "cat_programming", name: "Programming", slug: "programming" },
  { _id: "cat_web_dev", name: "Web Development", slug: "web-development" },
  { _id: "cat_cybersecurity", name: "Cybersecurity", slug: "cybersecurity" },
  { _id: "cat_data_science", name: "Data Science", slug: "data-science" },
  { _id: "cat_cloud", name: "Cloud Computing", slug: "cloud-computing" },
];

// <<< SỬA ĐỔI: Bổ sung lại thuộc tính `courseContent` đã bị thiếu vào dữ liệu `dummyCourses`
const dummyCourses = [
  {
    _id: "course_js_intro",
    title: "Introduction to JavaScript",
    description:
      "<h2>Learn the Basics of JavaScript</h2><p>This course covers the fundamentals of JavaScript, perfect for beginners in web development.</p>",
    price: 49.99,
    discount: 20,
    isPublished: true,
    educatorId: "user_educator_01",
    enrolledStudentIds: ["user_student_01", "user_student_02"],
    ratingsData: [{ userId: "user_student_01", rating: 5 }],
    courseThumbnail: "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg",
    courseContent: [
      {
        chapterId: "js_ch1",
        chapterOrder: 1,
        chapterTitle: "Getting Started",
        chapterContent: [
          {
            lectureId: "js_ch1_lec1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            lectureOrder: 1,
          },
          {
            lectureId: "js_ch1_lec2",
            lectureTitle: "Setting Up Environment",
            lectureDuration: 19,
            lectureUrl: "https://youtu.be/4l87c2aeB4I",
            lectureOrder: 2,
          },
        ],
      },
    ],
  },
  {
    _id: "course_py_adv",
    title: "Advanced Python Programming",
    description:
      "<h2>Deep Dive into Python</h2><p>Take your Python skills to the next level with advanced topics like decorators and generators.</p>",
    price: 79.99,
    discount: 15,
    isPublished: true,
    educatorId: "user_educator_01",
    enrolledStudentIds: [
      "user_student_01",
      "user_student_02",
      "user_student_03",
    ],
    ratingsData: [{ userId: "user_student_02", rating: 5 }],
    courseThumbnail: "https://img.youtube.com/vi/HdLIMoQkXFA/maxresdefault.jpg",
    courseContent: [
      {
        chapterId: "py_ch1",
        chapterOrder: 1,
        chapterTitle: "Advanced Data Structures",
        chapterContent: [
          {
            lectureId: "py_ch1_lec1",
            lectureTitle: "Lists and Tuples Deep Dive",
            lectureDuration: 720,
            lectureUrl: "https://youtu.be/HdLIMoQkXFA",
            lectureOrder: 1,
          },
        ],
      },
    ],
  },
  {
    _id: "course_web_dev",
    title: "Web Development Bootcamp",
    description:
      "<h2>Become a Full-Stack Web Developer</h2><p>From zero to hero in web development. This bootcamp covers it all.</p>",
    price: 99.99,
    discount: 25,
    isPublished: true,
    educatorId: "user_educator_01",
    enrolledStudentIds: ["user_student_02"],
    ratingsData: [],
    courseThumbnail: "https://img.youtube.com/vi/lpx2zFkapIk/maxresdefault.jpg",
    courseContent: [], // Khóa học này chưa có chương trình
  },
];

// --- Hàm Seed ---
const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: true });
    console.log("Database synchronized successfully.");

    // 1. Seed Roles
    const roles = await Role.bulkCreate([
      { roleId: 1, name: "student" },
      { roleId: 2, name: "educator" },
      { roleId: 3, name: "admin" },
    ]);
    console.log("Seeded roles:", roles.map((r) => r.name).join(", "));

    // 2. Seed Users
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const usersToCreate = allUsers.map((user) => ({
      userId: user._id,
      fullName: user.name,
      email: user.email,
      passwordHash: hashedPassword,
      avatarUrl: user.imageUrl,
      status: "active",
    }));
    const createdUsers = await User.bulkCreate(usersToCreate);
    console.log(`Seeded ${createdUsers.length} users.`);

    for (const user of allUsers) {
      const dbUser = await User.findByPk(user._id);
      const role = await Role.findOne({ where: { name: user.role } });
      if (dbUser && role) {
        await dbUser.addRole(role);
      }
    }
    console.log("Assigned roles to users.");

    // 3. Seed Categories
    const createdCategories = await Category.bulkCreate(
      dummyCategories.map((cat) => ({
        categoryId: cat._id,
        name: cat.name,
        slug: cat.slug,
      }))
    );
    console.log(`Seeded ${createdCategories.length} categories.`);

    // 4. Seed Courses
    const createdCourses = await Course.bulkCreate(
      dummyCourses.map((course) => ({
        courseId: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        discount: course.discount,
        status: course.isPublished ? "published" : "draft",
        creatorId: course.educatorId,
        thumbnailUrl: course.courseThumbnail,
      }))
    );
    console.log(`Seeded ${createdCourses.length} courses.`);

    const courseCategoryMappings = [];
    dummyCourses.forEach((course) => {
      let assignedCategories = [];
      if (
        course.title.toLowerCase().includes("javascript") ||
        course.title.toLowerCase().includes("python")
      ) {
        assignedCategories.push("cat_programming");
      }
      if (course.title.toLowerCase().includes("web development")) {
        assignedCategories.push("cat_web_dev");
      }
      if (course.title.toLowerCase().includes("cybersecurity")) {
        assignedCategories.push("cat_cybersecurity");
      }
      if (
        course.title.toLowerCase().includes("data science") ||
        course.title.toLowerCase().includes("machine learning")
      ) {
        assignedCategories.push("cat_data_science");
      }
      if (course.title.toLowerCase().includes("cloud computing")) {
        assignedCategories.push("cat_cloud");
      }
      assignedCategories.forEach((catId) => {
        courseCategoryMappings.push({
          courseId: course._id,
          categoryId: catId,
        });
      });
    });
    if (courseCategoryMappings.length > 0) {
      await sequelize.models.CourseCategory.bulkCreate(courseCategoryMappings);
      console.log("Linked courses to categories.");
    }

    // 5. Seed Chapters & Lectures
    const chaptersToCreate = [];
    const lecturesToCreate = [];

    for (const courseData of dummyCourses) {
      if (courseData.courseContent && Array.isArray(courseData.courseContent)) {
        for (const chapterData of courseData.courseContent) {
          chaptersToCreate.push({
            chapterId: chapterData.chapterId, // Sử dụng ID đã định nghĩa
            courseId: courseData._id,
            title: chapterData.chapterTitle,
            orderIndex: chapterData.chapterOrder,
          });

          if (
            chapterData.chapterContent &&
            Array.isArray(chapterData.chapterContent)
          ) {
            for (const lectureData of chapterData.chapterContent) {
              lecturesToCreate.push({
                lectureId: lectureData.lectureId, // Sử dụng ID đã định nghĩa
                chapterId: chapterData.chapterId,
                title: lectureData.lectureTitle,
                videoUrl: lectureData.lectureUrl,
                duration: lectureData.lectureDuration,
                lectureType: "video",
                orderIndex: lectureData.lectureOrder,
              });
            }
          }
        }
      }
    }

    if (chaptersToCreate.length > 0) {
      await Chapter.bulkCreate(chaptersToCreate);
      console.log(`Seeded ${chaptersToCreate.length} chapters.`);
    }
    if (lecturesToCreate.length > 0) {
      await Lecture.bulkCreate(lecturesToCreate);
      console.log(`Seeded ${lecturesToCreate.length} lectures.`);
    }

    // <<< SỬA ĐỔI: Bỏ việc tự tạo ID khóa chính cho các bảng sau. Để Sequelize tự quản lý.
    // 6. Seed Enrollments
    const enrollmentsToCreate = [];
    for (const courseData of dummyCourses) {
      if (
        courseData.enrolledStudentIds &&
        Array.isArray(courseData.enrolledStudentIds)
      ) {
        for (const studentId of courseData.enrolledStudentIds) {
          enrollmentsToCreate.push({
            userId: studentId,
            courseId: courseData._id,
            pricePaid: courseData.price,
            enrolledAt: new Date(),
          });
        }
      }
    }
    if (enrollmentsToCreate.length > 0) {
      await Enrollment.bulkCreate(enrollmentsToCreate);
      console.log(`Seeded ${enrollmentsToCreate.length} enrollments.`);
    }

    // 7. Seed Course Ratings
    const courseRatingsToCreate = [];
    for (const courseData of dummyCourses) {
      if (courseData.ratingsData && Array.isArray(courseData.ratingsData)) {
        for (const ratingData of courseData.ratingsData) {
          courseRatingsToCreate.push({
            userId: ratingData.userId,
            courseId: courseData._id,
            rating: ratingData.rating,
            comment: "This is a great course!", // Thêm comment mẫu
          });
        }
      }
    }
    if (courseRatingsToCreate.length > 0) {
      await CourseRating.bulkCreate(courseRatingsToCreate);
      console.log(`Seeded ${courseRatingsToCreate.length} course ratings.`);
    }

    // 8. Seed User Progress (Giả lập một số tiến độ)
    const userProgressToCreate = [];
    const jsIntroCourse = dummyCourses.find((c) => c._id === "course_js_intro");
    if (jsIntroCourse?.courseContent?.[0]?.chapterContent?.[0]) {
      // <<< SỬA ĐỔI: Kiểm tra an toàn hơn
      userProgressToCreate.push({
        userId: "user_student_01",
        lectureId: jsIntroCourse.courseContent[0].chapterContent[0].lectureId,
        completedAt: new Date(),
      });
    }

    if (userProgressToCreate.length > 0) {
      await UserProgress.bulkCreate(userProgressToCreate);
      console.log(
        `Seeded ${userProgressToCreate.length} user progress entries.`
      );
    }

    // 9. Seed Testimonials
    const testimonialsToCreate = dummyTestimonial.map((test) => ({
      userId: test.userId,
      content: test.content,
      isApproved: test.isApproved,
    }));
    if (testimonialsToCreate.length > 0) {
      await Testimonial.bulkCreate(testimonialsToCreate);
      console.log(`Seeded ${testimonialsToCreate.length} testimonials.`);
    }

    console.log("\n✅ Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await sequelize.close();
  }
};

seedData();
