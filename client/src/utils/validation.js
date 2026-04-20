export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required.';
  }
  return true;
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'This field is required.';
  }
  if (!regex.test(email)) {
    return 'Enter a valid email address.';
  }
  return true;
};

export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password) {
    return 'This field is required.';
  }
  if (!regex.test(password)) {
    return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
  }
  return true;
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  if (!phone) {
    return 'This field is required.';
  }
  if (!regex.test(phone)) {
    return 'Phone number must be exactly 10 digits.';
  }
  return true;
};
