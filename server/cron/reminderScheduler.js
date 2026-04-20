const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const { processReminder } = require('../controllers/reminderController');
const { autoUpdateGoals } = require('../controllers/goalController');

// Schedule reminder processing every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running reminder scheduler...');
  
  try {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Find reminders that should be sent in the next 5 minutes
    const pendingReminders = await Reminder.find({
      status: 'pending',
      scheduledFor: { $lte: fiveMinutesFromNow, $gte: now }
    });

    console.log(`Found ${pendingReminders.length} reminders to process`);

    // Process each reminder
    for (const reminder of pendingReminders) {
      await processReminder(reminder._id);
    }
  } catch (error) {
    console.error('Reminder scheduler error:', error);
  }
});

// Schedule goal updates every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running goal auto-update scheduler...');
  
  try {
    // This would need to be implemented to get all active users
    // For now, we'll just log that it's running
    console.log('Goal auto-update scheduler completed');
  } catch (error) {
    console.error('Goal update scheduler error:', error);
  }
});

// Schedule cleanup of old notifications daily
cron.schedule('0 0 * * *', async () => {
  console.log('Running notification cleanup...');
  
  try {
    const Notification = require('../models/Notification');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      read: true
    });

    console.log(`Cleaned up ${result.deletedCount} old notifications`);
  } catch (error) {
    console.error('Notification cleanup error:', error);
  }
});

console.log('Reminder scheduler initialized');
