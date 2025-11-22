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
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native"; 

import { Colors, Spacing } from "@/src/constants/theme";
import { useAuth } from "@/src/providers/AuthProvider";

import { createPaymentIntent, fetchCourseByID } from "@/src/api/modules/courseApi";

import { Course } from "@/src/types/course";

export default function EnrollmentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); 

 
  const [course, setCourse] = useState<Course | null>(null);
  const [isFetching, setIsFetching] = useState(true); 
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseId = Array.isArray(id) ? id[0] : id;
        if (!courseId) return;

        const res = await fetchCourseByID(courseId);
        if (res.success) {
          setCourse(res.data);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        Alert.alert("Error", "Failed to load course details.");
        router.back();
      } finally {
        setIsFetching(false);
      }
    };

    loadCourse();
  }, [id]);

  useEffect(() => {
    if (!course || !user) return;

    if (user.role === "educator" && user.userId === course.creatorId) {
      Alert.alert("Invalid Action", "You are the creator of this course.", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }

    const isEnrolled = course.students?.some((s) => s.userId === user.userId);
    if (isEnrolled) {
      Alert.alert(
        "Already Enrolled",
        "You have already enrolled in this course.",
        [
          {
            text: "Go to My Learning",
            onPress: () => router.replace("/(tabs)/my-learning"),
          },
        ],
      );
    }
  }, [course, user, router]);

  if (isFetching) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.common.primary} />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Course not found.</Text>
      </SafeAreaView>
    );
  }

  const originalPrice = parseFloat(course.price) || 0;
  const discountVal = parseFloat(course.discount) || 0;
  const finalPrice = originalPrice - discountVal;

  const handleEnroll = async () => {
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

    try {
      setIsProcessing(true);

      const response = await createPaymentIntent(course.courseId);

      if (!response.success || !response.clientSecret) {
        Alert.alert("Error", "Could not initialize payment transaction.");
        setIsProcessing(false);
        return;
      }

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "E-Learning App",
        paymentIntentClientSecret: response.clientSecret,
        defaultBillingDetails: {
          name: user.fullName,
          email: user.email,
        },
        returnURL: "lmsmobileapp://stripe-redirect", 
      });

      if (initError) {
        Alert.alert("Error", initError.message);
        setIsProcessing(false);
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code !== "Canceled") {
          Alert.alert("Payment Failed", paymentError.message);
        }
      } else {
        Alert.alert(
          "Enrollment Successful!",
          `You have successfully enrolled in "${course.title}".`,
          [
            {
              text: "Start Learning",
              onPress: () => router.replace("/(tabs)/my-learning"),
            },
          ],
        );
      }
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.courseCard}>
          <Image
            source={{ uri: course.thumbnailUrl }}
            style={styles.thumbnail}
          />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {course.title}
            </Text>
            <Text style={styles.enrolledText}>
              Instructor: {course.creator?.fullName}
            </Text>
          </View>
        </View>

        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Original Price</Text>
            <Text style={styles.priceValue}>${originalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Discount</Text>
            <Text style={styles.priceValueDiscount}>
              -${discountVal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${finalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, isProcessing && styles.disabledButton]}
          onPress={handleEnroll}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={Colors.common.white} />
          ) : (
            <Text style={styles.confirmButtonText}>
              Pay ${finalPrice.toFixed(2)}
            </Text>
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
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.medium,
    paddingBottom: 30,
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
