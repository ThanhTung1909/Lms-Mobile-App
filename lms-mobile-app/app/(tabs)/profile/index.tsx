import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Profile home screen. Provides access to edit profile information,
 * application settings and user notifications. Replace the placeholder
 * text with your own profile summary or custom components.
 */
export default function ProfileHome() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.subtitle}>This is your profile overview.</Text>
      <TouchableOpacity
        onPress={() => router.push('/profile/edit')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/profile/settings')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/profile/notifications')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Notifications</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003096',
    marginBottom: 8,
  },
  subtitle: {
    color: '#333333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#003096',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});