import React from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

import SearchBar from '@/components/common/SearchBar';
import CourseRowCard from '@/components/common/CourseRowCard';
import { Course } from '@/types/course';

const coursesData: Course[] = [
  { id: '1', title: 'UX Foundation', author: 'Sara Weise', rating: 4.5, students: 1233, lessons: 13, image: '', price: 51, tag: 'Best-seller' },
  { id: '2', title: 'Design Basics', author: 'Kelly Hamilton', rating: 4.5, students: 1233, lessons: 12, image: '', price: 89 },
  { id: '3', title: 'Digital Sketching', author: 'Ramono Wulfschner', rating: 4.5, students: 1233, lessons: 8, image: '', price: 49 },
  { id: '4', title: 'Digital Portrait', author: 'Ramono Wulfschner', rating: 4.5, students: 657, lessons: 11, image: '', price: 67 },
  { id: '5', title: 'Web Design', author: 'Ryan Meyers', rating: 4.5, students: 1233, lessons: 12, image: '', price: 29 },
];

export default function CourseListingScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* 1. Header: Search + Filter */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchBar placeholder="Design" />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: tintColor }]}>
          <Ionicons name="filter" size={20} color="#FFFFFF" />
          <ThemedText style={styles.filterText}>Filter</ThemedText>
        </TouchableOpacity>
      </View>

      {/* 2. Results Count */}
      <View style={styles.resultsContainer}>
        <ThemedText style={styles.resultsText}>120 Results</ThemedText>
      </View>

      {/* 3. List */}
      <FlatList
        data={coursesData}
        renderItem={({ item }) => <CourseRowCard item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Đệm cho status bar
    paddingBottom: 16,
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});