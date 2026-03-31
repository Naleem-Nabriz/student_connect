export const skillProfileValidationRules = {
  skills: {
    validate: (skills) => {
      if (!Array.isArray(skills) || skills.length === 0) {
        return 'At least one skill is required';
      }
      
      for (const skill of skills) {
        if (!skill.name?.trim()) {
          return 'Skill name is required';
        }
        if (skill.name.length < 2) {
          return 'Skill name must be at least 2 characters';
        }
      }
      
      return true;
    },
  },
  bio: {
    maxLength: {
      value: 500,
      message: 'Bio must not exceed 500 characters',
    },
  },
  availability: {
    validate: (value) => {
      const validOptions = ['available', 'busy', 'offline'];
      if (!validOptions.includes(value)) {
        return 'Invalid availability status';
      }
      return true;
    },
  },
};

export const collaborationValidationRules = {
  title: {
    required: 'Collaboration title is required',
    minLength: {
      value: 3,
      message: 'Title must be at least 3 characters',
    },
    maxLength: {
      value: 200,
      message: 'Title must not exceed 200 characters',
    },
  },
  description: {
    required: 'Description is required',
    minLength: {
      value: 10,
      message: 'Description must be at least 10 characters',
    },
    maxLength: {
      value: 1000,
      message: 'Description must not exceed 1000 characters',
    },
  },
  requiredSkills: {
    validate: (skills) => {
      if (!Array.isArray(skills) || skills.length === 0) {
        return 'At least one required skill is needed';
      }
      
      for (const skill of skills) {
        if (!skill.name?.trim()) {
          return 'Skill name is required';
        }
      }
      
      return true;
    },
  },
  deadline: {
    validate: (date) => {
      if (date && new Date(date) < new Date()) {
        return 'Deadline cannot be in the past';
      }
      return true;
    },
  },
};

export const validateSkillProfile = (data) => {
  const errors = {};

  const skillsValidation = skillProfileValidationRules.skills.validate(data.skills);
  if (skillsValidation !== true) {
    errors.skills = skillsValidation;
  }

  if (data.bio && data.bio.length > 500) {
    errors.bio = skillProfileValidationRules.bio.maxLength.message;
  }

  const availabilityValidation = skillProfileValidationRules.availability.validate(data.availability);
  if (availabilityValidation !== true) {
    errors.availability = availabilityValidation;
  }

  return errors;
};

export const validateCollaboration = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = collaborationValidationRules.title.required;
  } else if (data.title.length < 3) {
    errors.title = collaborationValidationRules.title.minLength.message;
  } else if (data.title.length > 200) {
    errors.title = collaborationValidationRules.title.maxLength.message;
  }

  if (!data.description?.trim()) {
    errors.description = collaborationValidationRules.description.required;
  } else if (data.description.length < 10) {
    errors.description = collaborationValidationRules.description.minLength.message;
  } else if (data.description.length > 1000) {
    errors.description = collaborationValidationRules.description.maxLength.message;
  }

  const skillsValidation = collaborationValidationRules.requiredSkills.validate(data.requiredSkills);
  if (skillsValidation !== true) {
    errors.requiredSkills = skillsValidation;
  }

  if (data.deadline) {
    const deadlineValidation = collaborationValidationRules.deadline.validate(data.deadline);
    if (deadlineValidation !== true) {
      errors.deadline = deadlineValidation;
    }
  }

  return errors;
};

export default skillProfileValidationRules;
