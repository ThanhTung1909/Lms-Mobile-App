import apiClient from "../apiClient";


export const fetchAllCourses = async () => {
    try {
        const response = await apiClient.get("/courses")
        return response.data
    } catch (error) {
        console.log(error);
        throw error
        
    }
}