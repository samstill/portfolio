export type UserRole = 'user' | 'admin';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
} 