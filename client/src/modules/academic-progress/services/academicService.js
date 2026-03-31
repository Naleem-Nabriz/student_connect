import { academicAPI } from '../../../services/api';
import { handleAPIError } from '../../../services/api';

export const academicService = {
  // Subject methods
  getSubjects: async () => {
    try {
      const response = await academicAPI.get('/subjects');
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  createSubject: async (subjectData) => {
    try {
      const response = await academicAPI.post('/subjects', subjectData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  updateSubject: async (id, subjectData) => {
    try {
      const response = await academicAPI.put(`/subjects/${id}`, subjectData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  deleteSubject: async (id) => {
    try {
      const response = await academicAPI.delete(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Record methods
  getRecords: async (params = {}) => {
    try {
      const response = await academicAPI.get('/records', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  createRecord: async (recordData) => {
    try {
      const response = await academicAPI.post('/records', recordData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  updateRecord: async (id, recordData) => {
    try {
      const response = await academicAPI.put(`/records/${id}`, recordData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  deleteRecord: async (id) => {
    try {
      const response = await academicAPI.delete(`/records/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Dashboard
  getProgressDashboard: async () => {
    try {
      const response = await academicAPI.get('/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },
};

export default academicService;
