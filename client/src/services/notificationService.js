import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5012/api';

export const notificationAPI = axios.create({
  baseURL: `${API_BASE_URL}/notifications`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Setup interceptors for notificationAPI
notificationAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async (params = {}) => {
    try {
      const response = await notificationAPI.get('/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch notifications');
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await notificationAPI.get('/unread-count');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch unread count');
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await notificationAPI.patch(`/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await notificationAPI.patch('/read-all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to mark all notifications as read');
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await notificationAPI.delete(`/${notificationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete notification');
    }
  },
};
