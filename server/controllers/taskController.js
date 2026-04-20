const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const ProgressLog = require('../models/ProgressLog');
const Reminder = require('../models/Reminder');

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, deadline, studySessionDate, priority, category, reminderRules, userId } = req.body;

    // For testing, use a default user ID if not provided
    const defaultUserId = '507f1f77bcf86cd799439011'; // Example MongoDB ObjectId

    const task = new Task({
      title,
      description,
      userId: userId || defaultUserId,
      deadline: new Date(deadline),
      studySessionDate: studySessionDate ? new Date(studySessionDate) : undefined,
      priority: priority || 'medium',
      category: category || 'general',
      reminderRules: reminderRules || ['1day', '6hours']
    });

    await task.save();

    await ProgressLog.create({
      userId: userId || defaultUserId,
      taskId: task._id,
      action: 'created',
      details: {
        priority: task.priority,
        category: task.category
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task', error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10, sortBy = 'deadline', sortOrder = 'asc', userId } = req.query;
    
    // For testing, use a default user ID if not provided
    const defaultUserId = '507f1f77bcf86cd799439011';
    const queryUserId = userId || defaultUserId;
    
    const query = { userId: queryUserId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'firstName lastName username email');

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks', error: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { userId } = req.query;
    const defaultUserId = '507f1f77bcf86cd799439011';
    const queryUserId = userId || defaultUserId;
    
    const task = await Task.findOne({ _id: req.params.id, userId: queryUserId })
      .populate('userId', 'firstName lastName username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error fetching task', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, deadline, studySessionDate, priority, category, reminderRules, userId } = req.body;
    const defaultUserId = '507f1f77bcf86cd799439011';
    const queryUserId = userId || defaultUserId;

    const task = await Task.findOne({ _id: req.params.id, userId: queryUserId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline) task.deadline = new Date(deadline);
    if (studySessionDate !== undefined) task.studySessionDate = studySessionDate ? new Date(studySessionDate) : undefined;
    if (priority) task.priority = priority;
    if (category) task.category = category;
    if (reminderRules) task.reminderRules = reminderRules;

    await task.save();

    await ProgressLog.create({
      userId: queryUserId,
      taskId: task._id,
      action: 'completed',
      details: {
        priority: task.priority,
        category: task.category,
        updated: true
      }
    });

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task', error: error.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const { mood, energy, studyHours, userId } = req.body;
    const defaultUserId = '507f1f77bcf86cd799439011';
    const queryUserId = userId || defaultUserId;

    const task = await Task.findOne({ _id: req.params.id, userId: queryUserId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Task already completed' });
    }

    task.status = 'completed';
    task.completedAt = new Date();
    task.feedback = {
      completed: true,
      mood: mood || 'medium',
      energy: energy || 'medium',
      studyHours: studyHours || 0
    };

    await task.save();

    await ProgressLog.create({
      userId: queryUserId,
      taskId: task._id,
      action: 'completed',
      details: {
        mood: task.feedback.mood,
        energy: task.feedback.energy,
        studyHours: task.feedback.studyHours
      }
    });

    // Cancel pending reminders
    await Reminder.updateMany(
      { taskId: task._id, status: 'pending' },
      { status: 'skipped', errorMessage: 'Task completed' }
    );

    res.json({
      message: 'Task completed successfully',
      task
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'Server error completing task', error: error.message });
  }
};

const postponeTask = async (req, res) => {
  try {
    const { newDeadline, reason, mood, energy, userId } = req.body;
    const defaultUserId = '507f1f77bcf86cd799439011';
    const queryUserId = userId || defaultUserId;

    const task = await Task.findOne({ _id: req.params.id, userId: queryUserId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Cannot postpone completed task' });
    }

    const oldDeadline = task.deadline;
    task.status = 'postponed';
    task.postponedAt = new Date();
    task.newDeadline = new Date(newDeadline);
    task.deadline = new Date(newDeadline);
    task.feedback = {
      postponed: true,
      reason: reason || '',
      mood: mood || 'medium',
      energy: energy || 'medium'
    };

    await task.save();

    await ProgressLog.create({
      userId: queryUserId,
      taskId: task._id,
      action: 'postponed',
      details: {
        reason: task.feedback.reason,
        mood: task.feedback.mood,
        energy: task.feedback.energy,
        oldDeadline,
        newDeadline: task.deadline
      }
    });

    // Reschedule reminders
    await Reminder.updateMany(
      { taskId: task._id, status: 'pending' },
      { status: 'skipped', errorMessage: 'Task postponed' }
    );
    // await scheduleReminders(task); // This will be handled by the cron job

    res.json({
      message: 'Task postponed successfully',
      task
    });
  } catch (error) {
    console.error('Postpone task error:', error);
    res.status(500).json({ message: 'Server error postponing task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const defaultUserId = '507f1f77bcf86cd799439011';
    const queryUserId = userId || defaultUserId;

    const task = await Task.findOne({ _id: req.params.id, userId: queryUserId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    await Reminder.deleteMany({ taskId: req.params.id });

    await ProgressLog.create({
      userId: queryUserId,
      taskId: task._id,
      action: 'overdue',
      details: {
        originalTitle: task.title,
        originalDeadline: task.deadline,
        deleted: true
      }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task', error: error.message });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const { period = 'week', userId } = req.query;
    const defaultUserId = '507f1f77bcf86cd799439011';
    const queryUserId = userId || defaultUserId;

    const now = new Date();
    let startDate;

    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const stats = await Task.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(queryUserId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      pending: 0,
      completed: 0,
      overdue: 0,
      postponed: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    // Get completion rate
    const completionRate = result.total > 0 ? (result.completed / result.total) * 100 : 0;

    res.json({
      ...result,
      completionRate: Math.round(completionRate * 100) / 100
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ message: 'Server error fetching task statistics', error: error.message });
  }
};

const scheduleReminders = async (task) => {
  try {
    const reminderTimes = {
      '7days': 7 * 24 * 60 * 60 * 1000,
      '3days': 3 * 24 * 60 * 60 * 1000,
      '1day': 24 * 60 * 60 * 1000,
      '6hours': 6 * 60 * 60 * 1000
    };

    const now = new Date();
    const deadline = new Date(task.deadline);

    for (const rule of task.reminderRules) {
      const scheduledTime = new Date(deadline.getTime() - reminderTimes[rule]);
      
      if (scheduledTime > now && !task.reminderSent[rule]) {
        await Reminder.create({
          userId: task.userId,
          taskId: task._id,
          type: rule,
          scheduledFor: scheduledTime,
          method: 'both'
        });
      }
    }
  } catch (error) {
    console.error('Schedule reminders error:', error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  completeTask,
  postponeTask,
  deleteTask,
  getTaskStats
};
