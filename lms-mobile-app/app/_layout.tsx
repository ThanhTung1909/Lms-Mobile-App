import { Slot, useRouter, useRootNavigationState } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const rootNavigation = useRootNavigationState();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Fake check – sau này thay bằng AsyncStorage hoặc API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOnboarded(false); // giả sử user CHƯA xem onboarding
      setIsAuthenticated(false); // giả sử user chưa login
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!rootNavigation?.key || loading) return;

    if (!isOnboarded) {
      router.replace("/(onboarding)/splash");
    } else if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)/home");
    }
  }, [loading, isAuthenticated, isOnboarded, rootNavigation?.key]);

  if (loading || !rootNavigation?.key) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
