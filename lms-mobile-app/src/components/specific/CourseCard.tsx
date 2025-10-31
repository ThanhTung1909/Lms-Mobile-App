import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Course } from "@/src/types/course";
import { allUsers } from "@/src/assets/assets";

type CourseCardProps = {
  item: Course;
};

const CourseCard: React.FC<CourseCardProps> = ({ item }) => {
  const router = useRouter();
  const educator = allUsers.find(u => u._id === item.educator);
  const instructorName = educator ? educator.name : "Unknown Instructor";

  const avgRating =
    item.courseRatings && item.courseRatings.length > 0
      ? (
          item.courseRatings.reduce((sum, r) => sum + r.rating, 0) /
          item.courseRatings.length
        ).toFixed(1)
      : "0.0";

  const studentCount = item.enrolledStudents ? item.enrolledStudents.length : 0;

  const finalPrice = item.discount
    ? item.coursePrice * (1 - item.discount / 100)
    : item.coursePrice;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: "/(stack)/courses/[id]",
        params: { id: item._id }
      })}
    >
      <Image
        source={{
          uri:
            item.courseThumbnail 
        }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {item.courseTitle}
        </Text>
        <Text style={styles.instructor}>{instructorName}</Text>

        <View style={styles.row}>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingValue}>{avgRating}</Text>
            <View style={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={
                    i < Math.round(Number(avgRating)) ? "star" : "star-outline"
                  }
                  size={14}
                  color="#FF4D00"
                />
              ))}
            </View>
            <Text style={styles.ratingCount}>({studentCount})</Text>
          </View>

          <Text style={styles.price}>${finalPrice.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "visible",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  instructor: {
    fontSize: 13,
    color: "#777",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 14,
    color: "#333",
    marginRight: 4,
  },
  stars: {
    flexDirection: "row",
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: "#777",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
});
