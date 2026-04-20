const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  action: {
    type: String,
    enum: ['created', 'completed', 'postponed', 'overdue', 'reminder_sent', 'reminder_ignored'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    mood: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    energy: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    reason: {
      type: String,
      maxlength: 500
    },
    studyHours: {
      type: Number,
      default: 0
    },
    reminderType: {
      type: String,
      enum: ['7days', '3days', '1day', '6hours']
    }
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    source: {
      type: String,
      enum: ['web', 'mobile', 'api', 'cron'],
      default: 'web'
    }
  }
}, {
  timestamps: true
});

progressLogSchema.index({ userId: 1, timestamp: -1 });
progressLogSchema.index({ userId: 1, action: 1 });
progressLogSchema.index({ taskId: 1 });

module.exports = mongoose.model('ProgressLog', progressLogSchema);
