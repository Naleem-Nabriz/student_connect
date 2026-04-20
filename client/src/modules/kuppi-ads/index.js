import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Lazy load components for better performance
const ApprovedAds = React.lazy(() => import('./pages/ApprovedAds'));
const MyAds = React.lazy(() => import('./pages/MyAds'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage'));

const KuppiAds = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(0,119,182,0.10),transparent_26%),radial-gradient(circle_at_top_right,rgba(224,122,95,0.12),transparent_24%),linear-gradient(180deg,#FDF6EC_0%,#fffaf2_100%)] p-4 md:p-6">
      <Routes>
        <Route index element={<ApprovedAds />} />
        <Route path="payment/:classId" element={<PaymentPage />} />
        <Route path="my" element={<MyAds />} />
        {user?.role === 'admin' && (
          <Route path="admin" element={<AdminDashboard />} />
        )}
      </Routes>
    </div>
  );
};

export default KuppiAds;
