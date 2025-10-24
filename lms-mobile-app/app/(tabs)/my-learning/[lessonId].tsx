import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/**
 * Lesson detail screen. This page displays the details of a particular lesson
 * selected from the My Learning tab. For demonstration purposes it simply
 * prints the lessonId parameter and some placeholder text. In a real app you
 * would fetch the lesson content based on this ID.
 */
export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lesson {lessonId}</Text>
      <Text style={styles.content}>
        This is the detailed view for lesson {lessonId}. You can display the
        lesson content, resources, videos or quizzes here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003096',
    marginBottom: 12,
  },
  content: {
    color: '#333333',
    fontSize: 16,
  },
});