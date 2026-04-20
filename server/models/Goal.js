const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['weekly_study_hours', 'daily_tasks', 'streak_days', 'tasks_completed'],
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  achieved: {
    type: Boolean,
    default: false
  },
  achievedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

goalSchema.index({ userId: 1, isActive: 1 });
goalSchema.index({ userId: 1, type: 1, period: 1 });

goalSchema.methods.updateProgress = function(amount) {
  this.current += amount;
  if (this.current >= this.target && !this.achieved) {
    this.achieved = true;
    this.achievedAt = new Date();
  }
  return this.save();
};

module.exports = mongoose.model('Goal', goalSchema);
