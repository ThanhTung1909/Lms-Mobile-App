import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
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
    <View style={styles.container}>
      {/* Rich text editor */}
      <RichEditor
        ref={richText}
        onChange={setContent}
        placeholder="Bạn đang nghĩ gì thế?..."
        androidLayerType="software"
        style={styles.richEditor}
        initialHeight={300}
        editorStyle={{
          backgroundColor: "#fff",
          placeholderColor: "#888",
          contentCSSText: "font-size: 16px; min-height: 200px;",
        }}
      />

      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.keyboard,
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
  richEditor: {
    borderColor: "#C6C6C6",
    borderWidth: 1,
    borderRadius: 6,
    flex: 1,
  },
  richToolbar: {
    backgroundColor: "#f5f5f5",
    borderColor: "#C6C6C6",
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: Colors.common.primary,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
