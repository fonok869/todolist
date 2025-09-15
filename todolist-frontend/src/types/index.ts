export interface TodoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  ranking: number;
  dateCreated: Date;
  auditDateCreated: Date;
  auditDateModified: Date;
  done: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  id: string;
  username: string;
  email: string;
}

export type Theme = 'light' | 'dark';