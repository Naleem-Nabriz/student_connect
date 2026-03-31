const express = require('express');
const { protect, adminAuth } = require('../middleware/auth');
const {
  createKuppiAd,
  getApprovedKuppiAds,
  getMyKuppiAds,
  getAllKuppiAds,
  updateKuppiAd,
  approveKuppiAd,
  rejectKuppiAd,
  deleteKuppiAd,
  enrollStudent,
  getMyEnrollments,
  unenrollStudent
} = require('../controllers/kuppiAdController');

const router = express.Router();

// Validation middleware
const { body } = require('express-validator');

const adValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Ad title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 100 })
    .withMessage('Subject cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('tutorName')
    .trim()
    .notEmpty()
    .withMessage('Tutor name is required')
    .isLength({ max: 100 })
    .withMessage('Tutor name cannot exceed 100 characters'),
  body('contactInfo')
    .trim()
    .notEmpty()
    .withMessage('Contact information is required')
    .isLength({ max: 200 })
    .withMessage('Contact information cannot exceed 200 characters')
    .custom((value) => {
      const normalizedValue = String(value).trim();
      const digitsOnly = normalizedValue.replace(/\D/g, '');
      const phoneRegex = /^\+?[\d\s\-()]{10,20}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const isPhoneNumber = phoneRegex.test(normalizedValue) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
      const isEmail = emailRegex.test(normalizedValue);

      if (!isPhoneNumber && !isEmail) {
        throw new Error('Contact information must be a valid phone number or email');
      }
      return true;
    }),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('classType')
    .trim()
    .isIn(['online', 'physical'])
    .withMessage('Class type must be online or physical'),
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Date must be a valid date'),
  body('time')
    .trim()
    .notEmpty()
    .withMessage('Time is required')
    .isLength({ max: 50 })
    .withMessage('Time cannot exceed 50 characters'),
  body('price')
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('maxStudents')
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage('Maximum students must be at least 1')
];

const approvalValidation = [
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot exceed 500 characters')
];

// Routes
router.post('/create', protect, adValidation, createKuppiAd);

// Public routes
router.get('/approved', getApprovedKuppiAds);

// Enrollment routes (MUST be before /my/:userId route)
router.post('/enroll/:classId', protect, enrollStudent);
router.post('/unenroll/:classId', protect, unenrollStudent);
router.get('/my-enrollments/:studentId', protect, getMyEnrollments);

// Protected routes
router.get('/my/:userId', protect, getMyKuppiAds);
router.get('/admin', protect, adminAuth, getAllKuppiAds);
router.put('/update/:id', protect, updateKuppiAd);
router.put('/approve/:id', protect, adminAuth, approvalValidation, approveKuppiAd);
router.put('/reject/:id', protect, adminAuth, approvalValidation, rejectKuppiAd);
router.delete('/delete/:id', protect, deleteKuppiAd);

module.exports = router;
