import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Change Language")}>
        <Text style={styles.buttonText}>Language</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Notifications Settings")}>
        <Text style={styles.buttonText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#ffdddd" }]} onPress={() => Alert.alert("Logged Out")}>
        <Text style={[styles.buttonText, { color: "red" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});
