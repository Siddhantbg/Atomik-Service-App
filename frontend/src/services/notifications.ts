import api from './api';

export interface AppNotification {
  _id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  isRead: boolean;
  createdAt: string;
  data?: { bookingId?: string };
}

export const notificationService = {
  async getNotifications() {
    const res = (await api.get('/notifications')) as {
      notifications: AppNotification[];
    };
    return res.notifications ?? [];
  },

  async markRead(id: string) {
    return api.patch(`/notifications/${id}/read`);
  },

  async markAllRead() {
    return api.patch('/notifications/mark-all-read');
  },

  async getUnreadCount() {
    const res = (await api.get('/notifications/unread-count')) as { count: number };
    return res.count ?? 0;
  },
};
