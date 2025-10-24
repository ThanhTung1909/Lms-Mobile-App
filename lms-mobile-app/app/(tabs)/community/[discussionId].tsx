
import { View, Text, Button, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DiscussionDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discussion Detail</Text>
      <Text>Post ID: {id}</Text>

      <Text style={styles.sectionTitle}>Comments:</Text>
      <Text>- User A: Great tips!</Text>
      <Text>- User B: I agree with this.</Text>

      <Button title="Add Comment / Reply" onPress={() => alert("Placeholder")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 20 },
});
