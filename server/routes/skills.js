const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createOrUpdateSkillProfile,
  getMySkillProfile,
  getSkillProfiles,
  getSkillProfileById
} = require('../controllers/skillController');

const router = express.Router();

// Validation rules
const skillProfileValidation = [
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('skills.*.name').optional().trim().notEmpty().withMessage('Skill name is required'),
  body('skills.*.level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Skill level must be beginner, intermediate, advanced, or expert'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('availability').optional().isIn(['available', 'busy', 'offline']).withMessage('Availability must be available, busy, or offline')
];

// Routes
router.post('/profile', auth, skillProfileValidation, createOrUpdateSkillProfile);
router.get('/profile/me', auth, getMySkillProfile);
router.get('/profiles', auth, getSkillProfiles);
router.get('/profiles/:id', auth, getSkillProfileById);

module.exports = router;
