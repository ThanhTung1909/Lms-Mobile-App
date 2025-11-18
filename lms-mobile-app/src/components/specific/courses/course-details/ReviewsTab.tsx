import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Review } from '@/types/course';

const reviewsData: Review[] = [
    {
        id: '1',
        user: { name: 'Jinny Oslin', avatar: '' },
        rating: 5,
        date: 'A day ago',
        comment: 'Nostrud excepteur magna id est quis in aliqua consequat. Exercitation enim eiusmod elit sint laborum.',
    },
    {
        id: '2',
        user: { name: 'Jane Barry', avatar: '' },
        rating: 4,
        date: 'A day ago',
        comment: 'Deserunt minim incididunt cillum nostrud do voluptate excepteur excepteur minim ex minim est.',
    },
    {
        id: '3',
        user: { name: 'Claire Mignard', avatar: '' },
        rating: 4,
        date: '5 days ago',
        comment: 'Magna id sint irure in cillum esse nisi dolor laboris ullamco. Consectetur proident ...',
    },
];


const ReviewItem = ({ item }: { item: Review }) => {
    const iconColor = useThemeColor({}, 'icon');

    // Hàm render sao (5 ngôi sao)
    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <Ionicons
                key={index}
                name={index < rating ? "star" : "star-outline"}
                size={14}
                color="#FFC107"
                style={{ marginLeft: 2 }}
            />
        ));
    };

    return (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                    <ThemedText type="defaultSemiBold">{item.user.name}</ThemedText>
                    <ThemedText style={[styles.dateText, { color: iconColor }]}>{item.date}</ThemedText>
                </View>
                <View style={styles.ratingContainer}>
                    {renderStars(item.rating)}
                </View>
            </View>
            <ThemedText style={[styles.commentText, { color: iconColor }]}>
                {item.comment}
            </ThemedText>
        </View>
    );
};


export default function ReviewsTab() {
    const tintColor = useThemeColor({}, 'tint');
    const iconColor = useThemeColor({}, 'icon');
    const [selectedFilter, setSelectedFilter] = useState('All');

    const filters = ['All', '5', '4', '3', '2', '1'];

    return (
        <View style={styles.container}>
            {/* 1. Summary Header */}
            <View style={styles.summaryContainer}>
                <View style={styles.ratingSummary}>
                    <Ionicons name="star" size={20} color="#FFC107" />
                    <ThemedText style={styles.ratingBigText}>4.5/5</ThemedText>
                    <ThemedText style={[styles.ratingCountText, { color: iconColor }]}>
                        (1233+ reviews)
                    </ThemedText>
                </View>
                <TouchableOpacity>
                    <ThemedText style={[styles.viewAllText, { color: tintColor }]}>View all</ThemedText>
                </TouchableOpacity>
            </View>

            {/* 2. Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {filters.map((filter) => {
                    const isSelected = selectedFilter === filter;
                    return (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterChip,
                                isSelected ? { backgroundColor: tintColor } : { borderColor: tintColor, borderWidth: 1 }
                            ]}
                            onPress={() => setSelectedFilter(filter)}
                        >
                            {filter !== 'All' && (
                                <Ionicons
                                    name="star"
                                    size={12}
                                    color={isSelected ? '#FFF' : tintColor}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            <ThemedText
                                style={[
                                    styles.filterText,
                                    isSelected ? { color: '#FFF' } : { color: tintColor }
                                ]}
                            >
                                {filter}
                            </ThemedText>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* 3. List */}
            <View style={styles.listContainer}>
                {reviewsData.map((review) => (
                    <ReviewItem key={review.id} item={review} />
                ))}
            </View>

            {/* Khoảng đệm dưới cùng */}
            <View style={{ height: 80 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    // Summary
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingSummary: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBigText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    ratingCountText: {
        fontSize: 14,
        marginLeft: 8,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Filters
    filterScroll: {
        marginBottom: 24,
        // Để tránh bị cắt bóng đổ hoặc padding
        flexGrow: 0,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
        // Style mặc định cho unselected
        backgroundColor: 'transparent',
    },
    filterText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Review Item
    listContainer: {
        gap: 16,
    },
    reviewItem: {
        marginBottom: 20, // Fallback cho gap
    },
    reviewHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    dateText: {
        fontSize: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    commentText: {
        fontSize: 14,
        lineHeight: 22,
    },
});