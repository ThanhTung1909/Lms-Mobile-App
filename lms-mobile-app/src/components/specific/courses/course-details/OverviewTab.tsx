import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Course, CourseBenefit } from '@/types/course';
import CourseRowCard from '@/components/common/CourseRowCard';

interface OverviewTabProps {
    course: Course;
    similarCourses: Course[];
}

export default function OverviewTab({ course, similarCourses }: OverviewTabProps) {
    const iconColor = useThemeColor({}, 'icon');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({ light: '#EEEEEE', dark: '#333' }, 'background');

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={styles.container}>
            {/* 1. Instructor Section */}
            <View style={styles.instructorRow}>
                <Image
                    source={{ uri: course.authorAvatar || '' }}
                    style={styles.avatar}
                />
                <View style={styles.instructorInfo}>
                    <ThemedText type="defaultSemiBold">{course.author}</ThemedText>
                    <ThemedText style={[styles.roleText, { color: iconColor }]}>
                        {course.authorRole || 'Instructor'}
                    </ThemedText>
                </View>
                <TouchableOpacity style={[styles.followButton, { backgroundColor: tintColor + '20' }]}>
                    <ThemedText style={[styles.followText, { color: tintColor }]}>Follow</ThemedText>
                </TouchableOpacity>
            </View>

            {/* 2. Description */}
            <View style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Description</ThemedText>
                <ThemedText style={[styles.descriptionText, { color: iconColor }]} numberOfLines={isExpanded ? undefined : 3}>
                    {course.description || "No description available."}
                </ThemedText>
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                    <ThemedText style={[styles.seeMore, { color: tintColor }]}>
                        {isExpanded ? 'Show less' : 'See more'}
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {/* 3. Benefits */}
            <View style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Benefits</ThemedText>
                {course.benefits?.map((benefit) => (
                    <View key={benefit.id} style={styles.benefitRow}>
                        <Ionicons name={benefit.icon} size={20} color={tintColor} style={{ width: 30 }} />
                        <ThemedText style={[styles.benefitText, { color: iconColor }]}>{benefit.text}</ThemedText>
                    </View>
                ))}
            </View>

            {/* 4. Similar Courses */}
            <View style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Similar courses</ThemedText>
                <View style={{ marginTop: 10 }}>
                    {similarCourses.map((item) => (
                        <CourseRowCard key={item.id} item={item} />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    // Instructor
    instructorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    instructorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    roleText: {
        fontSize: 12,
    },
    followButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 6,
    },
    followText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    // Common Section
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 8,
        fontSize: 16,
    },
    // Description
    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
    },
    seeMore: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    // Benefits
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    benefitText: {
        fontSize: 14,
    },
});