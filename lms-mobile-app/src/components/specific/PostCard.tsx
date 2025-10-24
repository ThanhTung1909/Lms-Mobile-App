import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * A card component used to render a post preview within the community forum.
 *
 * This component displays the title, a short excerpt of the post content and
 * action buttons to like, dislike or view the number of comments. All
 * interactive callbacks are optional which allows you to customise behaviour
 * depending on your screen.
 */
export interface PostCardProps {
  title: string;
  /** Short excerpt of the post content */
  excerpt: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  /** Navigate to details screen */
  onPress?: () => void;
  /** Triggered when user taps the like icon */
  onLike?: () => void;
  /** Triggered when user taps the dislike icon */
  onDislike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  likes,
  dislikes,
  commentsCount,
  onPress,
  onLike,
  onDislike,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={styles.title}>{title}</Text>
      {/* Limit excerpt to a few lines so cards remain compact */}
      <Text style={styles.excerpt} numberOfLines={3}>
        {excerpt}
      </Text>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={onLike}>
          <Ionicons name="thumbs-up-outline" size={20} color="#003096" />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={onDislike}>
          <Ionicons name="thumbs-down-outline" size={20} color="#003096" />
          <Text style={styles.actionText}>{dislikes}</Text>
        </TouchableOpacity>
        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={20} color="#003096" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#C6C6C6',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003096',
    marginBottom: 4,
  },
  excerpt: {
    color: '#333333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    color: '#003096',
  },
});

export default PostCard;