const mongoose = require('mongoose');

const kuppiAdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Ad title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  tutorName: {
    type: String,
    required: [true, 'Tutor name is required'],
    trim: true,
    maxlength: [100, 'Tutor name cannot exceed 100 characters']
  },
  contactInfo: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true,
    maxlength: [200, 'Contact information cannot exceed 200 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  classType: {
    type: String,
    enum: ['online', 'physical'],
    default: 'online',
    required: [true, 'Class type is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true,
    maxlength: [50, 'Time cannot exceed 50 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    required: [true, 'Creator role is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  maxStudents: {
    type: Number,
    min: [1, 'Maximum students must be at least 1'],
    default: 30
  },
  currentEnrollments: {
    type: Number,
    min: [0, 'Current enrollments cannot be negative'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  }],
  ratings: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      required: true
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

// Virtuals
kuppiAdSchema.virtual('isFull').get(function() {
  return this.currentEnrollments >= this.maxStudents;
});

kuppiAdSchema.virtual('availableSpots').get(function() {
  return Math.max(0, this.maxStudents - this.currentEnrollments);
});

// Indexes
kuppiAdSchema.index({ subject: 1, status: 1 });
kuppiAdSchema.index({ location: 1, status: 1 });
kuppiAdSchema.index({ createdBy: 1 });
kuppiAdSchema.index({ status: 1, isActive: 1 });

module.exports = mongoose.model('KuppiAd', kuppiAdSchema);
