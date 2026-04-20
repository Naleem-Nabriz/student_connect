const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  rateResource,
  downloadResource,
  upload
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
router.post('/', auth, (req, res, next) => {
  console.log('=== BEFORE MULTER ===');
  console.log('Request headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  next();
}, upload.single('file'), (req, res, next) => {
  console.log('=== MULTER MIDDLEWARE DEBUG ===');
  console.log('Request headers:', req.headers);
  console.log('Request file after multer:', req.file);
  console.log('Request body after multer:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
}, createResourceValidation, createResource);

// Multer error handler
router.use((err, req, res, next) => {
  console.log('=== MULTER ERROR ===');
  console.log('Multer error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB' });
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files uploaded' });
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field' });
    }
  }
  return res.status(400).json({ message: 'File upload error: ' + err.message });
});
router.get('/', getResources);
router.get('/:id', getResourceById);
router.put('/:id', auth, updateResourceValidation, updateResource);
router.delete('/:id', auth, deleteResource);
router.post('/:id/rate', auth, rateResourceValidation, rateResource);
router.get('/:id/download', downloadResource); // Download endpoint

module.exports = router;
