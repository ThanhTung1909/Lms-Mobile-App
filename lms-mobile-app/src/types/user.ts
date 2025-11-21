export type UserRole = "educator" | "student";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
};
