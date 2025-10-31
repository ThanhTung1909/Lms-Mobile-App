// app/_layout.tsx

import { Slot, useRouter, useRootNavigationState } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/src/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 1. Import AsyncStorage

const ONBOARDING_KEY = "hasOnboarded"; // Tạo một key hằng số

function RootLayoutNav() {
  const router = useRouter();
  const rootNavigationReady = useRootNavigationState()?.key !== undefined;
  
  const { user, isLoading: isAuthLoading } = useAuth(); 
  const isAuthenticated = !!user;

  // State để quản lý việc đã xem onboarding hay chưa
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  // 2. useEffect này giờ sẽ ĐỌC từ AsyncStorage
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        // Nếu value là 'true', nghĩa là người dùng đã xem onboarding
        setIsOnboarded(value === 'true');
      } catch (e) {
        // Xử lý lỗi nếu có
        setIsOnboarded(false);
      }
    };
    checkOnboarding();
  }, []);

  // 3. useEffect điều hướng chính
  useEffect(() => {
    // Chờ cho đến khi TẤT CẢ các trạng thái cần thiết được xác định
    if (!rootNavigationReady || isAuthLoading || isOnboarded === null) {
      return;
    }

    if (!isOnboarded) {
      router.replace("/(onboarding)/splash");
    } else if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)/home");
    }
  }, [rootNavigationReady, isAuthLoading, isAuthenticated, isOnboarded]);

  // Hiển thị loading cho đến khi tất cả sẵn sàng
  if (!rootNavigationReady || isAuthLoading || isOnboarded === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <RootLayoutNav /> 
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}