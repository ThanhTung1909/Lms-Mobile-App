import { Slot, useRouter, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function OnboardingLayout() {
  const router = useRouter();

  // Có thể điều hướng từng màn theo button "Tiếp tục" hoặc auto sau timeout ở mỗi screen.
  // Hoặc bạn chỉ cần <Slot/> thôi nếu điều hướng nằm trong từng màn hình.

  return <Slot />;
}
