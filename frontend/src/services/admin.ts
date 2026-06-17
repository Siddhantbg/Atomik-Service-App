import api from './api';

export const adminService = {
  async getStats() {
    return api.get('/admin/stats') as Promise<{
      stats: {
        totalUsers: number;
        totalBookings: number;
        pendingBookings: number;
        totalRevenue: number;
        activeTechnicians: number;
      };
    }>;
  },

  async getAnalytics() {
    return api.get('/admin/analytics');
  },

  async getUsers(params?: { role?: string; search?: string; page?: number }) {
    const res = (await api.get('/admin/users', { params })) as {
      users: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        isActive: boolean;
      }[];
    };
    return res.users ?? [];
  },

  async toggleUser(id: string) {
    return api.patch(`/admin/users/${id}/toggle`);
  },
};
