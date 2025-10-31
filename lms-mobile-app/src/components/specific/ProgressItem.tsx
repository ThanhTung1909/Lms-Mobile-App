import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Displays progress for a single course or learning unit. A simple progress
 * indicator is implemented with nested View elements. Colour palette is
 * consistent with the rest of the app: primary blue for the progress bar and
 * light grey for the background. Progress is expressed as a fraction between
 * 0 and 1.
 */
export interface ProgressItemProps {
  title: string;
  /** A value between 0 and 1 representing the percent complete */
  progress: number;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ title, progress }) => {
  // Clamp progress to [0, 1] to avoid invalid values
  const clamped = Math.max(0, Math.min(progress, 1));
  const percent = Math.round(clamped * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
      <Text style={styles.percent}>{percent}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontWeight: '600',
    color: '#003096',
  },
  progressBackground: {
    height: 10,
    backgroundColor: '#C6C6C6',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#003096',
  },
  percent: {
    alignSelf: 'flex-end',
    marginTop: 2,
    color: '#003096',
    fontSize: 12,
  },
});

export default ProgressItem;