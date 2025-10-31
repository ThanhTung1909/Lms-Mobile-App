
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/providers/AuthProvider';
import { Colors, Spacing } from '@/src/constants/theme';

type SettingOption = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string; 
  action?: () => void; 
  isDestructive?: boolean; 
};

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Hàm xử lý Logout
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const settingsOptions: SettingOption[] = [
    { title: 'Edit Profile', icon: 'person-outline', route: '/edit-profile' },
    { title: 'Payment Option', icon: 'card-outline', route: '/payment-options' },
    { title: 'Terms & Conditions', icon: 'document-text-outline', route: '/terms' },
    { title: 'Help Center', icon: 'help-buoy-outline', route: '/help' },
    { title: 'Invite Friends', icon: 'share-social-outline', route: '/invite' },
    { title: 'Logout', icon: 'log-out-outline', action: handleLogout, isDestructive: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.imageUrl || 'https://i.pravatar.cc/150?u=guest' }}
            style={styles.avatar}
          />
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                if (option.action) {
                  option.action();
                } else if (option.route) {
                  router.push(option.route as any);
                }
              }}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={option.isDestructive ? '#dc2626' : Colors.common.primary}
              />
              <Text style={[styles.menuText, option.isDestructive && { color: '#dc2626' }]}>
                {option.title}
              </Text>
              <Ionicons name="chevron-forward-outline" size={22} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  scrollContent: { padding: Spacing.medium },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: Spacing.medium,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.common.primary,
  },
  menuContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: Spacing.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.medium,
    backgroundColor: '#f3f4f6',
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.medium,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
});