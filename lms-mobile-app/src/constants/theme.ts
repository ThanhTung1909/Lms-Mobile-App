/**
 * Đây là file định nghĩa các hằng số cho design system của ứng dụng,
 * bao gồm Màu sắc (hỗ trợ light/dark mode), Font chữ và Spacing.
 */

import { Platform } from 'react-native';

// --- Định nghĩa các màu sắc cốt lõi của thương hiệu ---
const brandPrimary = '#2563eb'; // Màu xanh dương chủ đạo
const brandSuccess = '#22c55e'; // Màu xanh lá cho các trạng thái thành công

/**
 * Bảng màu của ứng dụng, được chia theo chế độ light và dark.
 * Để sử dụng trong component, bạn có thể dùng hook `useColorScheme` để lấy đúng bộ màu.
 */
export const Colors = {
  light: {
    text: '#11181C',          // Màu chữ chính
    textSecondary: '#64748b', // Màu chữ phụ, mờ hơn
    background: '#fff',       // Màu nền chính
    tint: brandPrimary,       // Màu nhấn cho các thành phần tương tác (button, link)
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: brandPrimary,
    borderColor: '#e5e7eb',   // Màu cho đường viền, dải phân cách
    lightGray: '#f1f5f9',     // Màu nền cho các container, card, input
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    tint: '#fff',             // Trong dark mode, màu trắng thường là màu nhấn
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    borderColor: '#272A2B',
    lightGray: '#1E2021',     // Một màu nền tối nhưng sáng hơn background chính
  },
  // Các màu dùng chung, không thay đổi theo theme
  common: {
      primary: brandPrimary,
      success: brandSuccess,
      white: '#FFFFFF',
  }
};

/**
 * Định nghĩa các kiểu font chữ cơ bản cho các nền tảng khác nhau.
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * Định nghĩa các giá trị khoảng trắng (padding, margin) để đảm bảo tính nhất quán.
 */
export const Spacing = {
    small: 8,
    medium: 16,
    large: 24,
};