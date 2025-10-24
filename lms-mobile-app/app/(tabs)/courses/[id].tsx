// app/(tabs)/courses/[id].tsx
import { View, Text, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Detail</Text>
      <Text>Course ID: {id}</Text>

      <Button
        title="Enroll / Start Course"
        onPress={() => router.push("/(tabs)/courses/enroll")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
