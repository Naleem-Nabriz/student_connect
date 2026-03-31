import { validateRequired } from '../../../utils/validation';

export const groupValidationRules = {
  name: {
    required: 'Group name is required',
    minLength: {
      value: 3,
      message: 'Group name must be at least 3 characters',
    },
    maxLength: {
      value: 100,
      message: 'Group name must not exceed 100 characters',
    },
  },
  subject: {
    required: 'Subject is required',
    minLength: {
      value: 2,
      message: 'Subject must be at least 2 characters',
    },
  },
  description: {
    maxLength: {
      value: 500,
      message: 'Description must not exceed 500 characters',
    },
  },
  capacity: {
    required: 'Capacity is required',
    min: {
      value: 2,
      message: 'Capacity must be at least 2 members',
    },
    max: {
      value: 50,
      message: 'Capacity must not exceed 50 members',
    },
  },
};

export const validateGroupForm = (data) => {
  const errors = {};

  const requiredName = validateRequired(data.name);
  if (requiredName !== true) {
    errors.name = requiredName;
  } else if (data.name.trim().length < 3) {
    errors.name = groupValidationRules.name.minLength.message;
  } else if (data.name.trim().length > 100) {
    errors.name = groupValidationRules.name.maxLength.message;
  }

  const requiredSubject = validateRequired(data.subject);
  if (requiredSubject !== true) {
    errors.subject = requiredSubject;
  } else if (data.subject.trim().length < 2) {
    errors.subject = groupValidationRules.subject.minLength.message;
  }

  if (data.description && data.description.length > 500) {
    errors.description = groupValidationRules.description.maxLength.message;
  }

  if (!data.capacity) {
    errors.capacity = groupValidationRules.capacity.required;
  } else if (data.capacity < 2) {
    errors.capacity = groupValidationRules.capacity.min.message;
  } else if (data.capacity > 50) {
    errors.capacity = groupValidationRules.capacity.max.message;
  }

  return errors;
};

export default groupValidationRules;
