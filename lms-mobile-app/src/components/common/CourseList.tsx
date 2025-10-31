import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import SectionHeader from './SectionHeader';
import CourseCard from './CourseCard';
import { router } from 'expo-router';


type CourseItem = {
    id: string;
    title: string;
    author: string;
    rating: number;
    students: number;
    lessons: number;
    image: string;
    tag?: string;
};

interface CourseListProps {
    title: string;
    data: CourseItem[];
    onViewMore: () => void;
}

const CourseList: React.FC<CourseListProps> = ({ title, data, onViewMore }) => {

    const handlePressCourse = (id: string) => {
        // Điều hướng đến trang chi tiết
        router.push(`/(tabs)/courses/${id}`);
    };

    return (
        <View style={styles.container}>
            <SectionHeader title={title} onViewMore={onViewMore} />
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <CourseCard
                        item={item}
                        onPress={() => handlePressCourse(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
    },
    listContent: {
        paddingLeft: 20,
        paddingRight: 4,
    },
});

export default CourseList;