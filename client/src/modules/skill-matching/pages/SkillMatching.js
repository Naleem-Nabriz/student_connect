import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Plus, Search, Users, User, MessageSquare, Settings, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSkillProfile, useSkillProfiles, useCollaborations, useMatchingUsers } from '../hooks/useSkills';
import { useAuth } from '../../../context/AuthContext';
import SkillProfileCard from '../components/SkillProfileCard';
import CollaborationCard from '../components/CollaborationCard';
import SkillProfileForm from '../components/SkillProfileForm';
import CollaborationForm from '../components/CollaborationForm';
import LoadingSpinner from '../../../components/LoadingSpinner';
import IntegratedSkillMatching from '../components/IntegratedSkillMatching';

const shellClassName = 'min-h-full rounded-[28px] border border-[#d8e4e6] bg-[#FDF6EC] p-4 md:p-6 shadow-[0_24px_70px_rgba(61,61,61,0.08)]';
const panelClassName = 'rounded-[24px] border border-[#d8e4e6] bg-white/80 backdrop-blur-sm shadow-[0_18px_45px_rgba(0,119,182,0.08)]';
const primaryButtonClassName = 'inline-flex items-center rounded-full bg-[#0077B6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(0,119,182,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#005f92] disabled:opacity-50';
const searchInputClassName = 'w-full rounded-full border border-[#c7d8da] bg-[#fffdf8] pl-10 pr-4 py-3 text-sm text-[#3D3D3D] placeholder:text-[#8b8176] focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20';
const selectClassName = 'rounded-full border border-[#c7d8da] bg-[#fffdf8] px-4 py-3 text-sm text-[#3D3D3D] focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20';

const SkillProfile = () => {
  const { profile, loading, error, updateProfile } = useSkillProfile();
  const [showForm, setShowForm] = useState(false);

  const handleUpdateProfile = async (profileData) => {
    try {
      await updateProfile(profileData);
      setShowForm(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading && !profile) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className={`${shellClassName} space-y-6`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3D3D3D]">My Skill Profile</h1>
          <p className="mt-2 text-sm text-[#6f655c]">Showcase your strengths and attract the right study partners.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className={primaryButtonClassName}
        >
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#E07A5F]/30 bg-[#fff1ed] px-4 py-3 text-sm text-[#a3533c]">
          {error}
        </div>
      )}

      {profile ? (
        <SkillProfileCard profile={profile} showConnectButton={false} />
      ) : (
        <div className={`${panelClassName} px-6 py-14 text-center`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0077B6]/10 text-[#0077B6]">
            <User className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#3D3D3D]">No profile yet</h3>
          <p className="mt-2 text-sm text-[#6f655c]">Create your skill profile to start finding thoughtful matches.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className={primaryButtonClassName}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Profile
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <SkillProfileForm
          profile={profile}
          onSubmit={handleUpdateProfile}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

const FindPartners = () => {
  const { profiles, loading, error } = useSkillProfiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const { findMatchingUsers, matchingUsers, loading: matchingLoading } = useMatchingUsers();
  const [showMatching, setShowMatching] = useState(false);

  const handleFindMatches = async () => {
    if (!profiles[0]?.skills?.length) {
      toast.error('Please set up your skill profile first');
      return;
    }
    
    const mySkills = profiles[0].skills.map(skill => skill.name);
    try {
      await findMatchingUsers(mySkills.join(','));
      setShowMatching(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.userId.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.userId.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAvailability = !filterAvailability || profile.availability === filterAvailability;
    return matchesSearch && matchesAvailability;
  });

  if (loading && profiles.length === 0) {
    return <LoadingSpinner text="Loading profiles..." />;
  }

  return (
    <div className={`${shellClassName} space-y-6`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3D3D3D]">Find Study Partners</h1>
          <p className="mt-2 text-sm text-[#6f655c]">Connect with students who complement your pace, skills, and goals.</p>
        </div>
        <button
          onClick={handleFindMatches}
          disabled={matchingLoading}
          className={`${primaryButtonClassName} bg-[#E07A5F] shadow-[0_12px_24px_rgba(224,122,95,0.22)] hover:bg-[#c96a52]`}
        >
          <Users className="h-4 w-4 mr-2" />
          {matchingLoading ? 'Finding...' : 'Find Matches'}
        </button>
      </div>

      {/* Search and Filter */}
      <div className={`${panelClassName} p-4`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b8176]" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={searchInputClassName}
            />
          </div>
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className={selectClassName}
          >
            <option value="">All Availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#E07A5F]/30 bg-[#fff1ed] px-4 py-3 text-sm text-[#a3533c]">
          {error}
        </div>
      )}

      {/* Matching Users */}
      {showMatching && matchingUsers.length > 0 && (
        <div className="rounded-[24px] border border-[#0077B6]/15 bg-[linear-gradient(135deg,rgba(0,119,182,0.12),rgba(242,201,76,0.18))] p-5 shadow-[0_18px_45px_rgba(0,119,182,0.10)]">
          <h3 className="mb-3 text-lg font-semibold text-[#18465a]">Best Matches for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingUsers.map((profile) => (
              <SkillProfileCard
                key={profile._id}
                profile={profile}
                onConnect={(userId) => {
                  toast.success('Connection request sent!');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Profiles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#3D3D3D]">
          {showMatching ? 'Other Profiles' : 'All Profiles'}
        </h3>
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <SkillProfileCard
                key={profile._id}
                profile={profile}
                onConnect={(userId) => {
                  toast.success('Connection request sent!');
                }}
              />
            ))}
          </div>
        ) : (
          <div className={`${panelClassName} px-6 py-14 text-center`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E07A5F]/12 text-[#E07A5F]">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#3D3D3D]">No profiles found</h3>
            <p className="mt-2 text-sm text-[#6f655c]">
              {searchTerm || filterAvailability
                ? 'Try adjusting your search or filters'
                : 'No skill profiles available yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Collaborations = () => {
  const {
    collaborations,
    loading,
    creating,
    error,
    createCollaboration,
    updateCollaborationStatus,
    respondToCollaboration
  } = useCollaborations();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const handleCreateCollaboration = async (collaborationData) => {
    try {
      await createCollaboration(collaborationData);
      setShowForm(false);
      toast.success('Collaboration request created!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResponse = async (id, responseData) => {
    try {
      await respondToCollaboration(id, responseData);
      toast.success('Response submitted!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateCollaborationStatus(id, status);
      toast.success('Status updated!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading && collaborations.length === 0) {
    return <LoadingSpinner text="Loading collaborations..." />;
  }

  return (
    <div className={`${shellClassName} space-y-6`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3D3D3D]">Collaboration Requests</h1>
          <p className="mt-2 text-sm text-[#6f655c]">Post needs, review responses, and move ideas into shared work.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className={primaryButtonClassName}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#E07A5F]/30 bg-[#fff1ed] px-4 py-3 text-sm text-[#a3533c]">
          {error}
        </div>
      )}

      {collaborations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {collaborations.map((collaboration) => (
            <CollaborationCard
              key={collaboration._id}
              collaboration={collaboration}
              onResponse={handleResponse}
              onUpdateStatus={handleStatusUpdate}
              isOwner={collaboration.requestedBy._id === user?.id}
            />
          ))}
        </div>
      ) : (
        <div className={`${panelClassName} px-6 py-14 text-center`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2C94C]/18 text-[#b58c18]">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#3D3D3D]">No collaboration requests</h3>
          <p className="mt-2 text-sm text-[#6f655c]">Create your first request to find collaborators.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className={primaryButtonClassName}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <CollaborationForm
          onSubmit={handleCreateCollaboration}
          onCancel={() => setShowForm(false)}
          loading={creating}
        />
      )}
    </div>
  );
};

const SkillMatching = () => {
  return (
    <div className="space-y-6 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(0,119,182,0.10),transparent_38%),radial-gradient(circle_at_top_right,rgba(224,122,95,0.12),transparent_34%),linear-gradient(180deg,#FDF6EC_0%,#f9f1e4_100%)] p-4 md:p-6">
      <div className="overflow-hidden rounded-[28px] border border-[#d8e4e6] bg-white/60 shadow-[0_24px_70px_rgba(61,61,61,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-3 border-b border-[#eadfce] px-5 py-5 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0077B6]">Skill Matching Hub</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#3D3D3D]">Build stronger study connections</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#6f655c]">A warmer collaboration space for profiles, partner discovery, project asks, and cross-module matching.</p>
          </div>
          <div className="rounded-full bg-[#F2C94C]/20 px-4 py-2 text-sm font-medium text-[#8a6a10]">
            Thoughtful matching, calmer visuals
          </div>
        </div>
      {/* Navigation Tabs */}
      <div className="border-b border-[#eadfce] bg-[#fffaf2]/80 px-4 md:px-8">
        <nav className="-mb-px flex flex-wrap gap-2 py-3 md:space-x-3">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'border-[#0077B6] bg-[#0077B6] text-white shadow-[0_12px_24px_rgba(0,119,182,0.18)]'
                  : 'border-transparent text-[#6f655c] hover:border-[#d9cab6] hover:bg-white hover:text-[#3D3D3D]'
              }`
            }
          >
            My Profile
          </NavLink>
          <NavLink
            to="partners"
            className={({ isActive }) =>
              `inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'border-[#0077B6] bg-[#0077B6] text-white shadow-[0_12px_24px_rgba(0,119,182,0.18)]'
                  : 'border-transparent text-[#6f655c] hover:border-[#d9cab6] hover:bg-white hover:text-[#3D3D3D]'
              }`
            }
          >
            Find Partners
          </NavLink>
          <NavLink
            to="collaborations"
            className={({ isActive }) =>
              `inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'border-[#0077B6] bg-[#0077B6] text-white shadow-[0_12px_24px_rgba(0,119,182,0.18)]'
                  : 'border-transparent text-[#6f655c] hover:border-[#d9cab6] hover:bg-white hover:text-[#3D3D3D]'
              }`
            }
          >
            Collaborations
          </NavLink>
          <NavLink
            to="integrated"
            className={({ isActive }) =>
              `inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'border-[#0077B6] bg-[#0077B6] text-white shadow-[0_12px_24px_rgba(0,119,182,0.18)]'
                  : 'border-transparent text-[#6f655c] hover:border-[#d9cab6] hover:bg-white hover:text-[#3D3D3D]'
              }`
            }
          >
            <Link2 className="inline h-4 w-4 mr-1" />
            Integrated
          </NavLink>
        </nav>
      </div>
      </div>

      {/* Tab Content */}
      <Routes>
        <Route path="profile" element={<SkillProfile />} />
        <Route path="partners" element={<FindPartners />} />
        <Route path="collaborations" element={<Collaborations />} />
        <Route path="integrated" element={<IntegratedSkillMatching />} />
        <Route path="/" element={<SkillProfile />} />
      </Routes>
    </div>
  );
};

export default SkillMatching;
