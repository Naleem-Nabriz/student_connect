const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalStats
} = require('../controllers/goalController');

// Validation rules
const goalValidation = [
  body('type').isIn(['weekly_study_hours', 'daily_tasks', 'streak_days', 'tasks_completed']).withMessage('Invalid goal type'),
  body('target').isInt({ min: 1 }).withMessage('Target must be a positive integer'),
  body('period').isIn(['daily', 'weekly', 'monthly']).withMessage('Period must be daily, weekly, or monthly'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Category must be less than 50 characters')
];

const updateValidation = [
  body('type').optional().isIn(['weekly_study_hours', 'daily_tasks', 'streak_days', 'tasks_completed']).withMessage('Invalid goal type'),
  body('target').optional().isInt({ min: 1 }).withMessage('Target must be a positive integer'),
  body('period').optional().isIn(['daily', 'weekly', 'monthly']).withMessage('Period must be daily, weekly, or monthly'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Category must be less than 50 characters'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

const progressValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Progress amount must be a positive number')
];

// Routes
router.post('/', auth(), goalValidation, createGoal);
router.get('/', auth(), getGoals);
router.get('/stats', auth(), getGoalStats);
router.get('/:id', auth(), getGoal);
router.put('/:id', auth(), updateValidation, updateGoal);
router.patch('/:id/progress', auth(), progressValidation, updateGoalProgress);
router.delete('/:id', auth(), deleteGoal);

module.exports = router;
