import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Simple card to display a user achievement or badge. Achievements are
 * represented by an icon (trophy) and descriptive text. This can be used
 * within the My Learning screen to showcase milestones the learner has
 * unlocked.
 */
export interface AchievementItemProps {
  title: string;
  description: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ title, description }) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="trophy-outline"
        size={24}
        color="#003096"
        style={{ marginRight: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderColor: '#C6C6C6',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginVertical: 4,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    color: '#003096',
  },
  description: {
    color: '#333333',
    marginTop: 2,
  },
});

export default AchievementItem;