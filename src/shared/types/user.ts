export type UserRole = 'admin' | 'user';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  displayName?: string;
  profilePhoto?: string;
} 