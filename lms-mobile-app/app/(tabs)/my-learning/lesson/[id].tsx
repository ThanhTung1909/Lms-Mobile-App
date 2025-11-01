
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import YoutubeIframe from "react-native-youtube-iframe";

import { dummyCourses } from "@/src/assets/assets";
import { Colors, Spacing } from "@/src/constants/theme";
import { Lecture } from "@/src/types/course";

const getYoutubeVideoId = (url: string) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const course = dummyCourses.find((c) => c._id === id);

  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(
    course?.courseContent[0]?.chapterContent[0] || null,
  );

  if (!course) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Course not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {selectedLecture && getYoutubeVideoId(selectedLecture.lectureUrl) ? (
          <YoutubeIframe
            height={230}
            play={true}
            videoId={getYoutubeVideoId(selectedLecture.lectureUrl)!}
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoPlaceholderText}>
              Select a lecture to play
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.courseTitle}>{course.courseTitle}</Text>
        {selectedLecture && (
          <Text style={styles.lectureTitle}>
            {selectedLecture.lectureTitle}
          </Text>
        )}
        <View style={styles.divider} />
        <Text style={styles.playlistTitle}>Course Content</Text>
        {course.courseContent.map((chapter) => (
          <View key={chapter.chapterId} style={styles.chapterContainer}>
            <Text style={styles.chapterTitle}>{chapter.chapterTitle}</Text>
            {chapter.chapterContent.map((lecture) => (
              <TouchableOpacity
                key={lecture.lectureId}
                style={[
                  styles.lectureItem,
                  selectedLecture?.lectureId === lecture.lectureId &&
                    styles.lectureItemActive,
                ]}
                onPress={() => {
                  if (lecture.isPreviewFree) {
                    setSelectedLecture(lecture);
                  } else {
                    Alert.alert(
                      "Premium Content",
                      "You need to purchase this course to view this lecture.",
                    );
                  }
                }}
              >
                <Ionicons
                  name={
                    selectedLecture?.lectureId === lecture.lectureId
                      ? "play-circle"
                      : "play-circle-outline"
                  }
                  size={24}
                  color={
                    selectedLecture?.lectureId === lecture.lectureId
                      ? Colors.common.white
                      : Colors.common.primary
                  }
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.itemTitle,
                      selectedLecture?.lectureId === lecture.lectureId && {
                        color: Colors.common.white,
                      },
                    ]}
                  >
                    {lecture.lectureTitle}
                  </Text>
                  <Text
                    style={[
                      styles.itemDuration,
                      selectedLecture?.lectureId === lecture.lectureId && {
                        color: "#eee",
                      },
                    ]}
                  >
                    {lecture.lectureDuration} mins{" "}
                    {lecture.isPreviewFree && "• Free Preview"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) router.back();
        }}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  videoPlaceholder: {
    height: 230,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholderText: { color: "#fff" },
  content: { padding: Spacing.medium },
  courseTitle: { fontSize: 22, fontWeight: "bold", color: Colors.light.text },
  lectureTitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.borderColor,
    marginBottom: Spacing.medium,
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.small,
  },
  chapterContainer: { marginBottom: Spacing.medium },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: Spacing.small,
    marginTop: Spacing.small,
  },
  lectureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.medium,
    padding: Spacing.medium,
    borderRadius: 8,
    backgroundColor: Colors.light.lightGray,
    marginBottom: Spacing.small,
  },
  lectureItemActive: { backgroundColor: Colors.common.primary },
  itemTitle: { fontSize: 15, fontWeight: "500", color: Colors.light.text },
  itemDuration: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
});
