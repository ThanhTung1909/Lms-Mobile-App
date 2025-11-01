  import React from "react";
  import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from "react-native";
  import { Image } from "expo-image";
  import { useAuth } from "@/src/providers/AuthProvider";
  import { allUsers, dummyCourses } from "@/src/assets/assets";
  import { useRouter } from "expo-router";

  /**
   * My Learning screen. Displays a list of courses with progress bars and a
   * collection of achievements the user has earned. All data here is mocked for
   * demonstration purposes. In a production application you would fetch the
   * current progress and achievements for the authenticated user from your
   * backend API.
   */
  interface Achievement {
    id: string;
    title: string;
    description: string;
  }

  const userProgress: Record<string, number> = {
    "605c72efb3f1c2b1f8e4e1a1": 0.75,
    "675ac1512100b91a6d9b8b24": 0.4,
    "605c72efb3f1c2b1f8e4e1ac": 0.2,
    "605c72efb3f1c2b1f8e4e1ab": 0.0,
  };

  const achievements: Achievement[] = [
    {
      id: "ach1",
      title: "Started your first course",
      description: "Congratulations on beginning your learning journey!",
    },
    {
      id: "ach2",
      title: "5 lessons completed",
      description: "You have completed five lessons. Keep it up!",
    },
  ];

  export default function MyLearningScreen() {
    const { user } = useAuth();
    const router = useRouter()

    const getEducatorName = (educatorId: string) => {
      const educator = allUsers.find(
        (u) => u._id === educatorId && u.role === "educator",
      );
      return educator ? educator.name : "Unknown Instructor";
    };

    const enrolledCourses = user
      ? dummyCourses.filter((course) =>
          course.enrolledStudents.includes(user._id),
        )
      : [];

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Enrolled Courses Section */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => {
            const progress = userProgress[course._id] || 0;
            const educatorName = getEducatorName(course.educator);

            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/my-learning/lesson/[id]",
                    params: { id: course._id },
                  })
                }
                key={course._id}
                style={styles.card}
              >
                <Image
                  source={{ uri: course.courseThumbnail }}
                  style={styles.thumbnail}
                />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {course.courseTitle}
                  </Text>
                  <Text style={styles.educatorName}>By {educatorName}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${progress * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{`${Math.round(
                      progress * 100,
                    )}%`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.emptyText}>
            You are not enrolled in any courses yet.
          </Text>
        )}

        <View style={{ height: 16 }} />

        {/* Achievements Section */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map((ach) => (
          <View key={ach.id} style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{ach.title}</Text>
              <Text style={styles.achievementDescription}>{ach.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F9FA",
    },
    contentContainer: {
      padding: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#1C2A4B",
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#343A40",
      marginBottom: 16,
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      flexDirection: "row",
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      overflow: "hidden",
    },
    thumbnail: {
      width: 100,
      height: 100,
    },
    courseInfo: {
      flex: 1,
      padding: 12,
      justifyContent: "center",
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#212529",
    },
    educatorName: {
      fontSize: 14,
      color: "#6C757D",
      marginTop: 4,
      marginBottom: 8,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    progressBarBackground: {
      flex: 1,
      height: 8,
      backgroundColor: "#E9ECEF",
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: "#007BFF", // A vibrant blue for progress
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: "#495057",
      marginLeft: 8,
      fontWeight: "600",
    },
    achievementCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 3,
    },
    achievementIcon: {
      fontSize: 24,
      marginRight: 16,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#343A40",
    },
    achievementDescription: {
      fontSize: 14,
      color: "#6C757D",
      marginTop: 2,
    },
    emptyText: {
      textAlign: "center",
      color: "#6C757D",
      marginTop: 20,
      fontSize: 16,
    },
  });
