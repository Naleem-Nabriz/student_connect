const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  rateResource
} = require('../controllers/resourceController');

const router = express.Router();

// Validation rules
const createResourceValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('type').isIn(['file', 'link', 'document']).withMessage('Type must be file, link, or document')
];

const updateResourceValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
  body('type').optional().isIn(['file', 'link', 'document']).withMessage('Type must be file, link, or document')
];

const rateResourceValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

// Routes
router.post('/', auth, createResourceValidation, createResource);
router.get('/', auth, getResources);
router.get('/:id', auth, getResourceById);
router.put('/:id', auth, updateResourceValidation, updateResource);
router.delete('/:id', auth, deleteResource);
router.post('/:id/rate', auth, rateResourceValidation, rateResource);

module.exports = router;
