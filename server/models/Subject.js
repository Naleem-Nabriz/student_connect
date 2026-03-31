const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    trim: true
  },
  credits: {
    type: Number,
    min: 1,
    max: 10
  },
  semester: {
    type: String,
    trim: true
  },
  targetMarks: {
    type: Number,
    min: 0,
    max: 100
  },
  targetAttendance: {
    type: Number,
    min: 0,
    max: 100
  },
  weeklyStudyHours: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

subjectSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
