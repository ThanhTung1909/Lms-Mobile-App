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

export const createPaymentIntent = async (courseId: string) => {
  try {
    const response = await apiClient.post("/payment/create-intent", {
      courseId,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating payment intent:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
