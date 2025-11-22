import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";

// Imports
import { useAuth } from "@/src/providers/AuthProvider";
import { Colors, Spacing } from "@/src/constants/theme";
import CoursePreview from "@/src/components/specific/CoursePreview";

import { Course } from "@/src/types/course";
import { fetchCourseByID } from "@/src/api/modules/courseApi";

const { width } = Dimensions.get("window");

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const courseId = Array.isArray(id) ? id[0] : id;
        if (!courseId) return;

        const response = await fetchCourseByID(courseId);
        if (response.success) {
          setCourse(response.data);

          if (response.data.chapters?.[0]?.lectures?.[0]?.videoUrl) {
            setPlayingVideoUrl(response.data.chapters[0].lectures[0].videoUrl);
          }
        }
      } catch (error) {
        console.error("Error loading course detail:", error);
        Alert.alert("Error", "Could not load course details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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
        <Text style={{ color: Colors.light.text }}>Course not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: Colors.common.primary }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const originalPrice = parseFloat(course.price) || 0;
  const discountVal = parseFloat(course.discount) || 0;
  const finalPrice = (originalPrice - discountVal).toFixed(2);

  const isEnrolled = course.students?.some((s) => s.userId === user?.userId);
  const isCreator =
    user?.role === "educator" && user.userId === course.creatorId;

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {["Overview", "Lessons", "Reviews"].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab.toLowerCase())}
          style={[
            styles.tabItem,
            activeTab === tab.toLowerCase() && styles.activeTabItem,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.toLowerCase() && styles.activeTabText,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <View style={styles.contentSection}>
            <RenderHtml
              contentWidth={width - Spacing.medium * 2}
              source={{
                html: course.description || "<p>No description available.</p>",
              }}
              tagsStyles={{
                h2: {
                  fontSize: 18,
                  fontWeight: "700",
                  color: Colors.light.text,
                  marginBottom: Spacing.small,
                },
                p: {
                  fontSize: 15,
                  color: Colors.light.textSecondary,
                  lineHeight: 22,
                },
                ul: { marginLeft: 10 },
                li: {
                  fontSize: 15,
                  color: Colors.light.textSecondary,
                  marginBottom: 4,
                },
              }}
            />
          </View>
        );
      case "lessons":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            {course.chapters && course.chapters.length > 0 ? (
              course.chapters.map((chapter) => (
                <View key={chapter.chapterId} style={styles.chapterContainer}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  {chapter.lectures.map((lecture, index) => {
                    const isFree = index === 0;
                    const canWatch = isFree || isEnrolled || isCreator;
                    const isPlaying = playingVideoUrl === lecture.videoUrl;

                    return (
                      <TouchableOpacity
                        key={lecture.lectureId}
                        style={[
                          styles.lectureRow,
                          isPlaying && {
                            backgroundColor: "#f0f9ff",
                            borderRadius: 8,
                          },
                        ]}
                        onPress={() => {
                          if (canWatch) {
                            setPlayingVideoUrl(lecture.videoUrl);
                          } else {
                            Alert.alert(
                              "Locked Content",
                              "Please enroll in this course to watch the full content.",
                            );
                          }
                        }}
                      >
                        <Ionicons
                          name={
                            canWatch
                              ? isPlaying
                                ? "pause-circle"
                                : "play-circle"
                              : "lock-closed"
                          }
                          size={24}
                          color={
                            canWatch
                              ? Colors.common.primary
                              : Colors.light.textSecondary
                          }
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.lectureTitle,
                              isPlaying && {
                                color: Colors.common.primary,
                                fontWeight: "700",
                              },
                            ]}
                          >
                            {lecture.title}
                          </Text>
                          <Text style={styles.lectureDuration}>
                            {lecture.duration || 0} mins{" "}
                            {isFree && !isEnrolled && (
                              <Text
                                style={{
                                  color: Colors.common.success,
                                  fontWeight: "600",
                                }}
                              >
                                • Free Preview
                              </Text>
                            )}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))
            ) : (
              <Text style={{ color: Colors.light.textSecondary }}>
                No lessons available.
              </Text>
            )}
          </View>
        );
      case "reviews":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Student Feedback</Text>
            {course.ratings && course.ratings.length > 0 ? (
              course.ratings.map((r) => {
                const studentName = r.user?.fullName || "Anonymous";
                const studentAvatar = r.user?.avatarUrl;

                return (
                  <View key={r.ratingId} style={styles.reviewBox}>
                    {studentAvatar ? (
                      <Image
                        source={{ uri: studentAvatar }}
                        style={styles.reviewAvatar}
                      />
                    ) : (
                      <View
                        style={[styles.reviewAvatar, styles.avatarFallback]}
                      >
                        <Ionicons
                          name="person"
                          size={24}
                          color={Colors.light.textSecondary}
                        />
                      </View>
                    )}

                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.reviewText}>{studentName}</Text>
                        <Text style={styles.reviewDate}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.reviewRating}>⭐ {r.rating} / 5</Text>
                      {r.comment && (
                        <Text style={styles.reviewComment}>{r.comment}</Text>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={{ color: Colors.light.textSecondary }}>
                No reviews yet.
              </Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const renderEnrollBar = () => {
    if (isCreator) {
      return (
        <TouchableOpacity
          style={styles.enrollBtn}
          onPress={() => Alert.alert("Navigate to Edit Screen")}
        >
          <Text style={styles.enrollText}>Edit Course</Text>
        </TouchableOpacity>
      );
    }

    if (isEnrolled) {
      return (
        <TouchableOpacity
          style={styles.enrollBtn}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/my-learning/lesson/[id]",
              params: { id: course.courseId },
            })
          }
        >
          <Text style={styles.enrollText}>Go to Course</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.enrollBtn}
        onPress={() => {
          if (user) {
            router.push({
              pathname: "/(tabs)/courses/enroll/[id]",
              params: { id: course.courseId },
            });
          } else {
            router.replace("/(auth)/login");
          }
        }}
      >
        <Text style={styles.enrollText}>Enroll Now</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <CoursePreview
            course={course}
            customVideoUrl={playingVideoUrl}
          />

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.common.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{course.title}</Text>
          {course.creator && (
            <View style={styles.educatorRow}>
              <Image
                source={{
                  uri: course.creator.avatarUrl,
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.educatorName}>
                  {course.creator.fullName}
                </Text>
                <Text style={styles.educatorEmail}>{course.creator.email}</Text>
              </View>
            </View>
          )}
        </View>

        {renderTabs()}
        {renderContent()}
      </ScrollView>

      <View style={styles.enrollBar}>
        <View>
          <Text style={styles.price}>${finalPrice}</Text>
          {discountVal > 0 && (
            <Text style={styles.oldPrice}>${originalPrice.toFixed(2)}</Text>
          )}
        </View>
        {renderEnrollBar()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },

  header: { height: 230, backgroundColor: "#1e293b" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: Spacing.medium,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },

  infoContainer: {
    padding: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: Spacing.small,
  },
  educatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.medium,
    gap: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#eee",
  },
  educatorName: { fontWeight: "600", fontSize: 16, color: Colors.light.text },
  educatorEmail: { fontSize: 14, color: Colors.light.textSecondary },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
    backgroundColor: Colors.light.background,
  },
  tabItem: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
    flex: 1,
  },
  activeTabItem: {
    borderBottomColor: Colors.common.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.light.textSecondary,
  },
  activeTabText: { color: Colors.common.primary, fontWeight: "700" },

  contentSection: { padding: Spacing.medium },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.medium,
  },

  chapterContainer: { marginBottom: Spacing.large },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: Spacing.medium,
    paddingBottom: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  lectureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.medium,
    paddingVertical: Spacing.small,
    paddingHorizontal: 4,
  },
  lectureTitle: { fontSize: 15, color: Colors.light.text, marginBottom: 4 },
  lectureDuration: { fontSize: 13, color: Colors.light.textSecondary },

  reviewBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.medium,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
  reviewText: { fontSize: 15, color: Colors.light.text, fontWeight: "600" },
  reviewDate: { fontSize: 12, color: Colors.light.textSecondary },
  reviewRating: {
    fontSize: 14,
    color: "#F1C40F",
    marginTop: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  avatarFallback: {
    backgroundColor: Colors.light.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },

  enrollBar: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    backgroundColor: Colors.light.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderColor,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  price: { fontSize: 22, fontWeight: "bold", color: Colors.common.primary },
  oldPrice: {
    color: Colors.light.textSecondary,
    textDecorationLine: "line-through",
    fontSize: 14,
  },
  enrollBtn: {
    backgroundColor: Colors.common.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  enrollText: { color: Colors.common.white, fontWeight: "bold", fontSize: 16 },
});
