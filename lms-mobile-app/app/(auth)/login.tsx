import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/providers/AuthProvider";

export default function LoginScreen() {
  const router = useRouter();

  const { login, isAuthenticating, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", top: 20, left: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: "#000",
              marginTop: 40,
            }}
          >
            Sign in
          </Text>
          <Text style={{ color: "#666", marginTop: 6 }}>
            Please Sign in with your account
          </Text>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 16 }}>
          <TextInput
            placeholder="Email Here"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 14,
            }}
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 8, position: "relative" }}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 14,
            }}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={{ position: "absolute", right: 14, top: 12 }}
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {error ? (
          <Text
            style={{
              color: "red",
              fontSize: 13,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          style={{ alignSelf: "flex-end", marginBottom: 24 }}
        >
          <Text style={{ color: "#777", fontSize: 13 }}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isAuthenticating}
          style={{
            backgroundColor: isAuthenticating ? "#ccc" : "#001f54",
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {isAuthenticating ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 8 }}
            />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700" }}>SIGN IN</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
          <Text style={{ marginHorizontal: 12, color: "#777" }}>
            Or Sign in with
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
        </View>

        {/* Social Buttons */}
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 28,
          }}
        >
          <Text style={{ color: "#777" }}>Didn’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={{ color: "#001f54", fontWeight: "700" }}>
              Sign up Here
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
