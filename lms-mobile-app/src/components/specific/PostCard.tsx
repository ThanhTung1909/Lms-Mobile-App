import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/theme";

export interface PostCardProps {
  title: string;
  excerpt: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  onPress?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  avatarUrl?: string | null;
  timestamp?: string;
  isLiked?: boolean;
}

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
};

const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  likes,
  commentsCount,
  onPress,
  onLike,
  avatarUrl,
  timestamp,
  isLiked = false,
}) => {
  const dateDisplay = timestamp
    ? new Date(timestamp).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <Image
          source={{ uri: avatarUrl || "https://i.pravatar.cc/150?img=3" }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>{title}</Text>
          {dateDisplay ? (
            <Text style={styles.timestamp}>{dateDisplay}</Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.excerpt} numberOfLines={3}>
        {stripHtml(excerpt)}
      </Text>

      <View style={styles.footer}>
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.action} onPress={onLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? "#E91E63" : "#666"}
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {likes}
            </Text>
          </TouchableOpacity>

          <View style={styles.action}>
            <Ionicons name="chatbubble-outline" size={20} color="#666" />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F2F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E1E1E1",
  },
  headerText: {
    marginLeft: 10,
    justifyContent: "center",
  },
  authorName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  excerpt: {
    color: "#444",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionGroup: {
    flexDirection: "row",
    gap: 20,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    marginLeft: 6,
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  likedText: {
    color: "#E91E63",
    fontWeight: "600",
  },
});

export default PostCard;
