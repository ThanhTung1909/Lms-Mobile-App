import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Notification, NotificationType } from "@/src/types/notification";
import { dummyNotifications } from "@/src/assets/assets";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "reminder":
      return { name: "time-outline", color: "#FFC107" };
    case "announcement":
      return { name: "megaphone-outline", color: "#17A2B8" };
    case "grade":
      return { name: "school-outline", color: "#28A745" };
    case "message":
      return { name: "chatbubble-ellipses-outline", color: "#007BFF" };
    default:
      return { name: "notifications-outline", color: "#6C757D" };
  }
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<Notification[]>(dummyNotifications);

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.cardUnread]}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: icon.color }]}>
          <Ionicons name={icon.name as any} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <View style={styles.footer}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={80} color="#CED4DA" />
          <Text style={styles.emptyText}>Tuyệt vời!</Text>
          <Text style={styles.emptySubText}>
            Bạn không có thông báo mới nào.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
  },
  markAllButton: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardUnread: {
    backgroundColor: "#E7F3FF",
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343A40",
  },
  message: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 4,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  timestamp: {
    fontSize: 12,
    color: "#ADB5BD",
    fontWeight: "500",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007BFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#495057",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: "#ADB5BD",
    marginTop: 8,
    textAlign: "center",
  },
});
