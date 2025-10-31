import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import SectionHeader from '@/components/common/SectionHeader';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

interface InspiredCourseListProps {
    title: string;
    data: Course[];
    onViewMore: () => void;
}

const InspiredCourseCard: React.FC<{ item: Course }> = ({ item }) => {

    const borderColor = useThemeColor(
        { light: '#EEEEEE', dark: '#333333' },
        'background'
    );

    const secondaryColor = useThemeColor({}, 'icon');
    const priceColor = useThemeColor({}, 'tint');

    return (
        <TouchableOpacity
            style={[styles.cardContainer, { borderColor: borderColor }]}
            onPress={() => router.push(`/(tabs)/courses/${item.id}`)}
        >
            <Image source={{ uri: item.image || '' }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
                <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
                <ThemedText style={[styles.cardStats, { color: secondaryColor }]}>
                    <Ionicons name="star" size={14} color="#FFC107" /> {item.rating} ({item.students})
                </ThemedText>
                <ThemedText style={[styles.cardStats, { color: secondaryColor }]}>
                    {item.lessons} lessons
                </ThemedText>
            </View>
            <View style={styles.cardRight}>
                <ThemedText style={[styles.cardPrice, { color: priceColor }]}>
                    ${item.price}
                </ThemedText>
                <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={20} color={secondaryColor} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default function InspiredCourseList({ title, data, onViewMore }: InspiredCourseListProps) {

    return (
        <View style={styles.container}>
            <SectionHeader title={title} onViewMore={onViewMore} />
            <View style={styles.listContainer}>
                {data.map((item) => (
                    <InspiredCourseCard key={item.id} item={item} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    cardImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardStats: {
        fontSize: 12,
        marginTop: 4,
    },
    cardRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});