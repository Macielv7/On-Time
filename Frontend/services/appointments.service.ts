// services/appointments.service.ts
import api from './api';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: number;
  client_id: number;
  professional_id: number;
  service_id: number;
  scheduled_date: string;
  scheduled_time: string;
  status: AppointmentStatus;
  payment_method?: string;
  total_price: number;
  notes?: string;
  created_at: string;
  // Joined fields (when listed)
  professional_name?: string;
  professional_avatar?: string;
  client_name?: string;
  client_avatar?: string;
  service_name?: string;
  duration_min?: number;
}

export interface CreateAppointmentPayload {
  professional_id: number;
  service_id: number;
  scheduled_date: string;  // 'YYYY-MM-DD'
  scheduled_time: string;  // 'HH:MM'
  payment_method?: string;
  notes?: string;
}

export const appointmentsService = {
  async getAppointments(status?: AppointmentStatus): Promise<Appointment[]> {
    const params = status ? { status } : {};
    const { data } = await api.get('/api/appointments', { params });
    return data.data;
  },

  async createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
    const { data } = await api.post('/api/appointments', payload);
    return data.data;
  },

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const { data } = await api.put(`/api/appointments/${id}/status`, { status });
    return data.data;
  },
};
