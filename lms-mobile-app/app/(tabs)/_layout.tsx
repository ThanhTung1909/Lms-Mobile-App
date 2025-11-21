import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/src/providers/AuthProvider";

function CustomHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [pathname]);

  const getHeaderContent = () => {
    if (pathname.includes("/courses")) {
      return {
        title: "Your Courses 📚",
        subtitle: "Continue where you left off",
      };
    }
    if (pathname.includes("/community")) {
      return { title: "Community 💬", subtitle: "Connect & share ideas" };
    }
    if (pathname.includes("/my-learning")) {
      return { title: "My Learning 🎓", subtitle: "Keep up your progress" };
    }
    if (pathname.includes("/settings")) {
      return {
        title: user?.fullName || "Settings",
        subtitle: "Manage your account",
      };
    }

    return {
      title: user?.fullName ? `Hi, ${user.fullName} 👋` : "Hi there 👋",
      subtitle: "Ready to learn something new?",
    };
  };

  const { title, subtitle } = getHeaderContent();

  const renderAvatar = () => {
    if (user?.avatarUrl) {
      return <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />;
    }

    const initial = user?.fullName
      ? user.fullName.charAt(0).toUpperCase()
      : "U";

    return (
      <View style={[styles.avatar, styles.avatarFallback]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#e3f2fd", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.headerContainer}
    >
      <Animated.View
        style={[
          styles.headerContent,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [5, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => router.push("/settings/notifications")}
            style={styles.iconBtn}
          >
            <Ionicons name="notifications-outline" size={22} color="#1e3a8a" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(tabs)/settings")}>
            {renderAvatar()}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />,
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarStyle: {
          height: Platform.OS === "android" ? 70 : 90,
          paddingBottom: Platform.OS === "android" ? 10 : 30,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          backgroundColor: "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={focused ? "#1e40af" : "#64748b"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courses/index"
        options={{
          title: "Courses",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={24}
              color={focused ? "#1e40af" : "#64748b"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community/index"
        options={{
          title: "Community",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={24}
              color={focused ? "#1e40af" : "#64748b"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-learning/index"
        options={{
          title: "My Learning",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "school" : "school-outline"}
              size={24}
              color={focused ? "#1e40af" : "#64748b"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={focused ? "#1e40af" : "#64748b"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="courses/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="courses/enroll/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="my-learning/lesson/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="community/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="community/create-post"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="settings/notifications"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#475569",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarFallback: {
    backgroundColor: "#e0e7ff",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e3a8a",
  },
});
