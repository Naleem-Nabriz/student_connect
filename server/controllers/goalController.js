const { body, validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const ProgressLog = require('../models/ProgressLog');
const Task = require('../models/Task');
const mongoose = require('mongoose');

const createGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, target, period, startDate, endDate, category } = req.body;

    const goal = new Goal({
      userId: req.user.id,
      type,
      target,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      category
    });

    await goal.save();

    await ProgressLog.create({
      userId: req.user.id,
      action: 'goal_created',
      details: {
        goalType: type,
        target,
        period,
        category
      }
    });

    res.status(201).json({
      message: 'Goal created successfully',
      goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error creating goal' });
  }
};

const getGoals = async (req, res) => {
  try {
    const { isActive, type, period, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user.id };
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (type) query.type = type;
    if (period) query.period = period;

    const goals = await Goal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Goal.countDocuments(query);

    res.json({
      goals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error fetching goals' });
  }
};

const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ message: 'Server error fetching goal' });
  }
};

const updateGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, target, period, startDate, endDate, category, isActive } = req.body;

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Update goal fields
    if (type) goal.type = type;
    if (target) goal.target = target;
    if (period) goal.period = period;
    if (startDate) goal.startDate = new Date(startDate);
    if (endDate) goal.endDate = new Date(endDate);
    if (category !== undefined) goal.category = category;
    if (isActive !== undefined) goal.isActive = isActive;

    await goal.save();

    await ProgressLog.create({
      userId: req.user.id,
      action: 'goal_updated',
      details: {
        goalType: goal.type,
        target: goal.target,
        period: goal.period,
        category: goal.category
      }
    });

    res.json({
      message: 'Goal updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error updating goal' });
  }
};

const updateGoalProgress = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Progress amount must be a positive number' });
    }

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const wasAchieved = goal.achieved;
    await goal.updateProgress(amount);

    if (!wasAchieved && goal.achieved) {
      await ProgressLog.create({
        userId: req.user.id,
        action: 'goal_achieved',
        details: {
          goalType: goal.type,
          target: goal.target,
          finalProgress: goal.current
        }
      });
    }

    res.json({
      message: 'Goal progress updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(500).json({ message: 'Server error updating goal progress' });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await Goal.findByIdAndDelete(req.params.id);

    await ProgressLog.create({
      userId: req.user.id,
      action: 'goal_deleted',
      details: {
        goalType: goal.type,
        target: goal.target,
        period: goal.period,
        finalProgress: goal.current
      }
    });

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error deleting goal' });
  }
};

const getGoalStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Goal.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          achieved: { $sum: { $cond: ['$achieved', 1, 0] } },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    const result = {};
    stats.forEach(stat => {
      result[stat._id] = {
        total: stat.total,
        achieved: stat.achieved,
        active: stat.active,
        achievementRate: stat.total > 0 ? Math.round((stat.achieved / stat.total) * 100) : 0
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Get goal stats error:', error);
    res.status(500).json({ message: 'Server error fetching goal statistics' });
  }
};

const autoUpdateGoals = async (userId) => {
  try {
    // Update weekly study hours goals
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const completedTasks = await Task.find({
      userId,
      status: 'completed',
      completedAt: { $gte: weekStart, $lte: weekEnd }
    });

    const totalStudyHours = completedTasks.reduce((total, task) => {
      return total + (task.feedback?.studyHours || 0);
    }, 0);

    await Goal.updateMany(
      {
        userId,
        type: 'weekly_study_hours',
        isActive: true,
        startDate: { $lte: weekStart },
        endDate: { $gte: weekEnd }
      },
      { current: totalStudyHours }
    );

    // Update daily tasks goals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCompletedTasks = await Task.countDocuments({
      userId,
      status: 'completed',
      completedAt: { $gte: today, $lt: tomorrow }
    });

    await Goal.updateMany(
      {
        userId,
        type: 'daily_tasks',
        isActive: true,
        startDate: { $lte: today },
        endDate: { $gte: today }
      },
      { current: todayCompletedTasks }
    );

    // Update tasks completed goals
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthCompletedTasks = await Task.countDocuments({
      userId,
      status: 'completed',
      completedAt: { $gte: monthStart }
    });

    await Goal.updateMany(
      {
        userId,
        type: 'tasks_completed',
        isActive: true,
        startDate: { $lte: monthStart },
        endDate: { $gte: new Date() }
      },
      { current: monthCompletedTasks }
    );

    console.log(`Auto-updated goals for user ${userId}`);
  } catch (error) {
    console.error('Auto update goals error:', error);
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalStats,
  autoUpdateGoals
};
