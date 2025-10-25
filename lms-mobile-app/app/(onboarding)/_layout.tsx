import { Slot, useRouter, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function OnboardingLayout() {
  const router = useRouter();
  return <Slot />;
}
