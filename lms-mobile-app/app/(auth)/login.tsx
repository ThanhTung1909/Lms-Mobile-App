import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Text>Login Screen</Text>
      <Button title="Đăng Nhập" onPress={handleLoginSuccess} />
      <Button title="Đăng ký" onPress={() => router.push("/(auth)/signup")} />
      <Button
        title="Quên mật khẩu"
        onPress={() => router.push("/(auth)/forgot-password")}
      />
    </View>
  );
}
