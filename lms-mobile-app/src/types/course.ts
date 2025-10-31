export type Course = {
  _id: string;
  courseTitle: string;
  courseThumbnail: string;
  coursePrice: number;
  educatorName?: string;
  discount?: number;
  enrolledStudents?: string[];
  courseRatings?: { rating: number }[];
};
