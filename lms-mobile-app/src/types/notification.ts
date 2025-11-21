export type NotificationType =
  | "reminder"
  | "announcement"
  | "grade"
  | "message";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
