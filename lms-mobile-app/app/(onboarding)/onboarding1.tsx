import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding1() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Onboarding Screen 1</Text>
      <Button
        title="Tiếp tục"
        onPress={() => router.push("/(onboarding)/onboarding2")}
      />
    </View>
  );
}
