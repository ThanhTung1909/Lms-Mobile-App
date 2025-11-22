import apiClient from "../apiClient";

// Lấy danh sách khóa học đã đăng ký
export const getEnrolledCourses = async () => {
  try {
    const response = await apiClient.get("/users/enrolled-courses");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy tiến độ học tập
export const getUserProgress = async (courseId: string) => {
  try {
    const response = await apiClient.get(`/users/progress`, {
      params: { courseId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Đánh dấu hoàn thành bài học
export const markLectureComplete = async (lectureId: string) => {
  try {
    const response = await apiClient.post(`/users/progress/${lectureId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Đánh giá khóa học
export const rateCourse = async (
  courseId: string,
  rating: number,
  comment: string,
) => {
  try {
    const response = await apiClient.post(`/courses/${courseId}/rate`, {
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const syncProgress = async (
  lectureId: string,
  courseId: string,
  currentSecond: number,
  totalDuration: number,
) => {
  try {
    const response = await apiClient.post("/users/progress/sync", {
      lectureId,
      courseId,
      currentSecond,
      totalDuration,
      deviceInfo: "mobile_app",
    });
    return response.data;
  } catch (error) {
    console.log("Sync error (silent):", error);
    return null;
  }
};
