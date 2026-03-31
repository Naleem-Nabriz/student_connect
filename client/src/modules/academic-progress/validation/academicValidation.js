import { validateRequired } from '../../../utils/validation';

export const subjectValidationRules = {
  name: {
    required: 'Subject name is required',
    minLength: {
      value: 2,
      message: 'Subject name must be at least 2 characters',
    },
  },
  code: {
    maxLength: {
      value: 20,
      message: 'Subject code must not exceed 20 characters',
    },
  },
  credits: {
    min: {
      value: 1,
      message: 'Credits must be at least 1',
    },
    max: {
      value: 10,
      message: 'Credits must not exceed 10',
    },
  },
  semester: {
    maxLength: {
      value: 50,
      message: 'Semester must not exceed 50 characters',
    },
  },
};

export const recordValidationRules = {
  subjectId: {
    required: 'Subject is required',
  },
  marks: {
    min: {
      value: 0,
      message: 'Marks cannot be less than 0',
    },
    max: {
      value: 100,
      message: 'Marks cannot exceed 100',
    },
  },
  attendance: {
    min: {
      value: 0,
      message: 'Attendance cannot be less than 0',
    },
    max: {
      value: 100,
      message: 'Attendance cannot exceed 100',
    },
  },
  assignmentScore: {
    min: {
      value: 0,
      message: 'Assignment score cannot be less than 0',
    },
    max: {
      value: 100,
      message: 'Assignment score cannot exceed 100',
    },
  },
  testType: {
    validate: (value) => {
      const validTypes = ['quiz', 'midterm', 'final', 'assignment', 'project'];
      if (!validTypes.includes(value)) {
        return 'Invalid test type';
      }
      return true;
    },
  },
  notes: {
    maxLength: {
      value: 500,
      message: 'Notes must not exceed 500 characters',
    },
  },
};

export const validateSubject = (data) => {
  const errors = {};

  const requiredName = validateRequired(data.name);
  if (requiredName !== true) {
    errors.name = requiredName;
  } else if (data.name.trim().length < 2) {
    errors.name = subjectValidationRules.name.minLength.message;
  }

  if (data.code && data.code.length > 20) {
    errors.code = subjectValidationRules.code.maxLength.message;
  }

  if (data.credits !== undefined) {
    if (data.credits < 1) {
      errors.credits = subjectValidationRules.credits.min.message;
    } else if (data.credits > 10) {
      errors.credits = subjectValidationRules.credits.max.message;
    }
  }

  if (data.semester && data.semester.length > 50) {
    errors.semester = subjectValidationRules.semester.maxLength.message;
  }

  return errors;
};

export const validateRecord = (data) => {
  const errors = {};

  if (!data.subjectId) {
    errors.subjectId = recordValidationRules.subjectId.required;
  }

  if (data.marks !== undefined) {
    if (data.marks < 0) {
      errors.marks = recordValidationRules.marks.min.message;
    } else if (data.marks > 100) {
      errors.marks = recordValidationRules.marks.max.message;
    }
  }

  if (data.attendance !== undefined) {
    if (data.attendance < 0) {
      errors.attendance = recordValidationRules.attendance.min.message;
    } else if (data.attendance > 100) {
      errors.attendance = recordValidationRules.attendance.max.message;
    }
  }

  if (data.assignmentScore !== undefined) {
    if (data.assignmentScore < 0) {
      errors.assignmentScore = recordValidationRules.assignmentScore.min.message;
    } else if (data.assignmentScore > 100) {
      errors.assignmentScore = recordValidationRules.assignmentScore.max.message;
    }
  }

  const testTypeValidation = recordValidationRules.testType.validate(data.testType);
  if (testTypeValidation !== true) {
    errors.testType = testTypeValidation;
  }

  if (data.notes && data.notes.length > 500) {
    errors.notes = recordValidationRules.notes.maxLength.message;
  }

  return errors;
};

export default subjectValidationRules;
