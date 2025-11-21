import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/src/types/user";
import { allUsers } from "@/src/assets/assets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../api/modules/authApi";
import apiClient from "../api/apiClient";

const ONBOARDING_KEY = "hasOnboarded";
const TOKEN_KEY = "userToken";
const USER_INFO_KEY = "userInfo";

interface AuthContextType {
  user: User | null;
  isOnboarded: boolean | null;
  isAppLoading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const onboardedStatus = await AsyncStorage.getItem(ONBOARDING_KEY);
        setIsOnboarded(onboardedStatus === "true");
        // kiểm tra token đăng nhập ở đây
      } catch (e) {
        console.error("Failed to load initial state", e);
        setIsOnboarded(false);
      } finally {
        setIsAppLoading(false);
      }
    };
    loadInitialState();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsAuthenticating(true);

    try {
      const response = await authApi.login({ email, password });

      const { success, token, user, message } = response.data;

      if (success) {
        await AsyncStorage.setItem(TOKEN_KEY, token);

        await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(user));

        setUser(user);

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return true;
      } else {
        setError(message || "Đăng nhập thất bại");
        return false;
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const msg =
        err.response?.data?.message || "Lỗi kết nối hoặc sai thông tin";
      setError(msg);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    setError(null);
    setIsAuthenticating(true);

    try {
      const response = await authApi.register({ fullName, email, password });
      const { success, message } = response.data;

      if (success) {
        return true;
      } else {
        setError(message || "Đăng ký thất bại");
        return false;
      }
    } catch (err: any) {
      console.error("Register Error:", err);
      const msg =
        err.response?.data?.message || "Lỗi kết nối hoặc email đã tồn tại";
      setError(msg);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_INFO_KEY);
      delete apiClient.defaults.headers.common["Authorization"];
      setUser(null);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      setIsOnboarded(true);
    } catch (e) {
      console.error("Failed to complete onboarding", e);
    }
  };

  const value = {
    user,
    isOnboarded,
    isAppLoading,
    isAuthenticating,
    error,
    login,
    register,
    logout,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
