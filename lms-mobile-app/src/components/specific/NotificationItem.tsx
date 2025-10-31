import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Renders a single notification entry. Notifications can be either read or
 * unread, indicated by a coloured bar on the left. The component uses
 * consistent paddings and border styles defined by the design guidelines.
 */
export interface NotificationItemProps {
  title: string;
  description: string;
  /** ISO formatted date string */
  date: string;
  /** Whether this notification has been read by the user */
  isRead?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
  date,
  isRead,
}) => {
  return (
    <View
      style={[
        styles.container,
        isRead ? styles.read : styles.unread,
      ]}
    >
      <Ionicons
        name="notifications-outline"
        size={20}
        color="#003096"
        style={{ marginRight: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C6C6C6',
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: '600',
    color: '#003096',
  },
  description: {
    color: '#333333',
    marginTop: 2,
  },
  date: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
  read: {},
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: '#003096',
  },
});

export default NotificationItem;