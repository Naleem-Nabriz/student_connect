import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const kuppiAdAPI = axios.create({
  baseURL: `${API_BASE_URL}/kuppi`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export const kuppiAdPublicAPI = axios.create({
  baseURL: `${API_BASE_URL}/kuppi`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Setup interceptors for kuppiAdAPI
kuppiAdAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('kuppiAdAPI request interceptor - token:', token ? 'exists' : 'missing', 'URL:', config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Setup interceptors for kuppiAdPublicAPI  
kuppiAdPublicAPI.interceptors.request.use(
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

export const kuppiAdService = {
  // Create new ad
  createAd: async (adData) => {
    try {
      const response = await kuppiAdAPI.post('/create', adData);
      return response.data;
    } catch (error) {
      const firstValidationError = error.response?.data?.errors?.[0]?.msg;
      throw new Error(firstValidationError || error.response?.data?.message || error.message || 'Failed to create ad');
    }
  },

  // Get approved ads (public view)
  getApprovedAds: async (params = {}) => {
    try {
      const response = await kuppiAdPublicAPI.get('/approved', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch approved ads');
    }
  },

  // Get user's ads (My Ads page)
  getMyAds: async (userId, params = {}) => {
    try {
      console.log('kuppiAdService.getMyAds called with userId:', userId, 'params:', params);
      const response = await kuppiAdAPI.get(`/my/${userId}`, { params });
      console.log('kuppiAdService.getMyAds response:', response.data);
      return response.data;
    } catch (error) {
      console.error('kuppiAdService.getMyAds error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch my ads');
    }
  },

  // Get all ads (Admin dashboard)
  getAllAds: async (params = {}) => {
    try {
      const response = await kuppiAdAPI.get('/admin', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch all ads');
    }
  },

  // Update ad
  updateAd: async (id, adData) => {
    try {
      const response = await kuppiAdAPI.put(`/update/${id}`, adData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update ad');
    }
  },

  // Approve ad
  approveAd: async (id) => {
    try {
      const response = await kuppiAdAPI.put(`/approve/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to approve ad');
    }
  },

  // Reject ad
  rejectAd: async (id, rejectionReason) => {
    try {
      const response = await kuppiAdAPI.put(`/reject/${id}`, { rejectionReason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to reject ad');
    }
  },

  // Delete ad
  deleteAd: async (id) => {
    try {
      const response = await kuppiAdAPI.delete(`/delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete ad');
    }
  },

  // Enroll student in class
  enrollClass: async (classId) => {
    try {
      const response = await kuppiAdAPI.post(`/enroll/${classId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to enroll in class');
    }
  },

  // Unenroll student from class
  unenrollClass: async (classId) => {
    try {
      const response = await kuppiAdAPI.post(`/unenroll/${classId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to unenroll from class');
    }
  },

  // Get user's enrollments
  getMyEnrollments: async (studentId) => {
    try {
      const response = await kuppiAdAPI.get(`/my-enrollments/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch enrollments');
    }
  },
};
