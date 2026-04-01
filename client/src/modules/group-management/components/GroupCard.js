import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Calendar, UserPlus, UserMinus, Edit, Trash2, BookOpen, ExternalLink } from 'lucide-react';
import ResourceRecommendations from './ResourceRecommendations';

const GroupCard = ({ group, onJoin, onLeave, onEdit, onDelete, isOwner = false }) => {
  const { user } = useAuth();
  const [showResources, setShowResources] = useState(false);
  
  const isMember = group.members?.some(member => member._id === user?.id);
  const isFull = group.members?.length >= group.capacity;
  const canJoin = !isMember && !isFull && !isOwner;

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

  return (
    <div className="card-hover bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{group.subject}</p>
          {group.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{group.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowResources(!showResources)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
            title="View resources"
          >
            <BookOpen className="h-4 w-4" />
          </button>
          {isOwner && (
            <>
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit group"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete group"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {isFull ? 'Full' : 'Available'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {(group.members || []).slice(0, 5).map((member, index) => (
            <div
              key={member._id || index}
              className="w-8 h-8 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
              title={member.firstName ? `${member.firstName} ${member.lastName}` : member.username}
            >
              {member.firstName ? member.firstName[0] : member.username[0]?.toUpperCase()}
            </div>
          ))}
          {group.members?.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
              +{group.members.length - 5}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isOwner ? (
            <span className="text-xs text-gray-500 font-medium">Owner</span>
          ) : isMember ? (
            <button
              onClick={handleLeave}
              className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <UserMinus className="h-4 w-4 mr-1" />
              Leave
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={!canJoin}
              className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                canJoin
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {isFull ? 'Full' : 'Join'}
            </button>
          )}
        </div>
      </div>

      {/* Created by info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Created by {group.createdBy?.firstName} {group.createdBy?.lastName}
        </p>
      </div>

      {/* Resource Recommendations Section */}
      {showResources && (
        <div className="mt-4 pt-4 border-t border-gray-200">
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
