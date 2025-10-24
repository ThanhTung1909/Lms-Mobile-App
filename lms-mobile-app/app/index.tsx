import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📱 Welcome to LMS Mobile App</Text>
      <Text style={styles.subtext}>Your learning journey starts here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  subtext: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
});
