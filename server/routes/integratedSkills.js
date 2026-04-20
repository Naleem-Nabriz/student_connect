const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTasksNeedingHelp,
  getGroupsNeedingSkills,
  getResourceSharingMatches,
  offerTaskHelp,
  joinGroupWithSkills,
  offerResourceShare,
  getSmartMatches,
  getSkillProgressCorrelation
} = require('../controllers/integratedSkillController');

// Task-Skill Integration Routes
router.get('/tasks/need-help', getTasksNeedingHelp);
router.post('/tasks/:taskId/offer-help', offerTaskHelp);

// Group-Skill Integration Routes
router.get('/groups/need-skills', getGroupsNeedingSkills);
router.post('/groups/:groupId/join-with-skills', joinGroupWithSkills);

// Resource-Skill Integration Routes
router.get('/resources/sharing-matches', getResourceSharingMatches);
router.post('/resources/:resourceId/offer-share', offerResourceShare);

// Smart Matching Routes
router.post('/matches/smart/:userId', getSmartMatches);

// Analytics Routes
router.get('/progress/correlation/:userId', getSkillProgressCorrelation);

module.exports = router;
