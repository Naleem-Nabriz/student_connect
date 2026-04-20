import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../../../context/AuthContext';
import GroupCard from '../components/GroupCard';
import GroupForm from '../components/GroupForm';
import LoadingSpinner from '../../../components/LoadingSpinner';

const getEntityId = (entity) => {
  if (!entity) return null;
  if (typeof entity === 'string') return entity;
  return entity._id || entity.id || null;
};

const GroupList = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id || null;
  const isAdmin = user?.role === 'admin';
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
  
  const {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    acceptJoinRequest,
    rejectJoinRequest,
    leaveGroup,
  } = useGroups();

  const handleCreateGroup = async (groupData) => {
    setIsSubmittingGroup(true);
    try {
      await createGroup(groupData);
      setShowForm(false);
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmittingGroup(false);
    }
  };

  const handleUpdateGroup = async (groupData) => {
    setIsSubmittingGroup(true);
    try {
      await updateGroup(editingGroup._id, groupData);
      setEditingGroup(null);
      toast.success('Group updated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmittingGroup(false);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await deleteGroup(id);
      toast.success('Group deleted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleJoinGroup = async (id) => {
    try {
      await joinGroup(id);
      toast.success('Join request sent to the group creator.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAcceptRequest = async (groupId, userId) => {
    try {
      await acceptJoinRequest(groupId, userId);
      toast.success('Student added to the group.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRejectRequest = async (groupId, userId) => {
    try {
      await rejectJoinRequest(groupId, userId);
      toast.success('Join request declined.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLeaveGroup = async (id) => {
    try {
      await leaveGroup(id);
      toast.success('Successfully left the group!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || group.subject.toLowerCase() === filterSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(groups.map(group => group.subject))];

  if (loading && groups.length === 0) {
    return <LoadingSpinner text="Loading groups..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>
          <p className="text-gray-600 mt-1">Join or create study groups to collaborate with peers</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="form-input"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Groups Grid */}
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onJoin={handleJoinGroup}
              onLeave={handleLeaveGroup}
              onEdit={setEditingGroup}
              onDelete={handleDeleteGroup}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              isOwner={getEntityId(group.createdBy) === currentUserId}
              canDelete={getEntityId(group.createdBy) === currentUserId || isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Plus className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No groups found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterSubject
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first study group'}
          </p>
          {!searchTerm && !filterSubject && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Group Modal */}
      {(showForm || editingGroup) && (
        <GroupForm
          group={editingGroup}
          onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
          onCancel={() => {
            setShowForm(false);
            setEditingGroup(null);
          }}
          loading={isSubmittingGroup}
        />
      )}
    </div>
  );
};

export default GroupList;
