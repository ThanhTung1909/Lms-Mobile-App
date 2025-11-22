
export type UserBasic = {
  userId: string;
  fullName: string;
  email?: string;
  avatarUrl?: string; 
};


export type Category = {
  categoryId: string;
  name: string;
};

export type Lecture = {
  lectureId: string;
  title: string;
  videoUrl: string;
  orderIndex: number;
  duration?: number;       
  lectureType?: 'video' | 'quiz' | 'text'; 
  content?: string | null; 
  isPreviewFree?: boolean;
};

export type Chapter = {
  chapterId: string;
  title: string;
  orderIndex: number;
  lectures: Lecture[];
};

export type Rating = {
  ratingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: UserBasic; 
};

export type Student = {
  userId: string;
};

export type Course = {
  courseId: string;
  title: string;
  description: string; 
  price: string;       
  discount: string;    
  thumbnailUrl: string;
  status: string;      
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  
  creator: UserBasic;
  categories: Category[];
  chapters: Chapter[];
  ratings: Rating[];

  students?: Student[];      
  avgRating?: string | number; 
  totalRatings?: number;     
  studentCount?: number;     
};