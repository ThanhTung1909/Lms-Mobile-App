import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding3() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Onboarding Screen 3</Text>
      <Button
        title="Hoàn tất"
        onPress={() => {
          // TODO: Lưu trạng thái đã onboarding vào AsyncStorage sau này
          router.replace("/(auth)/login");
        }}
      />
    </View>
  );
}
