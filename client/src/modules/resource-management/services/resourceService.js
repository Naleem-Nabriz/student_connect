import { resourcesAPI } from '../../../services/api';
import { handleAPIError } from '../../../services/api';

export const resourceService = {
  // Get all resources
  getResources: async (params = {}) => {
    try {
      const response = await resourcesAPI.get('/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Get resource by ID
  getResourceById: async (id) => {
    try {
      const response = await resourcesAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Create new resource
  createResource: async (resourceData) => {
    try {
      const response = await resourcesAPI.post('/', resourceData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Update resource
  updateResource: async (id, resourceData) => {
    try {
      const response = await resourcesAPI.put(`/${id}`, resourceData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Delete resource
  deleteResource: async (id) => {
    try {
      const response = await resourcesAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Rate resource
  rateResource: async (id, rating) => {
    try {
      const response = await resourcesAPI.post(`/${id}/rate`, { rating });
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },
};

export default resourceService;
