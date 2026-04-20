const ProgressLog = require('../models/ProgressLog');
const Task = require('../models/Task');
const Goal = require('../models/Goal');
const mongoose = require('mongoose');

const getProgressOverview = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const userId = req.user.id;

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

    // Task statistics
    const taskStats = await Task.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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

    // Progress logs
    const progressLogs = await ProgressLog.find({
      userId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });

    // Goals progress
    const goals = await Goal.find({
      userId,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    const result = {
      period,
      taskStats: {},
      totalTasks: 0,
      completionRate: 0,
      progressLogs: progressLogs.slice(0, 20), // Last 20 logs
      goals: goals.map(goal => ({
        id: goal._id,
        type: goal.type,
        target: goal.target,
        current: goal.current,
        percentage: Math.round((goal.current / goal.target) * 100),
        achieved: goal.achieved
      }))
    };

    taskStats.forEach(stat => {
      result.taskStats[stat._id] = stat.count;
      result.totalTasks += stat.count;
    });

    if (result.totalTasks > 0) {
      result.completionRate = Math.round((result.taskStats.completed || 0) / result.totalTasks * 100);
    }

    res.json(result);
  } catch (error) {
    console.error('Get progress overview error:', error);
    res.status(500).json({ message: 'Server error fetching progress overview' });
  }
};

const getProgressLogs = async (req, res) => {
  try {
    const { action, page = 1, limit = 20 } = req.query;
    
    const query = { userId: req.user.id };
    if (action) query.action = action;

    const logs = await ProgressLog.find(query)
      .populate('taskId', 'title')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ProgressLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get progress logs error:', error);
    res.status(500).json({ message: 'Server error fetching progress logs' });
  }
};

const getCompletionTrends = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const userId = req.user.id;

    const now = new Date();
    let startDate, groupBy;

    switch (period) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 30)); // Last 30 days
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } };
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 12 * 7)); // Last 12 weeks
        groupBy = { $dateToString: { format: "%Y-W%U", date: "$timestamp" } };
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 12)); // Last 12 months
        groupBy = { $dateToString: { format: "%Y-%m", date: "$timestamp" } };
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } };
    }

    const trends = await ProgressLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          action: 'completed',
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      period,
      trends: trends.map(trend => ({
        date: trend._id,
        completions: trend.count
      }))
    });
  } catch (error) {
    console.error('Get completion trends error:', error);
    res.status(500).json({ message: 'Server error fetching completion trends' });
  }
};

const getMoodEnergyAnalysis = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const userId = req.user.id;

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

    const analysis = await ProgressLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          timestamp: { $gte: startDate },
          'details.mood': { $exists: true },
          'details.energy': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          moodDistribution: {
            $push: '$details.mood'
          },
          energyDistribution: {
            $push: '$details.energy'
          },
          totalEntries: { $sum: 1 }
        }
      }
    ]);

    if (analysis.length === 0) {
      return res.json({
        moodDistribution: { low: 0, medium: 0, high: 0 },
        energyDistribution: { low: 0, medium: 0, high: 0 },
        totalEntries: 0
      });
    }

    const data = analysis[0];
    
    const countOccurrences = (arr) => {
      return arr.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, { low: 0, medium: 0, high: 0 });
    };

    res.json({
      moodDistribution: countOccurrences(data.moodDistribution),
      energyDistribution: countOccurrences(data.energyDistribution),
      totalEntries: data.totalEntries
    });
  } catch (error) {
    console.error('Get mood energy analysis error:', error);
    res.status(500).json({ message: 'Server error fetching mood/energy analysis' });
  }
};

module.exports = {
  getProgressOverview,
  getProgressLogs,
  getCompletionTrends,
  getMoodEnergyAnalysis
};
