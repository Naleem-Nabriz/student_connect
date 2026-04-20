const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  getProgressDashboard
} = require('../controllers/academicController');

const router = express.Router();

// Subject validation
const createSubjectValidation = [
  body('name').trim().notEmpty().withMessage('Subject name is required'),
  body('code').optional().trim().notEmpty().withMessage('Subject code cannot be empty'),
  body('credits').optional().isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
  body('semester').optional().trim().notEmpty().withMessage('Semester cannot be empty'),
  body('targetMarks').optional().isInt({ min: 0, max: 100 }).withMessage('Target marks must be between 0 and 100'),
  body('targetAttendance').optional().isInt({ min: 0, max: 100 }).withMessage('Target attendance must be between 0 and 100'),
  body('weeklyStudyHours').optional().isFloat({ min: 0, max: 100 }).withMessage('Weekly study hours must be between 0 and 100')
];

const updateSubjectValidation = [
  body('name').optional().trim().notEmpty().withMessage('Subject name cannot be empty'),
  body('code').optional().trim().notEmpty().withMessage('Subject code cannot be empty'),
  body('credits').optional().isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
  body('semester').optional().trim().notEmpty().withMessage('Semester cannot be empty'),
  body('targetMarks').optional().isInt({ min: 0, max: 100 }).withMessage('Target marks must be between 0 and 100'),
  body('targetAttendance').optional().isInt({ min: 0, max: 100 }).withMessage('Target attendance must be between 0 and 100'),
  body('weeklyStudyHours').optional().isFloat({ min: 0, max: 100 }).withMessage('Weekly study hours must be between 0 and 100')
];

// Record validation
const createRecordValidation = [
  body('subjectId').notEmpty().withMessage('Subject ID is required'),
  body('quizMarks').optional().isFloat({ min: 0, max: 100 }).withMessage('Quiz marks must be between 0 and 100'),
  body('midtermMarks').optional().isFloat({ min: 0, max: 100 }).withMessage('Midterm marks must be between 0 and 100'),
  body('assignmentMarks').optional().isFloat({ min: 0, max: 100 }).withMessage('Assignment marks must be between 0 and 100'),
  body('finalMarks').optional().isFloat({ min: 0, max: 100 }).withMessage('Final marks must be between 0 and 100'),
  body('attendance').optional().isFloat({ min: 0, max: 100 }).withMessage('Attendance must be between 0 and 100'),
];

const updateRecordValidation = [
  body('quizMarks').optional().isFloat({ min: 0, max: 100 }).withMessage('Quiz marks must be between 0 and 100'),
  body('midtermMarks').optional().isFloat({ min: 0, max: 100 }).withMessage('Midterm marks must be between 0 and 100'),
  body('assignmentMarks').optional().isFloat({ min: 0, max: 100 }).withMessage('Assignment marks must be between 0 and 100'),
  body('finalMarks').optional().isFloat({ min: 0, max: 100 }).withMessage('Final marks must be between 0 and 100'),
  body('attendance').optional().isFloat({ min: 0, max: 100 }).withMessage('Attendance must be between 0 and 100')
];

// Subject routes
router.post('/subjects', auth, createSubjectValidation, createSubject);
router.get('/subjects', auth, getSubjects);
router.put('/subjects/:id', auth, updateSubjectValidation, updateSubject);
router.delete('/subjects/:id', auth, deleteSubject);

// Record routes
router.post('/records', auth, createRecordValidation, createRecord);
router.get('/records', auth, getRecords);
router.put('/records/:id', auth, updateRecordValidation, updateRecord);
router.delete('/records/:id', auth, deleteRecord);

// Dashboard route
router.get('/dashboard', auth, getProgressDashboard);

module.exports = router;
