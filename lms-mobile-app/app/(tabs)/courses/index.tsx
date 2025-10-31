// Vị trí: app/(tabs)/courses/index.tsx

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Các component chung
import SearchBar from '@/components/common/SearchBar';
import CourseRowCard from '@/components/common/CourseRowCard';
import CourseList from '@/components/common/CourseList'; // Tái sử dụng từ Home

// Các component mới cho màn hình này
import HotTopics from '@/components/specific/courses/HotTopics';
import CategoryRows from '@/components/specific/courses/CategoryRows';

// Types
import { Course } from '@/types/course';

// =================================
// DỮ LIỆU MẪU
// =================================
// Dữ liệu cho "Kết quả tìm kiếm"
const searchResultsData: Course[] = [
  { id: '1', title: 'UX Foundation', author: 'Sara Weise', rating: 4.5, students: 1233, lessons: 13, image: 'https://i.imgur.com/E9gxL3i.png', price: 51, tag: 'Best-seller' },
  { id: '2', title: 'Design Basics', author: 'Kelly Hamilton', rating: 4.5, students: 1233, lessons: 12, image: 'https://i.imgur.com/x0iP1Cj.png', price: 89 },
  // ... thêm dữ liệu khác
];
// Dữ liệu cho "Recommended" (khi chưa tìm kiếm)
const recommendedData: Course[] = [
  { id: '3', title: 'Website Design', author: 'Ramono Wulfschner', rating: 4.5, students: 1233, lessons: 9, image: 'https://i.imgur.com/q1wKdeJ.png', price: 590, tag: 'Best-seller' },
  { id: '4', title: 'UX Research For...', author: 'Olivia Wang', rating: 4.5, students: 1782, lessons: 12, image: 'https://i.imgur.com/ybeQp3I.png', price: 290, tag: '20% OFF' },
];
// =================================

// Component con cho trạng thái Mặc định (Chưa tìm kiếm)
const DefaultSearchContent = () => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <HotTopics />
    <CategoryRows />
    <CourseList
      title="Recommended for you"
      data={recommendedData}
      onViewMore={() => router.push('/(tabs)/courses')}
    />
    <View style={{ height: 40 }} />
  </ScrollView>
);

// Component con cho trạng thái Kết quả (Đã tìm kiếm)
const SearchResultsContent = () => (
  <>
    <View style={styles.resultsContainer}>
      <ThemedText style={styles.resultsText}>120 Results</ThemedText>
    </View>
    <FlatList
      data={searchResultsData}
      renderItem={({ item }) => <CourseRowCard item={item} />}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  </>
);


export default function CourseListingScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  // State để quản lý việc tìm kiếm
  const [searchText, setSearchText] = useState('');

  // Quyết định hiển thị nội dung nào
  const hasResults = searchText.length > 0;

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* 1. Header: Search + Filter (Luôn hiển thị) */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search course"
          // Cập nhật state khi gõ
          // value={searchText} 
          // onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: tintColor }]}>
          <Ionicons name="filter" size={20} color="#FFFFFF" />
          <ThemedText style={styles.filterText}>Filter</ThemedText>
        </TouchableOpacity>
      </View>

      {/* 2. Nội dung thay đổi (Mặc định hoặc Kết quả) */}
      {hasResults ? <SearchResultsContent /> : <DefaultSearchContent />}

    </ThemedView>
  );
}

// Styles (Kết hợp từ cả 2 màn hình)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE', // Nên dùng màu border từ theme
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
  // Styles cho phần kết quả
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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