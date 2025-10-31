
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function EnrollScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enroll Screen</Text>
      <Text>Confirm to enroll this course</Text>

      <Button
        title="Go to Lesson 1"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
