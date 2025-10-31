import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lesson View</Text>
      <Text>Lesson ID: {lessonId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
