import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar } from "react-native";

export default function OnboardingLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Slot />
    </SafeAreaView>
  );
}
