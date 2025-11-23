import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export interface CommentItemProps {
  author: string;
  content: string;
  likes: number;
  dislikes: number;
  avatarUrl?: string | null; 
  timestamp?: string;
  
  onLike?: () => void;
  onDislike?: () => void;
  onReply?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  author,
  content,
  likes,
  dislikes,
  avatarUrl, 
  timestamp, 
  onLike,
  onDislike,
  onReply,
}) => {

  const displayTime = timestamp 
    ? new Date(timestamp).toLocaleDateString("vi-VN", { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    : "";

  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
     
        <Image 
          source={{ uri: avatarUrl || "https://i.pravatar.cc/150?img=3" }} 
          style={styles.avatar} 
        />
        
        <View style={styles.headerText}>
          <Text style={styles.author}>{author}</Text>
          {displayTime ? <Text style={styles.timestamp}>{displayTime}</Text> : null}
        </View>
      </View>

      <Text style={styles.content}>{content}</Text>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={onLike}>
          <Ionicons name="thumbs-up-outline" size={16} color="#003096" />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.action} onPress={onDislike}>
          <Ionicons name="thumbs-down-outline" size={16} color="#003096" />
          <Text style={styles.actionText}>{dislikes}</Text>
        </TouchableOpacity>

        {onReply && (
          <TouchableOpacity style={styles.replyButton} onPress={onReply}>
            <Ionicons name="arrow-undo-outline" size={16} color="#003096" />
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: "#F0F2F5",
    marginVertical: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#E0E0E0",
  },
  headerText: {
    justifyContent: "center",
  },
  author: {
    fontWeight: "700",
    color: "#003096",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 11,
    color: "#888888",
    marginTop: 2,
  },
  content: {
    color: "#333333",
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 42, 
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 42,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 12,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  replyText: {
    marginLeft: 4,
    color: "#003096",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default CommentItem;