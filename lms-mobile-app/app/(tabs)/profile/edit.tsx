import { View, Text, Button, StyleSheet } from "react-native";

export default function EditProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile (Placeholder)</Text>
      <Button title="Save Changes" onPress={() => alert("Profile updated!")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
