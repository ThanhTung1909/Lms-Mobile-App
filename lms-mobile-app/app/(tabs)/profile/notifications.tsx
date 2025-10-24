import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import NotificationItem from '../../../src/components/specific/NotificationItem';

/**
 * Notifications screen. Displays a list of recent messages from the system
 * or courses. Each item may be marked as read/unread. Replace the
 * static array with API data to show real notifications. Colours are
 * consistent with the palette: primary blue (#003096) and neutral grey
 * (#C6C6C6) on a white background.
 */
interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead?: boolean;
}

const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'New course available',
    description: 'A new advanced React Native course has been released.',
    date: '2025-10-20',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Lesson completed',
    description: 'You have completed the lesson "JavaScript Basics".',
    date: '2025-10-18',
    isRead: true,
  },
];

export default function NotificationsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          title={n.title}
          description={n.description}
          date={n.date}
          isRead={n.isRead}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003096',
    marginBottom: 8,
  },
});