import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { Colors } from "@/src/constants/theme";
import { createPost } from "@/src/api/modules/socialApi";

export default function CreatePostScreen() {
  const router = useRouter();
  const richText = useRef<RichEditor | null>(null);

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.replace(/<[^>]*>?/gm, "").trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bài viết.");
      return;
    }

    setSubmitting(true);
    try {
      await createPost(content);
      Alert.alert("Thành công", "Đăng bài viết thành công!");
      router.back();
    } catch (error) {
      Alert.alert("Thất bại", "Không thể đăng bài viết lúc này.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        // keyboardVerticalOffset giúp tránh bị header che mất (điều chỉnh số này nếu cần)
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        {/* Editor chiếm phần lớn không gian và tự co lại khi bàn phím hiện */}
        <RichEditor
          ref={richText}
          onChange={setContent}
          placeholder="Bạn đang nghĩ gì thế?..."
          androidLayerType="software"
          style={styles.richEditor}
          initialHeight={300} // Có thể bỏ hoặc giữ, vì flex: 1 sẽ ghi đè
          editorStyle={{
            backgroundColor: "#fff",
            placeholderColor: "#888",
            contentCSSText: "font-size: 16px; min-height: 200px;",
          }}
        />

        {/* Toolbar và Nút bấm đặt trong View ở dưới cùng */}
        <View style={styles.bottomContainer}>
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.keyboard, // Nút ẩn bàn phím rất quan trọng
            ]}
            iconTint={Colors.common.primary}
            selectedIconTint={Colors.common.primary}
            style={styles.richToolbar}
          />

          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>Đăng bài</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  richEditor: {
    flex: 1, // Quan trọng: Để editor chiếm hết khoảng trống còn lại
    borderColor: "#C6C6C6",
    borderWidth: 1,
    borderRadius: 6,
  },
  bottomContainer: {
    // Container chứa Toolbar và Nút submit
    marginTop: 8,
  },
  richToolbar: {
    backgroundColor: "#f5f5f5",
    borderColor: "#C6C6C6",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: Colors.common.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 5, // Một chút margin đáy
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
