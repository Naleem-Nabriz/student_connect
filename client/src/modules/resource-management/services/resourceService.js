import { resourcesAPI } from '../../../services/api';
import { handleAPIError } from '../../../services/api';
import axios from 'axios';

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

  // Create new resource (handles both file upload and regular data)
  createResource: async (resourceData, isFileUpload = false) => {
    try {
      let response;
      const hasFormDataPayload = typeof FormData !== 'undefined' && resourceData instanceof FormData;
      
      if (isFileUpload || hasFormDataPayload) {
        console.log('Creating resource with file upload...');
        console.log('FormData entries:');
        for (let [key, value] of resourceData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File { name: ${value.name}, size: ${value.size}, type: ${value.type} }`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        // Handle file upload with FormData
        const config = {
          headers: {
            'Content-Type': undefined,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Upload progress:', progress + '%');
          }
        };
        
        response = await resourcesAPI.post('/', resourceData, config);
      } else {
        console.log('Creating resource with regular data...');
        // Handle regular form data
        response = await resourcesAPI.post('/', resourceData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Resource service error:', error);
      console.error('Error response:', error.response?.data);
      
      // Extract detailed error message
      let errorMessage = 'Failed to create resource';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(e => e.msg || e.message).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
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

  // Download resource
  downloadResource: async (id, filename) => {
    try {
      const response = await resourcesAPI.get(`/${id}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Get download URL for direct linking
  getDownloadUrl: (id) => {
    return `${axios.defaults.baseURL}/resources/${id}/download`;
  }
};

export default resourceService;
