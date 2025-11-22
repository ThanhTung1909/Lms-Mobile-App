import { Course } from "@/src/types/course";
import apiClient from "../apiClient";

export const fetchAllCourses = async (): Promise<{
  success: boolean;
  data: Course[];
}> => {
  try {
    const response = await apiClient.get("/courses");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchCourseByID = async (
  courseId: string,
): Promise<{ success: boolean; data: Course }> => {
  try {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
