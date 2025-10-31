import { Slot, useRouter, useRootNavigationState, usePathname } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/src/providers/AuthProvider";

function RootLayoutNav() {
  const router = useRouter();
  const pathname = usePathname();
  const rootNavigationReady = useRootNavigationState()?.key !== undefined;

  const { user, isOnboarded, isAppLoading } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isAppLoading || !rootNavigationReady) {
      return;
    }

    const inTabsGroup = pathname.startsWith("/(tabs)");

    if (!isOnboarded && !pathname.startsWith("/(onboarding)")) {
      router.replace("/(onboarding)/splash");

    } else if (isOnboarded && !isAuthenticated && !pathname.startsWith("/(auth)")) {
      router.replace("/(auth)/login");

    } else if (isOnboarded && isAuthenticated && !inTabsGroup) {
      router.replace("/(tabs)/home");
    }
  }, [rootNavigationReady, isAppLoading, isAuthenticated, isOnboarded, pathname]);

  if (isAppLoading || !rootNavigationReady) {
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}


