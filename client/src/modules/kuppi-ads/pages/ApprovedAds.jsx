import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApprovedKuppiAds } from '../hooks/useKuppiAds';
import KuppiAdCard from '../components/KuppiAdCard';
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
    <div className="space-y-6 rounded-[28px] border border-[#d8e4e6] bg-[#fffaf2] p-5 shadow-[0_18px_45px_rgba(61,61,61,0.06)] md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3D3D3D]">Kuppi Advertisements</h1>
          <p className="mt-2 text-sm text-[#62574d]">Find and enroll in tuition classes with a calmer, clearer browsing flow.</p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center rounded-full bg-[linear-gradient(135deg,#0077B6,#E07A5F)] px-5 py-2.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Advertisement
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 rounded-[24px] border border-[#eadfce] bg-white/80 p-4">
        <Link
          to="/kuppi"
          className="rounded-full bg-[#0077B6] px-4 py-2 text-white transition-colors hover:bg-[#005f92]"
        >
          Browse Ads
        </Link>
        {user && (
          <Link
            to="/kuppi/my"
            className="rounded-full bg-[#efe4d8] px-4 py-2 text-[#5d544d] transition-colors hover:bg-[#e4d6c6]"
          >
            My Ads
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link
            to="/kuppi/admin"
            className="rounded-full bg-[#E07A5F] px-4 py-2 text-white transition-colors hover:bg-[#c96a52]"
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
            className="w-full rounded-full border border-[#eadfce] bg-white px-4 py-3 text-[#3D3D3D] placeholder-[#85786c] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
          />
        </div>
        <div className="min-w-[150px]">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full rounded-full border border-[#eadfce] bg-white px-4 py-3 text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
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
            className="w-full rounded-full border border-[#eadfce] bg-white px-4 py-3 text-[#3D3D3D] placeholder-[#85786c] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
          />
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
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
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
