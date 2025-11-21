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
  user: User;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    roles: { roleId: string; name: string }[]; 
  };
}

export const authApi = {
  login: (data: LoginPayload) => {
    return apiClient.post<LoginResponse>("/auth/login", data);
  },
  register: (data: RegisterPayload) => {
    return apiClient.post<RegisterResponse>("/auth/register", data);
  },
};
