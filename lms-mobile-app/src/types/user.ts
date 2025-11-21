
export type UserRole = "educator" | "student";

export type User = {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: UserRole;
};