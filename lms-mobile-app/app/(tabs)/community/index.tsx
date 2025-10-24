// app/(tabs)/community/index.tsx
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const mockDiscussions = [
  { id: "1", title: "How to stay motivated in online learning?" },
  { id: "2", title: "Tips for passing final exams" },
];

export default function CommunityScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Discussions</Text>

      <FlatList
        data={mockDiscussions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(tabs)/community/${item.id}`)}>
            <Text style={styles.item}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Create New Post" onPress={() => router.push("/(tabs)/community/new")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  item: { paddingVertical: 12, fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
});
