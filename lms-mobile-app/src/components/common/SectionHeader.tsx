import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = { text: '#000', primary: '#007BFF', gray: '#888' };

interface SectionHeaderProps {
    title: string;
    onViewMore: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onViewMore }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onViewMore}>
                <Text style={styles.viewMore}>View more</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    viewMore: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '500',
    },
});

export default SectionHeader;