import React, { useState } from 'react';
import { UserPlus, Mail, MapPin, Clock, Star } from 'lucide-react';

const SkillProfileCard = ({ profile, onConnect, showConnectButton = true }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-green-100 text-green-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect(profile.userId._id);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="card-hover bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {profile.userId.firstName?.[0] || profile.userId.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {profile.userId.firstName} {profile.userId.lastName}
            </h3>
            <p className="text-sm text-gray-500">@{profile.userId.username}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(profile.availability)}`}>
          <Clock className="w-3 h-3 mr-1" />
          {profile.availability}
        </span>
      </div>

      {profile.bio && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{profile.bio}</p>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                {skill.name}
              </span>
              <span className="text-xs text-gray-500 capitalize">{skill.level}</span>
            </div>
          ))}
        </div>
      </div>

      {profile.matchScore && (
        <div className="mb-4 p-2 bg-blue-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Match Score</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-bold text-blue-900">{profile.matchScore}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Mail className="w-3 h-3 mr-1" />
            {profile.userId.email}
          </div>
        </div>

        {showConnectButton && (
          <button
            onClick={handleConnect}
            disabled={isConnecting || profile.availability === 'offline'}
            className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
              isConnecting || profile.availability === 'offline'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillProfileCard;
