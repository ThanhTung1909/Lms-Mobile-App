import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ProgressItem from '../../../src/components/specific/ProgressItem';
import AchievementItem from '../../../src/components/specific/AchievementItem';

/**
 * My Learning screen. Displays a list of courses with progress bars and a
 * collection of achievements the user has earned. All data here is mocked for
 * demonstration purposes. In a production application you would fetch the
 * current progress and achievements for the authenticated user from your
 * backend API.
 */
interface CourseProgress {
  id: string;
  title: string;
  progress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
}

const courses: CourseProgress[] = [
  { id: 'js', title: 'JavaScript Basics', progress: 0.75 },
  { id: 'rn', title: 'React Native Fundamentals', progress: 0.4 },
  { id: 'algos', title: 'Algorithms & Data Structures', progress: 0.2 },
];

const achievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'Started your first course',
    description: 'Congratulations on beginning your learning journey!',
  },
  {
    id: 'ach2',
    title: '5 lessons completed',
    description: 'You have completed five lessons. Keep it up!',
  },
];

export default function MyLearningScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Your Progress</Text>
      {courses.map((course) => (
        <ProgressItem
          key={course.id}
          title={course.title}
          progress={course.progress}
        />
      ))}
      <View style={{ height: 16 }} />
      <Text style={styles.sectionTitle}>Achievements</Text>
      {achievements.map((ach) => (
        <AchievementItem
          key={ach.id}
          title={ach.title}
          description={ach.description}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003096',
    marginBottom: 8,
  },
});