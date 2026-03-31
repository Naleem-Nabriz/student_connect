import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Lazy load components for better performance
const ApprovedAds = React.lazy(() => import('./pages/ApprovedAds'));
const MyAds = React.lazy(() => import('./pages/MyAds'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

const KuppiAds = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route index element={<ApprovedAds />} />
        <Route path="my" element={<MyAds />} />
        {user?.role === 'admin' && (
          <Route path="admin" element={<AdminDashboard />} />
        )}
      </Routes>
    </div>
  );
};

export default KuppiAds;
