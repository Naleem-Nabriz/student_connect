const { validationResult } = require('express-validator');
const CollaborationRequest = require('../models/CollaborationRequest');
const SkillProfile = require('../models/SkillProfile');

const createCollaborationRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, requiredSkills, deadline } = req.body;

    const collaboration = new CollaborationRequest({
      title,
      description,
      requiredSkills,
      requestedBy: req.user.id,
      deadline
    });

    await collaboration.save();
    await collaboration.populate('requestedBy', 'username firstName lastName');

    res.status(201).json(collaboration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCollaborationRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, skill } = req.query;

    // Build filter
    let filter = {};
    if (status) filter.status = status;
    if (skill) {
      filter['requiredSkills.name'] = { $regex: skill, $options: 'i' };
    }

    const collaborations = await CollaborationRequest.find(filter)
      .populate('requestedBy', 'username firstName lastName')
      .populate('requestedTo', 'username firstName lastName')
      .populate('responses.user', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CollaborationRequest.countDocuments(filter);

    res.json({
      collaborations,
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

const getMyCollaborationRequests = async (req, res) => {
  try {
    const collaborations = await CollaborationRequest.find({
      $or: [
        { requestedBy: req.user.id },
        { 'responses.user': req.user.id }
      ]
    })
      .populate('requestedBy', 'username firstName lastName')
      .populate('requestedTo', 'username firstName lastName')
      .populate('responses.user', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.json(collaborations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCollaborationById = async (req, res) => {
  try {
    const collaboration = await CollaborationRequest.findById(req.params.id)
      .populate('requestedBy', 'username firstName lastName')
      .populate('requestedTo', 'username firstName lastName')
      .populate('responses.user', 'username firstName lastName');

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration request not found' });
    }

    res.json(collaboration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const respondToCollaboration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, message } = req.body;
    const collaboration = await CollaborationRequest.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration request not found' });
    }

    if (collaboration.requestedBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot respond to your own request' });
    }

    // Check if user already responded
    const existingResponse = collaboration.responses.find(r => r.user.toString() === req.user.id);
    if (existingResponse) {
      existingResponse.status = status;
      existingResponse.message = message;
    } else {
      collaboration.responses.push({
        user: req.user.id,
        status,
        message
      });
    }

    await collaboration.save();
    await collaboration.populate('requestedBy', 'username firstName lastName');
    await collaboration.populate('responses.user', 'username firstName lastName');

    res.json(collaboration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCollaborationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const collaboration = await CollaborationRequest.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration request not found' });
    }

    if (collaboration.requestedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only request creator can update status' });
    }

    collaboration.status = status;
    await collaboration.save();

    await collaboration.populate('requestedBy', 'username firstName lastName');
    await collaboration.populate('requestedTo', 'username firstName lastName');
    await collaboration.populate('responses.user', 'username firstName lastName');

    res.json(collaboration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const findMatchingUsers = async (req, res) => {
  try {
    const { skills } = req.query;
    const skillArray = skills ? skills.split(',').map(s => s.trim()) : [];

    if (skillArray.length === 0) {
      return res.status(400).json({ message: 'At least one skill is required' });
    }

    // Find users with matching skills
    const matchingProfiles = await SkillProfile.find({
      userId: { $ne: req.user.id },
      availability: 'available',
      'skills.name': { $in: skillArray }
    }).populate('userId', 'username firstName lastName email');

    // Calculate match score
    const usersWithScore = matchingProfiles.map(profile => {
      const userSkills = profile.skills.map(s => s.name.toLowerCase());
      const matchScore = skillArray.filter(skill => 
        userSkills.includes(skill.toLowerCase())
      ).length;
      
      return {
        ...profile.toObject(),
        matchScore
      };
    });

    // Sort by match score (highest first)
    usersWithScore.sort((a, b) => b.matchScore - a.matchScore);

    res.json(usersWithScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCollaborationRequest,
  getCollaborationRequests,
  getMyCollaborationRequests,
  getCollaborationById,
  respondToCollaboration,
  updateCollaborationStatus,
  findMatchingUsers
};
