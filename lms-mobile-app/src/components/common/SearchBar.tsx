import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
    placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search...' }: SearchBarProps) {
    const backgroundColor = useThemeColor({ light: '#F0F0F0', dark: '#333333' }, 'background');
    const textColor = useThemeColor({}, 'text');
    const iconColor = useThemeColor({}, 'icon');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Ionicons name="search-outline" size={20} color={iconColor} style={styles.icon} />
            <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder={placeholder}
                placeholderTextColor={iconColor}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});