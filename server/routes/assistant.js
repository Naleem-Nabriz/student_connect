const express = require('express');
const { body } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');
const { chatWithAssistant } = require('../controllers/assistantController');

const router = express.Router();

router.post(
  '/chat',
  optionalAuth,
  body('message').trim().notEmpty().withMessage('Message is required'),
  chatWithAssistant
);

module.exports = router;
