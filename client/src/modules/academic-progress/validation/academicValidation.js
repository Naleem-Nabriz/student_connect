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
  quizMarks: {
    min: {
      value: 0,
      message: 'Quiz marks cannot be less than 0',
    },
    max: {
      value: 100,
      message: 'Quiz marks cannot exceed 100',
    },
  },
  midtermMarks: {
    min: {
      value: 0,
      message: 'Mid term marks cannot be less than 0',
    },
    max: {
      value: 100,
      message: 'Mid term marks cannot exceed 100',
    },
  },
  assignmentMarks: {
    min: {
      value: 0,
      message: 'Assignment marks cannot be less than 0',
    },
    max: {
      value: 100,
      message: 'Assignment marks cannot exceed 100',
    },
  },
  finalMarks: {
    min: {
      value: 0,
      message: 'Final marks cannot be less than 0',
    },
    max: {
      value: 100,
      message: 'Final marks cannot exceed 100',
    },
  },
  testType: {
    validate: (value) => {
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

  if (data.quizMarks !== undefined) {
    if (data.quizMarks < 0) {
      errors.quizMarks = recordValidationRules.quizMarks.min.message;
    } else if (data.quizMarks > 100) {
      errors.quizMarks = recordValidationRules.quizMarks.max.message;
    }
  }

  if (data.midtermMarks !== undefined) {
    if (data.midtermMarks < 0) {
      errors.midtermMarks = recordValidationRules.midtermMarks.min.message;
    } else if (data.midtermMarks > 100) {
      errors.midtermMarks = recordValidationRules.midtermMarks.max.message;
    }
  }

  if (data.assignmentMarks !== undefined) {
    if (data.assignmentMarks < 0) {
      errors.assignmentMarks = recordValidationRules.assignmentMarks.min.message;
    } else if (data.assignmentMarks > 100) {
      errors.assignmentMarks = recordValidationRules.assignmentMarks.max.message;
    }
  }

  if (data.finalMarks !== undefined) {
    if (data.finalMarks < 0) {
      errors.finalMarks = recordValidationRules.finalMarks.min.message;
    } else if (data.finalMarks > 100) {
      errors.finalMarks = recordValidationRules.finalMarks.max.message;
    }
  }

  if (data.notes && data.notes.length > 500) {
    errors.notes = recordValidationRules.notes.maxLength.message;
  }

  return errors;
};

export default subjectValidationRules;
