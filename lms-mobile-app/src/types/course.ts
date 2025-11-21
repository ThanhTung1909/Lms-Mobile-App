
export type Lecture = {
  lectureId: string;
  lectureTitle: string;
  lectureDuration: number;
  lectureUrl: string;
  isPreviewFree: boolean;
  lectureOrder: number;
};

export type Chapter = {
  chapterId: string;
  chapterOrder: number;
  chapterTitle: string;
  chapterContent: Lecture[];
};


export type Rating = {
  userId: string;
  rating: number;
  _id: string;
};

export type Course = {
  _id: string;
  courseTitle: string;
  courseThumbnail: string;
  courseDescription: string;
  coursePrice: number;
  isPublished: boolean;
  discount?: number;
  educator: string; 
  enrolledStudents?: string[]; 
  courseContent: Chapter[];
  courseRatings?: Rating[];
  createdAt: string; 
  updatedAt: string; 
  __v?: number;
};