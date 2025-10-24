
import { View, Text, Button, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function MyLearningDetailScreen() {
  const { lessonId } = useLocalSearchParams(); // Đổi từ id -> lessonId

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resume Course</Text>
      <Text>Course ID: {lessonId}</Text>

      <Button
        title="Continue Learning (Placeholder)"
        onPress={() => alert("Lesson view coming soon!")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
