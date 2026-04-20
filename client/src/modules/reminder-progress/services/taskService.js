import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const taskService = {
  // Get all tasks with filtering and pagination
  getTasks: async (params = {}) => {
    const response = await axios.get(`${API_URL}/tasks`, { params });
    return response.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    return response.data;
  },

  // Complete task
  completeTask: async (id, feedbackData) => {
    const response = await axios.patch(`${API_URL}/tasks/${id}/complete`, feedbackData);
    return response.data;
  },

  // Postpone task
  postponeTask: async (id, postponeData) => {
    const response = await axios.patch(`${API_URL}/tasks/${id}/postpone`, postponeData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async (period = 'week') => {
    const response = await axios.get(`${API_URL}/tasks/stats`, { params: { period } });
    return response.data;
  }
};

export default taskService;
