import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

/**
 * Demo màn hình chỉnh sửa hồ sơ.
 * Phiên bản này không phụ thuộc vào useAuth — dữ liệu chỉ lưu tạm trong state.
 */
export default function EditProfileScreen() {
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("demo@lms.com");

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Validation", "Both name and email are required.");
      return;
    }

    // Chỉ demo — không gọi API, chỉ log kết quả
    console.log("Saved user:", { name, email });
    Alert.alert("Success", "Profile updated successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003096",
    marginBottom: 12,
  },
  input: {
    borderColor: "#C6C6C6",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#003096",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#003096",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
