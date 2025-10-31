import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dummyCourses } from "@/src/assets/assets";
import { Colors, Spacing } from "@/src/constants/theme";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/providers/AuthProvider";

export default function EnrollmentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const course = dummyCourses.find((c) => c._id === id);

  useEffect(() => {
    if (!course || !user) return;
    if (user.role === "educator" && user._id === course.educator) {
      Alert.alert("Invalid Action", "You are the educator of this course.", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }
    const isEnrolled = course.enrolledStudents?.includes(user._id);
    if (isEnrolled) {
      Alert.alert(
        "Already Enrolled",
        "You have already enrolled in this course.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    }
  }, [course, user, router]);

  if (!course) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Course not found.</Text>
      </SafeAreaView>
    );
  }

  const originalPrice = course.coursePrice;
  const discountPercentage = course.discount ?? 0;
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const finalPrice = originalPrice - discountAmount;

  const handleEnroll = () => {
    if (!user) {
      Alert.alert(
        "Please Login",
        "You need to be logged in to enroll in a course.",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/(auth)/login"),
          },
          { text: "Cancel", style: "cancel" },
        ],
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Enrollment Successful!",
        `You have successfully enrolled in "${course.courseTitle}".`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/my-learning"),
          },
        ],
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Enrollment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tóm tắt khóa học */}
        <View style={styles.courseCard}>
          <Image
            source={{ uri: course.courseThumbnail }}
            style={styles.thumbnail}
          />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {course.courseTitle}
            </Text>
            <Text style={styles.enrolledText}>
              You are about to enroll in this course.
            </Text>
          </View>
        </View>

        {/* Chi tiết thanh toán */}
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Original Price</Text>
            <Text style={styles.priceValue}>${originalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Discount ({discountPercentage}%)
            </Text>
            <Text style={styles.priceValueDiscount}>
              -${discountAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${finalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút xác nhận dính ở cuối */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, isLoading && styles.disabledButton]}
          onPress={handleEnroll}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.common.white} />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Purchase</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: {
    padding: Spacing.medium,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: Colors.light.text },
  courseCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: Spacing.medium,
    alignItems: "center",
    gap: Spacing.medium,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
  },
  thumbnail: { width: 64, height: 64, borderRadius: 8 },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 17, fontWeight: "600", color: Colors.light.text },
  enrolledText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: Spacing.large,
    marginBottom: Spacing.medium,
  },
  summaryCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
    paddingHorizontal: Spacing.medium,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
  },
  priceLabel: { fontSize: 16, color: Colors.light.textSecondary },
  priceValue: { fontSize: 16, color: Colors.light.text, fontWeight: "500" },
  priceValueDiscount: {
    fontSize: 16,
    color: Colors.common.success,
    fontWeight: "600",
  },
  totalRow: {
    borderBottomWidth: 0,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: Colors.light.text },
  totalValue: { fontSize: 22, fontWeight: "bold", color: "#0052cc" },
  divider: {},
  footer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    padding: Spacing.medium,
    paddingBottom: Spacing.large,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderColor,
  },
  confirmButton: {
    backgroundColor: Colors.common.primary,
    padding: Spacing.medium,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#a5b4fc" },
  confirmButtonText: {
    color: Colors.common.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
