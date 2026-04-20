import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Calendar, UserPlus, UserMinus, Edit, Trash2, BookOpen, Check, X } from 'lucide-react';
import ResourceRecommendations from './ResourceRecommendations';

const GroupCard = ({
  group,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onAcceptRequest,
  onRejectRequest,
  isOwner = false,
  canDelete = false
}) => {
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id || null;
  const [showResources, setShowResources] = useState(false);

  const getEntityId = (entity) => {
    if (!entity) return null;
    if (typeof entity === 'string') return entity;
    return entity._id || entity.id || null;
  };
  
  const isMember = group.members?.some(member => getEntityId(member) === currentUserId);
  const pendingRequests = group.joinRequests || [];
  const hasPendingRequest = pendingRequests.some((request) => getEntityId(request.user) === currentUserId);
  const isFull = group.members?.length >= group.capacity;
  const canJoin = !isMember && !isFull && !isOwner && !hasPendingRequest;

  const handleJoin = () => {
    onJoin(group._id);
  };

  const handleLeave = () => {
    onLeave(group._id);
  };

  const handleEdit = () => {
    onEdit(group);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      onDelete(group._id);
    }
  };

  const handleResourceSelect = (resource) => {
    console.log('Selected resource for group:', group.name, resource);
  };

  const handleAcceptRequest = (userId) => {
    onAcceptRequest(group._id, userId);
  };

  const handleRejectRequest = (userId) => {
    onRejectRequest(group._id, userId);
  };

  return (
    <div className="card-hover rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-[#3D3D3D]">{group.name}</h3>
          <p className="mb-2 text-sm text-[#62574d]">{group.subject}</p>
          {group.description && (
            <p className="line-clamp-2 text-sm text-[#85786c]">{group.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowResources(!showResources)}
            className="rounded-full p-2 text-[#0077B6] transition-colors hover:bg-[#d9ecf7]"
            title="View resources"
          >
            <BookOpen className="h-4 w-4" />
          </button>
          {(isOwner || canDelete) && (
            <>
              {isOwner && (
              <button
                onClick={handleEdit}
                className="rounded-full p-2 text-[#0077B6] transition-colors hover:bg-[#d9ecf7]"
                title="Edit group"
              >
                <Edit className="h-4 w-4" />
              </button>
              )}
              <button
                onClick={handleDelete}
                className="rounded-full p-2 text-[#E07A5F] transition-colors hover:bg-[#f6e3dc]"
                title="Delete group"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-[#85786c]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.members?.length || 0}/{group.capacity}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(group.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className={`rounded-full px-2 py-1 text-xs font-medium ${
          isFull ? 'bg-[#f6e3dc] text-[#b85f47]' : 'bg-[#d9f1ea] text-[#0c6e59]'
        }`}>
          {isFull ? 'Full' : 'Available'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {(group.members || []).slice(0, 5).map((member, index) => (
            <div
              key={member._id || index}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(135deg,#0077B6,#4f9fc6)] text-xs font-medium text-white"
              title={member?.firstName ? `${member.firstName} ${member.lastName}` : member?.username || 'Group member'}
            >
              {member?.firstName ? member.firstName[0] : member?.username?.[0]?.toUpperCase() || '?'}
            </div>
          ))}
          {group.members?.length > 5 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#eadfce] text-xs font-medium text-[#62574d]">
              +{group.members.length - 5}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isOwner ? (
            <span className="text-xs font-medium text-[#85786c]">Owner</span>
          ) : isMember ? (
            <button
              onClick={handleLeave}
              className="flex items-center rounded-full px-4 py-2 text-sm text-[#E07A5F] transition-colors hover:bg-[#f6e3dc]"
            >
              <UserMinus className="h-4 w-4 mr-1" />
              Leave
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={!canJoin}
              className={`flex items-center rounded-full px-4 py-2 text-sm transition-colors ${
                canJoin
                  ? 'text-[#0077B6] hover:bg-[#d9ecf7]'
                  : 'cursor-not-allowed text-[#b7ab9e]'
              }`}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {hasPendingRequest ? 'Requested' : isFull ? 'Full' : 'Join'}
            </button>
          )}
        </div>
      </div>

      {isOwner && pendingRequests.length > 0 && (
        <div className="mt-4 border-t border-[#eadfce] pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#3D3D3D]">Pending join requests</h4>
            <span className="rounded-full bg-[#fff1cc] px-2 py-1 text-xs text-[#8a6a10]">
              {pendingRequests.length}
            </span>
          </div>
          <div className="space-y-2">
            {pendingRequests.map((request) => {
              const requestUserId = getEntityId(request.user);
              const requestName = request.user?.firstName
                ? `${request.user.firstName} ${request.user.lastName || ''}`.trim()
                : request.user?.username || 'Student';

              return (
                <div
                  key={requestUserId}
                  className="flex items-center justify-between rounded-2xl bg-[#fffaf2] px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-[#3D3D3D]">{requestName}</p>
                    <p className="text-xs text-[#85786c]">
                      Requested {request.requestedAt ? new Date(request.requestedAt).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(requestUserId)}
                      className="inline-flex items-center rounded-full bg-[#d9ecf7] px-3 py-1.5 text-xs font-medium text-[#0b5f8f] hover:bg-[#c9e2f1]"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(requestUserId)}
                      className="inline-flex items-center rounded-full bg-[#f6e3dc] px-3 py-1.5 text-xs font-medium text-[#b85f47] hover:bg-[#efd3ca]"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Created by info */}
      <div className="mt-4 border-t border-[#eadfce] pt-4">
        <p className="text-xs text-[#85786c]">
          Created by {group.createdBy?.firstName || group.createdBy?.username || 'Unknown user'} {group.createdBy?.lastName || ''}
        </p>
      </div>

      {/* Resource Recommendations Section */}
      {showResources && (
        <div className="mt-4 border-t border-[#eadfce] pt-4">
          <ResourceRecommendations
            groupData={group}
            onResourceSelect={handleResourceSelect}
            className="border-0 rounded-none shadow-none p-0"
          />
        </div>
      )}
    </div>
  );
};

export default GroupCard;
