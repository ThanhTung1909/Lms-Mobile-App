import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { dummyCourses } from "@/src/assets/assets";
import CourseCard from "@/src/components/specific/CourseCard";

const ITEM_HEIGHT = 280;

export default function CoursesScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  // Fake loading (2s)
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  const filteredCourses = dummyCourses;

  const filters = ["All", "Top Rated", "Popular"];

  const renderSkeleton = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <View key={i} style={styles.skeletonCard}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonTextLarge} />
        <View style={styles.skeletonTextSmall} />
      </View>
    ));

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchSection}>
        <Ionicons name="search-outline" size={20} color="#555" />
        <TextInput
          placeholder="Search courses..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterBtn,
              filter === item && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading Skeleton */}
      {loading ? (
        <View>{renderSkeleton()}</View>
      ) : (
        <Animated.FlatList
          data={filteredCourses}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          renderItem={({ item, index }) => {
            const scale = scrollY.interpolate({
              inputRange: [
                -1,
                0,
                ITEM_HEIGHT * index,
                ITEM_HEIGHT * (index + 2),
              ],
              outputRange: [1, 1, 1, 0.9],
              extrapolate: "clamp", 
            });
            const opacity = scrollY.interpolate({
              inputRange: [
                -1,
                0,
                ITEM_HEIGHT * index,
                ITEM_HEIGHT * (index + 1),
              ],
              outputRange: [1, 1, 1, 0],
              extrapolate: "clamp", 
            });

            return (
              <Animated.View
                style={{
                  transform: [{ scale }],
                  opacity,
                }}
              >
                <CourseCard item={item} />
              </Animated.View>
            );
          }}
        />
      )}

      {/* Load more */}
      {!loading && visibleCount < dummyCourses.length && (
        <TouchableOpacity
          style={styles.loadMoreBtn}
          onPress={() => setVisibleCount((prev) => prev + 5)}
        >
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
  },
  filtersRow: {
    flexDirection: "row",
    marginVertical: 14,
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
  },
  filterBtnActive: {
    backgroundColor: "#1e3a8a",
  },
  filterText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  loadMoreBtn: {
    alignSelf: "center",
    backgroundColor: "#1e40af",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // Skeleton styles
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  skeletonImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    marginBottom: 10,
  },
  skeletonTextLarge: {
    width: "80%",
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonTextSmall: {
    width: "60%",
    height: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
});
