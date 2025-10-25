import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton}>
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
        <TextInput placeholder="Your Name Here" style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Your Email Here"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="**************"
            secureTextEntry
            style={styles.passwordInput}
          />
          <Ionicons name="eye-off-outline" size={20} color="gray" />
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="**************"
            secureTextEntry
            style={styles.passwordInput}
          />
          <Ionicons name="eye-off-outline" size={20} color="gray" />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpText}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or Sign Up with</Text>
          <View style={styles.divider} />
        </View>

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
          <TouchableOpacity>
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
    marginBottom: 16,
  },
  passwordInput: { flex: 1 },
  signUpButton: {
    backgroundColor: "#0051CB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  signUpText: { color: "white", fontWeight: "bold", fontSize: 16 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#ddd" },
  dividerText: { marginHorizontal: 10, color: "#777" },
  facebookButton: {
    flexDirection: "row",
    backgroundColor: "#1877F2",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  facebookText: { color: "white", fontWeight: "500", marginLeft: 8 },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  googleText: { color: "#333", fontWeight: "500", marginLeft: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  footerText: { color: "#444" },
  footerLink: { color: "#0051CB", fontWeight: "600" },
});
