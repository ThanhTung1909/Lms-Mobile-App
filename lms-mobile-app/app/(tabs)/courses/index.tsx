import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Import API và Type

import { Course } from "@/src/types/course";
import CourseCard from "@/src/components/specific/CourseCard";
import { fetchAllCourses } from "@/src/api/modules/courseApi";

const ITEM_HEIGHT = 280;

export default function CoursesScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);

  const [courses, setCourses] = useState<Course[]>([]); 
  const [filteredData, setFilteredData] = useState<Course[]>([]); 
  const [loading, setLoading] = useState(true);

  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await fetchAllCourses();
        if (response.success) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    let result = [...courses];

    if (search.trim()) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filter === "Top Rated") {
      result = result.filter((c) => {
        const ratings = c.ratings || [];
        if (ratings.length === 0) return false;
        const avg =
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        return avg >= 4.0;
      });
      result.sort((a, b) => {
        const avgA =
          (a.ratings?.reduce((s, r) => s + r.rating, 0) || 0) /
          (a.ratings?.length || 1);
        const avgB =
          (b.ratings?.reduce((s, r) => s + r.rating, 0) || 0) /
          (b.ratings?.length || 1);
        return avgB - avgA;
      });
    } else if (filter === "Popular") {
      result.sort(
        (a, b) => (b.ratings?.length || 0) - (a.ratings?.length || 0),
      );
    }

    setFilteredData(result);
    setVisibleCount(10); 
  }, [courses, search, filter]);

  const filters = ["All", "Top Rated", "Popular"];

  const visibleCourses = filteredData.slice(0, visibleCount);

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
          placeholderTextColor="#999"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
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

      {/* Content */}
      {loading ? (
        <View style={{ marginTop: 10 }}>{renderSkeleton()}</View>
      ) : (
        <Animated.FlatList
          data={visibleCourses}

          keyExtractor={(item) => item.courseId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}

          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No courses found</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const scale = scrollY.interpolate({
              inputRange: [
                -1,
                0,
                ITEM_HEIGHT * index,
                ITEM_HEIGHT * (index + 2),
              ],
              outputRange: [1, 1, 1, 0.95], 
              extrapolate: "clamp",
            });
            const opacity = scrollY.interpolate({
              inputRange: [
                -1,
                0,
                ITEM_HEIGHT * index,
                ITEM_HEIGHT * (index + 1),
              ],
              outputRange: [1, 1, 1, 0.5], 
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

      {!loading && visibleCount < filteredData.length && (
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
    paddingVertical: 10, 
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
  },
  filterBtnActive: {
    backgroundColor: "#2D6CE5", 
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
    backgroundColor: "#2D6CE5", 
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginVertical: 20,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#888",
    marginTop: 10,
    fontSize: 16,
  },

  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  skeletonImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
  skeletonTextLarge: {
    width: "80%",
    height: 20,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonTextSmall: {
    width: "50%",
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
});
