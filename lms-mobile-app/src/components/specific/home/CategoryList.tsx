import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import SectionHeader from '@/components/common/SectionHeader';
import { Category } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CategoryListProps {
    data: Category[];
    onViewMore: () => void;
}

const CategoryItem: React.FC<{ item: Category }> = ({ item }) => {

    const borderColor = useThemeColor(
        { light: '#EEEEEE', dark: '#333333' },
        'background'
    );

    return (
        <TouchableOpacity
            style={[styles.itemContainer, { borderColor }]}
            onPress={() => router.push('/(tabs)/courses')}
        >

        </TouchableOpacity>
    );
};

export default function CategoryList({ data, onViewMore }: CategoryListProps) {
    return (
        <View style={styles.container}>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        margin: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemText: {
        fontSize: 14,
        fontWeight: '500',
    },
});