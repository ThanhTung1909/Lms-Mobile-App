import { Slot, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/src/providers/AuthProvider";

import { StripeProvider } from "@stripe/stripe-react-native";

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
  const STRIPE_PUBLISHABLE_KEY =
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  return (
    <AuthProvider>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier="merchant.identifier"
      >
        <SafeAreaProvider>
          <RootLayoutNav />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </StripeProvider>
    </AuthProvider>
  );
}
