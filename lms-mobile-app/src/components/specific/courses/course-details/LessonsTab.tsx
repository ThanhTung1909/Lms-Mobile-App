import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { CourseSection, Lesson } from '@/types/course';

const LessonItem = ({ item }: { item: Lesson }) => {
    const tintColor = useThemeColor({}, 'tint');
    const iconColor = useThemeColor({}, 'icon');
    const isActive = item.status === 'active';

    // Xác định Icon dựa trên status
    const renderStatusIcon = () => {
        switch (item.status) {
            case 'completed':
                return <Ionicons name="checkmark" size={20} color={tintColor} />;
            case 'active':
                return <Ionicons name="play-circle-outline" size={24} color={tintColor} />; // Hoặc icon 'play'
            case 'locked':
                return <Ionicons name="lock-closed-outline" size={20} color={iconColor} />;
        }
    };

    return (
        <View style={[
            styles.lessonItem,
            isActive && {
                backgroundColor: tintColor + '10', // Thêm độ trong suốt 10%
                borderColor: tintColor,
                borderWidth: 1
            }
        ]}>
            <ThemedText style={[styles.lessonNumber, isActive && { color: tintColor }]}>
                {item.lessonNumber}
            </ThemedText>

            <View style={styles.lessonInfo}>
                <ThemedText style={styles.lessonTitle}>{item.title}</ThemedText>
                <ThemedText style={[styles.lessonDuration, { color: iconColor }]}>
                    {item.duration}
                </ThemedText>
            </View>

            <View style={styles.lessonIcon}>
                {renderStatusIcon()}
            </View>
        </View>
    );
};

const SectionItem = ({ section }: { section: CourseSection }) => {
    const [expanded, setExpanded] = useState(true); // Mặc định mở
    const iconColor = useThemeColor({}, 'icon');

    return (
        <View style={styles.sectionContainer}>
            {/* Header của Section (Bấm để mở/đóng) */}
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setExpanded(!expanded)}
            >
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                    {section.title}
                </ThemedText>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={iconColor}
                />
            </TouchableOpacity>

            {/* Danh sách bài học (Chỉ hiện khi expanded = true) */}
            {expanded && (
                <View>
                    {section.lessons.map((lesson) => (
                        <LessonItem key={lesson.id} item={lesson} />
                    ))}
                </View>
            )}
        </View>
    );
};

export default function LessonsTab() {
    const sections: CourseSection[] = [
        {
            id: 's1',
            title: 'I - Introduction',
            lessons: [
                { id: 'l1', lessonNumber: '01', title: 'Amet adipisicing consectetur', duration: '01:23 mins', status: 'completed' },
                { id: 'l2', lessonNumber: '02', title: 'Adipisicing dolor amet occaeca', duration: '01:23 mins', status: 'active' },
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

    return (
        <View style={styles.container}>
            {sections.map((section) => (
                <SectionItem key={section.id} section={section} />
            ))}
            <View style={{ height: 80 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    // Section Styles
    sectionContainer: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 16,
    },
    // Lesson Styles
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        // Style mặc định (cho item chưa active)
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