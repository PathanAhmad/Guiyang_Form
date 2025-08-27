const Joi = require('joi');

// Common validation schemas
const commonSchema = {
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters'
    }),
  email: Joi.string().email().trim().lowercase().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  phone: Joi.string().trim().min(10).max(20).optional()
    .messages({
      'string.min': 'Phone number must be at least 10 characters long',
      'string.max': 'Phone number must not exceed 20 characters'
    })
};

// Extended validation schemas
const demoShowcaseSchema = {
  ...commonSchema,
  // Contact information
  institution: Joi.string().trim().min(2).max(200).optional().allow(''),
  position: Joi.string().trim().min(2).max(100).optional().allow(''),
  country: Joi.string().trim().min(2).max(100).optional().allow(''),
  
  // Industry background
  workInEducation: Joi.string().valid('yes', 'no', '').optional().allow(''),
  educationFields: Joi.array().items(Joi.string().trim()).optional(),
  educationFieldsOther: Joi.string().trim().max(200).optional().allow(''),
  primaryRole: Joi.string().trim().max(100).optional().allow(''),
  primaryRoleOther: Joi.string().trim().max(200).optional().allow(''),
  
  // SparkOS Interest
  sparkosUsage: Joi.array().items(Joi.string().trim()).optional(),
  sparkosUsageOther: Joi.string().trim().max(200).optional().allow(''),
  ageGroups: Joi.array().items(Joi.string().trim()).optional(),
  neurodiversityWork: Joi.string().valid('frequently', 'occasionally', 'interestedNo', 'no', '').optional().allow(''),
  supportedConditions: Joi.array().items(Joi.string().trim()).optional(),
  supportedConditionsOther: Joi.string().trim().max(200).optional().allow(''),
  
  // Feature Interest
  featuresInterest: Joi.array().items(Joi.string().trim()).optional(),
  implementationTimeline: Joi.string().valid('immediate', 'shortTerm', 'mediumTerm', 'longTerm', 'research', '').optional().allow(''),
  pilotInterest: Joi.string().valid('yes', 'no', 'maybe', '').optional().allow(''),
  
  // Additional Information
  currentChallenges: Joi.string().trim().max(2000).optional().allow(''),
  additionalComments: Joi.string().trim().max(2000).optional().allow('')
};

// Validation schemas for each form type
const validationSchemas = {
  demo: Joi.object(demoShowcaseSchema),
  
  showcase: Joi.object(demoShowcaseSchema),
  
  fasttrack: Joi.object({
    ...commonSchema,
    company: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.empty': 'Company is required',
        'string.min': 'Company name must be at least 2 characters long',
        'string.max': 'Company name must not exceed 100 characters'
      }),
    role: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.empty': 'Role is required',
        'string.min': 'Role must be at least 2 characters long',
        'string.max': 'Role must not exceed 100 characters'
      }),
    message: Joi.string().trim().max(1000).optional().allow('')
      .messages({
        'string.max': 'Message must not exceed 1000 characters'
      })
  })
};

/**
 * Middleware to validate form submissions
 */
const validateFormSubmission = (formType) => {
  return (req, res, next) => {
    const schema = validationSchemas[formType];
    
    if (!schema) {
      return res.status(400).json({
        success: false,
        error: 'Invalid form type',
        formType
      });
    }
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessages
      });
    }
    
    // Attach validated data to request
    req.validatedData = value;
    req.formType = formType;
    
    next();
  };
};

/**
 * Generic error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry',
      details: [{
        field,
        message: `${field} already exists`
      }]
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 handler middleware
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
};

module.exports = {
  validateFormSubmission,
  errorHandler,
  notFoundHandler,
  validationSchemas
};
