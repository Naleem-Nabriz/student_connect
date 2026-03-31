const { validationResult } = require('express-validator');
const SkillProfile = require('../models/SkillProfile');

const createOrUpdateSkillProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { skills, bio, availability } = req.body;

    let skillProfile = await SkillProfile.findOne({ userId: req.user.id });

    if (skillProfile) {
      skillProfile.skills = skills || skillProfile.skills;
      skillProfile.bio = bio || skillProfile.bio;
      skillProfile.availability = availability || skillProfile.availability;
    } else {
      skillProfile = new SkillProfile({
        userId: req.user.id,
        skills: skills || [],
        bio: bio || '',
        availability: availability || 'available'
      });
    }

    await skillProfile.save();
    await skillProfile.populate('userId', 'username firstName lastName email');

    res.json(skillProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMySkillProfile = async (req, res) => {
  try {
    const skillProfile = await SkillProfile.findOne({ userId: req.user.id })
      .populate('userId', 'username firstName lastName email');

    if (!skillProfile) {
      return res.status(404).json({ message: 'Skill profile not found' });
    }

    res.json(skillProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSkillProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { skill, availability } = req.query;

    // Build filter
    let filter = { userId: { $ne: req.user.id } }; // Exclude current user
    if (skill) {
      filter['skills.name'] = { $regex: skill, $options: 'i' };
    }
    if (availability) {
      filter.availability = availability;
    }

    const skillProfiles = await SkillProfile.find(filter)
      .populate('userId', 'username firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SkillProfile.countDocuments(filter);

    res.json({
      skillProfiles,
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

const getSkillProfileById = async (req, res) => {
  try {
    const skillProfile = await SkillProfile.findById(req.params.id)
      .populate('userId', 'username firstName lastName email');

    if (!skillProfile) {
      return res.status(404).json({ message: 'Skill profile not found' });
    }

    res.json(skillProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrUpdateSkillProfile,
  getMySkillProfile,
  getSkillProfiles,
  getSkillProfileById
};
