import { groupsAPI } from '../../../services/api';
import { handleAPIError } from '../../../services/api';

export const groupService = {
  // Get all groups
  getGroups: async (params = {}) => {
    try {
      const response = await groupsAPI.get('/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Get group by ID
  getGroupById: async (id) => {
    try {
      const response = await groupsAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Create new group
  createGroup: async (groupData) => {
    try {
      const response = await groupsAPI.post('/', groupData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Update group
  updateGroup: async (id, groupData) => {
    try {
      const response = await groupsAPI.put(`/${id}`, groupData);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Delete group
  deleteGroup: async (id) => {
    try {
      const response = await groupsAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Join group
  joinGroup: async (id) => {
    try {
      const response = await groupsAPI.post(`/${id}/join`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Accept join request
  acceptJoinRequest: async (groupId, userId) => {
    try {
      const response = await groupsAPI.post(`/${groupId}/requests/${userId}/accept`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Reject join request
  rejectJoinRequest: async (groupId, userId) => {
    try {
      const response = await groupsAPI.post(`/${groupId}/requests/${userId}/reject`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },

  // Leave group
  leaveGroup: async (id) => {
    try {
      const response = await groupsAPI.post(`/${id}/leave`);
      return response.data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  },
};

export default groupService;
