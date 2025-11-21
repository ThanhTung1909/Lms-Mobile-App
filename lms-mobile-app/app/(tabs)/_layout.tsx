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

  const router = useRouter()
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
    switch (true) {
      case pathname.includes("courses"):
        return {
          title: "Your Courses 📚",
          subtitle: "Continue where you left off",
        };
      case pathname.includes("community"):
        return { title: "Community 💬", subtitle: "Connect & share ideas" };
      case pathname.includes("my-learning"):
        return { title: "My Learning 🎓", subtitle: "Keep up your progress" };
      case pathname.includes("settings"):
        return {
          title: user?.fullname || "Setting",
          subtitle: "Manage your account",
        };
      default:
        return {
          title: user ? `Hi, ${user.fullname} 👋` : "Hi there 👋",
          subtitle: "Ready to learn something new?",
        };
    }
  };

  const { title, subtitle } = getHeaderContent();

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
          onPress={() => 
              router.push("/settings/notifications") 
            }
          style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color="#1e3a8a" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{
                uri: user?.avatarUrl || "https://i.pravatar.cc/150?img=12",
              }}
              style={styles.avatar}
            />
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
          height: Platform.OS === "android" ? 100 : 100,
          paddingBottom: Platform.OS === "android" ? 10 : 30,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 5,
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
          title: "Setting",
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
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="courses/enroll/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="my-learning/lesson/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="community/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="community/create-post"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings/notifications"
        options={{
          href: null,
          headerShown: false,
        }}
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
  },
});
