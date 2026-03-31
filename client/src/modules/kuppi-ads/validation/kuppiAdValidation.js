import { validateRequired, validateEmail, validatePhone } from '../../../utils/validation';

export const validateKuppiAd = (adData) => {
  const errors = {};

  if (!adData.title?.trim()) {
    errors.title = 'Ad title is required';
  }

  if (!adData.subject?.trim()) {
    errors.subject = 'Subject is required';
  }

  if (!adData.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!adData.tutorName?.trim()) {
    errors.tutorName = 'Tutor name is required';
  }

  const contactValidation = validateRequired(adData.contactInfo);
  if (contactValidation !== true) {
    errors.contactInfo = contactValidation;
  } else {
    const info = adData.contactInfo.trim();
    if (info.includes('@')) {
      const emailCheck = validateEmail(info);
      if (emailCheck !== true) {
        errors.contactInfo = emailCheck;
      }
    } else {
      const phoneCheck = validatePhone(info);
      if (phoneCheck !== true) {
        errors.contactInfo = phoneCheck;
      }
    }
  }

  const locationValidation = validateRequired(adData.location);
  if (locationValidation !== true) {
    errors.location = locationValidation;
  }

  if (!adData.date) {
    errors.date = 'Date is required';
  }

  if (!adData.time?.trim()) {
    errors.time = 'Time is required';
  }

  if (adData.price && (isNaN(adData.price) || parseFloat(adData.price) < 0)) {
    errors.price = 'Price must be a positive number';
  }

  if (adData.maxStudents && (isNaN(adData.maxStudents) || parseInt(adData.maxStudents) < 1)) {
    errors.maxStudents = 'Maximum students must be at least 1';
  }

  if (!['online', 'physical'].includes(adData.classType)) {
    errors.classType = 'Class type must be online or physical';
  }

  if (adData.title && adData.title.length > 200) {
    errors.title = 'Title cannot exceed 200 characters';
  }

  if (adData.subject && adData.subject.length > 100) {
    errors.subject = 'Subject cannot exceed 100 characters';
  }

  if (adData.description && adData.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  if (adData.tutorName && adData.tutorName.length > 100) {
    errors.tutorName = 'Tutor name cannot exceed 100 characters';
  }

  if (adData.contactInfo && adData.contactInfo.length > 200) {
    errors.contactInfo = 'Contact information cannot exceed 200 characters';
  }

  if (adData.time && adData.time.length > 50) {
    errors.time = 'Time cannot exceed 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRejectionReason = (reason) => {
  const errors = {};

  if (reason && reason.length > 500) {
    errors.reason = 'Rejection reason cannot exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
