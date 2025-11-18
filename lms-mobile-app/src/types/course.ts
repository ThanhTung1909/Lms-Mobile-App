import { Ionicons } from '@expo/vector-icons';

// Thêm type cho Benefit
export type CourseBenefit = {
    id: string;
    text: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
};

// Cập nhật type Course (Bổ sung các trường còn thiếu)
export type Course = {
    id: string;
    title: string;
    author: string; // Tên giảng viên
    authorAvatar?: string; // Avatar giảng viên
    authorRole?: string; // Chức danh (VD: UI/UX Designer)
    rating: number;
    students: number;
    lessons: number;
    image: string;
    price: number;
    originalPrice?: number; // Giá gốc (để tính % giảm giá)
    tag?: string;
    description?: string;
    benefits?: CourseBenefit[];
};
export type Category = {
    id: string;
    name: string;
    iconName: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
};


export type Teacher = {
    id: string;
    name: string;
    university: string;
    avatar: string;
};

