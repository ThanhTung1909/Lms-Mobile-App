# 🚀 LMS Mobile App - Learning Management System
![link_figma] = https://www.figma.com/design/023mHor8vTvbHqxRfnokAi/LMS--Learning-Management-System--Mobile-Application--Community-?node-id=303-2&p=f&t=Ih3vVJupGyuwMny7-0

![link_repository] = https://github.com/ThanhTung1909/Lms-Mobile-App.git

## 📚 Giới thiệu

Đây là ứng dụng di động quản lý học tập (LMS) được xây dựng để cung cấp một nền tảng toàn diện cho cả học viên và giảng viên. Ứng dụng cho phép người dùng truy cập các khóa học, tài liệu, bài kiểm tra, và tương tác trong một môi trường cộng đồng năng động.

Dự án được phát triển với mục tiêu tạo ra trải nghiệm học tập di động mượt mà, trực quan và hiệu quả.

## ✨ Tính năng chính

*   **Xác thực người dùng:** Đăng ký, Đăng nhập, Quên mật khẩu.
*   **Quản lý hồ sơ:** Xem và chỉnh sửa thông tin cá nhân.
*   **Trang chủ (Dashboard):** Tổng quan các khóa học đang theo dõi, khóa học nổi bật.
*   **Danh sách khóa học:** Duyệt, tìm kiếm và lọc các khóa học.
*   **Chi tiết khóa học:** Mô tả, nội dung bài học, thông tin giảng viên, đánh giá.
*   **Trình xem nội dung:** Hỗ trợ nhiều định dạng bài học (video, văn bản, PDF).
*   **Diễn đàn cộng đồng:** Thảo luận, tạo bài viết, bình luận và tương tác.
*   **Thông báo:** Cập nhật về khóa học, hoạt động cộng đồng.
*   **Tiến độ học tập:** Theo dõi quá trình học và thành tích.
*   **Cài đặt:** Tùy chỉnh ứng dụng.

## 🛠️ Công nghệ sử dụng

*   **Framework:** React Native
*   **Runtime:** Expo
*   **Ngôn ngữ:** TypeScript
*   **Navigation:** React Navigation
*   **State Management:** Redux Toolkit / React Context API (sẽ xác định rõ hơn trong quá trình phát triển)
*   **Validation:** Yup
*   **Styling:** React Native `StyleSheet` (hoặc thư viện UI như NativeBase/UI Kitten nếu cần)
*   **Code Quality:** ESLint, Prettier

## 🚀 Khởi động dự án

Để chạy ứng dụng trên máy local của bạn, hãy làm theo các bước sau:

### 1. Yêu cầu hệ thống

Đảm bảo bạn đã cài đặt:
*   Node.js (phiên bản khuyến nghị LTS)
*   npm hoặc Yarn
*   Expo CLI (`npm install -g expo-cli`)
*   Thiết bị Android/iOS hoặc trình giả lập/mô phỏng.

### 2. Cài đặt

1.  Clone repository:
    ```bash
    git clone [URL_CỦA_REPOSITORY]
    cd lms-mobile-app
    ```
2.  Cài đặt các dependency:
    ```bash
    npm install
    # hoặc
    yarn install
    ```

### 3. Chạy ứng dụng

1.  Khởi động Expo development server:
    ```bash
    npx expo start
    # hoặc
    yarn start
    ```
2.  Mở ứng dụng Expo Go trên điện thoại của bạn và quét mã QR, hoặc chạy trên trình giả lập/mô phỏng:
    *   Nhấn `a` để chạy trên Android emulator/device.
    *   Nhấn `i` để chạy trên iOS simulator/device (chỉ trên macOS).
    *   Nhấn `w` để mở trong trình duyệt web (ít được dùng cho mobile app).

## 📂 Cấu trúc thư mục
lms-mobile-app/
├── .expo/
├── .vscode/

├── scripts/
│   ├── reset-project.js
│   └── generate-assets.js
│
├── src/
│   ├── api/
│   │   ├── apiClient.ts
│   │   ├── modules/
│   │   │   ├── authApi.ts
│   │   │   ├── courseApi.ts
│   │   │   ├── communityApi.ts
│   │   │   └── userApi.ts
│   │   └── index.ts
│
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│
│   ├── components/
│   │   ├── common/              # Button, Input, Card, TextField, Loader,...
│   │   ├── layout/              # Header, Footer, TabBar, ScreenWrapper,...
│   │   └── specific/            # Component riêng từng module
│
│   ├── constants/
│   │   ├── api.ts
│   │   ├── colors.ts
│   │   ├── messages.ts
│   │   ├── routes.ts
│   │   └── index.ts
│
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useFetch.ts
│   │   └── index.ts
│
│   ├── services/
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   ├── communityService.ts
│   │   ├── userService.ts
│   │   └── index.ts
│
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── courseSlice.ts
│   │   │   ├── communitySlice.ts
│   │   │   └── userSlice.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│
│   ├── types/
│   │   ├── auth.ts
│   │   ├── course.ts
│   │   ├── community.ts
│   │   ├── user.ts
│   │   └── index.ts
│
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   ├── storage.ts
│   │   └── index.ts
│
│   └── providers/
│       ├── AppProvider.tsx      # Gắn Redux, Theme, AuthContext
│       └── AuthProvider.tsx
│
├── app/
│   ├── _layout.tsx              # Root layout - gắn AppProvider
│
│   ├── index.tsx                # Redirect: nếu login → (tabs)/, chưa login → (onboarding)/
│
│   ├── (onboarding)/            # Onboarding Flow
│   │   ├── _layout.tsx
│   │   ├── splash.tsx
│   │   ├── onboarding1.tsx
│   │   ├── onboarding2.tsx
│   │   └── onboarding3.tsx
│
│   ├── (auth)/                  # Authentication Flow
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│
│   ├── (tabs)/                  # Main Flow (Bottom Tabs)
│   │   ├── _layout.tsx
│   │   ├── home/
│   │   │   └── index.tsx
│   │   ├── courses/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   ├── enroll.tsx
│   │   │   └── lesson/[lessonId].tsx
│   │   ├── community/
│   │   │   ├── index.tsx
│   │   │   ├── [discussionId].tsx
│   │   │   └── create-post.tsx
│   │   ├── my-learning/
│   │   │   ├── index.tsx
│   │   │   └── [lessonId].tsx
│   │   └── profile/
│   │       ├── index.tsx
│   │       ├── edit.tsx
│   │       ├── settings.tsx
│   │       └── notifications.tsx
│
│   └── (modals)/                # Optional: Modal routes
│       ├── help.tsx
│       ├── faq.tsx
│       └── about.tsx
│
├── .gitignore
├── .prettierrc.js
├── eslint.config.js
├── tsconfig.json
├── app.json
├── package.json
└── README.md

## 🤝 Thực hiện

1.  Clone repository này.
2.  Lấy nhánh về máy (`git fetch --all`)
3.  Kiểm tra danh sách nhánh (`git branch -r`)
3.  Checkout đúng nhánh của mình (`git checkout <tên-nhánh>`)
4.  Làm việc → commit → push trên đúng nhánh (`git push origin <tên-nhánh>`).

**Quy tắc đặt tên commit (Conventional Commits):**
*   `feat:` Thêm một tính năng mới.
*   `fix:` Sửa một lỗi.
*   `docs:` Thay đổi tài liệu.
*   `style:` Thay đổi định dạng code (không ảnh hưởng đến logic).
*   `refactor:` Tái cấu trúc code (không sửa lỗi hay thêm tính năng).
*   `test:` Thêm hoặc sửa test.
*   `chore:` Thay đổi liên quan đến build process hoặc tool phụ trợ.

## 👥 Thành viên nhóm

*   **Thành viên 1:** [Tung] - Phụ trách Authentication & Profile Module.
**Các Screen Chính:**
- Splash Screen:
- Onboarding Screens (3 màn hình):
- Login Screen:
- Sign Up Screen:
- Forgot Password Screen:
- Profile Screen (User/Student View):
- Edit Profile Screen:
- Settings Screen:
**Yêu cầu chi tiết:**
- Tích hợp Formik/React Hook Form và Yup để quản lý form và validation.
- Xử lý logic đăng nhập, đăng ký, quên mật khẩu (gọi API).
- Quản lý trạng thái người dùng (authentication token, user info) bằng Redux Toolkit hoặc Context API.
- Xây dựng giao diện Profile và Edit Profile theo Figma.
- Thiết lập màn hình Settings (chẳng hạn như đổi ngôn ngữ, thông báo).
- Tích hợp xác thực mạng xã hội (tùy chọn, nếu có trong yêu cầu API).

*   **Thành viên 2:** [Tien] - Phụ trách Courses & Content Module.
**Các Screen Chính:**
- Home Screen (Dashboard):
- Course Listing Screen (All Courses):
- Course Details Screen:
- Lesson/Content View Screen:
- Search Screen:
- Categories Screen:
**Yêu cầu chi tiết:**
- Xây dựng giao diện Home Screen với các phần như "Popular Courses", "My Courses", "Categories", v.v.
- Hiển thị danh sách khóa học (Course Listing) với các bộ lọc và sắp xếp.
- Xây dựng giao diện chi tiết khóa học (Course Details) bao gồm mô tả, syllabus, giảng viên, đánh giá.
- Triển khai màn hình xem nội dung bài học (video, text, PDF viewer).
- Phát triển chức năng tìm kiếm khóa học.
- Xử lý tương tác người dùng như đăng ký khóa học, đánh dấu đã hoàn thành.
*   **Thành viên 3:** [Nguyen] - Phụ trách Community & Notifications Module.
**Các Screen Chính:**
- Discussions/Community Forum Screen:
- Discussion Details Screen (Post/Comment View):
- Create New Post Screen:
- Notifications Screen:
- My Learning (Progress & Achievements):
- Help/FAQ Screen:
**Yêu cầu chi tiết:**
- Xây dựng giao diện diễn đàn thảo luận, cho phép người dùng tạo bài viết và bình luận.
- Tích hợp rich text editor cho việc tạo bài viết (nếu được).
- Phát triển màn hình thông báo, hiển thị các thông báo mới từ hệ thống hoặc khóa học.
- Hiển thị tiến độ học tập và thành tích của người dùng (My Learning).
- Thiết lập màn hình Help/FAQ.
- Xử lý các tương tác như thích/không thích bài viết, trả lời bình luận.

**Các Flow Screen Chính:**
1. Onboarding & Authentication Flow:
+ Splash Screen -> Onboarding Screens (3) -> Login/Sign Up Screen -> Home Screen (nếu đăng nhập thành công).
+ Forgot Password -> (API gửi OTP/link reset) -> Reset Password.
2. Main Navigation Flow:
+ Bottom Tab Navigator: Home | Courses | Community | My Learning | Profile.
+ Course Enrollment & Learning Flow:
+ Home -> Course Details -> Enroll/Start Course -> Lesson View (video/text/quiz).
+ Courses -> Filter/Search -> Course Details.
3. Community Interaction Flow:
+ Community (Discussions) -> View Discussion Details -> Add Comment/Reply.
+ Community -> Create New Post.
+ Profile & Settings Flow:
+ Profile -> Edit Profile.
+ Profile -> Settings -> (Language, Notifications, Logout).