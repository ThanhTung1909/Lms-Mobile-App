export type UserRole = "educator" | "student";

export type User = {
  _id: string;
  fullname: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
};
