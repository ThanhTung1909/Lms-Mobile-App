import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

/**
 * Application settings screen. This screen showcases a few toggles to
 * personalise the app experience. In a real application, you would
 * integrate these toggles with your state management or backend so
 * that preferences persist across sessions. All colours follow the
 * primary palette (#003096) and neutral greys (#C6C6C6) requested.
 */
export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Push notifications toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={pushEnabled}
          onValueChange={setPushEnabled}
          trackColor={{ false: '#C6C6C6', true: '#003096' }}
          thumbColor={pushEnabled ? '#003096' : '#ffffff'}
        />
      </View>

      {/* Dark mode toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#C6C6C6', true: '#003096' }}
          thumbColor={darkMode ? '#003096' : '#ffffff'}
        />
      </View>

      {/* Additional settings can be added here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003096',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#C6C6C6',
  },
  label: {
    fontSize: 16,
    color: '#003096',
  },
});