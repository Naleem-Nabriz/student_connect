import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || '/api'}/skills/integrated`;

const integratedSkillService = {
  // Skill matching with task integration
  getTaskBasedMatches: async (taskId) => {
    const response = await axios.get(`${API_URL}/matches/task/${taskId}`);
    return response.data;
  },

  // Find help for specific tasks
  getTasksNeedingHelp: async (userSkills = []) => {
    const response = await axios.get(`${API_URL}/tasks/need-help`, {
      params: { skills: userSkills.join(',') }
    });
    return response.data;
  },

  // Offer help for a task
  offerTaskHelp: async (taskId, offerData) => {
    const response = await axios.post(`${API_URL}/tasks/${taskId}/offer-help`, offerData);
    return response.data;
  },

  // Group skill gap analysis
  getGroupSkillGaps: async (groupId) => {
    const response = await axios.get(`${API_URL}/groups/${groupId}/skill-gaps`);
    return response.data;
  },

  // Find groups needing specific skills
  getGroupsNeedingSkills: async (userSkills = []) => {
    const response = await axios.get(`${API_URL}/groups/need-skills`, {
      params: { skills: userSkills.join(',') }
    });
    return response.data;
  },

  // Join group based on skill contribution
  joinGroupWithSkills: async (groupId, skills) => {
    const response = await axios.post(`${API_URL}/groups/${groupId}/join-with-skills`, { skills });
    return response.data;
  },

  // Resource sharing based on skills
  getResourceSharingMatches: async (userSkills = []) => {
    const response = await axios.get(`${API_URL}/resources/sharing-matches`, {
      params: { skills: userSkills.join(',') }
    });
    return response.data;
  },

  // Offer resource sharing
  offerResourceShare: async (resourceId, offerData) => {
    const response = await axios.post(`${API_URL}/resources/${resourceId}/offer-share`, offerData);
    return response.data;
  },

  // Academic progress integration
  getSkillProgressCorrelation: async (userId) => {
    const response = await axios.get(`${API_URL}/progress/correlation/${userId}`);
    return response.data;
  },

  // Get skill recommendations based on academic performance
  getSkillRecommendations: async (academicData) => {
    const response = await axios.post(`${API_URL}/skills/recommendations/academic`, academicData);
    return response.data;
  },

  // Task-Skill integration
  createSkillBasedTask: async (taskData) => {
    const response = await axios.post(`${API_URL}/skills/tasks/skill-based`, taskData);
    return response.data;
  },

  // Get tasks that match user's skill level
  getSkillAppropriateTasks: async (userId, difficulty = 'medium') => {
    const response = await axios.get(`${API_URL}/skills/tasks/appropriate/${userId}`, {
      params: { difficulty }
    });
    return response.data;
  },

  // Collaboration tracking
  trackCollaboration: async (collaborationData) => {
    const response = await axios.post(`${API_URL}/skills/collaborations/track`, collaborationData);
    return response.data;
  },

  // Get collaboration impact on academic performance
  getCollaborationImpact: async (userId) => {
    const response = await axios.get(`${API_URL}/skills/collaborations/impact/${userId}`);
    return response.data;
  },

  // Smart matching algorithm
  getSmartMatches: async (userId, preferences = {}) => {
    const response = await axios.post(`${API_URL}/matches/smart/${userId}`, preferences);
    return response.data;
  },

  // Update matching preferences
  updateMatchingPreferences: async (userId, preferences) => {
    const response = await axios.put(`${API_URL}/skills/users/${userId}/matching-preferences`, preferences);
    return response.data;
  },

  // Skill verification
  verifySkill: async (userId, skillData) => {
    const response = await axios.post(`${API_URL}/skills/users/${userId}/verify-skill`, skillData);
    return response.data;
  },

  // Get verified skills
  getVerifiedSkills: async (userId) => {
    const response = await axios.get(`${API_URL}/skills/users/${userId}/verified-skills`);
    return response.data;
  }
};

export default integratedSkillService;
