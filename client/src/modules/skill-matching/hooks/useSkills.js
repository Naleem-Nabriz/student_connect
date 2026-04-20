import { useState, useEffect, useCallback } from 'react';
import { skillService } from '../services/skillService';

export const useSkillProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await skillService.getMySkillProfile();
      setProfile(profileData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await skillService.createOrUpdateSkillProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchMyProfile,
  };
};

export const useSkillProfiles = (params = {}) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchProfiles = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await skillService.getSkillProfiles({ ...params, ...newParams });
      setProfiles(response.skillProfiles || []);
      setPagination(prev => response.pagination || prev);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    pagination,
    fetchProfiles,
  };
};

export const useCollaborations = (params = {}) => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [responding, setResponding] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchCollaborations = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await skillService.getCollaborationRequests({ ...params, ...newParams });
      setCollaborations(response.collaborations || []);
      setPagination(prev => response.pagination || prev);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createCollaboration = async (collaborationData) => {
    setCreating(true);
    setError(null);
    try {
      const newCollaboration = await skillService.createCollaborationRequest(collaborationData);
      setCollaborations(prev => [newCollaboration, ...prev]);
      return newCollaboration;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const updateCollaborationStatus = async (id, status) => {
    setUpdatingStatus(true);
    setError(null);
    try {
      const updatedCollaboration = await skillService.updateCollaborationStatus(id, status);
      setCollaborations(prev => prev.map(collab => 
        collab._id === id ? updatedCollaboration : collab
      ));
      return updatedCollaboration;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUpdatingStatus(false);
    }
  };

  const respondToCollaboration = async (id, responseData) => {
    setResponding(true);
    setError(null);
    try {
      const updatedCollaboration = await skillService.respondToCollaboration(id, responseData);
      setCollaborations(prev => prev.map(collab => 
        collab._id === id ? updatedCollaboration : collab
      ));
      return updatedCollaboration;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setResponding(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, [fetchCollaborations]);

  return {
    collaborations,
    loading,
    creating,
    responding,
    updatingStatus,
    error,
    pagination,
    fetchCollaborations,
    createCollaboration,
    updateCollaborationStatus,
    respondToCollaboration,
  };
};

export const useMyCollaborations = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyCollaborations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await skillService.getMyCollaborationRequests();
      setCollaborations(response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCollaborations();
  }, [fetchMyCollaborations]);

  return {
    collaborations,
    loading,
    error,
    refetch: fetchMyCollaborations,
  };
};

export const useMatchingUsers = () => {
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findMatchingUsers = async (skills) => {
    setLoading(true);
    setError(null);
    try {
      const response = await skillService.findMatchingUsers({ skills });
      setMatchingUsers(response || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    matchingUsers,
    loading,
    error,
    findMatchingUsers,
  };
};
