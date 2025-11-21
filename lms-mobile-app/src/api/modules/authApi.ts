import { User } from "@/src/types/user";
import apiClient from "../apiClient";
interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User; // Backend trả về key là "user"
}

export const authApi = {
  login: (data: LoginPayload) => {
    return apiClient.post<LoginResponse>("/auth/login", data);
  },
};
