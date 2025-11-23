import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import CommentItem from "../../../src/components/specific/CommentItem";
import { Colors } from "@/src/constants/theme";
import {
  getPostDetail,
  createComment,
  toggleLikePost,
  PostDetail, 
} from "@/src/api/modules/socialApi";

export default function DiscussionScreen() {

  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);

  const fetchDetail = async () => {
    try {
      if (!id) return;
      const res = await getPostDetail(id);
      if (res.success) {
        setPost(res.data);
      }
    } catch (error) {
      console.log("Error loading discussion", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleLikePost = async () => {
    if (!post) return;
    const oldLiked = post.isLiked;

    setPost((prev) =>
      prev
        ? {
            ...prev,
            isLiked: !oldLiked,

            likeCount: (prev.likeCount || 0) + (!oldLiked ? 1 : -1),
          }
        : null,
    );

    try {
     
      await toggleLikePost(post._id);
    } catch (error) {
     
      setPost((prev) =>
        prev
          ? {
              ...prev,
              isLiked: oldLiked,
              likeCount: (prev.likeCount || 0) + (oldLiked ? 1 : -1),
            }
          : null,
      );
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !post) return;
    setSending(true);
    try {
      
      await createComment(post._id, newComment);
      setNewComment("");
      fetchDetail(); 
    } catch (error: any) {
      
      const msg = error.response?.data?.message || "Không thể gửi bình luận";
      Alert.alert("Lỗi", msg);
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.common.primary} />
      </View>
    );
  if (!post)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy bài viết</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Header Post */}
        <View style={styles.headerRow}>
          <Text style={styles.author}>
            {post.author?.fullName || post.user?.fullName || "Người dùng"}
          </Text>
          <Text style={styles.date}>
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </Text>
        </View>

        <Text style={styles.content}>{post.content}</Text>

        {/* Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.postAction} onPress={handleLikePost}>
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={22}
              color={post.isLiked ? "#E91E63" : "#003096"}
            />
            <Text
              style={[
                styles.postActionText,
                post.isLiked && { color: "#E91E63" },
              ]}
            >
              {post.likeCount || 0} Thích
            </Text>
          </TouchableOpacity>
          <View style={styles.postAction}>
            <Ionicons name="chatbubble-outline" size={22} color="#003096" />
            <Text style={styles.postActionText}>
              {post.comments?.length || 0} Bình luận
            </Text>
          </View>
        </View>

        <Text style={styles.commentsHeader}>Bình luận</Text>

        
        {post.comments?.length > 0 ? (
          post.comments.map((comment) => (
            <CommentItem
              
              key={comment._id}
              author={comment.user?.fullName || "Ẩn danh"}
              content={comment.content}
              likes={0}
              dislikes={0}
              onLike={() => {}}
              onDislike={() => {}}
              
              avatarUrl={comment.user?.avatarUrl || undefined}
              timestamp={comment.createdAt} 
            />
          ))
        ) : (
          <Text style={{ color: "#888", fontStyle: "italic" }}>
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </Text>
        )}

        
        <View style={{ height: 20 }} />
      </ScrollView>

    
      <View style={styles.addCommentContainer}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Viết bình luận..."
          style={styles.commentInput}
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendComment}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="send" size={20} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  author: { fontSize: 16, fontWeight: "700", color: Colors.common.primary },
  date: { fontSize: 12, color: "#888" },
  content: {
    color: "#333333",
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    paddingVertical: 10,
  },
  postAction: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  postActionText: { marginLeft: 4, color: "#003096", fontWeight: "600" },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003096",
    marginBottom: 15,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#C6C6C6",
    backgroundColor: "#f9f9f9",
  },
  commentInput: {
    flex: 1,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: "#333",
    marginRight: 8,
    backgroundColor: "#FFF",
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: Colors.common.primary,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
});
