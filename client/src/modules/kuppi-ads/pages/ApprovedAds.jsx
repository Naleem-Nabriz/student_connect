import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApprovedKuppiAds } from '../hooks/useKuppiAds';
import KuppiAdCard from '../components/KuppiAdCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import CreateAd from '../components/CreateAd';

const ApprovedAds = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const params = useMemo(() => ({
    subject: filterSubject,
    location: filterLocation,
    sortBy,
    sortOrder: 'desc'
  }), [filterSubject, filterLocation, sortBy]);

  const { ads, loading, error, fetchAds } = useApprovedKuppiAds(params);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchAds();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kuppi Advertisements</h1>
          <p className="text-[#A0A3BD] mt-1">Find and enroll in tuition classes</p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8 8H8a2 2 0 008-2v2a2 2 0 00-2 2v6a2 2 0 002-2l-3 3a2 2 0 004-2l-3-3a2 2 0 002-2z" />
            </svg>
            Create Advertisement
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 p-4 bg-[#111217] rounded-lg border border-[#2A2D36]">
        <Link
          to="/kuppi"
          className="px-4 py-2 bg-[#FF7A00] text-white rounded-md hover:bg-[#FF8800] transition-colors"
        >
          Browse Ads
        </Link>
        {user && (
          <Link
            to="/kuppi/my"
            className="px-4 py-2 bg-[#2A2D36] text-white rounded-md hover:bg-[#3A3D46] transition-colors"
          >
            My Ads
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link
            to="/kuppi/admin"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search ads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-[#111217] border border-[#2A2D36] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-white placeholder-[#A0A3BD]"
          />
        </div>
        <div className="min-w-[150px]">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full px-3 py-2 bg-[#111217] border border-[#2A2D36] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-white"
          >
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Sinhala">Sinhala</option>
            <option value="History">History</option>
            <option value="Commerce">Commerce</option>
          </select>
        </div>
        <div className="min-w-[150px]">
          <input
            type="text"
            placeholder="Filter by location"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full px-3 py-2 bg-[#111217] border border-[#2A2D36] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-white placeholder-[#A0A3BD]"
          />
        </div>
        <div className="min-w-[150px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-[#111217] border border-[#2A2D36] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-white"
          >
            <option value="createdAt">Latest First</option>
            <option value="price">Price: Low to High</option>
            <option value="maxStudents">Capacity: High to Low</option>
          </select>
        </div>
      </div>

      {/* Ads Grid */}
      {loading && filteredAds.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-[#EF4444] bg-[#1A1C22] border border-[#2A2D36] rounded-lg">
          Error: {error}
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-8 text-[#A0A3BD] bg-[#1A1C22] border border-[#2A2D36] rounded-lg">
          No advertisements found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map(ad => (
            <KuppiAdCard
              key={ad._id}
              ad={ad}
              currentUser={user}
              onEnroll={() => fetchAds()}
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

export default ApprovedAds;
