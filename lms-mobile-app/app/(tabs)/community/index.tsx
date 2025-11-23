import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "../../../src/components/specific/PostCard";
import { Colors } from "@/src/constants/theme";

// API
import {
  getPosts,
  toggleLikePost,
  PostItem,
} from "@/src/api/modules/socialApi";

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Data
  const fetchPostsData = async () => {
    try {
      const res = await getPosts();
      if (res.success) {
        setPosts(res.data);
      }
    } catch (error) {
      console.log("Error fetching posts", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPostsData();
  };

 
  const handleLike = async (postId: string) => {
    
    setPosts((prev) =>
      prev.map((post) => {
       
        if (post._id === postId) {
          const newLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newLiked,
           
            likesCount: post.likesCount + (newLiked ? 1 : -1),
          };
        }
        return post;
      }),
    );

    try {
      await toggleLikePost(postId);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể like bài viết này");
      fetchPostsData(); // Revert lại dữ liệu nếu lỗi
    }
  };

  if (loading && !refreshing) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.common.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard
            title={
              item.author?.fullName ||
              item.user?.fullName ||
              "Người dùng ẩn danh"
            }
            excerpt={item.content}
            likes={item.likesCount} 
            dislikes={0}
            commentsCount={item.commentsCount} 
            onPress={() =>
              router.push({
                pathname: "/community/[id]",
                
                params: { id: item._id },
              })
            }
        
            onLike={() => handleLike(item._id)}
            onDislike={() => {}}
            isLiked={item.isLiked}
            avatarUrl={item.author?.avatarUrl || item.user?.avatarUrl}
            timestamp={item.createdAt}
          />
        )}

        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<ActivityIndicator size="small" color="#999" />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/community/create-post")}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: Colors.common.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
