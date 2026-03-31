const mongoose = require('mongoose');

const skillProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    category: {
      type: String,
      trim: true
    }
  }],
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SkillProfile', skillProfileSchema);
