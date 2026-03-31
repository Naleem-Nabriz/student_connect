import { skillsAPI, collaborationsAPI } from '../../../services/api';
import { handleAPIError } from '../../../services/api';

export const skillService = {
  // Skill Profile methods
  createOrUpdateSkillProfile: async (profileData) => {
    try {
      const response = await skillsAPI.post('/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  getMySkillProfile: async () => {
    try {
      const response = await skillsAPI.get('/profile/me');
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  getSkillProfiles: async (params = {}) => {
    try {
      const response = await skillsAPI.get('/profiles', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  getSkillProfileById: async (id) => {
    try {
      const response = await skillsAPI.get(`/profiles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Collaboration methods
  createCollaborationRequest: async (requestData) => {
    try {
      const response = await collaborationsAPI.post('/', requestData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  getCollaborationRequests: async (params = {}) => {
    try {
      const response = await collaborationsAPI.get('/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  getMyCollaborationRequests: async () => {
    try {
      const response = await collaborationsAPI.get('/my');
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  getCollaborationById: async (id) => {
    try {
      const response = await collaborationsAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  respondToCollaboration: async (id, responseData) => {
    try {
      const response = await collaborationsAPI.post(`/${id}/respond`, responseData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  updateCollaborationStatus: async (id, status) => {
    try {
      const response = await collaborationsAPI.put(`/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  findMatchingUsers: async (params = {}) => {
    try {
      const response = await collaborationsAPI.get('/match', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },
};

export default skillService;
