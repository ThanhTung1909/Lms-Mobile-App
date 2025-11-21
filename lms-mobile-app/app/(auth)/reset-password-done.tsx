import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordDone() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../src/assets/images/done.png")}
        style={styles.image}
      />
      <Text style={styles.message}>
        Your Password has been updated Successfully!
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/(auth)/login")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>DONE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 32,
  },
  message: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#1D4ED8", // blue-600
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
