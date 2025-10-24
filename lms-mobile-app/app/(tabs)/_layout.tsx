import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2b6cb0",
        tabBarStyle: {
          paddingBottom: 6,
          height: 60,
        },
        detachInactiveScreens={false},
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="courses/index"
        options={{
          title: "Courses",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "book" : "book-outline"} size={24} />
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
            />
          ),
        }}
      />

      <Tabs.Screen
        name="my-learning/index"
        options={{
          title: "My Learning",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "school" : "school-outline"} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
