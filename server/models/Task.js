const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  studySessionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue', 'postponed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  reminderRules: [{
    type: String,
    enum: ['7days', '3days', '1day', '6hours'],
    default: ['1day', '6hours']
  }],
  feedback: {
    completed: { type: Boolean },
    postponed: { type: Boolean },
    reason: { type: String, maxlength: 500 },
    mood: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    energy: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  completedAt: {
    type: Date
  },
  postponedAt: {
    type: Date
  },
  newDeadline: {
    type: Date
  },
  reminderSent: {
    '7days': { type: Boolean, default: false },
    '3days': { type: Boolean, default: false },
    '1day': { type: Boolean, default: false },
    '6hours': { type: Boolean, default: false }
  },
  adaptiveReminderAdjustments: [{
    originalRule: String,
    adjustedRule: String,
    adjustmentDate: { type: Date, default: Date.now },
    reason: String
  }]
}, {
  timestamps: true
});

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ userId: 1, deadline: 1 });

taskSchema.pre('save', function(next) {
  if (this.deadline < new Date() && this.status === 'pending') {
    this.status = 'overdue';
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
