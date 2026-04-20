const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// Routes
router.get('/', auth(), getNotifications);
router.get('/unread-count', auth(), getUnreadCount);
router.patch('/:id/read', auth(), markAsRead);
router.patch('/read-all', auth(), markAllAsRead);
router.delete('/:id', auth(), deleteNotification);

module.exports = router;
