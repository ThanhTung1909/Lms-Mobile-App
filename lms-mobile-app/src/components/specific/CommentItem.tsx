import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * A simple component to render a user comment with optional like, dislike and
 * reply actions. This can be used in the discussion detail screen to display
 * nested comments. Colour scheme follows the design tokens defined by the
 * project: primary #003096 and secondary #C6C6C6 on a white background.
 */
export interface CommentItemProps {
  author: string;
  content: string;
  likes: number;
  dislikes: number;
  /** Called when user taps the like icon */
  onLike?: () => void;
  /** Called when user taps the dislike icon */
  onDislike?: () => void;
  /** Called when user taps the reply button */
  onReply?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  author,
  content,
  likes,
  dislikes,
  onLike,
  onDislike,
  onReply,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.author}>{author}</Text>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={onLike}>
          <Ionicons name="thumbs-up-outline" size={18} color="#003096" />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={onDislike}>
          <Ionicons name="thumbs-down-outline" size={18} color="#003096" />
          <Text style={styles.actionText}>{dislikes}</Text>
        </TouchableOpacity>
        {onReply && (
          <TouchableOpacity style={styles.replyButton} onPress={onReply}>
            <Ionicons name="arrow-undo-outline" size={18} color="#003096" />
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C6C6C6',
    marginVertical: 4,
  },
  author: {
    fontWeight: '600',
    color: '#003096',
    marginBottom: 2,
  },
  content: {
    color: '#333333',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    marginLeft: 4,
    color: '#003096',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    marginLeft: 4,
    color: '#003096',
  },
});

export default CommentItem;