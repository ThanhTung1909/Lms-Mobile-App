import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';

import CourseList from '@/components/common/CourseList';

import HomeHeader from '@/components/specific/home/HomeHeader';
import PromotionBanner from '@/components/specific/home/PromotionBanner';
import CategoryList from '@/components/specific/home/CategoryList';
import InspiredCourseList from '@/components/specific/home/InspiredCourseList';
import TeacherList from '@/components/specific/home/TeacherList';

import { Course, Category, Teacher } from '@/types/course';

const popularCoursesData: Course[] = [
  { id: '1', title: 'PHP in One Click', author: 'Ramono Wulfschner', rating: 4.5, students: 1233, lessons: 18, image: '', tag: 'Best seller' },
  { id: '2', title: 'Python Introduction', author: 'Ramono Wulfschner', rating: 4.5, students: 1267, lessons: 12, image: '' },
];
const recommendedCoursesData: Course[] = [
  { id: '3', title: 'Website Design', author: 'Ramono Wulfschner', rating: 4.5, students: 1233, lessons: 9, image: '' },
  { id: '4', title: 'UX Research For...', author: 'Olivia Wang', rating: 4.5, students: 1782, lessons: 12, image: '', tag: '20% OFF' },
];
const inspiredCoursesData: Course[] = [
  { id: '5', title: 'Digital Portrait', author: 'James Wulfschner', rating: 4.5, students: 657, lessons: 12, image: '', price: 67 },
  { id: '6', title: 'Workspace Decor', author: 'David Dominguez', rating: 4.5, students: 33, lessons: 17, image: '', price: 19 },
];
const categoryData: Category[] = [
  { id: '1', name: 'Business', iconName: 'business-outline', color: '#E9F7FE' },
  { id: '2', name: 'Design', iconName: 'color-palette-outline', color: '#FFF6E9' },
  { id: '3', name: 'Code', iconName: 'code-slash-outline', color: '#FFEBEB' },
  { id: '4', name: 'Writing', iconName: 'create-outline', color: '#F0EFFF' },
  { id: '5', name: 'Movie', iconName: 'film-outline', color: '#E8F8F4' },
  { id: '6', name: 'Language', iconName: 'language-outline', color: '#FFF2F2' },
];
const teacherData: Teacher[] = [
  { id: '1', name: 'Christian Hayes', university: 'University of...', avatar: '' },
  { id: '2', name: 'Dennis Swed', university: 'University of...', avatar: '' },
  { id: '3', name: 'Lida Ers', university: 'University of...', avatar: '' },
];

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Header */}
        <HomeHeader userName="Rosie" />

        {/* 2. Promotion Banner */}
        <PromotionBanner />

        {/* 3. Categories */}
        <CategoryList
          data={categoryData}
          onViewMore={() => router.push('/(tabs)/courses')}
        />

        {/* 4. Popular Courses (Dùng CourseList chung) */}
        <CourseList
          title="Popular courses"
          data={popularCoursesData}
          onViewMore={() => router.push('/(tabs)/courses')}
        />

        {/* 5. Recommended for you (Dùng CourseList chung) */}
        <CourseList
          title="Recommended for you"
          data={recommendedCoursesData}
          onViewMore={() => router.push('/(tabs)/courses')}
        />

        {/* 6. Course that inspires */}
        <InspiredCourseList
          title="Course that inspires"
          data={inspiredCoursesData}
          onViewMore={() => router.push('/(tabs)/courses')}
        />

        {/* 7. Top teachers */}
        <TeacherList
          title="Top teachers"
          data={teacherData}
          onViewMore={() => console.log("View teachers")}
        />

        {/* Đệm cuối trang */}
        <ThemedView style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});