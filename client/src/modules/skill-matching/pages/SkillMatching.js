import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Plus, Search, Users, User, MessageSquare, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSkillProfile, useSkillProfiles, useCollaborations, useMyCollaborations, useMatchingUsers } from '../hooks/useSkills';
import { useAuth } from '../../../context/AuthContext';
import SkillProfileCard from '../components/SkillProfileCard';
import CollaborationCard from '../components/CollaborationCard';
import SkillProfileForm from '../components/SkillProfileForm';
import CollaborationForm from '../components/CollaborationForm';
import LoadingSpinner from '../../../components/LoadingSpinner';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Skill Profile</h1>
          <p className="text-gray-600 mt-1">Showcase your skills and find study partners</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {profile ? (
        <SkillProfileCard profile={profile} showConnectButton={false} />
      ) : (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No profile yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your skill profile to get started</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Study Partners</h1>
          <p className="text-gray-600 mt-1">Connect with students who have complementary skills</p>
        </div>
        <button
          onClick={handleFindMatches}
          disabled={matchingLoading}
          className="btn-primary flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <Users className="h-4 w-4 mr-2" />
          {matchingLoading ? 'Finding...' : 'Find Matches'}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="form-input"
          >
            <option value="">All Availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Matching Users */}
      {showMatching && matchingUsers.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Best Matches for You</h3>
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
        <h3 className="text-lg font-semibold text-gray-900">
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
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No profiles found</h3>
            <p className="mt-1 text-sm text-gray-500">
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
  const { collaborations, loading, error, createCollaboration, updateCollaborationStatus, respondToCollaboration } = useCollaborations();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collaboration Requests</h1>
          <p className="text-gray-600 mt-1">Find collaborators for your projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
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
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No collaboration requests</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first request to find collaborators</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
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
          loading={loading}
        />
      )}
    </div>
  );
};

const SkillMatching = () => {
  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `py-2 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            My Profile
          </NavLink>
          <NavLink
            to="partners"
            className={({ isActive }) =>
              `py-2 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Find Partners
          </NavLink>
          <NavLink
            to="collaborations"
            className={({ isActive }) =>
              `py-2 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Collaborations
          </NavLink>
        </nav>
      </div>

      {/* Tab Content */}
      <Routes>
        <Route path="profile" element={<SkillProfile />} />
        <Route path="partners" element={<FindPartners />} />
        <Route path="collaborations" element={<Collaborations />} />
        <Route path="/" element={<SkillProfile />} />
      </Routes>
    </div>
  );
};

export default SkillMatching;
