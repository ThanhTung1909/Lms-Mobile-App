import apiClient from "../apiClient";

export interface NotificationItem {
  _id: string;
  type: "AI_INSIGHT" | "LIKE" | "COMMENT" | "SYSTEM";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

export const getNotifications = async () => {
  try {
    const response = await apiClient.get("/notifi");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const response = await apiClient.put("/notifi/read-all");
    return response.data;
  } catch (error) {
    throw error;
  }
};
