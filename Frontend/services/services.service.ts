// services/services.service.ts — serviços do empreendedor
import api from './api';
import type { ServiceItem } from './professionals.service';

export interface CreateServicePayload {
  name: string;
  description?: string;
  price: number;
  duration_min: number;
  image_url?: string;
}

export interface UpdateServicePayload extends Partial<CreateServicePayload> {}

export const servicesService = {
  async getMyServices(): Promise<ServiceItem[]> {
    const { data } = await api.get('/api/services', { params: { mine: '1' } });
    return data.data;
  },

  async createService(payload: CreateServicePayload): Promise<ServiceItem> {
    const { data } = await api.post('/api/services', payload);
    return data.data;
  },

  async updateService(id: number, payload: UpdateServicePayload): Promise<ServiceItem> {
    const { data } = await api.put(`/api/services/${id}`, payload);
    return data.data;
  },

  async deleteService(id: number): Promise<void> {
    await api.delete(`/api/services/${id}`);
  },
};
