import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

interface HomeHeaderProps {
    userName: string;
}

export default function HomeHeader({ userName }: HomeHeaderProps) {
    const iconColor = useThemeColor({}, 'icon');
    const secondaryTextColor = useThemeColor({}, 'icon');

    return (
        <ThemedView style={styles.container}>
            <View>
                <ThemedText style={styles.greeting}>Hello, {userName}!</ThemedText>
                <ThemedText style={[styles.subGreeting, { color: secondaryTextColor }]}>
                    What do you want to learn today?
                </ThemedText>
            </View>
            <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="cart-outline" size={24} color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color={iconColor} />
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subGreeting: {
        fontSize: 14,
        marginTop: 4,
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 16,
    },
});