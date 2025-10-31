import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PostCard from '../../../src/components/specific/PostCard';

interface Comment {
  id: string;
  author: string;
  content: string;
  likes: number;
  dislikes: number;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

// Sample data used to populate the community feed. In a real application
// this would be replaced with data fetched from an API or stored in Redux.
const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to the community!',
    excerpt: 'Introduce yourself and meet other learners.',
    likes: 5,
    dislikes: 0,
    comments: [],
  },
  {
    id: '2',
    title: 'React Native tips & tricks',
    excerpt: 'Share your favourite tips for building apps with React Native.',
    likes: 3,
    dislikes: 1,
    comments: [],
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard
            title={item.title}
            excerpt={item.excerpt}
            likes={item.likes}
            dislikes={item.dislikes}
            commentsCount={item.comments.length}
            onPress={() => router.push(`/community/${item.id}`)}
            onLike={() => handleLike(item.id)}
            onDislike={() => handleDislike(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/community/create-post')}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#003096',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});