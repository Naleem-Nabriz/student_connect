const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getProgressOverview,
  getProgressLogs,
  getCompletionTrends,
  getMoodEnergyAnalysis
} = require('../controllers/progressController');

// Routes
router.get('/overview', auth(), getProgressOverview);
router.get('/logs', auth(), getProgressLogs);
router.get('/trends', auth(), getCompletionTrends);
router.get('/mood-energy', auth(), getMoodEnergyAnalysis);

module.exports = router;
