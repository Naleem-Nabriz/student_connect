import { useState, useEffect, useCallback } from 'react';
import { groupService } from '../services/groupService';

export const useGroups = (params = {}) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchGroups = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupService.getGroups({ ...params, ...newParams });
      setGroups(response.groups || []);
      setPagination(prev => response.pagination || prev);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (groupData) => {
    setLoading(true);
    setError(null);
    try {
      const newGroup = await groupService.createGroup(groupData);
      setGroups(prev => [newGroup, ...prev]);
      return newGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (id, groupData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupService.updateGroup(id, groupData);
      setGroups(prev => prev.map(group => 
        group._id === id ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await groupService.deleteGroup(id);
      setGroups(prev => prev.filter(group => group._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupService.joinGroup(id);
      setGroups(prev => prev.map(group => 
        group._id === id ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupService.leaveGroup(id);
      setGroups(prev => prev.map(group => 
        group._id === id ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptJoinRequest = async (groupId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupService.acceptJoinRequest(groupId, userId);
      setGroups(prev => prev.map(group =>
        group._id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectJoinRequest = async (groupId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupService.rejectJoinRequest(groupId, userId);
      setGroups(prev => prev.map(group =>
        group._id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    groups,
    loading,
    error,
    pagination,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    acceptJoinRequest,
    rejectJoinRequest,
    leaveGroup,
  };
};

export const useGroup = (id) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroup = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const groupData = await groupService.getGroupById(id);
      setGroup(groupData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  return {
    group,
    loading,
    error,
    refetch: fetchGroup,
  };
};
