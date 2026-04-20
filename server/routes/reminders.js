const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  getReminders,
  getUpcomingReminders,
  updateReminderStatus,
  snoozeReminder,
  dismissReminder
} = require('../controllers/reminderController');

// Validation rules
const statusValidation = [
  body('status').isIn(['pending', 'sent', 'failed', 'skipped']).withMessage('Status must be pending, sent, failed, or skipped')
];

const snoozeValidation = [
  body('minutes').isInt({ min: 5, max: 1440 }).withMessage('Snooze time must be between 5 and 1440 minutes')
];

// Routes
router.get('/', auth(), getReminders);
router.get('/upcoming', auth(), getUpcomingReminders);
router.patch('/:id/status', auth(), statusValidation, updateReminderStatus);
router.patch('/:id/snooze', auth(), snoozeValidation, snoozeReminder);
router.patch('/:id/dismiss', auth(), dismissReminder);

module.exports = router;
