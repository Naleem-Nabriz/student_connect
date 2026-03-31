import { validateRequired } from '../../../utils/validation';

export const resourceValidationRules = {
  title: {
    required: 'Resource title is required',
    minLength: {
      value: 3,
      message: 'Title must be at least 3 characters',
    },
    maxLength: {
      value: 200,
      message: 'Title must not exceed 200 characters',
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
      value: 1000,
      message: 'Description must not exceed 1000 characters',
    },
  },
  type: {
    required: 'Resource type is required',
  },
  fileUrl: {
    required: 'File URL is required for file/document resources',
    pattern: {
      value: /^https?:\/\/.+/,
      message: 'Please enter a valid URL',
    },
  },
  linkUrl: {
    required: 'Link URL is required for link resources',
    pattern: {
      value: /^https?:\/\/.+/,
      message: 'Please enter a valid URL',
    },
  },
};

export const validateResourceForm = (data) => {
  const errors = {};

  const requiredTitle = validateRequired(data.title);
  if (requiredTitle !== true) {
    errors.title = requiredTitle;
  } else if (data.title.trim().length < 3) {
    errors.title = resourceValidationRules.title.minLength.message;
  } else if (data.title.trim().length > 200) {
    errors.title = resourceValidationRules.title.maxLength.message;
  }

  const requiredSubject = validateRequired(data.subject);
  if (requiredSubject !== true) {
    errors.subject = requiredSubject;
  } else if (data.subject.trim().length < 2) {
    errors.subject = resourceValidationRules.subject.minLength.message;
  }

  if (data.description && data.description.length > 1000) {
    errors.description = resourceValidationRules.description.maxLength.message;
  }

  if (!data.type) {
    errors.type = resourceValidationRules.type.required;
  } else if (data.type === 'link' && !data.linkUrl?.trim()) {
    errors.linkUrl = resourceValidationRules.linkUrl.required;
  } else if (data.type === 'link' && data.linkUrl && !/^https?:\/\/.+/.test(data.linkUrl)) {
    errors.linkUrl = resourceValidationRules.linkUrl.pattern.message;
  } else if ((data.type === 'file' || data.type === 'document') && !data.fileUrl?.trim()) {
    errors.fileUrl = resourceValidationRules.fileUrl.required;
  } else if ((data.type === 'file' || data.type === 'document') && data.fileUrl && !/^https?:\/\/.+/.test(data.fileUrl)) {
    errors.fileUrl = resourceValidationRules.fileUrl.pattern.message;
  }

  return errors;
};

export default resourceValidationRules;
