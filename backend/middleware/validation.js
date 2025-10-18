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
    country: Joi.string().trim().min(2).max(100).optional().allow(''),
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
    areaOfInterest: Joi.string().trim().max(200).optional().allow(''),
    message: Joi.string().trim().max(1000).optional().allow('')
      .messages({
        'string.max': 'Message must not exceed 1000 characters'
      })
  }),

  // Parent/Guardian Survey
  parentSurvey: Joi.object({
    // Consent
    consentParticipate: Joi.boolean().valid(true).required()
      .messages({ 'any.only': 'Consent to participate is required' }),
    confirmAdult: Joi.boolean().valid(true).required()
      .messages({ 'any.only': 'You must confirm you are 18 or older' }),

    // Respondent info
    name: Joi.string().trim().min(2).max(100).required(),
    contactEmail: Joi.string().email().trim().lowercase().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),
    country: Joi.string().trim().min(2).max(100).required(),
    age: Joi.number().integer().required()
      .messages({
        'number.base': 'Age is required',
        'number.integer': 'Age must be a whole number'
      }),

    // Section 1: Background
    contactPhone: Joi.string().trim().min(10).max(20).required()
      .messages({
        'string.empty': 'Contact phone is required',
        'string.min': 'Phone number must be at least 10 characters long',
        'string.max': 'Phone number must not exceed 20 characters'
      }),
    wechatId: Joi.string().trim().min(1).max(100).required()
      .messages({
        'string.empty': 'WeChat ID is required',
        'string.min': 'WeChat ID must be at least 1 character long',
        'string.max': 'WeChat ID must not exceed 100 characters'
      }),
    relationship: Joi.string().trim().valid('parent', 'guardian', 'other').required(),
    relationshipOther: Joi.string().trim().max(200).optional().allow(''),
    childAgeRange: Joi.string().trim().valid('5-10', '11-15', '16-18', 'above18', 'preferNotSay').required(),
    schoolingLevel: Joi.string().trim().valid('primary', 'secondary', 'higherSecondary', 'university').required(),
    aiFamiliarity: Joi.string().trim().valid('notFamiliar', 'somewhat', 'familiar', 'very').required(),
    childDevices: Joi.array().items(Joi.string().trim()).optional(),
    childDevicesOther: Joi.string().trim().max(200).optional().allow(''),

    // Section 2A: Parent/Guardian AI usage
    parentAiUsageFrequency: Joi.string().trim().valid('regularly', 'fewTimes', 'triedOnce', 'no', 'notSure').optional(),
    parentAiExperience: Joi.string().trim().valid('veryPositive', 'somewhatPositive', 'neutral', 'somewhatNegative', 'veryNegative').optional(),
    parentAiConfidence: Joi.string().trim().valid('notConfident', 'slightlyConfident', 'confident', 'veryConfident').optional(),
    parentAiPurposes: Joi.array().items(Joi.string().trim()).optional(),
    parentAiPurposesOther: Joi.string().trim().max(200).optional().allow(''),

    // Section 2B: Child usage
    childAiUsageLocation: Joi.string().trim().valid('school', 'home', 'both', 'triedOnce', 'no', 'notSure').optional(),
    childAiFrequency: Joi.string().trim().valid('rarely', 'monthly', 'weekly', 'severalWeekly', 'daily').optional(),
    childAiPurposes: Joi.array().items(Joi.string().trim()).optional(),
    childAiPurposesOther: Joi.string().trim().max(200).optional().allow(''),
    // childAiToolsOften removed
    childObservedChanges: Joi.array().items(Joi.string().trim()).optional(),
    childObservedChangesOther: Joi.string().trim().max(200).optional().allow(''),
    childBenefits: Joi.array().items(Joi.string().trim()).optional(),
    childBenefitsOther: Joi.string().trim().max(200).optional().allow(''),
    childConcerns: Joi.array().items(Joi.string().trim()).optional(),
    childConcernsOther: Joi.string().trim().max(200).optional().allow(''),
    // aiSupportTeachersParents removed
    parentGuidanceConfidence: Joi.string().trim().valid('very', 'somewhat', 'unsure', 'needSupport').optional(),

    // Section 3: Perceptions
    // perceivedBenefits/perceivedConcerns removed
    importanceHumanInvolvement: Joi.string().trim().valid('very', 'somewhat', 'neutral', 'less').optional(),
    aiSupportEmotionalFocus: Joi.string().trim().valid('yes', 'maybe', 'no', 'notSure').optional(),
    likelihoodEncourageAi: Joi.string().trim().valid('veryLikely', 'somewhatLikely', 'neutral', 'unlikely').optional(),
    preferredGuardrails: Joi.array().items(Joi.string().trim()).optional(),
    preferredGuardrailsOther: Joi.string().trim().max(200).optional().allow(''),

    // Section 4: Experience
    preAiLearningHabits: Joi.string().trim().valid('independent', 'needsGuidance', 'easilyDistracted', 'motivationStruggle', 'other').optional(),
    preAiLearningHabitsOther: Joi.string().trim().max(200).optional().allow(''),
    postAiImprovements: Joi.array().items(Joi.string().trim()).optional(),
    engagingEnjoyable: Joi.string().trim().valid('yes', 'somewhat', 'no').optional(),
    aiInclusivity: Joi.string().trim().valid('yes', 'somewhat', 'no', 'notSure').optional(),
    specificLearningConsiderations: Joi.array().items(Joi.string().trim()).optional(),


    // Section 5: Looking Ahead (formerly Section 6)
    aiRoleNextFiveYears: Joi.string().trim().valid('supplementary', 'assistant', 'tutor', 'monitoring', 'other').optional(),
    aiRoleNextFiveYearsOther: Joi.string().trim().max(200).optional().allow(''),
    considerSparkOSFuture: Joi.string().trim().valid('definitelyYes', 'maybe', 'notSure', 'no').optional(),
    contactEmail: Joi.string().email().trim().lowercase().optional().allow(''),

    // Optional open feedback
    additionalFeedback: Joi.string().trim().max(2000).optional().allow('')
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
