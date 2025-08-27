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
 * Validate area of interest field (for fast-track form)
 */
export const validateAreaOfInterest = (areaOfInterest) => {
  if (areaOfInterest && areaOfInterest.length > 200) return 'Area of interest is too long (max 200 characters)';
  return '';
};

/**
 * Validate institution field
 */
export const validateInstitution = (institution) => {
  if (!institution) return 'Institution/Organization is required';
  if (institution.trim().length < 2) return 'Institution name must be at least 2 characters';
  if (institution.trim().length > 150) return 'Institution name is too long';
  return '';
};

/**
 * Validate position field
 */
export const validatePosition = (position) => {
  if (!position) return 'Position/Title is required';
  if (position.trim().length < 2) return 'Position must be at least 2 characters';
  if (position.trim().length > 100) return 'Position is too long';
  return '';
};

/**
 * Validate country field
 */
export const validateCountry = (country) => {
  if (!country) return 'Country/Region is required';
  if (country.trim().length < 2) return 'Country/Region must be at least 2 characters';
  if (country.trim().length > 100) return 'Country/Region is too long';
  return '';
};

/**
 * Validate required phone for comprehensive forms
 */
export const validateRequiredPhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (phone.length < 10) return 'Phone number must be at least 10 digits';
  if (phone.length > 20) return 'Phone number is too long';
  return '';
};

/**
 * Validate work in education field
 */
export const validateWorkInEducation = (workInEducation) => {
  if (!workInEducation || (workInEducation !== 'yes' && workInEducation !== 'no')) {
    return 'Please indicate if you work in education';
  }
  return '';
};

/**
 * Validate primary role field
 */
export const validatePrimaryRole = (primaryRole, workInEducation) => {
  if (workInEducation === 'yes' && !primaryRole) {
    return 'Please select your primary role';
  }
  return '';
};

/**
 * Validate features interest (max 3 selections)
 */
export const validateFeaturesInterest = (featuresInterest) => {
  if (!featuresInterest || featuresInterest.length === 0) {
    return 'Please select at least one feature of interest';
  }
  if (featuresInterest.length > 3) {
    return 'Please select up to 3 features only';
  }
  return '';
};

/**
 * Validate implementation timeline
 */
export const validateImplementationTimeline = (timeline) => {
  if (!timeline) return 'Please select your implementation timeline';
  return '';
};

/**
 * Validate pilot interest
 */
export const validatePilotInterest = (pilotInterest) => {
  if (!pilotInterest) return 'Please indicate your interest in pilot projects';
  return '';
};

/**
 * Validate current challenges field (optional)
 */
export const validateCurrentChallenges = (challenges) => {
  if (challenges && challenges.length > 2000) return 'Current challenges description is too long (max 2000 characters)';
  return '';
};

/**
 * Validate additional comments field (optional)
 */
export const validateAdditionalComments = (comments) => {
  if (comments && comments.length > 2000) return 'Additional comments are too long (max 2000 characters)';
  return '';
};

/**
 * Validate comprehensive demo form
 */
export const validateDemoForm = (data) => {
  const errors = {};
  
  // Contact Information (all required)
  errors.name = validateName(data.name);
  errors.email = validateEmail(data.email);
  errors.phone = validateRequiredPhone(data.phone);
  errors.institution = validateInstitution(data.institution);
  errors.position = validatePosition(data.position);
  errors.country = validateCountry(data.country);
  
  // Industry Background
  errors.workInEducation = validateWorkInEducation(data.workInEducation);
  errors.primaryRole = validatePrimaryRole(data.primaryRole, data.workInEducation);
  
  // SparkOS Interest
  errors.featuresInterest = validateFeaturesInterest(data.featuresInterest);
  errors.implementationTimeline = validateImplementationTimeline(data.implementationTimeline);
  errors.pilotInterest = validatePilotInterest(data.pilotInterest);
  
  // Optional fields
  errors.currentChallenges = validateCurrentChallenges(data.currentChallenges);
  errors.additionalComments = validateAdditionalComments(data.additionalComments);
  
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
 * Validate comprehensive showcase form
 */
export const validateShowcaseForm = (data) => {
  const errors = {};
  
  // Contact Information (all required)
  errors.name = validateName(data.name);
  errors.email = validateEmail(data.email);
  errors.phone = validateRequiredPhone(data.phone);
  errors.institution = validateInstitution(data.institution);
  errors.position = validatePosition(data.position);
  errors.country = validateCountry(data.country);
  
  // Industry Background
  errors.workInEducation = validateWorkInEducation(data.workInEducation);
  errors.primaryRole = validatePrimaryRole(data.primaryRole, data.workInEducation);
  
  // SparkOS Interest
  errors.featuresInterest = validateFeaturesInterest(data.featuresInterest);
  errors.implementationTimeline = validateImplementationTimeline(data.implementationTimeline);
  errors.pilotInterest = validatePilotInterest(data.pilotInterest);
  
  // Optional fields
  errors.currentChallenges = validateCurrentChallenges(data.currentChallenges);
  errors.additionalComments = validateAdditionalComments(data.additionalComments);
  
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
  errors.areaOfInterest = validateAreaOfInterest(data.areaOfInterest);
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
