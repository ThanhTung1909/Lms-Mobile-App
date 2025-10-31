import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dummyEducatorData } from "@/src/assets/assets";

type User = typeof dummyEducatorData;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Load user từ AsyncStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Error loading user:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!email.trim() || !password.trim()) {
        setError("Please enter both email and password.");
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (
        email.toLowerCase() === dummyEducatorData.email.toLowerCase() &&
        password === "password123"
      ) {
        setUser(dummyEducatorData);
        await AsyncStorage.setItem("user", JSON.stringify(dummyEducatorData)); //lưu lại user
        return true;
      } else {
        setError("Invalid email or password. Please try again.");
        return false;
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user"); //xóa user khỏi bộ nhớ
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
