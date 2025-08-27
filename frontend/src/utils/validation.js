/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation (basic)
 */
export const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return '';
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return ''; // Phone is optional for most forms
  if (phone.length < 10) return 'Phone number must be at least 10 digits';
  if (phone.length > 20) return 'Phone number is too long';
  return '';
};

/**
 * Validate name field
 */
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 100) return 'Name is too long';
  return '';
};

/**
 * Validate company field (for fast-track form)
 */
export const validateCompany = (company) => {
  if (!company) return 'Company is required';
  if (company.trim().length < 2) return 'Company name must be at least 2 characters';
  if (company.trim().length > 100) return 'Company name is too long';
  return '';
};

/**
 * Validate role field (for fast-track form)
 */
export const validateRole = (role) => {
  if (!role) return 'Role is required';
  if (role.trim().length < 2) return 'Role must be at least 2 characters';
  if (role.trim().length > 100) return 'Role is too long';
  return '';
};

/**
 * Validate message field (for fast-track form)
 */
export const validateMessage = (message) => {
  if (message && message.length > 1000) return 'Message is too long (max 1000 characters)';
  return '';
};

/**
 * Validate demo form
 */
export const validateDemoForm = (data) => {
  const errors = {};
  
  errors.name = validateName(data.name);
  errors.email = validateEmail(data.email);
  errors.phone = validatePhone(data.phone);
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate showcase form
 */
export const validateShowcaseForm = (data) => {
  const errors = {};
  
  errors.name = validateName(data.name);
  errors.email = validateEmail(data.email);
  errors.phone = validatePhone(data.phone);
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate fast-track form
 */
export const validateFasttrackForm = (data) => {
  const errors = {};
  
  errors.name = validateName(data.name);
  errors.email = validateEmail(data.email);
  errors.phone = validatePhone(data.phone);
  errors.company = validateCompany(data.company);
  errors.role = validateRole(data.role);
  errors.message = validateMessage(data.message);
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
