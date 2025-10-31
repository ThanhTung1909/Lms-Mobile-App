import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function PromotionBanner() {
    const tintColor = useThemeColor({}, 'tint');

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: '' }}
                resizeMode="cover"
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 16 }}
            >
                <LinearGradient
                    colors={[tintColor, '#3b9ec4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <View style={styles.textContainer}>
                            <ThemedText style={styles.title}>PROJECT MANAGEMENT</ThemedText>
                            <ThemedText style={styles.offer}>20% OFF</ThemedText>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <ThemedText style={[styles.buttonText, { color: tintColor }]}>
                                JOIN NOW
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    imageBackground: {
        height: 120,
        width: '100%',
    },
    gradient: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    offer: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});