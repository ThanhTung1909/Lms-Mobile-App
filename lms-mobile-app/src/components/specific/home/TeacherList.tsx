import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import SectionHeader from '@/components/common/SectionHeader';
import { Teacher } from '@/types/course';
import { useThemeColor } from '@/hooks/use-theme-color';

interface TeacherListProps {
    title: string;
    data: Teacher[];
    onViewMore: () => void;
}

const TeacherCard: React.FC<{ item: Teacher }> = ({ item }) => {
    const secondaryColor = useThemeColor({}, 'icon');
    return (
        <TouchableOpacity style={styles.cardContainer}>
            <Image source={{ uri: item.avatar || '' }} style={styles.avatar} />
            <ThemedText style={styles.teacherName} numberOfLines={1}>{item.name}</ThemedText>
            <ThemedText style={[styles.teacherUni, { color: secondaryColor }]} numberOfLines={1}>
                {item.university}
            </ThemedText>
        </TouchableOpacity>
    );
};

export default function TeacherList({ title, data, onViewMore }: TeacherListProps) {
    return (
        <View style={styles.container}>
            <SectionHeader title={title} onViewMore={onViewMore} />
            <FlatList
                data={data}
                renderItem={({ item }) => <TeacherCard item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    listContent: {
        paddingLeft: 20,
        paddingRight: 4,
    },
    cardContainer: {
        width: 100,
        alignItems: 'center',
        marginRight: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },
    teacherName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    teacherUni: {
        fontSize: 12,
    },
});