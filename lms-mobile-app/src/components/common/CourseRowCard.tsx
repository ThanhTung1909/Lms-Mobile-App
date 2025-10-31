import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CourseRowCardProps {
    item: Course;
}

export default function CourseRowCard({ item }: CourseRowCardProps) {
    const borderColor = useThemeColor({ light: '#EEEEEE', dark: '#333333' }, 'background');
    const secondaryColor = useThemeColor({}, 'icon');
    const priceColor = useThemeColor({}, 'tint');

    return (
        <TouchableOpacity
            style={[styles.cardContainer, { borderColor: borderColor }]}
            onPress={() => router.push(`/(tabs)/courses/${item.id}`)}
        >
            {/* Ảnh khóa học */}
            <Image
                source={{ uri: item.image || '' }}
                style={styles.cardImage}
            />

            {/* Tag (ví dụ: Best-seller) */}
            {item.tag && (
                <View style={styles.tag}>
                    <ThemedText style={styles.tagText}>{item.tag}</ThemedText>
                </View>
            )}

            {/* Cột thông tin */}
            <View style={styles.cardInfo}>
                <ThemedText style={styles.cardTitle} numberOfLines={2}>{item.title}</ThemedText>
                <ThemedText style={[styles.cardAuthor, { color: secondaryColor }]}>{item.author}</ThemedText>

                {/* Giá tiền */}
                <ThemedText style={[styles.cardPrice, { color: priceColor }]}>
                    ${item.price}
                </ThemedText>

                {/* Thống kê (rating, lessons) */}
                <View style={styles.statsContainer}>
                    <Ionicons name="star" size={14} color="#FFC107" />
                    <ThemedText style={styles.cardStats}> {item.rating} ({item.students})</ThemedText>
                    <ThemedText style={[styles.cardStats, { marginLeft: 8 }]}>• {item.lessons} lessons</ThemedText>
                </View>
            </View>

            {/* Cột Bookmark (bên phải) */}
            <TouchableOpacity style={styles.bookmarkButton}>
                <Ionicons name="bookmark-outline" size={20} color={secondaryColor} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
        position: 'relative',
    },
    cardImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    tag: {
        position: 'absolute',
        top: 18,
        left: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tagText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardAuthor: {
        fontSize: 12,
        marginTop: 4,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    cardStats: {
        fontSize: 12,
        color: '#888',
    },
    bookmarkButton: {
        marginLeft: 8,
        padding: 4,
    },
});