import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useMyKuppiAds } from '../hooks/useKuppiAds';
import KuppiAdCard from '../components/KuppiAdCard';
import CreateAd from '../components/CreateAd';
import LoadingSpinner from '../../../components/LoadingSpinner';

const MyAds = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentUserId = user?._id || user?.id;

  const params = useMemo(() => ({
    status: filterStatus,
    sortBy,
    sortOrder: 'desc'
  }), [filterStatus, sortBy]);

  const { ads, loading, error, fetchAds } = useMyKuppiAds(currentUserId, params);

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

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchAds();
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-[#85786c]">Please log in to view your advertisements.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-[28px] border border-[#d8e4e6] bg-[#fffaf2] p-5 shadow-[0_18px_45px_rgba(61,61,61,0.06)] md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3D3D3D]">My Advertisements</h1>
          <p className="mt-2 text-sm text-[#62574d]">Manage your kuppi class advertisements and track approval status.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center rounded-full bg-[linear-gradient(135deg,#0077B6,#E07A5F)] px-5 py-2.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Advertisement
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 rounded-[24px] border border-[#eadfce] bg-white/80 p-4">
        <Link
          to="/kuppi"
          className="rounded-full bg-[#efe4d8] px-4 py-2 text-[#5d544d] transition-colors hover:bg-[#e4d6c6]"
        >
          Browse Ads
        </Link>
        <Link
          to="/kuppi/my"
          className="rounded-full bg-[#0077B6] px-4 py-2 text-white transition-colors hover:bg-[#005f92]"
        >
          My Ads
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/kuppi/admin"
            className="rounded-full bg-[#E07A5F] px-4 py-2 text-white transition-colors hover:bg-[#c96a52]"
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Status Summary */}
      <div className="mb-6 rounded-[24px] border border-[#eadfce] bg-white/85 p-4 shadow-[0_16px_35px_rgba(61,61,61,0.08)]">
        <h2 className="mb-4 text-lg font-semibold text-[#3D3D3D]">Status Summary</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-[20px] bg-[#fff1cc] p-4">
            <div className="text-2xl font-bold text-[#8a6a10]">{getStatusCount().pending}</div>
            <div className="mt-1 text-sm text-[#8a6a10]">Pending</div>
            <div className="text-xs text-[#a88619]">Waiting for admin approval</div>
          </div>
          <div className="rounded-[20px] bg-[#d9ecf7] p-4">
            <div className="text-2xl font-bold text-[#0b5f8f]">{getStatusCount().approved}</div>
            <div className="mt-1 text-sm text-[#0b5f8f]">Approved</div>
            <div className="text-xs text-[#2d7aa4]">Visible to all students</div>
          </div>
          <div className="rounded-[20px] bg-[#f6e3dc] p-4">
            <div className="text-2xl font-bold text-[#b85f47]">{getStatusCount().rejected}</div>
            <div className="mt-1 text-sm text-[#b85f47]">Rejected</div>
            <div className="text-xs text-[#c66f57]">Not visible publicly</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search your ads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-[#eadfce] bg-white px-4 py-3 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
          />
        </div>
        <div className="min-w-[150px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-full border border-[#eadfce] bg-white px-4 py-3 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
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
            className="w-full rounded-full border border-[#eadfce] bg-white px-4 py-3 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
          >
            <option value="createdAt">Latest First</option>
            <option value="price">Price: Low to High</option>
            <option value="maxStudents">Capacity: High to Low</option>
          </select>
        </div>
      </div>

      {/* Ads Grid */}
      {loading && filteredAds.length === 0 ? (
        <LoadingSpinner text="Loading your advertisements..." />
      ) : error ? (
        <div className="rounded-[24px] border border-[#f6e3dc] bg-[#fff1ed] py-8 text-center text-[#b85f47]">
          Error: {error}
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="rounded-[24px] border border-[#eadfce] bg-white/70 py-8 text-center text-[#85786c]">
          No advertisements found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map(ad => (
            <KuppiAdCard
              key={ad._id}
              ad={ad}
              currentUser={user}
              onUpdate={fetchAds}
              onEnroll={fetchAds}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateAd onClose={() => setShowCreateModal(false)} onSuccess={handleCreateSuccess} />
      )}
    </div>
  );
};

export default MyAds;
