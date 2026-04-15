import { Role } from "@prisma/client";

export interface AuthPayload {
  userId: number;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: Role;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
