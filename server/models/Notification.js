const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['reminder', 'deadline', 'achievement', 'system', 'weekly_report', 'kuppi_enrollment', 'kuppi_unenrollment', 'kuppi_approved', 'kuppi_rejected'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KuppiAd'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionUrl: {
    type: String
  },
  actionText: {
    type: String
  },
  metadata: {
    reminderType: String,
    badgeEarned: String,
    reportData: mongoose.Schema.Types.Mixed,
    studentName: String,
    className: String,
    classSubject: String
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

notificationSchema.pre('save', function(next) {
  if (this.read && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Static method to create Kuppi enrollment notification
notificationSchema.statics.createKuppiEnrollmentNotification = async function(userId, studentId, classId, studentName, className, classSubject) {
  const message = `${studentName} enrolled in your Kuppi class - ${className}`;
  
  return await this.create({
    userId,
    title: 'New Enrollment',
    message,
    type: 'kuppi_enrollment',
    priority: 'medium',
    classId,
    studentId,
    actionUrl: `/kuppi/classes/${classId}`,
    actionText: 'View Class',
    metadata: {
      studentName,
      className,
      classSubject
    }
  });
};

// Static method to create Kuppi unenrollment notification
notificationSchema.statics.createKuppiUnenrollmentNotification = async function(userId, studentId, classId, studentName, className, classSubject) {
  const message = `${studentName} unenrolled from your Kuppi class - ${className}`;
  
  return await this.create({
    userId,
    title: 'Student Unenrolled',
    message,
    type: 'kuppi_unenrollment',
    priority: 'low',
    classId,
    studentId,
    actionUrl: `/kuppi/classes/${classId}`,
    actionText: 'View Class',
    metadata: {
      studentName,
      className,
      classSubject
    }
  });
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ userId, read: false });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { userId, read: false },
    { read: true, readAt: new Date() }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);
