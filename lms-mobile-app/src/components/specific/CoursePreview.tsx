import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import YoutubeIframe from "react-native-youtube-iframe";
import { Course } from "@/src/types/course";
import { useCallback, useState } from "react";

const { width } = Dimensions.get("window");

interface CoursePreviewProps {
  course: Course;
}

export default function CoursePreview({ course }: CoursePreviewProps) {
  const router = useRouter();
  const [videoError, setVideoError] = useState(false);


  const getYouTubeVideoId = (url?: string) => {
    const match = url?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
    return match ? match[1] : null;
  };

  const firstLectureUrl =
    course.courseContent?.[0]?.chapterContent?.[0]?.lectureUrl;
  const firstVideoId = getYouTubeVideoId(firstLectureUrl);

  const handleError = useCallback(() => {
    setVideoError(true);
  }, []);
  return (
    <View style={styles.header}>
      {firstVideoId && !videoError ? (
        <YoutubeIframe
          height={230}
          width={width}
          videoId={firstVideoId}
          play={false}
          onError={handleError}
        />
      ) : (
        <Image
          source={{ uri: course.courseThumbnail }}
          style={styles.thumbnail}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "relative",
    width: "100%",
    height: 230,
    backgroundColor: "#000",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  backBtn: {
    position: "absolute",
    top: 45,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 6,
  },
});
