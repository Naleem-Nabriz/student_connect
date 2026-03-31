import { useState, useEffect } from 'react';
import { academicService } from '../services/academicService';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const subjectsData = await academicService.getSubjects();
      setSubjects(subjectsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (subjectData) => {
    setLoading(true);
    setError(null);
    try {
      const newSubject = await academicService.createSubject(subjectData);
      setSubjects(prev => [...prev, newSubject]);
      return newSubject;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id, subjectData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSubject = await academicService.updateSubject(id, subjectData);
      setSubjects(prev => prev.map(subject => 
        subject._id === id ? updatedSubject : subject
      ));
      return updatedSubject;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await academicService.deleteSubject(id);
      setSubjects(prev => prev.filter(subject => subject._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};

export const useRecords = (params = {}) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const recordsData = await academicService.getRecords({ ...params, ...newParams });
      setRecords(recordsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (recordData) => {
    setLoading(true);
    setError(null);
    try {
      const newRecord = await academicService.createRecord(recordData);
      setRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (id, recordData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRecord = await academicService.updateRecord(id, recordData);
      setRecords(prev => prev.map(record => 
        record._id === id ? updatedRecord : record
      ));
      return updatedRecord;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await academicService.deleteRecord(id);
      setRecords(prev => prev.filter(record => record._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  };
};

export const useProgressDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await academicService.getProgressDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};
