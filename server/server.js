const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
// app.use(limiter); // Commented out for development - uncomment for production

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/collaborations', require('./routes/collaborations'));
app.use('/api/academic', require('./routes/academic'));
app.use('/api/kuppi', require('./routes/kuppiAdRoutes'));
app.use('/api/assistant', require('./routes/assistant'));

// Integrated Skills Routes
app.use('/api/skills/integrated', require('./routes/integratedSkills'));

// Reminder & Progress Module Routes
app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/reminders', require('./routes/reminders'));
// app.use('/api/progress', require('./routes/progress'));
// app.use('/api/goals', require('./routes/goals'));
// app.use('/api/notifications', require('./routes/notifications'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5012;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Initialize cron jobs
require('./cron/reminderScheduler');
