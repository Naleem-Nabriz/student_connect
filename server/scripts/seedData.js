const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Group = require('../models/Group');
const Resource = require('../models/Resource');
const SkillProfile = require('../models/SkillProfile');
const CollaborationRequest = require('../models/CollaborationRequest');
const Subject = require('../models/Subject');
const Record = require('../models/Record');
const KuppiClass = require('../models/KuppiClass');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Group.deleteMany({});
    await Resource.deleteMany({});
    await SkillProfile.deleteMany({});
    await CollaborationRequest.deleteMany({});
    await Subject.deleteMany({});
    await Record.deleteMany({});
    await KuppiClass.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'student'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'student'
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    ]);

    console.log('Created sample users');

    // Create sample groups
    const groups = await Group.create([
      {
        name: 'Math Study Group',
        subject: 'Mathematics',
        description: 'Advanced calculus study group',
        capacity: 10,
        createdBy: users[0]._id,
        members: [users[0]._id, users[1]._id]
      },
      {
        name: 'Web Development Team',
        subject: 'Computer Science',
        description: 'Learn React and Node.js together',
        capacity: 8,
        createdBy: users[1]._id,
        members: [users[1]._id]
      }
    ]);

    console.log('Created sample groups');

    // Create sample resources
    const resources = await Resource.create([
      {
        title: 'Calculus Notes',
        subject: 'Mathematics',
        description: 'Comprehensive calculus notes for beginners',
        type: 'document',
        fileUrl: '/uploads/calculus-notes.pdf',
        uploadedBy: users[0]._id,
        tags: ['calculus', 'math', 'notes']
      },
      {
        title: 'React Tutorial',
        subject: 'Computer Science',
        description: 'Complete React.js tutorial with examples',
        type: 'link',
        linkUrl: 'https://reactjs.org/tutorial',
        uploadedBy: users[1]._id,
        tags: ['react', 'javascript', 'tutorial']
      }
    ]);

    console.log('Created sample resources');

    // Create sample skill profiles
    const skillProfiles = await SkillProfile.create([
      {
        userId: users[0]._id,
        skills: [
          { name: 'Mathematics', level: 'advanced', category: 'Academic' },
          { name: 'Physics', level: 'intermediate', category: 'Academic' },
          { name: 'Java', level: 'beginner', category: 'Programming' }
        ],
        bio: 'Math enthusiast looking for study partners',
        availability: 'available'
      },
      {
        userId: users[1]._id,
        skills: [
          { name: 'JavaScript', level: 'advanced', category: 'Programming' },
          { name: 'React', level: 'intermediate', category: 'Programming' },
          { name: 'Node.js', level: 'intermediate', category: 'Programming' }
        ],
        bio: 'Full-stack developer passionate about web technologies',
        availability: 'available'
      }
    ]);

    console.log('Created sample skill profiles');

    // Create sample collaboration requests
    const collaborations = await CollaborationRequest.create([
      {
        title: 'Math Project Partner Needed',
        description: 'Looking for someone to work on calculus project',
        requiredSkills: [
          { name: 'Mathematics', level: 'intermediate' }
        ],
        requestedBy: users[0]._id,
        status: 'pending'
      },
      {
        title: 'Web App Development',
        description: 'Need help building a React application',
        requiredSkills: [
          { name: 'JavaScript', level: 'intermediate' },
          { name: 'React', level: 'beginner' }
        ],
        requestedBy: users[1]._id,
        status: 'pending'
      }
    ]);

    console.log('Created sample collaboration requests');

    // Create sample subjects
    const subjects = await Subject.create([
      {
        name: 'Calculus I',
        code: 'MATH101',
        credits: 4,
        semester: 'Fall 2024',
        userId: users[0]._id
      },
      {
        name: 'Physics I',
        code: 'PHYS101',
        credits: 3,
        semester: 'Fall 2024',
        userId: users[0]._id
      },
      {
        name: 'Web Development',
        code: 'CS201',
        credits: 3,
        semester: 'Fall 2024',
        userId: users[1]._id
      }
    ]);

    console.log('Created sample subjects');

    // Create sample records
    const records = await Record.create([
      {
        subjectId: subjects[0]._id,
        userId: users[0]._id,
        marks: 85,
        attendance: 90,
        assignmentScore: 88,
        testType: 'midterm',
        notes: 'Good performance on derivatives'
      },
      {
        subjectId: subjects[0]._id,
        userId: users[0]._id,
        marks: 92,
        attendance: 95,
        assignmentScore: 90,
        testType: 'final',
        notes: 'Excellent understanding of integrals'
      },
      {
        subjectId: subjects[2]._id,
        userId: users[1]._id,
        marks: 88,
        attendance: 100,
        assignmentScore: 95,
        testType: 'project',
        notes: 'Great React project implementation'
      }
    ]);

    console.log('Created sample records');

    // Create sample Kuppi Classes
    const kuppiClasses = await KuppiClass.create([
      {
        title: 'Advanced Mathematics for A/L',
        subject: 'Mathematics',
        location: 'Colombo 04',
        description: 'Comprehensive A/L mathematics class covering pure mathematics, mechanics, and statistics. Suitable for students preparing for advanced level examination.',
        contact: '+94 77 123 4567',
        teacher: users[2]._id, // admin user as teacher
        status: 'approved',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-15'),
        price: 5000,
        maxStudents: 25,
        currentStudents: 18,
        enrolledStudents: [
          { student: users[0]._id, enrolledAt: new Date(), status: 'enrolled' },
          { student: users[1]._id, enrolledAt: new Date(), status: 'enrolled' }
        ],
        ratings: [
          { student: users[0]._id, rating: 5, review: 'Excellent teaching method!', createdAt: new Date() },
          { student: users[1]._id, rating: 4, review: 'Very helpful class', createdAt: new Date() }
        ],
        averageRating: 4.5
      },
      {
        title: 'Physics Theory and Practical',
        subject: 'Physics',
        location: 'Kandy',
        description: 'Complete physics class with theory sessions and practical experiments. Covers mechanics, electricity, and modern physics.',
        contact: '+94 77 234 5678',
        teacher: users[2]._id,
        status: 'approved',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-11-30'),
        price: 4500,
        maxStudents: 20,
        currentStudents: 15,
        enrolledStudents: [
          { student: users[0]._id, enrolledAt: new Date(), status: 'enrolled' }
        ],
        ratings: [
          { student: users[0]._id, rating: 4, review: 'Good practical sessions', createdAt: new Date() }
        ],
        averageRating: 4.0
      },
      {
        title: 'Chemistry Organic & Inorganic',
        subject: 'Chemistry',
        location: 'Galle',
        description: 'In-depth chemistry class covering both organic and inorganic chemistry with lab sessions.',
        contact: '+94 77 345 6789',
        teacher: users[2]._id,
        status: 'pending',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-10-31'),
        price: 4000,
        maxStudents: 30,
        currentStudents: 0,
        enrolledStudents: [],
        ratings: [],
        averageRating: 0
      }
    ]);

    console.log('Created sample Kuppi classes');

    console.log('Seed data created successfully!');
    console.log('\nSample Login Credentials:');
    console.log('Student: john@example.com / password123');
    console.log('Student: jane@example.com / password123');
    console.log('Admin: admin@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
