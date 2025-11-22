import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import { userApi } from "@/src/api/modules/userApi";

interface Creator {
  userId: string;
  fullName: string;
  avatarUrl?: string;
}

interface CourseProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface CourseData {
  courseId: string;
  title: string;
  description?: string;
  price?: string;
  discount?: string;
  thumbnailUrl: string;
  status: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: Creator;
  progress: CourseProgress;
}

interface EnrollmentItem {
  enrollmentId: string;
  enrolledAt: string;
  pricePaid: string;
  course: CourseData;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiEnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    enrollments: EnrollmentItem[];
    pagination: Pagination;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
}

const achievements: Achievement[] = [
  {
    id: "ach1",
    title: "Khởi đầu hành trình",
    description: "Chúc mừng bạn đã bắt đầu khóa học đầu tiên!",
  },
  {
    id: "ach2",
    title: "Chiến binh học tập",
    description: "Bạn đã hoàn thành 5 bài học. Hãy tiếp tục cố gắng!",
  },
];

export default function MyLearningScreen() {
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await userApi.getEnrolledCourses();

      const apiResponse = response as ApiEnrollmentResponse;

      if (apiResponse && apiResponse.success) {
        setEnrollments(apiResponse.data.enrollments);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách khóa học:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEnrolledCourses();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchEnrolledCourses();
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.headerTitle}>Khoá học của tôi</Text>

      <Text style={styles.sectionTitle}>Tiến độ học tập</Text>

      {enrollments.length > 0 ? (
        enrollments.map((item) => {
          const { course } = item;
          const progressPercent = course.progress
            ? course.progress.percentage
            : 0;
          const completedLessons = course.progress
            ? course.progress.completed
            : 0;
          const totalLessons = course.progress ? course.progress.total : 0;

          const creatorName = course.creator
            ? course.creator.fullName
            : "Giảng viên";

          return (
            <TouchableOpacity
              key={item.enrollmentId}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/my-learning/lesson/[id]",
                  params: { id: course.courseId },
                })
              }
              style={styles.card}
            >
              <Image
                source={course.thumbnailUrl ? { uri: course.thumbnailUrl } : ""}
                style={styles.thumbnail}
                contentFit="cover"
                transition={500}
              />

              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {course.title}
                </Text>
                <Text style={styles.educatorName}>GV: {creatorName}</Text>

                {/* Thanh Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progressPercent}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {`${progressPercent}%`}
                  </Text>
                </View>

                {/* Text hiển thị số bài đã học */}
                <Text style={styles.statsText}>
                  {completedLessons}/{totalLessons} bài hoàn thành
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa đăng ký khóa học nào.</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/home")}
            style={styles.exploreButton}
          >
            <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 24 }} />

      <Text style={styles.sectionTitle}>Thành tựu</Text>
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
    paddingBottom: 40,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  thumbnail: {
    width: 100,
    height: 100,
    backgroundColor: "#E9ECEF",
  },
  courseInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  educatorName: {
    fontSize: 13,
    color: "#6C757D",
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
    backgroundColor: "#007BFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#495057",
    marginLeft: 8,
    fontWeight: "600",
    minWidth: 35,
    textAlign: "right",
  },
  statsText: {
    fontSize: 11,
    color: "#ADB5BD",
    marginTop: 6,
  },
  achievementCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F3F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#343A40",
  },
  achievementDescription: {
    fontSize: 13,
    color: "#6C757D",
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6C757D",
    fontSize: 16,
    marginBottom: 12,
  },
  exploreButton: {
    backgroundColor: "#E7F1FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: "#007BFF",
    fontWeight: "600",
  },
});
