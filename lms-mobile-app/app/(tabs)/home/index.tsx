import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const featuredCourses = [
  { id: "201", title: "Mastering React Native", category: "Mobile Dev" },
  { id: "202", title: "JavaScript Advanced Concepts", category: "Web Dev" },
  { id: "203", title: "Data Structures & Algorithms", category: "CS Fundamentals" },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Featured Courses</Text>

      <FlatList
        data={featuredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => router.push(`/courses/${item.id}`)}
          >
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseCategory}>{item.category}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  courseCard: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 12,
  },
  courseTitle: { fontSize: 16, fontWeight: "600" },
  courseCategory: { marginTop: 4, fontSize: 14, color: "#777" },
});
