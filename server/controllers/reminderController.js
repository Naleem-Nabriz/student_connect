const Reminder = require('../models/Reminder');
const Task = require('../models/Task');
const ProgressLog = require('../models/ProgressLog');
const Notification = require('../models/Notification');

const getReminders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user.id };
    if (status) query.status = status;

    const reminders = await Reminder.find(query)
      .populate('taskId', 'title deadline')
      .sort({ scheduledFor: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reminder.countDocuments(query);

    res.json({
      reminders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: 'Server error fetching reminders' });
  }
};

const getUpcomingReminders = async (req, res) => {
  try {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const reminders = await Reminder.find({
      userId: req.user.id,
      status: 'pending',
      scheduledFor: { $gte: now, $lte: nextWeek }
    })
    .populate('taskId', 'title deadline')
    .sort({ scheduledFor: 1 });

    res.json(reminders);
  } catch (error) {
    console.error('Get upcoming reminders error:', error);
    res.status(500).json({ message: 'Server error fetching upcoming reminders' });
  }
};

const updateReminderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    reminder.status = status;
    if (status === 'sent') {
      reminder.sent = true;
      reminder.sentAt = new Date();
    }

    await reminder.save();

    await ProgressLog.create({
      userId: req.user.id,
      taskId: reminder.taskId,
      action: 'reminder_sent',
      details: {
        reminderType: reminder.type,
        method: reminder.method
      }
    });

    res.json({
      message: 'Reminder status updated successfully',
      reminder
    });
  } catch (error) {
    console.error('Update reminder status error:', error);
    res.status(500).json({ message: 'Server error updating reminder status' });
  }
};

const snoozeReminder = async (req, res) => {
  try {
    const { minutes = 30 } = req.body;
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (reminder.status !== 'pending') {
      return res.status(400).json({ message: 'Can only snooze pending reminders' });
    }

    const newScheduledTime = new Date(Date.now() + minutes * 60 * 1000);
    reminder.scheduledFor = newScheduledTime;
    reminder.status = 'pending';
    reminder.attempts += 1;

    await reminder.save();

    await ProgressLog.create({
      userId: req.user.id,
      taskId: reminder.taskId,
      action: 'reminder_snoozed',
      details: {
        reminderType: reminder.type,
        snoozedFor: minutes,
        newScheduledTime
      }
    });

    res.json({
      message: 'Reminder snoozed successfully',
      reminder
    });
  } catch (error) {
    console.error('Snooze reminder error:', error);
    res.status(500).json({ message: 'Server error snoozing reminder' });
  }
};

const dismissReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    reminder.status = 'skipped';
    await reminder.save();

    await ProgressLog.create({
      userId: req.user.id,
      taskId: reminder.taskId,
      action: 'reminder_ignored',
      details: {
        reminderType: reminder.type
      }
    });

    res.json({
      message: 'Reminder dismissed successfully',
      reminder
    });
  } catch (error) {
    console.error('Dismiss reminder error:', error);
    res.status(500).json({ message: 'Server error dismissing reminder' });
  }
};

const processReminder = async (reminderId) => {
  try {
    const reminder = await Reminder.findById(reminderId).populate('taskId userId');
    
    if (!reminder || reminder.status !== 'pending') {
      return;
    }

    const now = new Date();
    if (reminder.scheduledFor > now) {
      return;
    }

    // Create notification
    await Notification.create({
      userId: reminder.userId._id,
      title: `Task Reminder: ${reminder.taskId.title}`,
      message: `Your task "${reminder.taskId.title}" is due ${reminder.type === '6hours' ? 'in 6 hours' : reminder.type === '1day' ? 'tomorrow' : reminder.type === '3days' ? 'in 3 days' : 'in a week'}`,
      type: 'reminder',
      priority: reminder.type === '6hours' ? 'high' : 'medium',
      taskId: reminder.taskId._id,
      actionUrl: `/tasks/${reminder.taskId._id}`,
      actionText: 'View Task',
      metadata: {
        reminderType: reminder.type
      }
    });

    // Update reminder status
    reminder.status = 'sent';
    reminder.sent = true;
    reminder.sentAt = new Date();
    await reminder.save();

    // Log the action
    await ProgressLog.create({
      userId: reminder.userId._id,
      taskId: reminder.taskId._id,
      action: 'reminder_sent',
      details: {
        reminderType: reminder.type,
        method: reminder.method
      },
      metadata: {
        source: 'cron'
      }
    });

    console.log(`Reminder sent for task ${reminder.taskId.title} to user ${reminder.userId.username}`);
  } catch (error) {
    console.error('Process reminder error:', error);
  }
};

module.exports = {
  getReminders,
  getUpcomingReminders,
  updateReminderStatus,
  snoozeReminder,
  dismissReminder,
  processReminder
};
