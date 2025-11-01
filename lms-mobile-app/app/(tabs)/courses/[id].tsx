import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dummyCourses, dummyEducatorData, allUsers } from "@/src/assets/assets";
import { useAuth } from "@/src/providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import { useRef, useState } from "react";
import { Course } from "@/src/types/course";
import { Colors, Spacing } from "@/src/constants/theme";
import CoursePreview from "@/src/components/specific/CoursePreview";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 230;

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const { user } = useAuth();

  const scrollY = useRef(new Animated.Value(0)).current;

  const course: Course | undefined = dummyCourses.find(
    (item) => item._id === id,
  );

  const educator = allUsers.find((u) => u._id === course?.educator);

  if (!course) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: Colors.light.text }}>Course not found</Text>
      </SafeAreaView>
    );
  }

  const discountedPrice = (
    course.coursePrice -
    (course.coursePrice * (course.discount ?? 0)) / 100
  ).toFixed(2);

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
              source={{ html: course.courseDescription }}
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
              }}
            />
          </View>
        );
      case "lessons":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            {course.courseContent.map((chapter) => (
              <View key={chapter.chapterId} style={styles.chapterContainer}>
                <Text style={styles.chapterTitle}>{chapter.chapterTitle}</Text>
                {chapter.chapterContent.map((lecture) => (
                  <View key={lecture.lectureId} style={styles.lectureRow}>
                    <Ionicons
                      name="play-circle-outline"
                      size={24}
                      color={Colors.common.primary}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.lectureTitle}>
                        {lecture.lectureTitle}
                      </Text>
                      <Text style={styles.lectureDuration}>
                        {lecture.lectureDuration} mins{" "}
                        {lecture.isPreviewFree && (
                          <Text style={{ color: Colors.common.success }}>
                            • Free Preview
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      case "reviews":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Student Feedback</Text>
            {course.courseRatings?.length ? (
              course.courseRatings.map((r, i) => {
                const studentInfo = allUsers.find((u) => u._id === r.userId);
                const studentName = studentInfo
                  ? studentInfo.name
                  : "Anonymous Student";
                const studentImageUrl = studentInfo
                  ? studentInfo.imageUrl
                  : null;

                return (
                  <View key={r._id || i} style={styles.reviewBox}>
                    {studentImageUrl ? (
                      <Image
                        source={{ uri: studentImageUrl }}
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

                    <View>
                      <Text style={styles.reviewText}>{studentName}</Text>
                      <Text style={styles.reviewRating}>⭐ {r.rating} / 5</Text>
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
   
    if (user?.role === 'educator' && user._id === course.educator) {
      return (
        <TouchableOpacity style={styles.enrollBtn} onPress={() => Alert.alert("Navigate to Edit Screen")}>
          <Text style={styles.enrollText}>Edit Course</Text>
        </TouchableOpacity>
      );
    }
    const isEnrolled = course.enrolledStudents?.includes(user?._id || '');
    
    if (user?.role === 'student' && isEnrolled) {
      return (
        <TouchableOpacity 
            style={styles.enrollBtn} 
            onPress={() => router.push({
                pathname: "/(tabs)/my-learning/lesson/[id]",
                params: { id: course._id }
            })}
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
                params: { id: course._id }
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
          <CoursePreview course={course} />
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.common.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{course.courseTitle}</Text>
          {educator && (
            <View style={styles.educatorRow}>
              <Image
                source={{ uri: educator.imageUrl }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.educatorName}>{educator.name}</Text>
                <Text style={styles.educatorEmail}>
                  {educator.email}
                </Text>
              </View>
            </View>
          )}
        </View>

        {renderTabs()}
        {renderContent()}
      </ScrollView>

      <View style={styles.enrollBar}>
        <View>
          <Text style={styles.price}>${discountedPrice}</Text>
          <Text style={styles.oldPrice}>${course.coursePrice}</Text>
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
    padding: Spacing.small,
    zIndex: 10,
  },

  infoContainer: {
    padding: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
  },
  title: {
    fontSize: 24,
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
  avatar: { width: 45, height: 45, borderRadius: 22.5 },
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
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.medium,
  },

  chapterContainer: { marginBottom: Spacing.large },
  chapterTitle: {
    fontSize: 17,
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
  },
  lectureTitle: { fontSize: 15, color: Colors.light.text, marginBottom: 4 },
  lectureDuration: { fontSize: 13, color: Colors.light.textSecondary },

  reviewBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.medium,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
  reviewText: { fontSize: 15, color: Colors.light.text, fontWeight: "600" },
  reviewRating: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
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
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  enrollText: { color: Colors.common.white, fontWeight: "bold", fontSize: 16 },
});
