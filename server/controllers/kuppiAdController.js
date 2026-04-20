const { validationResult } = require('express-validator');
const KuppiAd = require('../models/KuppiAd');
const Notification = require('../models/Notification');

// @desc    Create new kuppi ad
// @route   POST /api/kuppi/create
// @access   Private
const createKuppiAd = async (req, res) => {
  try {
    console.log('Creating kuppi ad with user role:', req.user.role);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorList = errors.array();
      return res.status(400).json({
        message: errorList[0]?.msg || 'Validation failed',
        errors: errorList
      });
    }

    const {
      title,
      subject,
      description,
      tutorName,
      contactInfo,
      location,
      classType,
      date,
      time,
      price,
      maxStudents
    } = req.body;

    // Business Logic: Set status based on user role
    let status = 'pending';
    if (req.user.role === 'admin') {
      status = 'approved'; // Admin-created ads are immediately approved
    }

    const kuppiAd = new KuppiAd({
      title,
      subject,
      description,
      tutorName,
      contactInfo,
      location,
      classType,
      date,
      time,
      price,
      maxStudents,
      createdBy: req.user._id,
      role: req.user.role,
      status,
      approvedBy: req.user.role === 'admin' ? req.user._id : undefined,
      approvedAt: req.user.role === 'admin' ? new Date() : undefined
    });

    const savedAd = await kuppiAd.save();
    await savedAd.populate('createdBy', 'firstName lastName email');

    console.log('Kuppi ad created successfully:', {
      id: savedAd._id,
      title: savedAd.title,
      status: savedAd.status,
      creatorRole: savedAd.role
    });

    res.status(201).json({
      message: status === 'pending'
        ? 'Kuppi ad submitted for admin approval'
        : 'Kuppi ad created and approved successfully',
      kuppiAd: savedAd
    });
  } catch (error) {
    console.error('Error creating kuppi ad:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all approved kuppi ads (public view)
// @route   GET /api/kuppi/approved
// @access   Public
const getApprovedKuppiAds = async (req, res) => {
  try {
    console.log('Getting approved kuppi ads');
    
    const {
      page = 1,
      limit = 10,
      subject,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter - only approved and active ads
    const filter = { status: 'approved', isActive: true };
    
    if (subject) {
      filter.subject = { $regex: subject, $options: 'i' };
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const kuppiAds = await KuppiAd.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await KuppiAd.countDocuments(filter);

    console.log('Returning approved kuppi ads:', {
      count: kuppiAds.length,
      filter: filter
    });

    res.json({
      kuppiAds,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching approved kuppi ads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's kuppi ads (My Ads page)
// @route   GET /api/kuppi/my/:userId
// @access   Private
const getMyKuppiAds = async (req, res) => {
  try {
    console.log('Getting my kuppi ads for user:', req.params.userId, 'auth user:', req.user._id, 'role:', req.user.role);
    
    // Authorization check - users can only access their own ads, admins can access any
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter - get ads created by this user (use route parameter)
    const filter = { createdBy: req.params.userId, isActive: true };
    
    if (status) {
      filter.status = status;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const kuppiAds = await KuppiAd.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await KuppiAd.countDocuments(filter);

    console.log('My kuppi ads found:', {
      count: kuppiAds.length,
      filter: filter
    });

    res.json({
      kuppiAds,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching my kuppi ads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all kuppi ads (Admin dashboard)
// @route   GET /api/kuppi/admin
// @access   Private (Admin only)
const getAllKuppiAds = async (req, res) => {
  try {
    console.log('Getting all kuppi ads for admin');
    
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter - all active ads (admin can see all statuses)
    const filter = { isActive: true };
    
    if (status) {
      filter.status = status;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const kuppiAds = await KuppiAd.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await KuppiAd.countDocuments(filter);

    console.log('All kuppi ads for admin:', {
      count: kuppiAds.length,
      filter: filter
    });

    res.json({
      kuppiAds,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching all kuppi ads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update kuppi ad
// @route   PUT /api/kuppi/update/:id
// @access   Private
const updateKuppiAd = async (req, res) => {
  try {
    console.log('Updating kuppi ad:', req.params.id);
    
    const {
      title,
      subject,
      description,
      tutorName,
      contactInfo,
      location,
      classType,
      date,
      time,
      price,
      maxStudents
    } = req.body;

    const kuppiAd = await KuppiAd.findById(req.params.id);

    if (!kuppiAd) {
      return res.status(404).json({ message: 'Kuppi ad not found' });
    }

    // Check ownership or admin
    if (kuppiAd.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this ad' });
    }

    // Update fields
    if (title) kuppiAd.title = title;
    if (subject) kuppiAd.subject = subject;
    if (description) kuppiAd.description = description;
    if (tutorName) kuppiAd.tutorName = tutorName;
    if (contactInfo) kuppiAd.contactInfo = contactInfo;
    if (location) kuppiAd.location = location;
    if (classType) kuppiAd.classType = classType;
    if (date) kuppiAd.date = date;
    if (time) kuppiAd.time = time;
    if (price !== undefined) kuppiAd.price = price;
    if (maxStudents) kuppiAd.maxStudents = maxStudents;

    await kuppiAd.save();
    await kuppiAd.populate('createdBy', 'firstName lastName email');

    res.json(kuppiAd);
  } catch (error) {
    console.error('Error updating kuppi ad:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Approve kuppi ad
// @route   PUT /api/kuppi/approve/:id
// @access   Private (Admin only)
const approveKuppiAd = async (req, res) => {
  try {
    console.log('Approving kuppi ad:', req.params.id);
    
    const kuppiAd = await KuppiAd.findById(req.params.id);

    if (!kuppiAd) {
      return res.status(404).json({ message: 'Kuppi ad not found' });
    }

    // Update status to approved
    kuppiAd.status = 'approved';
    kuppiAd.approvedBy = req.user._id;
    kuppiAd.approvedAt = new Date();
    kuppiAd.rejectionReason = undefined;

    await kuppiAd.save();

    res.json({ message: 'Kuppi ad approved successfully', kuppiAd });
  } catch (error) {
    console.error('Error approving kuppi ad:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reject kuppi ad
// @route   PUT /api/kuppi/reject/:id
// @access   Private (Admin only)
const rejectKuppiAd = async (req, res) => {
  try {
    console.log('Rejecting kuppi ad:', req.params.id);
    
    const { rejectionReason } = req.body;
    
    const kuppiAd = await KuppiAd.findById(req.params.id);

    if (!kuppiAd) {
      return res.status(404).json({ message: 'Kuppi ad not found' });
    }

    // Update status to rejected
    kuppiAd.status = 'rejected';
    kuppiAd.rejectionReason = rejectionReason;

    await kuppiAd.save();

    res.json({ message: 'Kuppi ad rejected successfully', kuppiAd });
  } catch (error) {
    console.error('Error rejecting kuppi ad:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete kuppi ad
// @route   DELETE /api/kuppi/delete/:id
// @access   Private
const deleteKuppiAd = async (req, res) => {
  try {
    console.log('Deleting kuppi ad:', req.params.id);
    
    const kuppiAd = await KuppiAd.findById(req.params.id);

    if (!kuppiAd) {
      return res.status(404).json({ message: 'Kuppi ad not found' });
    }

    // Check ownership or admin
    if (kuppiAd.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this ad' });
    }

    // Soft delete by setting isActive to false
    kuppiAd.isActive = false;
    await kuppiAd.save();

    res.json({ message: 'Kuppi ad deleted successfully' });
  } catch (error) {
    console.error('Error deleting kuppi ad:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Enroll student in kuppi class
// @route   POST /api/kuppi/enroll/:classId
// @access   Private
const enrollStudent = async (req, res) => {
  try {
    console.log('Enrolling student in class:', req.params.classId);
    
    const classId = req.params.classId;
    const studentId = req.user._id.toString();

    // Find the kuppi class
    const kuppiClass = await KuppiAd.findById(classId);

    if (!kuppiClass) {
      return res.status(404).json({ message: 'Kuppi class not found' });
    }

    // Check if student is already enrolled
    const alreadyEnrolled = kuppiClass.enrolledStudents.some(
      enrollment => enrollment.student.toString() === studentId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already Enrolled' });
    }

    // Check if class is at max capacity
    if (kuppiClass.currentEnrollments >= kuppiClass.maxStudents) {
      return res.status(400).json({ message: 'Class is at maximum capacity' });
    }

    // Check if class is free (price = 0)
    if (kuppiClass.price === 0) {
      // FREE CLASS - Direct enrollment
      kuppiClass.enrolledStudents.push({
        student: req.user._id,
        enrolledAt: new Date()
      });

      // Update current enrollment count
      kuppiClass.currentEnrollments = kuppiClass.enrolledStudents.length;

      // Save to database
      await kuppiClass.save();
      await kuppiClass.populate('createdBy', 'firstName lastName email');
      await kuppiClass.populate('enrolledStudents.student', 'firstName lastName email');

      // Create notification for class creator
      try {
        await Notification.createKuppiEnrollmentNotification(
          kuppiClass.createdBy._id, // Class creator ID
          req.user._id, // Student ID
          kuppiClass._id, // Class ID
          `${req.user.firstName || 'Student'} ${req.user.lastName || ''}`, // Student name
          kuppiClass.title, // Class name
          kuppiClass.subject // Class subject
        );
        console.log('Notification created for class creator:', kuppiClass.createdBy._id);
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the enrollment if notification fails
      }

      console.log('Student enrolled successfully in FREE class:', {
        classId: classId,
        studentId: studentId,
        totalEnrolled: kuppiClass.currentEnrollments,
        price: kuppiClass.price
      });

      return res.status(200).json({
        message: 'Enrolled successfully (Free Class)',
        kuppiClass: kuppiClass
      });
    } else {
      // PAID CLASS - Payment required
      return res.status(402).json({
        message: 'Payment Required',
        paymentNeeded: true,
        price: kuppiClass.price,
        classId: classId
      });
    }
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student's enrollments
// @route   GET /api/kuppi/my-enrollments/:studentId
// @access   Private
const getMyEnrollments = async (req, res) => {
  try {
    console.log('Getting enrollments for student:', req.params.studentId);
    
    const studentId = req.params.studentId;

    // Find all classes where student is enrolled
    const enrolledClasses = await KuppiAd.find({
      'enrolledStudents.student': studentId,
      status: 'approved',
      isActive: true
    })
      .populate('createdBy', 'firstName lastName email')
      .populate('enrolledStudents.student', 'firstName lastName email')
      .sort({ date: 1 });

    console.log('Enrollments found for student:', {
      studentId: studentId,
      count: enrolledClasses.length
    });

    res.json({
      enrolledClasses,
      total: enrolledClasses.length
    });
  } catch (error) {
    console.error('Error fetching my enrollments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unenroll student from kuppi class
// @route   POST /api/kuppi/unenroll/:classId
// @access   Private
const unenrollStudent = async (req, res) => {
  try {
    console.log('Unenrolling student from class:', req.params.classId);
    
    const classId = req.params.classId;
    const studentId = req.user._id.toString();

    // Find the kuppi class
    const kuppiClass = await KuppiAd.findById(classId);

    if (!kuppiClass) {
      return res.status(404).json({ message: 'Kuppi class not found' });
    }

    // Check if student is enrolled
    const enrolledIndex = kuppiClass.enrolledStudents.findIndex(
      enrollment => enrollment.student.toString() === studentId
    );

    if (enrolledIndex === -1) {
      return res.status(400).json({ message: 'Student is not enrolled in this class' });
    }

    // Remove student from enrolled students
    kuppiClass.enrolledStudents.splice(enrolledIndex, 1);

    // Update current enrollment count
    kuppiClass.currentEnrollments = kuppiClass.enrolledStudents.length;

    // Save to database
    await kuppiClass.save();
    await kuppiClass.populate('createdBy', 'firstName lastName email');
    await kuppiClass.populate('enrolledStudents.student', 'firstName lastName email');

    // Create notification for class creator
    try {
      await Notification.createKuppiUnenrollmentNotification(
        kuppiClass.createdBy._id, // Class creator ID
        req.user._id, // Student ID
        kuppiClass._id, // Class ID
        `${req.user.firstName || 'Student'} ${req.user.lastName || ''}`, // Student name
        kuppiClass.title, // Class name
        kuppiClass.subject // Class subject
      );
      console.log('Unenrollment notification created for class creator:', kuppiClass.createdBy._id);
    } catch (notificationError) {
      console.error('Error creating unenrollment notification:', notificationError);
      // Don't fail the unenrollment if notification fails
    }

    console.log('Student unenrolled successfully:', {
      classId: classId,
      studentId: studentId,
      totalEnrolled: kuppiClass.currentEnrollments
    });

res.status(200).json({
      message: 'Unenrolled successfully',
      kuppiClass: kuppiClass
    });
  } catch (error) {
    console.error('Error unenrolling student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Process payment and enroll student in kuppi class
// @route   POST /api/kuppi/payment/:classId
// @access   Private
const processPaymentAndEnroll = async (req, res) => {
  try {
    console.log('Processing payment for class:', req.params.classId);
    
    const classId = req.params.classId;
    const studentId = req.user._id.toString();
    const { paymentDetails } = req.body; // In real app, this would contain payment info

    // Find the kuppi class
    const kuppiClass = await KuppiAd.findById(classId);

    if (!kuppiClass) {
      return res.status(404).json({ message: 'Kuppi class not found' });
    }

    // Check if class is free
    if (kuppiClass.price === 0) {
      return res.status(400).json({ message: 'This is a free class. Use the enroll endpoint instead.' });
    }

    // Check if student is already enrolled
    const alreadyEnrolled = kuppiClass.enrolledStudents.some(
      enrollment => enrollment.student.toString() === studentId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already Enrolled' });
    }

    // Check if class is at max capacity
    if (kuppiClass.currentEnrollments >= kuppiClass.maxStudents) {
      return res.status(400).json({ message: 'Class is at maximum capacity' });
    }

    // Process payment (in real app, you would integrate with payment gateway here)
    // For now, we'll simulate successful payment
    console.log('Payment processed successfully for class:', classId, 'student:', studentId);

    // Add student to enrolled students
    kuppiClass.enrolledStudents.push({
      student: req.user._id,
      enrolledAt: new Date()
    });

    // Update current enrollment count
    kuppiClass.currentEnrollments = kuppiClass.enrolledStudents.length;

    // Save to database
    await kuppiClass.save();
    await kuppiClass.populate('createdBy', 'firstName lastName email');
    await kuppiClass.populate('enrolledStudents.student', 'firstName lastName email');

    // Create notification for class creator
    try {
      await Notification.createKuppiEnrollmentNotification(
        kuppiClass.createdBy._id, // Class creator ID
        req.user._id, // Student ID
        kuppiClass._id, // Class ID
        `${req.user.firstName || 'Student'} ${req.user.lastName || ''}`, // Student name
        kuppiClass.title, // Class name
        kuppiClass.subject // Class subject
      );
      console.log('Notification created for class creator:', kuppiClass.createdBy._id);
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't fail the enrollment if notification fails
    }

    console.log('Student enrolled successfully after payment:', {
      classId: classId,
      studentId: studentId,
      totalEnrolled: kuppiClass.currentEnrollments,
      price: kuppiClass.price
    });

    res.status(200).json({
      message: 'Payment processed and enrollment completed successfully',
      kuppiClass: kuppiClass
    });
  } catch (error) {
    console.error('Error processing payment and enrollment:', error);
    res.status(500).json({ message: 'Server error processing payment and enrollment', error: error.message });
  }
};

module.exports = {
  createKuppiAd,
  getApprovedKuppiAds,
  getMyKuppiAds,
  getAllKuppiAds,
  updateKuppiAd,
  approveKuppiAd,
  rejectKuppiAd,
  deleteKuppiAd,
  enrollStudent,
  getMyEnrollments,
  unenrollStudent,
  processPaymentAndEnroll
};
