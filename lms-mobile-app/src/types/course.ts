import { Ionicons } from '@expo/vector-icons';

export type Course = {
    id: string;
    title: string;
    author: string;
    rating: number;
    students: number;
    lessons: number;
    image: string;
    tag?: string;
    price?: number;
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