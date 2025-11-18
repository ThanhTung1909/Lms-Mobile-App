import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

import { CourseSection, Lesson } from '@/types/course';

// ==========================================
// MOCK DATA (Dữ liệu giả lập cho bài học)
// ==========================================
const currentLessonData = {
  title: 'UX Foundation: Introduction to User Experience Design',
  likes: 231,
  shares: 16,
  videoThumbnail: '',
};

const curriculumData: CourseSection[] = [
  {
    id: 's1',
    title: 'I - Introduction',
    lessons: [
      { id: 'l1', lessonNumber: '01', title: 'Amet adipisicing consectetur', duration: '01:23 mins', status: 'completed' },
      { id: 'l2', lessonNumber: '02', title: 'Culpa est incididunt enim id adi', duration: '01:23 mins', status: 'active' },
    ]
  },
  {
    id: 's2',
    title: 'III - Plan for your UX Research',
    lessons: [
      { id: 'l3', lessonNumber: '03', title: 'Exercitation elit incididunt esse', duration: '01:23 mins', status: 'locked' },
      { id: 'l4', lessonNumber: '04', title: 'Duis esse ipsum laboru', duration: '01:23 mins', status: 'locked' },
      { id: 'l5', lessonNumber: '05', title: 'Labore minim reprehenderit pariatur ea deserunt', duration: '01:23 mins', status: 'locked' },
    ]
  },
  { id: 's3', title: 'III - Conduct UX research', lessons: [] },
  { id: 's4', title: 'IV - Articulate findings', lessons: [] },
];

type TabType = 'LESSONS' | 'PROJECTS' | 'Q&A';

// ==========================================
// COMPONENT CON (Nội bộ): Lesson Item
// ==========================================
const LessonItem = ({ item }: { item: Lesson }) => {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const isActive = item.status === 'active';

  const renderStatusIcon = () => {
    switch (item.status) {
      case 'completed': return <Ionicons name="checkmark" size={20} color={tintColor} />;
      case 'active': return <Ionicons name="play-circle-outline" size={24} color={tintColor} />;
      case 'locked': return <Ionicons name="play-outline" size={20} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.lessonItem,
        isActive && {
          backgroundColor: tintColor + '10',
          borderColor: tintColor,
          borderWidth: 1
        }
      ]}
    >
      <ThemedText style={[styles.lessonNumber, isActive && { color: tintColor }]}>
        {item.lessonNumber}
      </ThemedText>

      <View style={styles.lessonInfo}>
        <ThemedText style={[styles.lessonTitle, isActive && { fontWeight: 'bold' }]}>
          {item.title}
        </ThemedText>
        <ThemedText style={[styles.lessonDuration, { color: iconColor }]}>
          {item.duration}
        </ThemedText>
      </View>

      <View style={styles.lessonIcon}>{renderStatusIcon()}</View>
    </TouchableOpacity>
  );
};

// ==========================================
// COMPONENT CON (Nội bộ): Section Accordion
// ==========================================
const SectionItem = ({ section }: { section: CourseSection }) => {
  const [expanded, setExpanded] = useState(true);
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setExpanded(!expanded)}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>{section.title}</ThemedText>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={iconColor} />
      </TouchableOpacity>
      {expanded && (
        <View>
          {section.lessons.map((lesson) => <LessonItem key={lesson.id} item={lesson} />)}
        </View>
      )}
    </View>
  );
};

// ==========================================
// MAIN SCREEN
// ==========================================
export default function LessonViewScreen() {
  const { lessonId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('LESSONS');

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Config Header */}
      <Stack.Screen options={{
        headerTitle: 'UX Foundation', // Tên ngắn gọn trên header
        headerTitleStyle: { fontSize: 16, fontWeight: 'bold' },
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons name="bookmark-outline" size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
        ),
      }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Video Player Area */}
        <ImageBackground
          source={{ uri: currentLessonData.videoThumbnail }}
          style={styles.videoContainer}
          resizeMode="cover"
        >
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={32} color={tintColor} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </ImageBackground>

        {/* 2. Lesson Info & Actions */}
        <View style={styles.infoContainer}>
          <ThemedText type="title" style={styles.lessonBigTitle}>
            {currentLessonData.title}
          </ThemedText>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={20} color={iconColor} />
              <ThemedText style={[styles.actionText, { color: iconColor }]}>
                {currentLessonData.likes} Like
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={20} color={iconColor} />
              <ThemedText style={[styles.actionText, { color: iconColor }]}>
                {currentLessonData.shares} Share
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Tabs */}
        <View style={styles.tabContainer}>
          {(['LESSONS', 'PROJECTS', 'Q&A'] as TabType[]).map((tab) => (
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
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Tab Content */}
        <View style={styles.contentContainer}>
          {activeTab === 'LESSONS' ? (
            curriculumData.map((section) => (
              <SectionItem key={section.id} section={section} />
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ThemedText style={{ color: iconColor }}>Content for {activeTab} is coming soon.</ThemedText>
            </View>
          )}
        </View>

        {/* Padding bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Video Player
  videoContainer: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Info
  infoContainer: {
    padding: 20,
  },
  lessonBigTitle: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginTop: 8,
  },
  tabItem: {
    marginRight: 32,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 20,
  },
  // List Components Styles (Accordion)
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  lessonNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
    width: 30,
  },
  lessonInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 20,
  },
  lessonDuration: {
    fontSize: 12,
  },
  lessonIcon: {
    width: 24,
    alignItems: 'center',
  },
});