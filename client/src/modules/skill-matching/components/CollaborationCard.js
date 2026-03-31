import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Clock, MessageCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CollaborationCard = ({ collaboration, onResponse, onUpdateStatus, isOwner = false }) => {
  const { user } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleResponse = async (status, message = '') => {
    try {
      await onResponse(collaboration._id, { status, message });
    } catch (error) {
      console.error('Error responding to collaboration:', error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await onUpdateStatus(collaboration._id, newStatus);
    } catch (error) {
      console.error('Error updating collaboration status:', error);
    }
  };

  const hasResponded = collaboration.responses?.some(response => response.user._id === user?.id);
  const userResponse = collaboration.responses?.find(response => response.user._id === user?.id);

  return (
    <div className="card-hover bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{collaboration.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">{collaboration.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>by {collaboration.requestedBy.firstName} {collaboration.requestedBy.lastName}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{new Date(collaboration.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(collaboration.status)}`}>
              {getStatusIcon(collaboration.status)}
              <span className="ml-1 capitalize">{collaboration.status}</span>
            </span>
            {collaboration.deadline && (
              <span className="text-xs text-gray-500">
                Deadline: {new Date(collaboration.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
        <div className="flex flex-wrap gap-2">
          {collaboration.requiredSkills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800"
            >
              {skill.name}
              <span className="ml-1 text-purple-600 capitalize">({skill.level})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Responses */}
      {collaboration.responses && collaboration.responses.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Responses ({collaboration.responses.length})
          </h4>
          <div className="space-y-2">
            {collaboration.responses.slice(0, 3).map((response, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                    {response.user.firstName?.[0] || response.user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">
                    {response.user.firstName} {response.user.lastName}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    response.status === 'interested' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {response.status === 'interested' ? 'Interested' : 'Not Interested'}
                  </span>
                </div>
              </div>
            ))}
            {collaboration.responses.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                +{collaboration.responses.length - 3} more responses
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {collaboration.responses && collaboration.responses.length > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <MessageCircle className="w-3 h-3 mr-1" />
              {collaboration.responses.length} responses
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isOwner ? (
            // Owner can update status
            <div className="flex items-center space-x-2">
              {collaboration.status === 'pending' && collaboration.responses.length > 0 && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              {collaboration.status === 'accepted' && (
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </div>
          ) : (
            // Other users can respond
            !hasResponded && collaboration.status === 'pending' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleResponse('interested')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Interested
                </button>
                <button
                  onClick={() => handleResponse('not_interested')}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Not Interested
                </button>
              </div>
            )
          )}
          
          {hasResponded && (
            <span className="text-xs text-gray-500">
              You responded: {userResponse.status === 'interested' ? 'Interested' : 'Not Interested'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationCard;
