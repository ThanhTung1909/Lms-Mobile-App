import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { text: '#000', gray: '#888', white: '#fff', yellow: 'orange' };

interface CourseCardProps {
    item: {
        id: string;
        title: string;
        author: string;
        rating: number;
        students: number;
        lessons: number;
        image: string;
        tag?: string;
    };
    onPress: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {/* Ảnh khóa học */}
            <Image
                source={{ uri: item.image || '' }}
                style={styles.image}
            />
            {/* Tag (Best seller, 20% OFF) */}
            {item.tag && (
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                </View>
            )}

            {/* Nút Bookmark */}
            <TouchableOpacity style={styles.bookmark}>
                <Ionicons name="bookmark-outline" size={18} color={COLORS.gray} />
            </TouchableOpacity>

            {/* Thông tin text */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.author}>{item.author}</Text>

                <View style={styles.statsContainer}>
                    <Ionicons name="star" size={14} color={COLORS.yellow} />
                    <Text style={styles.rating}>{item.rating}</Text>
                    <Text style={styles.students}>({item.students})</Text>
                    <Text style={styles.lessons}>- {item.lessons} lessons</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        marginRight: 16,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    tag: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tagText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    bookmark: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    author: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    rating: {
        fontSize: 12,
        color: COLORS.text,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    students: {
        fontSize: 12,
        color: COLORS.gray,
        marginLeft: 4,
    },
    lessons: {
        fontSize: 12,
        color: COLORS.gray,
        marginLeft: 8,
    },
});

export default CourseCard;