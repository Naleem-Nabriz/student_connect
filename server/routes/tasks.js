const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  completeTask,
  postponeTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');

// Validation rules
const taskValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
  body('studySessionDate').optional().isISO8601().withMessage('Study session date must be a valid date'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Category must be less than 50 characters'),
  body('reminderRules').optional().isArray().withMessage('Reminder rules must be an array')
];

const updateValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  body('studySessionDate').optional().isISO8601().withMessage('Study session date must be a valid date'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Category must be less than 50 characters'),
  body('reminderRules').optional().isArray().withMessage('Reminder rules must be an array')
];

const postponeValidation = [
  body('newDeadline').isISO8601().withMessage('New deadline must be a valid date'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters'),
  body('mood').optional().isIn(['low', 'medium', 'high']).withMessage('Mood must be low, medium, or high'),
  body('energy').optional().isIn(['low', 'medium', 'high']).withMessage('Energy must be low, medium, or high')
];

const completeValidation = [
  body('mood').optional().isIn(['low', 'medium', 'high']).withMessage('Mood must be low, medium, or high'),
  body('energy').optional().isFloat({ min: 0 }).withMessage('Energy must be a positive number')
];

// Routes
router.post('/', createTask);
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTask);
router.put('/:id', updateValidation, updateTask);
router.patch('/:id/complete', completeTask);
router.patch('/:id/postpone', postponeTask);
router.delete('/:id', deleteTask);

module.exports = router;
