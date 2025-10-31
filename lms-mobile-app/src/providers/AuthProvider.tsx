import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/src/types/user";
import { allUsers } from "@/src/assets/assets";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasOnboarded";

interface AuthContextType {
  user: User | null;
  isOnboarded: boolean | null;
  isAppLoading: boolean; 
  isAuthenticating: boolean; 
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = allUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (foundUser && password === "password123") {
          setUser(foundUser);
          setIsAuthenticating(false);
          resolve(true);
        } else {
          setError("Invalid email or password.");
          setIsAuthenticating(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
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
