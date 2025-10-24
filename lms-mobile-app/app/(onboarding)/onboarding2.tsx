import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding2() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Onboarding Screen 2</Text>
      <Button
        title="Tiếp tục"
        onPress={() => router.push("/(onboarding)/onboarding3")}
      />
    </View>
  );
}
