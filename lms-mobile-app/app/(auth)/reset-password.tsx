import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
    
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

    
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        At least 9 characters with uppercase and lowercase letters
      </Text>

     
      <Text style={styles.label}>New Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showPass}
          placeholder="****************"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Feather name={showPass ? "eye" : "eye-off"} size={20} />
        </TouchableOpacity>
      </View>

    
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showConfirm}
          placeholder="****************"
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Feather name={showConfirm ? "eye" : "eye-off"} size={20} />
        </TouchableOpacity>
      </View>

    
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/reset-password-done")}
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
    textAlign: "center",
    color: "gray",
    marginBottom: 32,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB", 
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  input: {
    flex: 1,
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
