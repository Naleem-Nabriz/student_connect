const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createCollaborationRequest,
  getCollaborationRequests,
  getMyCollaborationRequests,
  getCollaborationById,
  respondToCollaboration,
  updateCollaborationStatus,
  findMatchingUsers
} = require('../controllers/collaborationController');

const router = express.Router();

// Validation rules
const createCollaborationValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('requiredSkills').isArray().withMessage('Required skills must be an array'),
  body('requiredSkills.*.name').trim().notEmpty().withMessage('Skill name is required')
];

const respondCollaborationValidation = [
  body('status').isIn(['interested', 'not_interested']).withMessage('Status must be interested or not_interested'),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message must be less than 500 characters')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'accepted', 'rejected', 'completed']).withMessage('Invalid status')
];

// Routes
router.post('/', auth, createCollaborationValidation, createCollaborationRequest);
router.get('/', auth, getCollaborationRequests);
router.get('/my', auth, getMyCollaborationRequests);
router.get('/match', auth, findMatchingUsers);
router.get('/:id', auth, getCollaborationById);
router.post('/:id/respond', auth, respondCollaborationValidation, respondToCollaboration);
router.put('/:id/status', auth, updateStatusValidation, updateCollaborationStatus);

module.exports = router;
