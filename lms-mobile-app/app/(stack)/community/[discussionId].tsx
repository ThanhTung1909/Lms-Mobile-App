import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import CommentItem from '../../../src/components/specific/CommentItem';

/**
 * Discussion detail screen. Displays the content of a single post and its
 * comments. Users can like/dislike the post and individual comments as well
 * as add new comments. All data here is local to demonstrate the UI – in a
 * real app you would fetch the post and comments from your backend.
 */
interface CommentType {
  id: string;
  author: string;
  content: string;
  likes: number;
  dislikes: number;
}

interface PostType {
  id: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  comments: CommentType[];
}

export default function DiscussionScreen() {
  const { discussionId } = useLocalSearchParams<{ discussionId: string }>();
  // Initialise with fake data for demonstration
  const [post, setPost] = useState<PostType>({
    id: discussionId || '0',
    title: 'Sample discussion',
    content:
      'This is a sample discussion post. It can contain multiple paragraphs of text and rich formatting when loaded from the server.',
    likes: 2,
    dislikes: 0,
    comments: [
      {
        id: 'c1',
        author: 'Alice',
        content: 'Thanks for sharing!',
        likes: 1,
        dislikes: 0,
      },
      {
        id: 'c2',
        author: 'Bob',
        content: 'Great insight, I have a question...',
        likes: 0,
        dislikes: 0,
      },
    ],
  });
  const [newComment, setNewComment] = useState('');

  const likePost = () => {
    setPost((prev) => ({ ...prev, likes: prev.likes + 1 }));
  };

  const dislikePost = () => {
    setPost((prev) => ({ ...prev, dislikes: prev.dislikes + 1 }));
  };

  const handleCommentLike = (commentId: string) => {
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      ),
    }));
  };

  const handleCommentDislike = (commentId: string) => {
    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === commentId ? { ...c, dislikes: c.dislikes + 1 } : c
      ),
    }));
  };

  const addComment = () => {
    const text = newComment.trim();
    if (!text) return;
    const newId = Date.now().toString();
    setPost((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        { id: newId, author: 'You', content: text, likes: 0, dislikes: 0 },
      ],
    }));
    setNewComment('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.content}>{post.content}</Text>
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.postAction} onPress={likePost}>
            <Ionicons name="thumbs-up-outline" size={22} color="#003096" />
            <Text style={styles.postActionText}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction} onPress={dislikePost}>
            <Ionicons name="thumbs-down-outline" size={22} color="#003096" />
            <Text style={styles.postActionText}>{post.dislikes}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.commentsHeader}>Comments</Text>
        {post.comments.map((comment) => (
          <CommentItem
            key={comment.id}
            author={comment.author}
            content={comment.content}
            likes={comment.likes}
            dislikes={comment.dislikes}
            onLike={() => handleCommentLike(comment.id)}
            onDislike={() => handleCommentDislike(comment.id)}
          />
        ))}
      </ScrollView>
      <View style={styles.addCommentContainer}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          style={styles.commentInput}
          placeholderTextColor="#888888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={addComment}>
          <Ionicons name="send" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003096',
    marginBottom: 8,
  },
  content: {
    color: '#333333',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  postActionText: {
    marginLeft: 4,
    color: '#003096',
    fontWeight: '600',
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003096',
    marginBottom: 8,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#C6C6C6',
    backgroundColor: '#ffffff',
  },
  commentInput: {
    flex: 1,
    borderColor: '#C6C6C6',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#003096',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#003096',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});