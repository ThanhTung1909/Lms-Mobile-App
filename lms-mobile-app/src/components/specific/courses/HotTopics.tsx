import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

const topics = ['Java', 'SQL', 'Javascript', 'Python', 'Digital marketing', 'Photoshop'];

export default function HotTopics() {
    const chipBg = useThemeColor({ light: '#F0F0F0', dark: '#333' }, 'background');
    const chipText = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Hot topics</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {topics.map((topic) => (
                    <TouchableOpacity
                        key={topic}
                        style={[styles.chip, { backgroundColor: chipBg }]}
                    >
                        <ThemedText style={[styles.chipText, { color: chipText }]}>
                            {topic}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
    },
    chipText: {
        fontSize: 14,
    },
});