const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const { chatWithAssistant } = require('../controllers/assistantController');

const router = express.Router();

router.post(
  '/chat',
  auth,
  body('message').trim().notEmpty().withMessage('Message is required'),
  chatWithAssistant
);

module.exports = router;
