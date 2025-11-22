import apiClient from "../apiClient";

export const userApi = {
  getEnrolledCourses: async () => {
    try {
      const response = await apiClient.get("/users/enrolled-courses"); 
      return response.data; 
    } catch (error) {
      throw error; 
    }
  },

};