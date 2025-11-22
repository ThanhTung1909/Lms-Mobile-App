import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import YoutubeIframe, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { Colors, Spacing } from "@/src/constants/theme";

import { fetchCourseByID } from "@/src/api/modules/courseApi";
import {
  getUserProgress,
  markLectureComplete,
  rateCourse,
  syncProgress,
} from "@/src/api/modules/userApi";
// --- [NEW] Import API AI ---
import { getDailyAiReport, AiReportData } from "@/src/api/modules/aiApi";

// --- Interfaces ---
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

  // --- State Data ---
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [completedLectureIds, setCompletedLectureIds] = useState<Set<string>>(
    new Set(),
  );

  // --- [NEW] State cho AI Insight ---
  const [aiInsight, setAiInsight] = useState<AiReportData | null>(null);

  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  // --- State Modal Đánh giá ---
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  const playerRef = useRef<YoutubeIframeRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        // Gọi song song: Course Info, Progress và [NEW] AI Report
        const [courseRes, progressRes, aiRes] = await Promise.all([
          fetchCourseByID(id as string),
          getUserProgress(id as string),
          getDailyAiReport(), // Lấy báo cáo AI
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

        // [NEW] Set data AI
        if (aiRes.success) {
          setAiInsight(aiRes.data);
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

  // --- Tracking Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && selectedLecture && id) {
      interval = setInterval(async () => {
        if (playerRef.current) {
          try {
            const currentTime = await playerRef.current.getCurrentTime();
            const duration = await playerRef.current.getDuration();

            if (duration > 0) {
              const res = await syncProgress(
                selectedLecture.lectureId,
                id as string,
                Math.floor(currentTime),
                Math.floor(duration),
              );

              if (res?.success && res.data.isCompleted) {
                if (!completedLectureIds.has(selectedLecture.lectureId)) {
                  setCompletedLectureIds((prev) =>
                    new Set(prev).add(selectedLecture.lectureId),
                  );
                }
              }
            }
          } catch (err) {
            console.log("Tracking error:", err);
          }
        }
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, selectedLecture, id, completedLectureIds]);

  // --- Handlers ---
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

  const openRatingModal = () => {
    setRating(5);
    setComment("");
    setModalVisible(true);
  };

  const submitRating = async () => {
    if (!id) return;
    setSubmittingRating(true);
    Keyboard.dismiss();

    try {
      await rateCourse(id as string, rating, comment);
      Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá khóa học!");
      setModalVisible(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Không thể gửi đánh giá lúc này.";
      Alert.alert("Gửi thất bại", errorMessage);
    } finally {
      setSubmittingRating(false);
    }
  };

  // --- Render ---
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
      {/* Video Player */}
      <View style={styles.videoWrapper}>
        {selectedLecture && getYoutubeVideoId(selectedLecture.videoUrl) ? (
          <YoutubeIframe
            ref={playerRef}
            height={230}
            play={true}
            videoId={getYoutubeVideoId(selectedLecture.videoUrl)!}
            onChangeState={(state: string) => {
              if (state === "playing") setIsPlaying(true);
              else if (state === "paused" || state === "ended")
                setIsPlaying(false);
            }}
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

        {/* Controls: Hoàn thành & Đánh giá */}
        {selectedLecture && (
          <View style={styles.controlsContainer}>
            <Text style={styles.lectureTitle}>
              Đang học: {selectedLecture.title}
            </Text>
            <View style={styles.buttonRow}>
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

              <TouchableOpacity
                style={[styles.actionBtn, styles.outlineBtn]}
                onPress={openRatingModal}
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

        {/* --- [NEW] WIDGET AI PHÂN TÍCH (Thay thế phần Thành tích cũ) --- */}
        {aiInsight && (
          <View style={styles.aiWidgetContainer}>
            <View style={styles.aiHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Ionicons name="sparkles" size={20} color="#9C27B0" />
                <Text style={styles.aiTitle}>Trợ lý AI phân tích</Text>
              </View>
              <View style={styles.aiScoreBadge}>
                <Text style={styles.aiScoreText}>{aiInsight.score}/10</Text>
              </View>
            </View>

            <Text style={styles.aiMessage}>"{aiInsight.dailyMessage}"</Text>

            {aiInsight.actionItem && (
              <View style={styles.aiActionBox}>
                <Ionicons name="bulb-outline" size={16} color="#0277BD" />
                <Text style={styles.aiActionText}>{aiInsight.actionItem}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.divider} />
        <Text style={styles.playlistTitle}>Nội dung khóa học</Text>

        {/* Course Content List */}
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

      {/* --- Modal Đánh Giá --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Đánh giá khóa học</Text>
                <View style={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      style={{ padding: 5 }}
                    >
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={32}
                        color="#FFD700"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Viết cảm nhận..."
                  multiline
                  numberOfLines={4}
                  value={comment}
                  onChangeText={setComment}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.cancelBtn]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelBtnText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.submitBtn]}
                    onPress={submitRating}
                    disabled={submittingRating}
                  >
                    {submittingRating ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.submitBtnText}>Gửi</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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

  // --- AI Widget Styles ---
  aiWidgetContainer: {
    backgroundColor: "#F3E5F5", // Tím nhạt
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E1BEE7",
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7B1FA2", // Tím đậm
  },
  aiScoreBadge: {
    backgroundColor: "#9C27B0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aiScoreText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  aiMessage: {
    fontSize: 14,
    color: "#4A148C",
    fontStyle: "italic",
    lineHeight: 20,
    marginBottom: 8,
  },
  aiActionBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  aiActionText: {
    fontSize: 13,
    color: "#0277BD",
    fontWeight: "600",
  },

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.common.primary,
    marginBottom: 15,
  },
  commentInput: {
    width: "100%",
    height: 100,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 20,
    fontSize: 14,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F2F2F2",
  },
  cancelBtnText: {
    color: "#666",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: Colors.common.primary,
  },
  submitBtnText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
