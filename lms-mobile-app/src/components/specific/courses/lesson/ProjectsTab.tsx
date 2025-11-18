// Vị trí: src/components/specific/courses/lesson/ProjectsTab.tsx

import React from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';


const studentProjects = [
    { id: '1', title: 'Wireframe', author: 'Ramono Wulfschner', image: '' },
    { id: '2', title: 'Personal', author: 'Thomas Carlson', image: '' },
    { id: '3', title: 'Mobile App', author: 'Sara Weise', image: '' },
];

const resources = [
    { id: '1', title: 'Document 1.txt', size: '612 Kb', type: 'txt' },
    { id: '2', title: 'Document 2.pdf', size: '35 Mb', type: 'pdf' },
];

export default function ProjectsTab() {
    const tintColor = useThemeColor({}, 'tint');
    const iconColor = useThemeColor({}, 'icon');
    const borderColor = useThemeColor({ light: '#EEEEEE', dark: '#333' }, 'background');

    // Render Item cho danh sách Student Projects
    const renderProjectItem = ({ item }: { item: any }) => (
        <View style={[styles.projectCard, { borderColor }]}>
            <Image source={{ uri: item.image }} style={styles.projectImage} />
            <View style={styles.projectInfo}>
                <ThemedText style={styles.projectTitle}>{item.title}</ThemedText>
                <ThemedText style={[styles.projectAuthor, { color: iconColor }]}>
                    {item.author}
                </ThemedText>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* 1. Upload Section */}
            <View style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Upload your project</ThemedText>
                <TouchableOpacity
                    style={[styles.uploadBox, { borderColor: tintColor, backgroundColor: tintColor + '08' }]}
                >
                    <Ionicons name="cloud-upload-outline" size={28} color={tintColor} />
                    <ThemedText style={[styles.uploadText, { color: iconColor }]}>
                        Upload your project here
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {/* 2. Student Projects */}
            <View style={styles.section}>
                <View style={styles.headerRow}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>12 Student Projects</ThemedText>
                    <TouchableOpacity>
                        <ThemedText style={{ color: tintColor, fontSize: 12, fontWeight: 'bold' }}>View more</ThemedText>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={studentProjects}
                    renderItem={renderProjectItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 20 }} // Padding cuối list
                />
            </View>

            {/* 3. Project Description */}
            <View style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Project Description</ThemedText>
                <ThemedText style={[styles.descriptionText, { color: iconColor }]}>
                    Culpa aliquip commodo incididunt nostrud aliqua ut adipisicing officia.
                    Laborum consequat ea reprehenderit voluptate voluptate quis pariatur dolor.
                    Laboris proident ea fugiat nulla...
                    <ThemedText style={{ color: tintColor, fontWeight: 'bold' }}> See more</ThemedText>
                </ThemedText>
            </View>

            {/* 4. Resources */}
            <View style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Resources (2)</ThemedText>
                {resources.map((res) => (
                    <TouchableOpacity key={res.id} style={[styles.resourceItem, { borderColor }]}>
                        <View style={styles.resourceLeft}>
                            <Ionicons
                                name={res.type === 'pdf' ? "document-text-outline" : "document-outline"}
                                size={24}
                                color={iconColor}
                            />
                            <View style={{ marginLeft: 12 }}>
                                <ThemedText style={styles.resourceTitle}>{res.title}</ThemedText>
                                <ThemedText style={[styles.resourceSize, { color: iconColor }]}>{res.size}</ThemedText>
                            </View>
                        </View>
                        <Ionicons name="download-outline" size={20} color={iconColor} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Padding bottom */}
            <View style={{ height: 40 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    // Upload Box
    uploadBox: {
        borderWidth: 1,
        borderStyle: 'dashed', // Viền nét đứt
        borderRadius: 12,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    uploadText: {
        marginLeft: 8,
        fontSize: 14,
    },
    // Project Card
    projectCard: {
        width: 140,
        marginRight: 12,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        paddingBottom: 8,
    },
    projectImage: {
        width: '100%',
        height: 80,
        backgroundColor: '#eee',
    },
    projectInfo: {
        padding: 8,
    },
    projectTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    projectAuthor: {
        fontSize: 12,
        marginTop: 2,
    },
    // Description
    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
    },
    // Resource Item
    resourceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 12,
    },
    resourceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resourceTitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    resourceSize: {
        fontSize: 12,
        marginTop: 2,
    },
});