import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const goalService = {
  // Get all goals
  getGoals: async (params = {}) => {
    const response = await axios.get(`${API_URL}/goals`, { params });
    return response.data;
  },

  // Get single goal
  getGoal: async (id) => {
    const response = await axios.get(`${API_URL}/goals/${id}`);
    return response.data;
  },

  // Create new goal
  createGoal: async (goalData) => {
    const response = await axios.post(`${API_URL}/goals`, goalData);
    return response.data;
  },

  // Update goal
  updateGoal: async (id, goalData) => {
    const response = await axios.put(`${API_URL}/goals/${id}`, goalData);
    return response.data;
  },

  // Update goal progress
  updateGoalProgress: async (id, amount) => {
    const response = await axios.patch(`${API_URL}/goals/${id}/progress`, { amount });
    return response.data;
  },

  // Delete goal
  deleteGoal: async (id) => {
    const response = await axios.delete(`${API_URL}/goals/${id}`);
    return response.data;
  },

  // Get goal statistics
  getGoalStats: async () => {
    const response = await axios.get(`${API_URL}/goals/stats`);
    return response.data;
  }
};

export default goalService;
