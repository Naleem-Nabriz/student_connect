import React, { useState } from 'react';
import { UserPlus, Mail, Clock, Star, CheckCircle, Link, Users, Globe } from 'lucide-react';

const SkillProfileCard = ({ profile, onConnect, showConnectButton = true }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'bg-[#d9f1ea] text-[#0c6e59]';
      case 'busy':
        return 'bg-[#fff1cc] text-[#8a6a10]';
      case 'offline':
        return 'bg-[#efe4d8] text-[#76685c]';
      default:
        return 'bg-[#efe4d8] text-[#76685c]';
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-[#d9ecf7] text-[#0b5f8f]';
      case 'intermediate':
        return 'bg-[#d9f1ea] text-[#0c6e59]';
      case 'advanced':
        return 'bg-[#f6e3dc] text-[#b85f47]';
      case 'expert':
        return 'bg-[#fff1cc] text-[#8a6a10]';
      default:
        return 'bg-[#efe4d8] text-[#76685c]';
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
    <div className="card-hover rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)]">
      {/* Profile Completion Score */}
      {profile.profileCompletion !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-[#6f655c]">Profile Strength</span>
            <span className={`font-medium ${
              profile.profileCompletion >= 80 ? 'text-[#0c6e59]' :
              profile.profileCompletion >= 60 ? 'text-[#8a6a10]' : 'text-[#b85f47]'
            }`}>
              {profile.profileCompletion}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#efe4d8]">
            <div
              className={`h-1.5 rounded-full ${
                profile.profileCompletion >= 80 ? 'bg-[#0077B6]' :
                profile.profileCompletion >= 60 ? 'bg-[#F2C94C]' : 'bg-[#E07A5F]'
              }`}
              style={{ width: `${profile.profileCompletion}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {profile.userId.firstName?.[0] || profile.userId.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#3D3D3D]">
              {profile.userId.firstName} {profile.userId.lastName}
            </h3>
            <p className="text-sm text-[#85786c]">@{profile.userId.username}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(profile.availability)}`}>
          <Clock className="w-3 h-3 mr-1" />
          {profile.availability}
        </span>
      </div>

      {profile.bio && (
        <p className="mb-4 text-sm leading-6 text-[#62574d] line-clamp-2">{profile.bio}</p>
      )}

      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-[#3D3D3D]">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                {skill.name}
                {skill.verified && (
                  <CheckCircle className="ml-1 h-3 w-3 text-[#0077B6]" title="Verified Skill" />
                )}
              </span>
              <span className="text-xs capitalize text-[#85786c]">{skill.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Study Preferences */}
      {profile.studyPreferences && (
        <div className="mb-4 rounded-2xl border border-[#f0e1cf] bg-[#fffaf2] p-3">
          <h4 className="mb-2 text-sm font-medium text-[#3D3D3D]">Study Preferences</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {profile.studyPreferences.studyMode && (
              <span className="inline-flex items-center rounded-full bg-[#d9ecf7] px-2 py-1 text-[#0b5f8f]">
                <Globe className="w-3 h-3 mr-1" />
                {profile.studyPreferences.studyMode}
              </span>
            )}
            {profile.studyPreferences.groupSize && (
              <span className="inline-flex items-center rounded-full bg-[#f6e3dc] px-2 py-1 text-[#b85f47]">
                <Users className="w-3 h-3 mr-1" />
                {profile.studyPreferences.groupSize}
              </span>
            )}
            {profile.studyPreferences.preferredStudyTimes?.slice(0, 2).map(time => (
              <span key={time} className="inline-flex items-center rounded-full bg-[#fff1cc] px-2 py-1 text-[#8a6a10]">
                <Clock className="w-3 h-3 mr-1" />
                {time}
              </span>
            ))}
          </div>
          {profile.studyPreferences.studyGoals?.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-[#6f655c]">Goals: </span>
              <span className="text-xs text-[#3D3D3D]">
                {profile.studyPreferences.studyGoals.slice(0, 2).join(', ')}
                {profile.studyPreferences.studyGoals.length > 2 && '...'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Portfolio Links */}
      {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-[#3D3D3D]">Portfolio</h4>
          <div className="flex flex-wrap gap-2">
            {profile.portfolioLinks.slice(0, 3).map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-[#efe4d8] px-2 py-1 text-xs text-[#5d544d] transition-colors hover:bg-[#e4d6c6]"
              >
                <Link className="w-3 h-3 mr-1" />
                {link.title || link.type}
              </a>
            ))}
            {profile.portfolioLinks.length > 3 && (
              <span className="text-xs text-[#85786c]">+{profile.portfolioLinks.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {profile.matchScore && (
        <div className="mb-4 rounded-2xl border border-[#d9ecf7] bg-[#eef7fb] p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#18465a]">Match Score</span>
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-current text-[#F2C94C]" />
              <span className="text-sm font-bold text-[#18465a]">{profile.matchScore}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[#eadfce] pt-4">
        <div className="flex items-center space-x-4 text-xs text-[#85786c]">
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
                ? 'cursor-not-allowed bg-[#efe4d8] text-[#a59a8f]'
                : 'bg-[#0077B6] text-white hover:bg-[#005f92]'
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
