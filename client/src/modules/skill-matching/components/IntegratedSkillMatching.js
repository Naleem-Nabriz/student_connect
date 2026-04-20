import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, BookOpen, Target, Clock, Star, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import groupService from '../../group-management/services/groupService';
import resourceService from '../../resource-management/services/resourceService';
import integratedSkillService from '../services/integratedSkillService';
import skillService from '../services/skillService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const getEntityId = (entity) => {
  if (!entity) return null;
  if (typeof entity === 'string') return entity;
  return entity._id || entity.id || null;
};

const buildGroupSearchValues = (group) => [
  group.name || '',
  group.subject || '',
  group.description || '',
  group.createdBy?.firstName || '',
  group.createdBy?.lastName || '',
  group.createdBy?.username || '',
];

const buildResourceSearchValues = (resource) => [
  resource.title || '',
  resource.subject || '',
  resource.description || '',
  resource.type || '',
  resource.uploadedBy?.firstName || '',
  resource.uploadedBy?.lastName || '',
  resource.uploadedBy?.username || '',
  ...(resource.tags || []),
];

const buildMatchSearchValues = (match) => [
  match.name || '',
  ...(match.skills || []),
  ...(match.canHelpWith || []),
  ...(match.needsHelpWith || []),
  match.recentActivity || '',
];

const buildTaskSearchValues = (task) => [
  task.title || '',
  task.subject || '',
  task.description || '',
  task.postedBy || '',
  ...(task.suggestedSkills || []),
  ...(task.potentialHelpers || []),
];

const IntegratedSkillMatching = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id || null;
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [taskHelp, setTaskHelp] = useState([]);
  const [groupNeeds, setGroupNeeds] = useState([]);
  const [resourceRequests, setResourceRequests] = useState([]);

  const loadUserSkills = useCallback(async () => {
    try {
      const profile = await skillService.getMySkillProfile();
      return profile.skills?.map((skill) => skill.name).filter(Boolean) || [];
    } catch (error) {
      if (error.message?.toLowerCase().includes('skill profile not found')) {
        return [];
      }
      throw error;
    }
  }, []);

  const fetchSkillMatches = useCallback(async (userSkills) => {
    if (!currentUserId || userSkills.length === 0) {
      return [];
    }

    const response = await integratedSkillService.getSmartMatches(currentUserId, {});
    return response.matches || [];
  }, [currentUserId]);

  const fetchTasksNeedingHelp = useCallback(async (userSkills) => {
    if (userSkills.length === 0) {
      return [];
    }

    const response = await integratedSkillService.getTasksNeedingHelp(userSkills);
    return Array.isArray(response) ? response : [];
  }, []);

  const fetchGroupNeeds = async () => {
    const response = await groupService.getGroups();
    return response.groups || [];
  };

  const fetchResourceSharing = async () => {
    const response = await resourceService.getResources();
    return response.resources || [];
  };

  const fetchIntegratedData = useCallback(async () => {
    setLoading(true);
    try {
      const userSkills = await loadUserSkills();

      const [skillMatches, tasksNeedingHelp, liveGroups, liveResources] = await Promise.all([
        fetchSkillMatches(userSkills),
        fetchTasksNeedingHelp(userSkills),
        fetchGroupNeeds(),
        fetchResourceSharing(),
      ]);

      const normalizedQuery = searchTerm.trim().toLowerCase();
      const matchQuery = (values) => !normalizedQuery || values.some((value) => value.toLowerCase().includes(normalizedQuery));

      setMatches(skillMatches.filter((match) => matchQuery(buildMatchSearchValues(match))));
      setTaskHelp(tasksNeedingHelp.filter((task) => matchQuery(buildTaskSearchValues(task))));
      setGroupNeeds(liveGroups.filter((group) => matchQuery(buildGroupSearchValues(group))));
      setResourceRequests(liveResources.filter((resource) => matchQuery(buildResourceSearchValues(resource))));
    } catch (error) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchSkillMatches, fetchTasksNeedingHelp, loadUserSkills, searchTerm]);

  useEffect(() => {
    fetchIntegratedData();
  }, [fetchIntegratedData]);

  const handleConnect = async (type) => {
    try {
      toast.success(`Connection request sent for ${type}!`);
    } catch (error) {
      toast.error('Failed to send connection request');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const updatedGroup = await groupService.joinGroup(groupId);
      setGroupNeeds((prev) => prev.map((group) => (
        group._id === groupId ? updatedGroup : group
      )));
      toast.success('Join request sent to the group creator!');
    } catch (error) {
      toast.error(error.message || 'Failed to join group');
    }
  };

  const openResource = (resource) => {
    if (resource.type === 'link' && resource.linkUrl) {
      window.open(resource.linkUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (resource.fileUrl) {
      const normalizedUrl = resource.fileUrl.startsWith('http')
        ? resource.fileUrl
        : `${FILE_BASE_URL}${resource.fileUrl}`;
      window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    navigate('/resources');
  };

  const renderSkillMatches = () => (
    <div className="space-y-4">
      {matches.map((match) => (
        <div key={match.id} className="rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)] transition-shadow hover:shadow-[0_22px_55px_rgba(0,119,182,0.10)]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0077B6,#4f9fc6)] text-white font-bold">
                  {match.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#3D3D3D]">{match.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-[#6f655c]">
                    <span className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-[#F2C94C]" />
                      {match.rating}
                    </span>
                    <span>{match.collaborations} collaborations</span>
                    <span>{match.availability}</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#5d544d]">Match Score</span>
                  <span className="text-sm font-bold text-[#0077B6]">{match.matchScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#efe4d8]">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#0077B6,#F2C94C)]"
                    style={{ width: `${match.matchScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="mb-1 text-sm font-medium text-[#5d544d]">Can Help With:</p>
                  <div className="flex flex-wrap gap-1">
                    {match.canHelpWith.map((skill, idx) => (
                      <span key={idx} className="rounded-full bg-[#d9ecf7] px-2 py-1 text-xs text-[#0b5f8f]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-[#5d544d]">Needs Help With:</p>
                  <div className="flex flex-wrap gap-1">
                    {match.needsHelpWith.map((skill, idx) => (
                      <span key={idx} className="rounded-full bg-[#f6e3dc] px-2 py-1 text-xs text-[#b85f47]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mb-3 text-sm text-[#62574d]">
                <span className="font-medium">Recent:</span> {match.recentActivity}
              </p>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleConnect('skill_match')}
                  className="rounded-full bg-[#0077B6] px-4 py-2 text-sm text-white transition-colors hover:bg-[#005f92]"
                >
                  Connect
                </button>
                <button className="rounded-full border border-[#d9cab6] px-4 py-2 text-sm text-[#5d544d] transition-colors hover:bg-[#fff7ed]">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTaskHelp = () => (
    <div className="space-y-4">
      {taskHelp.map((task) => (
        <div key={task.id} className="rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)] transition-shadow hover:shadow-[0_22px_55px_rgba(0,119,182,0.10)]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-[#3D3D3D]">{task.title}</h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-[#6f655c]">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {task.subject}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Due: {task.deadline}
                </span>
                <span className={`rounded-full px-2 py-1 text-xs ${task.urgency === 'High' ? 'bg-[#f6e3dc] text-[#b85f47]' : 'bg-[#fff1cc] text-[#8a6a10]'}`}>
                  {task.urgency} Priority
                </span>
              </div>
            </div>
          </div>

          <p className="mb-3 text-[#62574d]">{task.description}</p>

          <div className="mb-3">
            <p className="mb-1 text-sm font-medium text-[#5d544d]">Suggested Skills Needed:</p>
            <div className="flex flex-wrap gap-1">
              {task.suggestedSkills.map((skill, idx) => (
                <span key={idx} className="rounded-full bg-[#d9ecf7] px-2 py-1 text-xs text-[#0b5f8f]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1 text-sm font-medium text-[#5d544d]">Potential Helpers:</p>
            <div className="flex flex-wrap gap-2">
              {task.potentialHelpers.map((helper, idx) => (
                <span key={idx} className="rounded-full bg-[#d9f1ea] px-2 py-1 text-xs text-[#0c6e59]">
                  {helper}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6f655c]">Posted by: {task.postedBy}</p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleConnect('task_help')}
                className="rounded-full bg-[#E07A5F] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c96a52]"
              >
                Offer Help
              </button>
              <button className="rounded-full border border-[#d9cab6] px-4 py-2 text-sm text-[#5d544d] transition-colors hover:bg-[#fff7ed]">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGroupNeeds = () => (
    <div className="space-y-4">
      {groupNeeds.map((group) => (
        <div key={group._id} className="rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)] transition-shadow hover:shadow-[0_22px_55px_rgba(0,119,182,0.10)]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-[#3D3D3D]">{group.name}</h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-[#6f655c]">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members?.length || 0}/{group.capacity} members
                </span>
                <span className={`rounded-full px-2 py-1 text-xs ${(group.members?.length || 0) >= group.capacity ? 'bg-[#f6e3dc] text-[#b85f47]' : 'bg-[#d9f1ea] text-[#0c6e59]'}`}>
                  {(group.members?.length || 0) >= group.capacity ? 'Full' : 'Open for members'}
                </span>
              </div>
            </div>
          </div>

          <p className="mb-3 text-[#62574d]">{group.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="mb-1 text-sm font-medium text-[#5d544d]">Subject:</p>
              <span className="inline-flex rounded-full bg-[#efe4d8] px-2 py-1 text-xs text-[#5d544d]">
                {group.subject}
              </span>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-[#5d544d]">Created by:</p>
              <span className="inline-flex rounded-full bg-[#d9ecf7] px-2 py-1 text-xs text-[#0b5f8f]">
                {group.createdBy?.firstName || group.createdBy?.username || 'Unknown user'} {group.createdBy?.lastName || ''}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {(group.members || []).slice(0, 5).map((member, idx) => (
                <div key={getEntityId(member) || idx} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(135deg,#0077B6,#4f9fc6)] text-xs font-bold text-white">
                  {member?.firstName?.[0] || member?.username?.[0]?.toUpperCase() || '?'}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleJoinGroup(group._id)}
                disabled={
                  !currentUserId ||
                  (group.members || []).some((member) => getEntityId(member) === currentUserId) ||
                  (group.members?.length || 0) >= group.capacity ||
                  getEntityId(group.createdBy) === currentUserId
                }
                className="rounded-full bg-[#0077B6] px-4 py-2 text-sm text-white transition-colors hover:bg-[#005f92] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {(group.members || []).some((member) => getEntityId(member) === currentUserId)
                  ? 'Joined'
                  : getEntityId(group.createdBy) === currentUserId
                    ? 'Owner'
                    : (group.members?.length || 0) >= group.capacity
                      ? 'Full'
                      : 'Join Group'}
              </button>
              <button
                onClick={() => navigate('/groups')}
                className="rounded-full border border-[#d9cab6] px-4 py-2 text-sm text-[#5d544d] transition-colors hover:bg-[#fff7ed]"
              >
                View Group
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderResourceRequests = () => (
    <div className="space-y-4">
      {resourceRequests.map((resource) => (
        <div key={resource._id} className="rounded-[24px] border border-[#d8e4e6] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(253,246,236,0.92))] p-6 shadow-[0_18px_45px_rgba(61,61,61,0.08)] transition-shadow hover:shadow-[0_22px_55px_rgba(0,119,182,0.10)]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-[#3D3D3D]">{resource.title}</h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-[#6f655c]">
                <span>Shared by: {resource.uploadedBy?.firstName || resource.uploadedBy?.username || 'Unknown user'} {resource.uploadedBy?.lastName || ''}</span>
                <span className="rounded-full bg-[#d9ecf7] px-2 py-1 text-xs text-[#0b5f8f]">
                  {resource.type}
                </span>
              </div>
            </div>
          </div>

          <p className="mb-3 text-[#62574d]">{resource.description}</p>

          <div className="mb-3 rounded-2xl border border-[#d9ecf7] bg-[#eef7fb] p-3">
            <p className="mb-1 text-sm font-medium text-[#18465a]">Resource Details</p>
            <p className="text-sm text-[#0b5f8f]">
              {`Subject: ${resource.subject}${resource.tags?.length ? ` | Tags: ${resource.tags.join(', ')}` : ''}`}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-[#85786c]" />
              <span className="text-sm text-[#6f655c]">
                {resource.averageRating ? `${resource.averageRating.toFixed(1)} rating` : 'Resource Sharing'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => openResource(resource)}
                className="rounded-full bg-[#0077B6] px-4 py-2 text-sm text-white transition-colors hover:bg-[#005f92]"
              >
                Open Resource
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="rounded-full border border-[#d9cab6] px-4 py-2 text-sm text-[#5d544d] transition-colors hover:bg-[#fff7ed]"
              >
                Browse Library
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-[28px] border border-[#d8e4e6] bg-[#fffaf2] p-5 shadow-[0_18px_45px_rgba(61,61,61,0.06)] md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3D3D3D]">Integrated Skill Matching</h1>
          <p className="mt-2 text-sm text-[#6f655c]">Connect skills with tasks, groups, and resources in one warm workspace.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b8176]" />
            <input
              type="text"
              placeholder="Search skills, subjects, or people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full border border-[#c7d8da] bg-[#fffdf8] py-3 pl-10 pr-4 text-sm text-[#3D3D3D] placeholder:text-[#8b8176] focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20"
            />
          </div>
          <button className="flex items-center rounded-full border border-[#d9cab6] px-4 py-3 text-[#5d544d] hover:bg-[#fff7ed]">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-[22px] bg-[linear-gradient(135deg,#0077B6,#4f9fc6)] p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Skill Matches</p>
              <p className="text-2xl font-bold">{matches.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="rounded-[22px] bg-[linear-gradient(135deg,#E07A5F,#ef9e86)] p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Tasks Needing Help</p>
              <p className="text-2xl font-bold">{taskHelp.length}</p>
            </div>
            <Target className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="rounded-[22px] bg-[linear-gradient(135deg,#F2C94C,#e7b83a)] p-4 text-[#5b4709]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Study Groups</p>
              <p className="text-2xl font-bold">{groupNeeds.length}</p>
            </div>
            <Users className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        <div className="rounded-[22px] bg-[linear-gradient(135deg,#3ea3d1,#0077B6)] p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Shared Resources</p>
              <p className="text-2xl font-bold">{resourceRequests.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="border-b border-[#eadfce]">
        <nav className="-mb-px flex flex-wrap gap-2 md:space-x-3">
          {[
            { id: 'discover', label: 'Skill Matches', icon: Users },
            { id: 'tasks', label: 'Task Help', icon: Target },
            { id: 'groups', label: 'Group Needs', icon: Users },
            { id: 'resources', label: 'Resource Sharing', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'border-[#0077B6] bg-[#0077B6] text-white shadow-[0_12px_24px_rgba(0,119,182,0.18)]'
                    : 'border-transparent text-[#6f655c] hover:border-[#d9cab6] hover:bg-white hover:text-[#3D3D3D]'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
                {tab.id === 'discover' && (
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-1 text-xs">
                    {matches.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'discover' && renderSkillMatches()}
        {activeTab === 'tasks' && renderTaskHelp()}
        {activeTab === 'groups' && renderGroupNeeds()}
        {activeTab === 'resources' && renderResourceRequests()}
      </div>
    </div>
  );
};

export default IntegratedSkillMatching;

