import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import SectionHeader from '@/components/common/SectionHeader';
import { Ionicons } from '@expo/vector-icons'; // Đảm bảo đã import
import { useThemeColor } from '@/hooks/use-theme-color';

type CategoryRow = {
    name: string;
    icon: React.ComponentProps<typeof Ionicons>['name']; // Đây là kiểu "tên icon"
};

const categories: CategoryRow[] = [
    { name: 'Business', icon: 'business-outline' },
    { name: 'Design', icon: 'color-palette-outline' },
    { name: 'Code', icon: 'code-slash-outline' },
    { name: 'Movie', icon: 'film-outline' },
    { name: 'Language', icon: 'language-outline' },
];

export default function CategoryRows() {
    const iconColor = useThemeColor({}, 'icon');
    const borderColor = useThemeColor({ light: '#EEEEEE', dark: '#333333' }, 'background');

    return (
        <View style={styles.container}>
            <SectionHeader title="Categories" onViewMore={() => { }} />
            <View style={styles.listContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.name}
                        style={[styles.row, { borderBottomColor: borderColor }]}
                    >
                        <Ionicons name={category.icon} size={24} color={iconColor} />
                        <ThemedText style={styles.rowText}>{category.name}</ThemedText>
                        <Ionicons name="chevron-forward-outline" size={20} color={iconColor} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    rowText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 16,
    },
});