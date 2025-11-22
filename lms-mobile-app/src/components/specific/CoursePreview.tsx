import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import YoutubeIframe from "react-native-youtube-iframe";
import { Course } from "@/src/types/course";

const { width } = Dimensions.get("window");

interface CoursePreviewProps {
  course: Course;
  customVideoUrl?: string | null;
}

export default function CoursePreview({
  course,
  customVideoUrl,
}: CoursePreviewProps) {
  const [videoError, setVideoError] = useState(false);

  const getYouTubeVideoId = (url?: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const defaultVideoUrl = course.chapters?.[0]?.lectures?.[0]?.videoUrl;
  const videoUrlToPlay = customVideoUrl || defaultVideoUrl;

  const videoId = getYouTubeVideoId(videoUrlToPlay);

  useEffect(() => {
    setVideoError(false);
  }, [videoId]);

  const handleError = useCallback(() => {
    setVideoError(true);
  }, []);

  const shouldAutoPlay = !!customVideoUrl;

  return (
    <View style={styles.header}>
      {videoId && !videoError ? (
        <YoutubeIframe
          height={230}
          width={width}
          videoId={videoId}
          play={shouldAutoPlay}
          onError={handleError}
          webViewProps={{
            allowsFullscreenVideo: true,
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
          }}
        />
      ) : (
        <Image
          source={{ uri: course.thumbnailUrl }}
          style={styles.thumbnail}
          contentFit="cover"
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
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
});
