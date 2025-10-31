import { Stack, useRouter, usePathname, Slot } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar"; 
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/src/providers/AuthProvider";

function RootLayoutNav() {
  const { user, isOnboarded, isAppLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAppLoading) {
      return;
    }

    const inAuthGroup = pathname.startsWith("/(auth)");
    const inOnboardingGroup = pathname.startsWith("/(onboarding)");
    const inApp =
      pathname.startsWith("/(tabs)")

    if (!isOnboarded && !inOnboardingGroup) {
      router.replace("/(onboarding)/splash");
      return
    } 
    if (isOnboarded && !user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return
    } 
    if (isOnboarded && user && (inAuthGroup || inOnboardingGroup)) {
      router.replace("/(tabs)/home");
      return;
    }
  }, [isOnboarded, user, isAppLoading, pathname]);

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
