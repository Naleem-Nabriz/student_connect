const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup,
  acceptJoinRequest,
  rejectJoinRequest,
  leaveGroup,
  updateGroup,
  deleteGroup
} = require('../controllers/groupController');

const router = express.Router();

// Validation rules
const createGroupValidation = [
  body('name').trim().notEmpty().withMessage('Group name is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('capacity').isInt({ min: 2, max: 50 }).withMessage('Capacity must be between 2 and 50')
];

const updateGroupValidation = [
  body('name').optional().trim().notEmpty().withMessage('Group name cannot be empty'),
  body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
  body('capacity').optional().isInt({ min: 2, max: 50 }).withMessage('Capacity must be between 2 and 50')
];

// Routes
router.post('/', auth, createGroupValidation, createGroup);
router.get('/', auth, getGroups);
router.get('/:id', auth, getGroupById);
router.post('/:id/join', auth, joinGroup);
router.post('/:id/requests/:userId/accept', auth, acceptJoinRequest);
router.post('/:id/requests/:userId/reject', auth, rejectJoinRequest);
router.post('/:id/leave', auth, leaveGroup);
router.put('/:id', auth, updateGroupValidation, updateGroup);
router.delete('/:id', auth, deleteGroup);

module.exports = router;
