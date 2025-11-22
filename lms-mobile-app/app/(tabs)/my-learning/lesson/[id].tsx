import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import YoutubeIframe from "react-native-youtube-iframe";
import { Colors, Spacing } from "@/src/constants/theme";

import { fetchCourseByID } from "@/src/api/modules/courseApi";
import {
  getUserProgress,
  markLectureComplete,
  rateCourse,
} from "@/src/api/modules/userApi";

interface Lecture {
  lectureId: string;
  title: string;
  duration: number;
  videoUrl: string;
  isPreviewFree?: boolean;
}

interface Chapter {
  chapterId: string;
  title: string;
  lectures: Lecture[];
}

interface CourseDetail {
  courseId: string;
  title: string;
  chapters: Chapter[];
}

const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [completedLectureIds, setCompletedLectureIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const [courseRes, progressRes] = await Promise.all([
          fetchCourseByID(id as string),
          getUserProgress(id as string),
        ]);

        if (courseRes.success) {
          const courseData = courseRes.data as unknown as CourseDetail;
          setCourse(courseData);

          if (courseData.chapters?.[0]?.lectures?.[0]) {
            setSelectedLecture(courseData.chapters[0].lectures[0]);
          }
        }

        if (
          progressRes.success &&
          progressRes.data.progressByCourse.length > 0
        ) {
          const completedList =
            progressRes.data.progressByCourse[0].completedLectures.map(
              (l: any) => l.lectureId,
            );
          setCompletedLectureIds(new Set(completedList));
        }
      } catch (error) {
        console.error("Error loading lesson:", error);
        Alert.alert("Lỗi", "Không thể tải nội dung khóa học.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMarkComplete = async () => {
    if (!selectedLecture) return;
    if (completedLectureIds.has(selectedLecture.lectureId)) return;

    setMarking(true);
    try {
      const res = await markLectureComplete(selectedLecture.lectureId);

      if (res.success) {
        setCompletedLectureIds((prev) =>
          new Set(prev).add(selectedLecture.lectureId),
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể cập nhật tiến độ.");
    } finally {
      setMarking(false);
    }
  };

  const handleRateCourse = () => {
    Alert.alert(
      "Đánh giá khóa học",
      "Bạn muốn đánh giá khóa học này mấy sao?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "5 Sao ⭐️", onPress: () => submitRating(5) },
      ],
    );
  };

  const submitRating = async (rating: number) => {
    try {
      if (id) {
        await rateCourse(id as string, rating, "Đánh giá từ app");
        Alert.alert("Cảm ơn", `Bạn đã đánh giá ${rating} sao!`);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi đánh giá lúc này.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.common.primary} />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Không tìm thấy khóa học.</Text>
      </SafeAreaView>
    );
  }

  const isCurrentLectureCompleted =
    selectedLecture && completedLectureIds.has(selectedLecture.lectureId);

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Player Area */}
      <View style={styles.videoWrapper}>
        {selectedLecture && getYoutubeVideoId(selectedLecture.videoUrl) ? (
          <YoutubeIframe
            height={230}
            play={true}
            videoId={getYoutubeVideoId(selectedLecture.videoUrl)!}
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoPlaceholderText}>
              Video không khả dụng
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.courseTitle}>{course.title}</Text>

        {/* Controls Area */}
        {selectedLecture && (
          <View style={styles.controlsContainer}>
            <Text style={styles.lectureTitle}>
              Đang học: {selectedLecture.title}
            </Text>

            <View style={styles.buttonRow}>
              {/* Nút Hoàn thành */}
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  isCurrentLectureCompleted
                    ? styles.completedBtn
                    : styles.primaryBtn,
                ]}
                onPress={handleMarkComplete}
                disabled={!!isCurrentLectureCompleted || marking}
              >
                {marking ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Ionicons
                    name={
                      isCurrentLectureCompleted
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={20}
                    color="#FFF"
                  />
                )}
                <Text style={styles.btnText}>
                  {isCurrentLectureCompleted
                    ? "Đã hoàn thành"
                    : "Hoàn thành bài học"}
                </Text>
              </TouchableOpacity>

              {/* Nút Đánh giá */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.outlineBtn]}
                onPress={handleRateCourse}
              >
                <Ionicons
                  name="star-outline"
                  size={20}
                  color={Colors.common.primary}
                />
                <Text
                  style={[styles.btnText, { color: Colors.common.primary }]}
                >
                  Đánh giá
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* Danh sách bài học */}
        <Text style={styles.playlistTitle}>Nội dung khóa học</Text>

        {course.chapters?.map((chapter) => (
          <View key={chapter.chapterId} style={styles.chapterContainer}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>

            {chapter.lectures?.map((lecture) => {
              const isActive = selectedLecture?.lectureId === lecture.lectureId;
              const isCompleted = completedLectureIds.has(lecture.lectureId);

              return (
                <TouchableOpacity
                  key={lecture.lectureId}
                  style={[
                    styles.lectureItem,
                    isActive && styles.lectureItemActive,
                  ]}
                  onPress={() => setSelectedLecture(lecture)}
                >
                  <Ionicons
                    name={
                      isActive
                        ? "play-circle"
                        : isCompleted
                          ? "checkmark-circle"
                          : "play-circle-outline"
                    }
                    size={24}
                    color={
                      isActive
                        ? "#FFF"
                        : isCompleted
                          ? "#28a745"
                          : Colors.common.primary
                    }
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.itemTitle, isActive && { color: "#FFF" }]}
                    >
                      {lecture.title}
                    </Text>
                    <Text
                      style={[
                        styles.itemDuration,
                        isActive && { color: "#EEE" },
                      ]}
                    >
                      {lecture.duration} phút
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  videoWrapper: { backgroundColor: "#000", position: "relative" },
  videoPlaceholder: {
    height: 230,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholderText: { color: "#fff" },
  content: { padding: Spacing.medium },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  lectureTitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },

  controlsContainer: { marginBottom: 16 },
  buttonRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  primaryBtn: { backgroundColor: Colors.common.primary },
  completedBtn: { backgroundColor: "#28a745" },
  outlineBtn: {
    borderWidth: 1,
    borderColor: Colors.common.primary,
    backgroundColor: "transparent",
  },
  btnText: { color: "#FFF", fontWeight: "600", fontSize: 14 },

  divider: {
    height: 1,
    backgroundColor: Colors.light.borderColor,
    marginBottom: Spacing.medium,
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },

  chapterContainer: { marginBottom: 16 },
  chapterTitle: {
    fontSize: 15,
    fontWeight: "600",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },

  lectureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.medium,
    padding: Spacing.medium,
    borderRadius: 8,
    backgroundColor: Colors.light.lightGray,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  lectureItemActive: { backgroundColor: Colors.common.primary },
  itemTitle: { fontSize: 14, fontWeight: "500", color: Colors.light.text },
  itemDuration: { fontSize: 12, color: Colors.light.textSecondary },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
});
