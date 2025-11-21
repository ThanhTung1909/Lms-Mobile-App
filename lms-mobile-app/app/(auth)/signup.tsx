import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";

export default function Signup() {
  const router = useRouter();
  const { register, isAuthenticating } = useAuth();

  // State cho Form Data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State cho UI (Ẩn/Hiện mật khẩu)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State cho Lỗi Validation
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "", // Lỗi chung từ API
  });

  // Hàm kiểm tra Validation
  const validate = () => {
    let isValid = true;
    let newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Hàm xử lý Đăng ký
  const handleSignup = async () => {
    if (!validate()) return; // Nếu validate sai thì dừng

    // Gọi API Register từ AuthProvider
    const success = await register(fullName, email, password);

    if (success) {
      Alert.alert("Success", "Account created successfully! Please log in.", [
        {
          text: "OK",
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } else {
      // Nếu thất bại, lấy lỗi từ AuthProvider (đã được set trong hook useAuth)
      // Hoặc set lỗi chung ở đây
      setErrors((prev) => ({
        ...prev,
        general: "Registration failed. Email might be taken.",
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Create an account to begin your Learning Journey
          </Text>
        </View>

        {/* Input Fields */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Your Name Here"
          style={[styles.input, errors.fullName ? styles.inputError : null]}
          value={fullName}
          onChangeText={setFullName}
        />
        {errors.fullName ? (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        ) : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Your Email Here"
          keyboardType="email-address"
          style={[styles.input, errors.email ? styles.inputError : null]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.passwordContainer,
            errors.password ? styles.inputError : null,
          ]}
        >
          <TextInput
            placeholder="**************"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <Text style={styles.label}>Confirm Password</Text>
        <View
          style={[
            styles.passwordContainer,
            errors.confirmPassword ? styles.inputError : null,
          ]}
        >
          <TextInput
            placeholder="**************"
            secureTextEntry={!showConfirmPassword}
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}

        {/* Hiển thị lỗi chung từ API nếu có */}
        {errors.general ? (
          <Text style={styles.generalErrorText}>{errors.general}</Text>
        ) : null}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[
            styles.signUpButton,
            isAuthenticating && styles.disabledButton,
          ]}
          onPress={handleSignup}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpText}>SIGN UP</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or Sign Up with</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Buttons (Giữ nguyên UI) */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#1877f2",
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons
            name="logo-facebook"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Sign In with Facebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="logo-google"
            size={20}
            color="#db4437"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#000", fontWeight: "600" }}>
            Sign In with Google
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.footerLink}>Sign in Here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  contentContainer: { padding: 20 },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 20,
  },
  header: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111" },
  subtitle: { textAlign: "center", color: "#666", marginTop: 8 },
  label: { fontWeight: "500", color: "#333", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 6, // Giảm margin để nhường chỗ cho error text
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  generalErrorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 6,
  },
  passwordInput: { flex: 1 },
  signUpButton: {
    backgroundColor: "#0051CB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
  signUpText: { color: "white", fontWeight: "bold", fontSize: 16 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#ddd" },
  dividerText: { marginHorizontal: 10, color: "#777" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  footerText: { color: "#444" },
  footerLink: { color: "#0051CB", fontWeight: "600" },
});
