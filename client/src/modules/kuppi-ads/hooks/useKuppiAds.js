import { useState, useEffect, useCallback } from 'react';
import { kuppiAdService } from '../services/kuppiAdApi';

export const useApprovedKuppiAds = (params = {}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchAds = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await kuppiAdService.getApprovedAds({ ...params, ...newParams });
      setAds(response.kuppiAds || []);
      setPagination(prev => response.pagination || prev);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAds();
  }, [params]);

  return {
    ads,
    loading,
    error,
    pagination,
    fetchAds,
    refetch: fetchAds
  };
};

export const useMyKuppiAds = (userId, params = {}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchAds = useCallback(async (newParams = {}) => {
    console.log('fetchMyKuppiAds called with userId:', userId, 'params:', { ...params, ...newParams });
    setLoading(true);
    setError(null);
    try {
      const response = await kuppiAdService.getMyAds(userId, { ...params, ...newParams });
      console.log('fetchMyKuppiAds response:', response);
      setAds(response.kuppiAds || []);
      setPagination(prev => response.pagination || prev);
    } catch (err) {
      console.error('fetchMyKuppiAds error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, params]);

  useEffect(() => {
    console.log('useMyKuppiAds useEffect triggered with userId:', userId);
    if (userId) {
      fetchAds();
    }
  }, [userId, fetchAds]);

  return {
    ads,
    loading,
    error,
    pagination,
    fetchAds,
    refetch: fetchAds
  };
};

export const useAllKuppiAds = (params = {}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchAds = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await kuppiAdService.getAllAds({ ...params, ...newParams });
      setAds(response.kuppiAds || []);
      setPagination(prev => response.pagination || prev);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAds();
  }, [params]);

  return {
    ads,
    loading,
    error,
    pagination,
    fetchAds,
    refetch: fetchAds
  };
};
