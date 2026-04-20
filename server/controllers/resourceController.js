const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');

const populateResource = (query) =>
  query
    .populate('uploadedBy', 'username firstName lastName')
    .populate('ratings.user', 'username firstName lastName');

const ensureResourceOwner = (resource, userId) => {
  if (!resource.uploadedBy) {
    return false;
  }

  return resource.uploadedBy.toString() === userId;
};

const canDeleteResource = (resource, user) =>
  ensureResourceOwner(resource, user.id) || user?.role === 'admin';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/resources');
    console.log('Upload path:', uploadPath);
    
    try {
      if (!fs.existsSync(uploadPath)) {
        console.log('Creating uploads directory...');
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error creating upload directory:', error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('File filter:', file.mimetype);
  
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error('File type not allowed:', file.mimetype);
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const createResource = async (req, res) => {
  try {
    console.log('=== CREATE RESOURCE REQUEST ===');
    console.log('Request headers:', req.headers);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Content-Type:', req.headers['content-type']);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array(),
        body: req.body,
        file: req.file 
      });
    }

    let { title, subject, description, type, fileUrl, linkUrl, tags } = req.body;
    
    console.log('Creating resource:', { title, subject, type, hasFile: !!req.file });
    
    // Validate required fields based on type
    if (!type) {
      console.log('Type validation failed - no type provided');
      return res.status(400).json({ message: 'Resource type is required' });
    }
    
    if (type === 'link' && !linkUrl) {
      console.log('Link validation failed - no linkUrl provided');
      return res.status(400).json({ message: 'Link URL is required for link resources' });
    }
    
    if ((type === 'file' || type === 'document') && !req.file) {
      console.log('File validation failed - no file provided');
      console.log('Request file details:', req.file);
      console.log('Request body fileUrl:', fileUrl);
      return res.status(400).json({ 
        message: 'File is required for file/document resources',
        debug: {
          hasFile: !!req.file,
          file: req.file,
          bodyFileUrl: fileUrl,
          type: type
        }
      });
    }
    
    // Handle file upload
    if (req.file && (type === 'file' || type === 'document')) {
      fileUrl = `/uploads/resources/${req.file.filename}`;
      console.log('File uploaded:', fileUrl);
    }

    // Parse tags if they come as string
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    const resourceData = {
      title,
      subject,
      description,
      type,
      fileUrl,
      linkUrl,
      tags: tags || []
    };

    // Only add uploadedBy if user is authenticated
    if (req.user && req.user.id) {
      resourceData.uploadedBy = req.user.id;
    }

    console.log('Final resource data:', resourceData);

    const resource = new Resource(resourceData);

    await resource.save();
    
    await resource.populate('uploadedBy', 'username firstName lastName');

    console.log('Resource created successfully:', resource);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ 
      message: 'Server error creating resource', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { subject, type, search } = req.query;

    // Build filter
    let filter = {};
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resources = await populateResource(Resource.find(filter))
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(filter);

    res.json({
      resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getResourceById = async (req, res) => {
  try {
    const resource = await populateResource(Resource.findById(req.params.id));

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateResource = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!ensureResourceOwner(resource, req.user.id)) {
      return res.status(403).json({ message: 'Only the resource creator can update this resource' });
    }

    const { title, subject, description, type, fileUrl, linkUrl, tags } = req.body;

    resource.title = title || resource.title;
    resource.subject = subject || resource.subject;
    resource.description = description || resource.description;
    resource.type = type || resource.type;
    resource.fileUrl = fileUrl || resource.fileUrl;
    resource.linkUrl = linkUrl || resource.linkUrl;
    resource.tags = tags || resource.tags;

    await resource.save();
    
    await resource.populate('uploadedBy', 'username firstName lastName');
    await resource.populate('ratings.user', 'username firstName lastName');

    res.json(resource);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Server error updating resource', error: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!canDeleteResource(resource, req.user)) {
      return res.status(403).json({ message: 'Only the resource creator or an admin can delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Server error deleting resource', error: error.message });
  }
};

const rateResource = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const userId = req.user.id;

    // Check if user already rated
    const existingRating = resource.ratings?.find(r => r.user?.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      resource.ratings.push({ user: userId, rating });
    }

    await resource.calculateAverageRating();
    
    await resource.populate('uploadedBy', 'username firstName lastName');
    await resource.populate('ratings.user', 'username firstName lastName');

    res.json(resource);
  } catch (error) {
    console.error('Rate resource error:', error);
    res.status(500).json({ message: 'Server error rating resource', error: error.message });
  }
};

const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if it's a file type with a fileUrl
    if (!resource.fileUrl || (resource.type !== 'file' && resource.type !== 'document')) {
      return res.status(400).json({ message: 'Resource is not downloadable' });
    }

    const filePath = path.join(__dirname, '..', resource.fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Get file extension to set proper content type
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${resource.title}${ext}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    // Increment download count
    resource.downloads = (resource.downloads || 0) + 1;
    await resource.save();
    
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({ message: 'Server error downloading resource' });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  rateResource,
  downloadResource,
  upload // Export multer upload middleware
};
