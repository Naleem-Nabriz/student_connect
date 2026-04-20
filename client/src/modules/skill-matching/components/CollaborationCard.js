import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Clock, MessageCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CollaborationCard = ({ collaboration, onResponse, onUpdateStatus, isOwner = false }) => {
  const { user } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#fff1cc] text-[#8a6a10]';
      case 'accepted':
        return 'bg-[#d9ecf7] text-[#0b5f8f]';
      case 'rejected':
        return 'bg-[#f6e3dc] text-[#b85f47]';
      case 'completed':
        return 'bg-[#d9f1ea] text-[#0c6e59]';
      default:
        return 'bg-[#efe4d8] text-[#76685c]';
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
    <div className="card-hover rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-[#3D3D3D]">{collaboration.title}</h3>
          <p className="mb-3 text-sm leading-6 text-[#62574d] line-clamp-3">{collaboration.description}</p>
          
          <div className="mb-3 flex items-center space-x-4 text-sm text-[#85786c]">
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
        <h4 className="mb-2 text-sm font-medium text-[#3D3D3D]">Required Skills</h4>
        <div className="flex flex-wrap gap-2">
          {collaboration.requiredSkills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-[#d9ecf7] px-2 py-1 text-xs font-medium text-[#0b5f8f]"
            >
              {skill.name}
              <span className="ml-1 capitalize text-[#0077B6]">({skill.level})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Responses */}
      {collaboration.responses && collaboration.responses.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-[#3D3D3D]">
            Responses ({collaboration.responses.length})
          </h4>
          <div className="space-y-2">
            {collaboration.responses.slice(0, 3).map((response, index) => (
              <div key={index} className="flex items-center justify-between rounded-2xl bg-[#fffaf2] p-2">
                <div className="flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eadfce] text-xs font-medium text-[#3D3D3D]">
                    {response.user.firstName?.[0] || response.user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-[#4e463e]">
                    {response.user.firstName} {response.user.lastName}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    response.status === 'interested' 
                      ? 'bg-[#d9f1ea] text-[#0c6e59]' 
                      : 'bg-[#f6e3dc] text-[#b85f47]'
                  }`}>
                    {response.status === 'interested' ? 'Interested' : 'Not Interested'}
                  </span>
                </div>
              </div>
            ))}
            {collaboration.responses.length > 3 && (
              <p className="text-center text-xs text-[#85786c]">
                +{collaboration.responses.length - 3} more responses
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-[#eadfce] pt-4">
        <div className="flex items-center space-x-2">
          {collaboration.responses && collaboration.responses.length > 0 && (
            <div className="flex items-center text-xs text-[#85786c]">
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
                    className="rounded-full bg-[#0077B6] px-4 py-2 text-sm text-white transition-colors hover:bg-[#005f92]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="rounded-full bg-[#E07A5F] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c96a52]"
                  >
                    Reject
                  </button>
                </>
              )}
              {collaboration.status === 'accepted' && (
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  className="rounded-full bg-[#F2C94C] px-4 py-2 text-sm text-[#5b4709] transition-colors hover:bg-[#ddb73f]"
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
                  className="rounded-full bg-[#0077B6] px-4 py-2 text-sm text-white transition-colors hover:bg-[#005f92]"
                >
                  Interested
                </button>
                <button
                  onClick={() => handleResponse('not_interested')}
                  className="rounded-full bg-[#efe4d8] px-4 py-2 text-sm text-[#5d544d] transition-colors hover:bg-[#e4d6c6]"
                >
                  Not Interested
                </button>
              </div>
            )
          )}
          
          {hasResponded && (
            <span className="text-xs text-[#85786c]">
              You responded: {userResponse.status === 'interested' ? 'Interested' : 'Not Interested'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationCard;
