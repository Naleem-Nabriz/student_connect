import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAllKuppiAds } from '../hooks/useKuppiAds';
import { kuppiAdService } from '../services/kuppiAdApi';
import KuppiAdCard from '../components/KuppiAdCard';
import CreateAd from '../components/CreateAd';
import LoadingSpinner from '../../../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editingAd, setEditingAd] = useState(null);

  const params = useMemo(() => ({
    status: filterStatus,
    sortBy,
    sortOrder: 'desc'
  }), [filterStatus, sortBy]);

  const { ads, loading, error, fetchAds } = useAllKuppiAds(params);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusCount = () => {
    const counts = {
      pending: ads.filter(ad => ad.status === 'pending').length,
      approved: ads.filter(ad => ad.status === 'approved').length,
      rejected: ads.filter(ad => ad.status === 'rejected').length
    };
    return counts;
  };

  const handleApprove = async (adId) => {
    try {
      await kuppiAdService.approveAd(adId);
      fetchAds();
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  const handleReject = async (adId) => {
    const reason = prompt('Rejection reason (optional):');
    if (reason !== null) {
      try {
        await kuppiAdService.rejectAd(adId, reason);
        fetchAds();
      } catch (error) {
        console.error('Error rejecting ad:', error);
      }
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
  };

  const handleEditSuccess = () => {
    setEditingAd(null);
    fetchAds();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage all kuppi advertisements</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <Link
          to="/kuppi"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Browse Ads
        </Link>
        <Link
          to="/kuppi/my"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          My Ads
        </Link>
        <Link
          to="/kuppi/admin"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Admin Dashboard
        </Link>
      </div>

      {/* Status Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Advertisement Status</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{ads.length}</div>
            <div className="text-sm text-gray-700 mt-1">Total Ads</div>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg">
            <div className="text-2xl font-bold text-yellow-800">{getStatusCount().pending}</div>
            <div className="text-sm text-yellow-700 mt-1">Pending</div>
            <div className="text-xs text-yellow-600">Need approval</div>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-800">{getStatusCount().approved}</div>
            <div className="text-sm text-green-700 mt-1">Approved</div>
            <div className="text-xs text-green-600">Visible to students</div>
          </div>
          <div className="p-4 bg-red-100 rounded-lg">
            <div className="text-2xl font-bold text-red-800">{getStatusCount().rejected}</div>
            <div className="text-sm text-red-700 mt-1">Rejected</div>
            <div className="text-xs text-red-600">Not visible</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search advertisements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="min-w-[150px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="min-w-[150px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt">Latest First</option>
            <option value="price">Price: Low to High</option>
            <option value="maxStudents">Capacity: High to Low</option>
          </select>
        </div>
      </div>

      {/* Ads Grid */}
      {loading && filteredAds.length === 0 ? (
        <LoadingSpinner text="Loading advertisements..." />
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          Error: {error}
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No advertisements found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map(ad => (
            <KuppiAdCard
              key={ad._id}
              ad={ad}
              currentUser={user}
              onUpdate={handleEdit}
              onApprove={handleApprove}
              onReject={handleReject}
              onEnroll={fetchAds}
            />
          ))}
        </div>
      )}

      {editingAd && (
        <CreateAd
          ad={editingAd}
          onClose={() => setEditingAd(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
