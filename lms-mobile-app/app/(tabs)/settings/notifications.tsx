import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/src/constants/theme";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationAsRead,
  NotificationItem,
} from "@/src/api/modules/notificationApi";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotifications(updatedNotifications);

    try {
      await markAllNotificationsRead();
    } catch (error) {
      console.log("Error marking all read", error);

      fetchNotifications();
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const handlePressNotification = async (item: NotificationItem) => {
    if (!item.isRead) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === item._id ? { ...notif, isRead: true } : notif,
        ),
      );

      markNotificationAsRead(item._id).catch((err) => {
        console.log("Failed to mark read:", err);
      });
    }

    if (item.type === "AI_INSIGHT") {
      router.push("/(tabs)/home");
    } else if (
      (item.type === "LIKE" || item.type === "COMMENT") &&
      item.metadata?.postId
    ) {
      router.push({
        pathname: "/community/[id]",
        params: { id: item.metadata.postId },
      });
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "AI_INSIGHT":
        return {
          icon: "sparkles",
          bgColor: "#F3E5F5",
          iconColor: "#9C27B0",
        };
      case "LIKE":
        return {
          icon: "heart",
          bgColor: "#FCE4EC",
          iconColor: "#E91E63",
        };
      case "COMMENT":
        return {
          icon: "chatbubble",
          bgColor: "#E3F2FD",
          iconColor: "#2196F3",
        };
      case "SYSTEM":
      default:
        return {
          icon: "notifications",
          bgColor: "#F8F9FA",
          iconColor: "#6C757D",
        };
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const style = getNotificationStyle(item.type);

    const timeString = new Date(item.createdAt).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "numeric",
    });

    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.cardUnread]}
        activeOpacity={0.7}
        onPress={() => handlePressNotification(item)}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: style.bgColor }]}
        >
          <Ionicons
            name={style.icon as any}
            size={24}
            color={style.iconColor}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.timestamp}>{timeString}</Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.common.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={styles.markAllButton}>Đánh dấu tất cả đã đọc</Text>
        </TouchableOpacity>
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={80}
            color="#CED4DA"
          />
          <Text style={styles.emptyText}>Trống trơn!</Text>
          <Text style={styles.emptySubText}>
            Bạn chưa có thông báo nào mới.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
  },
  markAllButton: {
    fontSize: 14,
    color: Colors.common.primary,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  cardUnread: {
    backgroundColor: "#F0F8FF",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#ADB5BD",
    fontWeight: "500",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.common.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: -50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#495057",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 15,
    color: "#ADB5BD",
    marginTop: 8,
    textAlign: "center",
  },
});
