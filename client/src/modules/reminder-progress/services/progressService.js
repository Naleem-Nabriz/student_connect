import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const progressService = {
  // Get progress overview
  getProgressOverview: async (period = 'week') => {
    const response = await axios.get(`${API_URL}/progress/overview`, { params: { period } });
    return response.data;
  },

  // Get progress logs
  getProgressLogs: async (params = {}) => {
    const response = await axios.get(`${API_URL}/progress/logs`, { params });
    return response.data;
  },

  // Get completion trends
  getCompletionTrends: async (period = 'week') => {
    const response = await axios.get(`${API_URL}/progress/trends`, { params: { period } });
    return response.data;
  },

  // Get mood and energy analysis
  getMoodEnergyAnalysis: async (period = 'week') => {
    const response = await axios.get(`${API_URL}/progress/mood-energy`, { params: { period } });
    return response.data;
  }
};

export default progressService;
