// services/professionals.service.ts
import api from './api';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface ServiceItem {
  id: number;
  professional_id: number;
  name: string;
  description?: string;
  price: number;
  duration_min: number;
  image_url?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  client_name: string;
  client_avatar?: string;
  created_at: string;
}

export interface AvailabilitySlot {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface Professional {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  specialty: string;
  bio?: string;
  address?: string;
  city?: string;
  rating_avg: number;
  rating_count: number;
  is_accepting: number;
  category_id: number;
  category_name: string;
  icon: string;
  color: string;
  // only in getProfessional detail
  services?: ServiceItem[];
  reviews?: Review[];
  availability_slots?: AvailabilitySlot[];
}

export interface ProfessionalsFilter {
  category_id?: number;
  city?: string;
  search?: string;
}

export const professionalsService = {
  async listProfessionals(filters?: ProfessionalsFilter): Promise<Professional[]> {
    const params: Record<string, any> = {};
    if (filters?.category_id) params.category_id = filters.category_id;
    if (filters?.city) params.city = filters.city;
    if (filters?.search) params.search = filters.search;

    const { data } = await api.get('/api/professionals', { params });
    return data.data;
  },

  async getProfessional(id: number): Promise<Professional> {
    const { data } = await api.get(`/api/professionals/${id}`);
    return data.data;
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await api.get('/api/categories');
    return data.data;
  },
};
