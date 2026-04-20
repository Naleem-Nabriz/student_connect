import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const reminderService = {
  // Get all reminders
  getReminders: async (params = {}) => {
    const response = await axios.get(`${API_URL}/reminders`, { params });
    return response.data;
  },

  // Get upcoming reminders
  getUpcomingReminders: async () => {
    const response = await axios.get(`${API_URL}/reminders/upcoming`);
    return response.data;
  },

  // Update reminder status
  updateReminderStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/reminders/${id}/status`, { status });
    return response.data;
  },

  // Snooze reminder
  snoozeReminder: async (id, minutes) => {
    const response = await axios.patch(`${API_URL}/reminders/${id}/snooze`, { minutes });
    return response.data;
  },

  // Dismiss reminder
  dismissReminder: async (id) => {
    const response = await axios.patch(`${API_URL}/reminders/${id}/dismiss`);
    return response.data;
  }
};

export default reminderService;
