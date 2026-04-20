const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  type: {
    type: String,
    enum: ['7days', '3days', '1day', '6hours'],
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  sent: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date
  },
  method: {
    type: String,
    enum: ['email', 'inapp', 'both'],
    default: 'both'
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'skipped'],
    default: 'pending'
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttempt: {
    type: Date
  },
  errorMessage: {
    type: String
  },
  isAdaptive: {
    type: Boolean,
    default: false
  },
  originalSchedule: {
    type: Date
  }
}, {
  timestamps: true
});

reminderSchema.index({ userId: 1, scheduledFor: 1 });
reminderSchema.index({ taskId: 1 });
reminderSchema.index({ status: 1, scheduledFor: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
