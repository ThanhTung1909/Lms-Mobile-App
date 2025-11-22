import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { dummyTestimonial } from "@/src/assets/assets";
import CourseCard from "@/src/components/specific/CourseCard";
import { fetchAllCourses } from "@/src/api/modules/courseApi";
import { Course } from "@/src/types/course";

import AccentureLogo from "@/src/assets/accenture_logo.svg";
import AdobeLogo from "@/src/assets/adobe_logo.svg";
import MicrosoftLogo from "@/src/assets/microsoft_logo.svg";
import PaypalLogo from "@/src/assets/paypal_logo.svg";
import WalmartLogo from "@/src/assets/walmart_logo.svg";


export default function HomeScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchAllCourses();
        if (res.success) {
          setCourses(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const topRatedCourses = useMemo(() => {
    return [...courses]
      .map((course) => {
        const ratings = course.ratings || [];
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
            : 0;
        return { ...course, avgRating };
      })
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);
  }, [courses]);

  if (loading) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2D6CE5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={topRatedCourses}
        keyExtractor={(item) => item.courseId} 
        renderItem={({ item }) => <CourseCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Hero section */}
            <View style={styles.hero}>
              <Text style={styles.heroSmallTitle}>Upgrade Your Skills</Text>
              <Text style={styles.heroTitle}>
                Learn from the{" "}
                <Text style={styles.highlight}>Best Instructors{"\n"}</Text>
                Around the World
              </Text>
              <Text style={styles.heroSubtitle}>
                Explore thousands of expert-led courses to achieve your personal
                and professional goals.
              </Text>

              {/* Search box */}
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color="#777" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="What do you want to learn?"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.searchBtn}>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Partner logos */}
              <View style={styles.partnerContainer}>
                <Text style={styles.partnerTitle}>
                  Trusted by leading companies
                </Text>
                <View style={styles.partnerRow}>
                  {[
                    AccentureLogo,
                    AdobeLogo,
                    MicrosoftLogo,
                    PaypalLogo,
                    WalmartLogo,
                  ].map((Logo, i) => (
                    <View key={i} style={styles.partnerLogoContainer}>
                      <Logo width={70} height={28} />
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Section title */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Learn from the best</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/courses")}>
                <Text style={styles.seeAllText}>See All →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>
              Discover our top-rated courses across various categories.
            </Text>
          </>
        }
        ListFooterComponent={
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Testimonials</Text>
              {dummyTestimonial.map((t, index) => (
                <View key={index} style={styles.testimonialCard}>
                  <View style={styles.testimonialHeader}>
                    <Image source={t.image} style={styles.avatar} />
                    <View>
                      <Text style={styles.testimonialName}>{t.name}</Text>
                      <Text style={styles.testimonialRole}>{t.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.stars}>★★★★★</Text>
                  <Text style={styles.feedback}>{t.feedback}</Text>
                  <TouchableOpacity>
                    <Text style={styles.readMore}>Read more</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.ctaSection}>
              <Text style={styles.ctaTitle}>
                Learn anything, anytime, anywhere
              </Text>
              <Text style={styles.ctaSubtitle}>
                Join thousands of learners and access expert-led courses from
                your phone.
              </Text>
              <View style={styles.ctaButtons}>
                <TouchableOpacity style={styles.getStartedBtn}>
                  <Text
                    style={styles.getStartedText}
                    onPress={() => router.push("/courses")}
                  >
                    Get Started
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 16,
  },
  heroSmallTitle: {
    color: "#2D6CE5",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#222",
    lineHeight: 34,
  },
  highlight: {
    color: "#2D6CE5",
  },
  heroSubtitle: {
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F8",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 18,
    width: "100%",
    height: 48,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#333",
    fontSize: 15,
  },
  searchBtn: {
    backgroundColor: "#2D6CE5",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  partnerContainer: {
    marginTop: 28,
    alignItems: "center",
  },
  partnerTitle: {
    fontSize: 13,
    color: "#777",
    marginBottom: 10,
    textAlign: "center",
  },
  partnerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 18,
  },
  partnerLogoContainer: {
    paddingHorizontal: 8,
    opacity: 0.9,
  },
  section: {
    marginTop: 36,
  },
  sectionHeader: {
    marginTop: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  seeAllText: {
    color: "#2D6CE5",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionSubtitle: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  testimonialCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  testimonialName: { fontWeight: "600", color: "#222" },
  testimonialRole: { fontSize: 13, color: "#666" },
  stars: { color: "#f1b500", marginVertical: 4 },
  feedback: { color: "#333", fontSize: 14, marginBottom: 6, lineHeight: 20 },
  readMore: { color: "#2D6CE5", fontWeight: "500", fontSize: 13 },
  ctaSection: { alignItems: "center", marginTop: 40 },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  ctaSubtitle: {
    color: "#666",
    textAlign: "center",
    fontSize: 14,
    marginVertical: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  ctaButtons: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  getStartedBtn: {
    backgroundColor: "#2D6CE5",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginRight: 10,
  },
  getStartedText: { color: "#fff", fontWeight: "600" },
});
