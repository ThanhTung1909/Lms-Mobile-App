import { Slot, useRouter, useSegments } from "expo-router"; // Thêm useSegments
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/src/providers/AuthProvider";

function RootLayoutNav() {
  const { user, isOnboarded, isAppLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments(); 

  useEffect(() => {
    if (isAppLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!isOnboarded && !inOnboardingGroup) {
      router.replace("/(onboarding)/splash"); 
      return;
    }

    if (isOnboarded && !user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (user && (inAuthGroup || inOnboardingGroup)) {
      router.replace("/(tabs)/home");
      return;
    }
  }, [isOnboarded, user, isAppLoading, segments]);

  if (isAppLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#001f54" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RootLayoutNav />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
