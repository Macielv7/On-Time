// services/auth.service.ts
import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'entrepreneur';
  avatar_url?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data.data;
  },

  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'client' | 'entrepreneur'
  ): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/register', {
      name,
      email,
      phone,
      password,
      role,
    });
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/api/auth/me');
    return data.data;
  },
};
