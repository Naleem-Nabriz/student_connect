const { validationResult } = require('express-validator');
const Resource = require('../models/Resource');

const createResource = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, subject, description, type, fileUrl, linkUrl, tags } = req.body;

    const resource = new Resource({
      title,
      subject,
      description,
      type,
      fileUrl,
      linkUrl,
      uploadedBy: req.user.id,
      tags: tags || []
    });

    await resource.save();
    await resource.populate('uploadedBy', 'username firstName lastName');

    res.status(201).json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

    const resources = await Resource.find(filter)
      .populate('uploadedBy', 'username firstName lastName')
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
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'username firstName lastName')
      .populate('ratings.user', 'username firstName lastName');

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

    if (resource.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only resource creator can update the resource' });
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

    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only resource creator can delete the resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

    // Check if user already rated
    const existingRating = resource.ratings.find(r => r.user.toString() === req.user.id);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      resource.ratings.push({ user: req.user.id, rating });
    }

    await resource.calculateAverageRating();
    await resource.populate('uploadedBy', 'username firstName lastName');

    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  rateResource
};
