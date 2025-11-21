import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasOnboarded";

const slides = [
  {
    id: "1",
    image: require("../../src/assets/images/onboarding1.png"),
    title: "Welcome to Cybex IT Group\nwhere learning meets innovation!",
    description:
      "Empowering your journey through\ncutting-edge IT education and expertise",
  },
  {
    id: "2",
    image: require("../../src/assets/images/onboarding2.png"),
    title: "Begin your learning journey\nand unlock a world of knowledge",
    description:
      "Explore our comprehensive courses\ndesigned to transform your skills and career",
  },
  {
    id: "3",
    image: require("../../src/assets/images/onboarding3.png"),
    title: "Dive into a seamless learning\nexperience with Cybex IT Group",
    description:
      "Experience interactive learning with\nexpert-led courses and progress tracking",
  },
  {
    id: "4",
    image: require("../../src/assets/images/onboarding4.png"),
    title: "Join a community of learners\nand embark on a learning adventure",
    description:
      "Connect with like-minded individuals\nJoin us to learn, grow, and thrive together!",
  },
  {
    id: "5",
    image: require("../../src/assets/images/onboarding5.png"),
    title: "Join Cybex IT Group to Kick Start\nYour Lesson",
    description: "Join and Learn from our Top Instructors!",
    last: true,
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const { completeOnboarding } = useAuth();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCompleteOnboarding = async (route: string) => {
    await completeOnboarding();
    router.replace(route as any);
  };

  // Khi người dùng scroll bằng tay
  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  // Khi bấm CONTINUE
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleCompleteOnboarding("/(auth)/login");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* SKIP Button */}
      <TouchableOpacity
        onPress={() => handleCompleteOnboarding("/(auth)/login")}
        style={{ alignSelf: "flex-end", margin: 16 }}
      >
        <Text style={{ color: "#999", fontWeight: "600" }}>SKIP</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <Image
              source={item.image}
              style={{
                width: 280,
                height: 280,
                resizeMode: "contain",
                marginVertical: 20,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                textAlign: "center",
                color: "#001f54",
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#555",
                marginTop: 8,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {item.description}
            </Text>
          </View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={32}
        onMomentumScrollEnd={handleScrollEnd}
      />

      {/* Pagination Dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 20,
        }}
      >
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={{
                width: dotWidth,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#001f54",
                marginHorizontal: 4,
                opacity,
              }}
            />
          );
        })}
      </View>

      {/* Buttons */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        {slides[currentIndex]?.last ? (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* 5. Cập nhật các nút cuối cùng để gọi hàm hoàn thành */}
            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#001f54",
                borderRadius: 8,
                paddingVertical: 14,
              }}
              onPress={() => handleCompleteOnboarding("/(auth)/login")}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#001f54",
                  fontWeight: "600",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#001f54",
                borderRadius: 8,
                paddingVertical: 14,
              }}
              onPress={() => handleCompleteOnboarding("/(auth)/signup")}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "#001f54",
              borderRadius: 8,
              paddingVertical: 14,
            }}
            onPress={handleNext}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontWeight: "600",
              }}
            >
              CONTINUE
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
