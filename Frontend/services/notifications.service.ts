// services/notifications.service.ts
import api from './api';

export interface Notification {
  id: number;
  user_id: number;
  type: 'booking' | 'cancellation' | 'confirmation' | 'reminder';
  title: string;
  message: string;
  is_read: number; // 0 or 1
  related_id?: number;
  related_type?: string;
  created_at: string;
}

export const notificationsService = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get('/api/notifications');
    return data.data;
  },

  async markAsRead(id: number): Promise<void> {
    await api.put(`/api/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/api/notifications/read-all');
  },
};
