import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5012/api';

// Create axios instance for auth routes
export const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create API instances for different modules
export const groupsAPI = axios.create({
  baseURL: `${API_BASE_URL}/groups`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const resourcesAPI = axios.create({
  baseURL: `${API_BASE_URL}/resources`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const skillsAPI = axios.create({
  baseURL: `${API_BASE_URL}/skills`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const collaborationsAPI = axios.create({
  baseURL: `${API_BASE_URL}/collaborations`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const academicAPI = axios.create({
  baseURL: `${API_BASE_URL}/academic`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const kuppiAPI = axios.create({
  baseURL: `${API_BASE_URL}/kuppi`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const assistantAPI = axios.create({
  baseURL: `${API_BASE_URL}/assistant`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const setupInterceptors = (apiInstance, options = {}) => {
  const { redirectOnUnauthorized = true } = options;

  apiInstance.interceptors.request.use(
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

  // Response interceptor to handle errors
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (redirectOnUnauthorized && error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Setup interceptors for all API instances
setupInterceptors(authAPI);
setupInterceptors(groupsAPI);
setupInterceptors(resourcesAPI);
setupInterceptors(skillsAPI);
setupInterceptors(collaborationsAPI);
setupInterceptors(academicAPI);
setupInterceptors(kuppiAPI);
setupInterceptors(assistantAPI, { redirectOnUnauthorized: false });

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

// Create a generic API instance creator
export const create = (config) => {
  const instance = axios.create({
    baseURL: `${API_BASE_URL}${config.baseURL}`,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    ...config,
  });

  // Only setup interceptors if withCredentials is true or not specified
  if (config.withCredentials !== false) {
    setupInterceptors(instance);
  }

  return instance;
};

const apiServices = {
  authAPI,
  groupsAPI,
  resourcesAPI,
  skillsAPI,
  collaborationsAPI,
  academicAPI,
  assistantAPI,
  create,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  handleAPIError,
};

export default apiServices;
