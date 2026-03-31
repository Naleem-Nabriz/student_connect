const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  marks: {
    type: Number,
    min: 0,
    max: 100
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100
  },
  assignmentScore: {
    type: Number,
    min: 0,
    max: 100
  },
  testType: {
    type: String,
    enum: ['quiz', 'midterm', 'final', 'assignment', 'project'],
    default: 'quiz'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

recordSchema.index({ subjectId: 1, userId: 1 });

module.exports = mongoose.model('Record', recordSchema);
