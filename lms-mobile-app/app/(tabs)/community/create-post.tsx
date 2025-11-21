import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

/**
 * Screen that lets users compose a new discussion post. A rich text editor is
 * provided via react-native-pell-rich-editor which wraps a web based editor
 * component. See documentation for examples on how to customise the editor
 * behaviour and actions【677848043953150†L255-L263】. The toolbar provides basic
 * formatting options such as bold, italic and lists【677848043953150†L275-L296】.
 */
export default function CreatePostScreen() {
  const router = useRouter();
  const richText = useRef<RichEditor | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    // Simple validation before submitting
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Please enter both title and content.');
      return;
    }
    // Here you would normally send the post to your API or update global state.
    // We simply navigate back to the previous screen after submission.
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Post title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
        placeholderTextColor="#888888"
      />
      {/* Rich text editor for composing the post content */}
      <RichEditor
        ref={richText}
        onChange={setContent}
        placeholder="Write your post..."
        // Disable hardware acceleration on Android as recommended by the docs【677848043953150†L255-L263】.
        androidHardwareAccelerationDisabled={true}
        style={styles.richEditor}
        initialHeight={250}
      />
      <RichToolbar
        editor={richText}
        // Choose a subset of actions to keep the toolbar concise
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
        ]}
        iconTint="#003096"
        selectedIconTint="#003096"
        style={styles.richToolbar}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Publish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 16 },
  titleInput: {
    borderColor: '#C6C6C6',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    color: '#003096',
  },
  richEditor: {
    borderColor: '#C6C6C6',
    borderWidth: 1,
    borderRadius: 6,
    minHeight: 200,
  },
  richToolbar: {
    backgroundColor: '#ffffff',
    borderColor: '#C6C6C6',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#003096',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});