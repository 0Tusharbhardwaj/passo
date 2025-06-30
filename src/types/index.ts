export interface PasswordEntry {
  id: string;
  website: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export type StorageMode = 'local' | 'cloud';