// app/(tabs)/mylearning/index.tsx
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const myCourses = [
  { id: "101", title: "React Native for Beginners", progress: "45%" },
  { id: "102", title: "UI/UX Design Basics", progress: "72%" },
];

export default function MyLearningScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Learning</Text>

      <FlatList
        data={myCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => router.push(`/my-learning/${item.id}`)}
          >
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseProgress}>Progress: {item.progress}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  courseCard: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 12,
  },
  courseTitle: { fontSize: 16, fontWeight: "600" },
  courseProgress: { marginTop: 4, fontSize: 14, color: "#555" },
});
