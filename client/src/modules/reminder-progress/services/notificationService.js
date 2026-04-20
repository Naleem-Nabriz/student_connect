import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const notificationService = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    const response = await axios.get(`${API_URL}/notifications`, { params });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await axios.get(`${API_URL}/notifications/unread-count`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await axios.patch(`${API_URL}/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await axios.patch(`${API_URL}/notifications/read-all`);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await axios.delete(`${API_URL}/notifications/${id}`);
    return response.data;
  }
};

export default notificationService;
