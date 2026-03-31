import { useState, useEffect } from 'react';
import { skillService } from '../services/skillService';

export const useSkillProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyProfile = async () => {
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
  };

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
  }, []);

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

  const fetchProfiles = async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await skillService.getSkillProfiles({ ...params, ...newParams });
      setProfiles(response.skillProfiles || []);
      setPagination(response.pagination || pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

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
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchCollaborations = async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await skillService.getCollaborationRequests({ ...params, ...newParams });
      setCollaborations(response.collaborations || []);
      setPagination(response.pagination || pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCollaboration = async (collaborationData) => {
    setLoading(true);
    setError(null);
    try {
      const newCollaboration = await skillService.createCollaborationRequest(collaborationData);
      setCollaborations(prev => [newCollaboration, ...prev]);
      return newCollaboration;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCollaborationStatus = async (id, status) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const respondToCollaboration = async (id, responseData) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  return {
    collaborations,
    loading,
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

  const fetchMyCollaborations = async () => {
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
  };

  useEffect(() => {
    fetchMyCollaborations();
  }, []);

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
