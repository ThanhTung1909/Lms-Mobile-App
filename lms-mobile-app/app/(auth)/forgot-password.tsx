import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your registered email to reset password
      </Text>

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email here"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/reset-password")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "gray",
    textAlign: "center",
    marginBottom: 32,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB", 
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1D4ED8", 
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
