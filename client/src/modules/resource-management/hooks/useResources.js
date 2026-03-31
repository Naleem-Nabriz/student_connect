import { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';

export const useResources = (params = {}) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchResources = async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await resourceService.getResources({ ...params, ...newParams });
      setResources(response.resources || []);
      setPagination(response.pagination || pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const createResource = async (resourceData) => {
    setLoading(true);
    setError(null);
    try {
      const newResource = await resourceService.createResource(resourceData);
      setResources(prev => [newResource, ...prev]);
      return newResource;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResource = async (id, resourceData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedResource = await resourceService.updateResource(id, resourceData);
      setResources(prev => prev.map(resource => 
        resource._id === id ? updatedResource : resource
      ));
      return updatedResource;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await resourceService.deleteResource(id);
      setResources(prev => prev.filter(resource => resource._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rateResource = async (id, rating) => {
    setLoading(true);
    setError(null);
    try {
      const updatedResource = await resourceService.rateResource(id, rating);
      setResources(prev => prev.map(resource => 
        resource._id === id ? updatedResource : resource
      ));
      return updatedResource;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    resources,
    loading,
    error,
    pagination,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
    rateResource,
  };
};

export const useResource = (id) => {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResource = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const resourceData = await resourceService.getResourceById(id);
      setResource(resourceData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

  return {
    resource,
    loading,
    error,
    refetch: fetchResource,
  };
};
