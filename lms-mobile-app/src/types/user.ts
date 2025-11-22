export type UserRole = "educator" | "student";

export type User = {
  userId: string;
  _id?: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
};
