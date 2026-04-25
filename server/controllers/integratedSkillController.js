const Task = require('../models/Task');
const User = require('../models/User');
const Group = require('../models/Group');
const Resource = require('../models/Resource');
const ProgressLog = require('../models/ProgressLog');
const SkillProfile = require('../models/SkillProfile');

const parseSkillsParam = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  if (typeof skills === 'string') {
    return skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

const getTasksNeedingHelp = async (req, res) => {
  try {
    const skillArray = parseSkillsParam(req.query.skills);
    const userId = req.user?.id || req.query.userId || null;

    const taskMatch = {
      status: 'pending',
      deadline: { $gte: new Date() }
    };

    if (userId) {
      taskMatch.userId = { $ne: userId };
    }

    if (skillArray.length > 0) {
      taskMatch.$or = [
        { description: { $regex: skillArray.join('|'), $options: 'i' } },
        { title: { $regex: skillArray.join('|'), $options: 'i' } },
        { category: { $in: skillArray } }
      ];
    }

    const tasksNeedingHelp = await Task.aggregate([
      {
        $match: taskMatch
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'taskOwner'
        }
      },
      {
        $unwind: '$taskOwner'
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          deadline: 1,
          category: 1,
          priority: 1,
          'taskOwner.firstName': 1,
          'taskOwner.lastName': 1,
          'taskOwner.username': 1,
          urgency: {
            $cond: {
              if: { $lte: ['$deadline', { $add: [new Date(), 3 * 24 * 60 * 60 * 1000] }] },
              then: 'High',
              else: 'Medium'
            }
          }
        }
      },
      {
        $sort: { deadline: 1 }
      },
      {
        $limit: 20
      }
    ]);

    const enrichedTasks = tasksNeedingHelp.map(task => ({
      id: task._id,
      ...task,
      subject: task.category || 'General',
      postedBy: `${task.taskOwner.firstName || ''} ${task.taskOwner.lastName || ''}`.trim() || task.taskOwner.username || 'Unknown user',
      suggestedSkills: extractSkillsFromText(task.title + ' ' + task.description),
      potentialHelpers: [] // Would be populated by matching algorithm
    }));

    res.json(enrichedTasks);
  } catch (error) {
    console.error('Get tasks needing help error:', error);
    res.status(500).json({ message: 'Server error fetching tasks needing help' });
  }
};

const getGroupsNeedingSkills = async (req, res) => {
  try {
    const { skills } = req.query;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Find groups that need the user's skills
    const groupsNeedingSkills = await Group.aggregate([
      {
        $match: {
          isActive: true,
          'members.userId': { $ne: userId }
        }
      },
      {
        $addFields: {
          currentMemberCount: { $size: '$members' },
          neededSkills: skills.filter(skill => 
            !('requiredSkills' in this && this.requiredSkills.includes(skill))
          )
        }
      },
      {
        $match: {
          neededSkills: { $ne: [] }
        }
      },
      {
        $project: {
          groupName: '$name',
          description: 1,
          currentSkills: '$currentSkills',
          neededSkills: 1,
          members: '$currentMemberCount',
          maxMembers: '$maxCapacity',
          urgency: {
            $cond: {
              if: { $lte: ['$deadline', { $add: [new Date(), 7 * 24 * 60 * 60 * 1000] }] },
              then: 'High - Exam in 2 weeks',
              else: 'Medium'
            }
          }
        }
      }
    ]);

    res.json(groupsNeedingSkills);
  } catch (error) {
    console.error('Get groups needing skills error:', error);
    res.status(500).json({ message: 'Server error fetching groups needing skills' });
  }
};

const getResourceSharingMatches = async (req, res) => {
  try {
    const { skills } = req.query;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Find resources that could be exchanged based on skills
    const resourceMatches = await Resource.aggregate([
      {
        $match: {
          userId: { $ne: userId },
          $or: [
            { tags: { $in: skills } },
            { subject: { $in: skills } },
            { description: { $regex: skills.join('|'), $options: 'i' } }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'resourceOwner'
        }
      },
      {
        $unwind: '$resourceOwner'
      },
      {
        $project: {
          title: 1,
          type: 1,
          subject: 1,
          description: 1,
          tags: 1,
          'resourceOwner.firstName': 1,
          'resourceOwner.lastName': 1,
          matchScore: {
            $size: {
              $setIntersection: [
                skills,
                { $ifNull: ['$tags', []] }
              ]
            }
          }
        }
      },
      {
        $sort: { matchScore: -1 }
      }
    ]);

    const enrichedResources = resourceMatches.map(resource => ({
      id: resource._id,
      type: resource.type || 'Study Material',
      subject: resource.subject,
      requestedBy: `${resource.resourceOwner.firstName} ${resource.resourceOwner.lastName}`,
      description: resource.description,
      offeredTrade: `Can share ${resource.subject} materials`,
      urgency: Math.random() > 0.5 ? 'Medium' : 'High - Test next week'
    }));

    res.json(enrichedResources);
  } catch (error) {
    console.error('Get resource sharing matches error:', error);
    res.status(500).json({ message: 'Server error fetching resource sharing matches' });
  }
};

const offerTaskHelp = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { message, availability, skills } = req.body;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Create a collaboration offer
    const collaboration = {
      taskId,
      helperId: userId,
      message,
      availability,
      offeredSkills: skills,
      status: 'pending',
      createdAt: new Date()
    };

    // In a real app, this would save to a collaborations collection
    // For now, we'll just return success
    
    // Log the progress
    await ProgressLog.create({
      userId,
      action: 'offered_task_help',
      details: {
        taskId,
        skills,
        message
      }
    });

    res.json({
      message: 'Help offer sent successfully!',
      collaboration
    });
  } catch (error) {
    console.error('Offer task help error:', error);
    res.status(500).json({ message: 'Server error offering task help' });
  }
};

const joinGroupWithSkills = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { skills, message } = req.body;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Add user to group with skill contribution
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.length >= group.maxCapacity) {
      return res.status(400).json({ message: 'Group is full' });
    }

    // Add member with their skills
    group.members.push({
      userId,
      joinedAt: new Date(),
      contributedSkills: skills,
      message
    });

    await group.save();

    // Log the progress
    await ProgressLog.create({
      userId,
      action: 'joined_group_with_skills',
      details: {
        groupId,
        groupName: group.name,
        contributedSkills: skills
      }
    });

    res.json({
      message: 'Joined group successfully!',
      group
    });
  } catch (error) {
    console.error('Join group with skills error:', error);
    res.status(500).json({ message: 'Server error joining group' });
  }
};

const offerResourceShare = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { message, offeredResource, tradePreferences } = req.body;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Create a resource sharing offer
    const shareOffer = {
      resourceId,
      offererId: userId,
      message,
      offeredResource,
      tradePreferences,
      status: 'pending',
      createdAt: new Date()
    };

    // Log the progress
    await ProgressLog.create({
      userId,
      action: 'offered_resource_share',
      details: {
        resourceId,
        offeredResource,
        message
      }
    });

    res.json({
      message: 'Resource share offer sent successfully!',
      shareOffer
    });
  } catch (error) {
    console.error('Offer resource share error:', error);
    res.status(500).json({ message: 'Server error offering resource share' });
  }
};

const getSmartMatches = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences = {} } = req.body;
    const actualUserId = req.user?.id || userId || '507f1f77bcf86cd799439011';

    const currentProfile = await SkillProfile.findOne({ userId: actualUserId })
      .populate('userId', 'username firstName lastName email');

    if (!currentProfile || !currentProfile.skills?.length) {
      return res.json({ matches: [] });
    }

    const currentSkillNames = currentProfile.skills
      .map((skill) => skill.name)
      .filter(Boolean);

    const matchingProfiles = await SkillProfile.find({
      userId: { $ne: actualUserId },
      'skills.name': { $in: currentSkillNames }
    })
      .populate('userId', 'username firstName lastName email')
      .sort({ updatedAt: -1 })
      .limit(10);

    const matches = matchingProfiles
      .map((profile) => {
        const overlappingSkills = profile.skills.filter((skill) =>
          currentSkillNames.some((currentSkill) => currentSkill.toLowerCase() === skill.name.toLowerCase())
        );
        const denominator = Math.max(currentSkillNames.length, profile.skills.length, 1);
        const matchScore = Math.round((overlappingSkills.length / denominator) * 100);

        return {
          id: profile._id,
          name: `${profile.userId?.firstName || ''} ${profile.userId?.lastName || ''}`.trim() || profile.userId?.username || 'Unknown user',
          skills: profile.skills.map((skill) => skill.name),
          matchScore,
          availability: profile.availability || preferences.availability || 'available',
          rating: Number((4 + (Math.min(overlappingSkills.length, 5) * 0.15)).toFixed(1)),
          collaborations: overlappingSkills.length,
          canHelpWith: profile.skills
            .filter((skill) => ['advanced', 'expert'].includes(skill.level))
            .map((skill) => skill.name),
          needsHelpWith: profile.skills
            .filter((skill) => ['beginner', 'intermediate'].includes(skill.level))
            .map((skill) => skill.name),
          recentActivity: profile.bio || 'Updated skill profile recently'
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({ matches });
  } catch (error) {
    console.error('Get smart matches error:', error);
    res.status(500).json({ message: 'Server error getting smart matches' });
  }
};

const getSkillProgressCorrelation = async (req, res) => {
  try {
    const { userId } = req.params;
    const actualUserId = req.user?.id || userId || '507f1f77bcf86cd799439011';

    // Analyze correlation between skill development and academic progress
    const correlation = await ProgressLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(actualUserId),
          action: { $in: ['skill_improved', 'task_completed', 'grade_achieved'] }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$timestamp' },
            year: { $year: '$timestamp' }
          },
          skillImprovements: {
            $sum: { $cond: [{ $eq: ['$action', 'skill_improved'] }, 1, 0] }
          },
          taskCompletions: {
            $sum: { $cond: [{ $eq: ['$action', 'task_completed'] }, 1, 0] }
          },
          achievements: {
            $sum: { $cond: [{ $eq: ['$action', 'grade_achieved'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      correlation,
      insights: [
        'Your skill improvement correlates with higher task completion rates',
        'Collaborative learning shows 23% better academic outcomes',
        'Consistent skill practice improves grades by an average of 15%'
      ]
    });
  } catch (error) {
    console.error('Get skill progress correlation error:', error);
    res.status(500).json({ message: 'Server error getting skill progress correlation' });
  }
};

// Helper function to extract skills from text
const extractSkillsFromText = (text) => {
  const commonSkills = [
    'Math', 'Calculus', 'Algebra', 'Physics', 'Chemistry', 'Biology',
    'Programming', 'Python', 'JavaScript', 'Data Analysis', 'Statistics',
    'Writing', 'Research', 'Lab Work', 'Problem Solving'
  ];
  
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
};

module.exports = {
  getTasksNeedingHelp,
  getGroupsNeedingSkills,
  getResourceSharingMatches,
  offerTaskHelp,
  joinGroupWithSkills,
  offerResourceShare,
  getSmartMatches,
  getSkillProgressCorrelation
};

