const { validationResult } = require('express-validator');
const Subject = require('../models/Subject');
const Record = require('../models/Record');

const roundToTwo = (value) => Number((value || 0).toFixed(2));

const getRecordAssessmentValues = (record) => {
  const values = [
    record.quizMarks,
    record.midtermMarks,
    record.assignmentMarks,
    record.finalMarks,
  ].filter((value) => value !== undefined && value !== null);

  if (values.length > 0) {
    return values;
  }

  if (record.marks !== undefined && record.marks !== null) {
    return [record.marks];
  }

  return [];
};

const buildSubjectInsight = (subject, subjectRecords) => {
  const allAssessmentValues = subjectRecords.flatMap(getRecordAssessmentValues);
  const totalMarks = allAssessmentValues.reduce((sum, value) => sum + value, 0);
  const attendanceRecords = subjectRecords.filter((record) => record.attendance !== undefined && record.attendance !== null);
  const totalAttendance = attendanceRecords.reduce((sum, r) => sum + (r.attendance || 0), 0);
  const assignmentValues = subjectRecords
    .map((record) => record.assignmentMarks ?? record.assignmentScore)
    .filter((value) => value !== undefined && value !== null);
  const totalAssignments = assignmentValues.reduce((sum, value) => sum + value, 0);
  const count = subjectRecords.length;
  const attendanceCount = attendanceRecords.length;
  const marksCount = allAssessmentValues.length;
  const assignmentCount = assignmentValues.length;

  const averageMarks = marksCount > 0 ? roundToTwo(totalMarks / marksCount) : 0;
  const averageAttendance = attendanceCount > 0 ? roundToTwo(totalAttendance / attendanceCount) : 0;
  const averageAssignmentScore = assignmentCount > 0 ? roundToTwo(totalAssignments / assignmentCount) : 0;

  const goals = {
    targetMarks: subject.targetMarks ?? null,
    targetAttendance: subject.targetAttendance ?? null,
    weeklyStudyHours: subject.weeklyStudyHours ?? null,
  };

  const goalProgress = {
    marksGap: goals.targetMarks !== null ? roundToTwo(goals.targetMarks - averageMarks) : null,
    attendanceGap: goals.targetAttendance !== null ? roundToTwo(goals.targetAttendance - averageAttendance) : null,
  };

  const riskFlags = [];

  if (count === 0) {
    riskFlags.push({
      type: 'missing_records',
      severity: 'medium',
      message: `No academic records have been added for ${subject.name} yet.`,
    });
  }

  if (count > 0 && averageMarks < 60) {
    riskFlags.push({
      type: 'low_marks',
      severity: 'high',
      message: `${subject.name} average marks are below 60%.`,
    });
  } else if (count > 0 && averageMarks < 75) {
    riskFlags.push({
      type: 'marks_watch',
      severity: 'medium',
      message: `${subject.name} marks need improvement to stay competitive.`,
    });
  }

  if (count > 0 && averageAttendance < 75) {
    riskFlags.push({
      type: 'low_attendance',
      severity: 'high',
      message: `${subject.name} attendance is below 75%.`,
    });
  } else if (count > 0 && averageAttendance < 85) {
    riskFlags.push({
      type: 'attendance_watch',
      severity: 'medium',
      message: `${subject.name} attendance is close to the warning zone.`,
    });
  }

  if (goals.targetMarks !== null && count > 0 && averageMarks < goals.targetMarks) {
    riskFlags.push({
      type: 'goal_gap_marks',
      severity: goals.targetMarks - averageMarks >= 15 ? 'high' : 'medium',
      message: `${subject.name} is ${roundToTwo(goals.targetMarks - averageMarks)} points below your marks goal.`,
    });
  }

  if (goals.targetAttendance !== null && count > 0 && averageAttendance < goals.targetAttendance) {
    riskFlags.push({
      type: 'goal_gap_attendance',
      severity: goals.targetAttendance - averageAttendance >= 10 ? 'high' : 'medium',
      message: `${subject.name} is ${roundToTwo(goals.targetAttendance - averageAttendance)} points below your attendance goal.`,
    });
  }

  const recommendations = [];

  if (count === 0) {
    recommendations.push(`Add your first record for ${subject.name} to unlock tracking insights.`);
  }
  if (averageMarks > 0 && averageMarks < 75) {
    recommendations.push(`Plan two focused revision sessions for ${subject.name} this week and review your weakest test areas.`);
  }
  if (averageAttendance > 0 && averageAttendance < 85) {
    recommendations.push(`Protect your attendance in ${subject.name} by scheduling classes and travel time first.`);
  }
  if (averageAssignmentScore > 0 && averageAssignmentScore < 70) {
    recommendations.push(`Break ${subject.name} assignments into smaller deadlines and start them earlier.`);
  }
  if (goals.weeklyStudyHours) {
    recommendations.push(`Aim for about ${goals.weeklyStudyHours} study hour${goals.weeklyStudyHours === 1 ? '' : 's'} per week for ${subject.name}.`);
  }

  const highestSeverity = riskFlags.some((flag) => flag.severity === 'high')
    ? 'high'
    : riskFlags.some((flag) => flag.severity === 'medium')
      ? 'medium'
      : 'low';

  return {
    subject,
    averageMarks,
    averageAttendance,
    averageAssignmentScore,
    totalRecords: count,
    goals,
    goalProgress,
    riskLevel: highestSeverity,
    riskFlags,
    recommendations,
  };
};

// Subject Controllers
const createSubject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, credits, semester, targetMarks, targetAttendance, weeklyStudyHours } = req.body;

    const subject = new Subject({
      name,
      code,
      credits,
      semester,
      targetMarks,
      targetAttendance,
      weeklyStudyHours,
      userId: req.user.id
    });

    await subject.save();

    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subject already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id })
      .sort({ name: 1 });

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, credits, semester, targetMarks, targetAttendance, weeklyStudyHours } = req.body;
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.name = name || subject.name;
    subject.code = code || subject.code;
    subject.credits = credits !== undefined ? credits : subject.credits;
    subject.semester = semester || subject.semester;
    subject.targetMarks = targetMarks !== undefined ? targetMarks : subject.targetMarks;
    subject.targetAttendance = targetAttendance !== undefined ? targetAttendance : subject.targetAttendance;
    subject.weeklyStudyHours = weeklyStudyHours !== undefined ? weeklyStudyHours : subject.weeklyStudyHours;

    await subject.save();

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Delete all records associated with this subject
    await Record.deleteMany({ subjectId: subject._id });
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subject and associated records deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Record Controllers
const createRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      subjectId,
      quizMarks,
      midtermMarks,
      assignmentMarks,
      finalMarks,
      attendance,
      notes,
      date,
    } = req.body;

    // Verify subject belongs to user
    const subject = await Subject.findOne({ _id: subjectId, userId: req.user.id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const record = new Record({
      subjectId,
      userId: req.user.id,
      quizMarks,
      midtermMarks,
      assignmentMarks,
      finalMarks,
      attendance,
      notes,
      date
    });

    await record.save();
    await record.populate('subjectId', 'name code credits');

    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecords = async (req, res) => {
  try {
    const { subjectId } = req.query;
    let filter = { userId: req.user.id };

    if (subjectId) {
      // Verify subject belongs to user
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user.id });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      filter.subjectId = subjectId;
    }

    const records = await Record.find(filter)
      .populate('subjectId', 'name code credits')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      quizMarks,
      midtermMarks,
      assignmentMarks,
      finalMarks,
      attendance,
      notes,
      date,
    } = req.body;
    const record = await Record.findOne({ _id: req.params.id, userId: req.user.id });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    record.quizMarks = quizMarks !== undefined ? quizMarks : record.quizMarks;
    record.midtermMarks = midtermMarks !== undefined ? midtermMarks : record.midtermMarks;
    record.assignmentMarks = assignmentMarks !== undefined ? assignmentMarks : record.assignmentMarks;
    record.finalMarks = finalMarks !== undefined ? finalMarks : record.finalMarks;
    record.attendance = attendance !== undefined ? attendance : record.attendance;
    record.notes = notes !== undefined ? notes : record.notes;
    record.date = date || record.date;

    await record.save();
    await record.populate('subjectId', 'name code credits');

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, userId: req.user.id });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await Record.findByIdAndDelete(req.params.id);

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProgressDashboard = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    const records = await Record.find({ userId: req.user.id })
      .populate('subjectId', 'name code credits');

    const subjectStats = subjects.map(subject => {
      const subjectRecords = records.filter(r => r.subjectId._id.toString() === subject._id.toString());
      return buildSubjectInsight(subject, subjectRecords);
    });

    const atRiskSubjects = subjectStats.filter(subject => subject.riskLevel === 'high').length;
    const mediumRiskSubjects = subjectStats.filter(subject => subject.riskLevel === 'medium').length;
    const recommendedStudyHours = subjectStats.reduce((sum, subject) => sum + (subject.goals.weeklyStudyHours || 0), 0);

    const overallStats = {
      totalSubjects: subjects.length,
      totalRecords: records.length,
      overallAverage: roundToTwo(subjectStats.reduce((sum, s) => sum + Number(s.averageMarks || 0), 0) / (subjects.length || 1)),
      overallAttendance: roundToTwo(subjectStats.reduce((sum, s) => sum + Number(s.averageAttendance || 0), 0) / (subjects.length || 1)),
      atRiskSubjects,
      mediumRiskSubjects,
      recommendedStudyHours,
    };

    const riskAlerts = subjectStats
      .flatMap(subject => subject.riskFlags.map(flag => ({
        ...flag,
        subjectId: subject.subject._id,
        subjectName: subject.subject.name,
      })))
      .sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      })
      .slice(0, 6);

    const recommendations = subjectStats
      .flatMap(subject => subject.recommendations.map(text => ({
        subjectId: subject.subject._id,
        subjectName: subject.subject.name,
        text,
      })))
      .slice(0, 8);

    const strongestSubject = subjectStats.length
      ? subjectStats.reduce((best, current) => (current.averageMarks > best.averageMarks ? current : best))
      : null;

    const weakestSubject = subjectStats.length
      ? subjectStats.reduce((worst, current) => (current.averageMarks < worst.averageMarks ? current : worst))
      : null;

    res.json({
      subjectStats,
      overallStats,
      riskAlerts,
      recommendations,
      coachingSummary: {
        strongestSubject: strongestSubject ? {
          name: strongestSubject.subject.name,
          averageMarks: strongestSubject.averageMarks,
        } : null,
        weakestSubject: weakestSubject ? {
          name: weakestSubject.subject.name,
          averageMarks: weakestSubject.averageMarks,
        } : null,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  // Subject methods
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  
  // Record methods
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  
  // Dashboard
  getProgressDashboard
};
