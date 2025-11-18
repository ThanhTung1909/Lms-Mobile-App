import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

import OverviewTab from '@/components/specific/courses/course-details/OverviewTab';
import LessonsTab from '@/components/specific/courses/course-details/LessonsTab';
import ReviewsTab from '@/components/specific/courses/course-details/ReviewsTab';

import { Course, CourseBenefit } from '@/types/course';

// ============================
// MOCK DATA CHI TIẾT (Giả lập)
// ============================
const mockBenefits: CourseBenefit[] = [
  { id: '1', text: '14 hours on-demand video', icon: 'videocam-outline' },
  { id: '2', text: 'Native teacher', icon: 'globe-outline' },
  { id: '3', text: '100% free document', icon: 'document-text-outline' },
  { id: '4', text: 'Full lifetime access', icon: 'time-outline' },
  { id: '5', text: 'Certificate of complete', icon: 'ribbon-outline' },
  { id: '6', text: '24/7 support', icon: 'checkmark-circle-outline' },
];

const courseDetail: Course = {
  id: '1',
  title: 'UX Foundation: Introduction to User Experience Design',
  author: 'Sara Weise',
  authorAvatar: '',
  authorRole: 'UI/UX Designer',
  rating: 4.5,
  students: 1233,
  lessons: 12,
  image: '',
  price: 59,
  originalPrice: 73.75,
  description: 'Convallis in semper laoreet nibh leo. Vivamus malesuada ipsum pulvinar non rutrum risus dui, risus. Purus massa velit iaculis tincidunt tortor, risus, scelerisque risus...',
  benefits: mockBenefits,
};

const similarCoursesData: Course[] = [
  { id: '2', title: 'Product Design', author: 'Dennis Sweeney', rating: 4.5, students: 1233, lessons: 12, image: '', price: 90 },
  { id: '3', title: 'Palettes for Your App', author: 'Ramono Wulfschner', rating: 4.5, students: 1233, lessons: 12, image: '', price: 59 },
];
// ============================

type TabType = 'Overview' | 'Lessons' | 'Review';

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams(); // Lấy ID từ URL
  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  // Render nội dung tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab course={courseDetail} similarCourses={similarCoursesData} />;
      case 'Lessons':
        return <LessonsTab />;
      case 'Review':
        return <ReviewsTab />;
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Config Header ẩn đi để dùng custom header hoặc chỉ nút back */}
      <Stack.Screen options={{
        headerTitle: 'Course details',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons name="bookmark-outline" size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
        )
      }} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* 1. Hero Section (Video Preview) */}
        <ImageBackground
          source={{ uri: courseDetail.image }}
          style={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={32} color={tintColor} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            <View style={styles.heroTextContainer}>
              <ThemedText style={styles.heroTitle}>Introduction to UX Design</ThemedText>
            </View>
          </View>
        </ImageBackground>

        {/* 2. Title & Stats */}
        <View style={styles.headerInfo}>
          <ThemedText type="title" style={styles.courseTitle}>{courseDetail.title}</ThemedText>
          <View style={styles.statsRow}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <ThemedText style={styles.ratingText}>{courseDetail.rating} ({courseDetail.students})</ThemedText>
            <ThemedText style={[styles.lessonText, { color: iconColor }]}>• {courseDetail.lessons} lessons</ThemedText>
          </View>
        </View>

        {/* 3. Custom Tabs */}
        <View style={styles.tabContainer}>
          {(['Overview', 'Lessons', 'Review'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === tab && { borderBottomColor: tintColor }]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === tab ? { color: tintColor, fontWeight: 'bold' } : { color: iconColor }
                ]}
              >
                {tab.toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Content */}
        {renderContent()}

        {/* Padding bottom để không bị che bởi bottom bar nếu dùng absolute, 
            nhưng ở đây ta sẽ để bottom bar nằm ngoài scrollview */}
      </ScrollView>

      {/* 5. Bottom Action Bar (Fixed) */}
      <View style={[styles.bottomBar, { backgroundColor, borderTopColor: '#EEEEEE', borderTopWidth: 1 }]}>
        <View>
          <ThemedText style={styles.price}>${courseDetail.price}</ThemedText>
          {courseDetail.originalPrice && (
            <ThemedText style={[styles.originalPrice, { color: iconColor }]}>
              80% Disc. ${courseDetail.originalPrice}
            </ThemedText>
          )}
        </View>
        <TouchableOpacity style={[styles.cartButton, { backgroundColor: tintColor }]}>
          <Ionicons name="cart-outline" size={20} color="#FFF" />
          <ThemedText style={styles.cartButtonText}>Add to cart</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 220,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 10
  },
  headerInfo: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 22,
    lineHeight: 30,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 8,
  },
  lessonText: {
    fontSize: 14,
  },
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabItem: {
    marginRight: 24,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30, // Cho iPhone tai thỏ
    elevation: 20, // Bóng đổ cho Android
    shadowColor: '#000', // Bóng đổ cho iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  cartButton: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});