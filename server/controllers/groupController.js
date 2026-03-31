const { validationResult } = require('express-validator');
const Group = require('../models/Group');

const createGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, subject, description, capacity } = req.body;

    const group = new Group({
      name,
      subject,
      description,
      capacity,
      createdBy: req.user.id,
      members: [req.user.id] // Creator is automatically a member
    });

    await group.save();
    await group.populate('createdBy', 'username firstName lastName');
    await group.populate('members', 'username firstName lastName');

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const groups = await Group.find({ isActive: true })
      .populate('createdBy', 'username firstName lastName')
      .populate('members', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Group.countDocuments({ isActive: true });

    res.json({
      groups,
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

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('createdBy', 'username firstName lastName')
      .populate('members', 'username firstName lastName');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    if (group.members.length >= group.capacity) {
      return res.status(400).json({ message: 'Group is full' });
    }

    group.members.push(req.user.id);
    await group.save();

    await group.populate('members', 'username firstName lastName');

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are not a member of this group' });
    }

    if (group.createdBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'Group creator cannot leave the group' });
    }

    group.members = group.members.filter(member => member.toString() !== req.user.id);
    await group.save();

    await group.populate('members', 'username firstName lastName');

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only group creator can update the group' });
    }

    const { name, subject, description, capacity } = req.body;

    if (capacity < group.members.length) {
      return res.status(400).json({ message: 'Capacity cannot be less than current members' });
    }

    group.name = name || group.name;
    group.subject = subject || group.subject;
    group.description = description || group.description;
    group.capacity = capacity || group.capacity;

    await group.save();
    await group.populate('createdBy', 'username firstName lastName');
    await group.populate('members', 'username firstName lastName');

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only group creator can delete the group' });
    }

    group.isActive = false;
    await group.save();

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  updateGroup,
  deleteGroup
};
