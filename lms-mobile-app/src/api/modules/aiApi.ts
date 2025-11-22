import apiClient from "../apiClient";

export interface AiReportData {
  _id: string;
  date: string;
  dailyMessage: string;
  mood: string;
  score: number;
  actionItem?: string;
}

export const getDailyAiReport = async (refresh: boolean = false) => {
  try {
    const response = await apiClient.get(`/ai/daily-report${refresh ? '?refresh=true' : ''}`);
    return response.data; 
  } catch (error) {
    throw error;
  }
};