import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Discussion</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter post title..."
        value={title}
        onChangeText={setTitle}
      />

      <Button
        title="Submit"
        onPress={() => {
          alert("Post created (placeholder)");
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
});
