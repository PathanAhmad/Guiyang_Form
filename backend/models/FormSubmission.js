const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  // Common fields for all form types
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  
  // Form type identifier
  formType: {
    type: String,
    required: true,
    enum: ['demo', 'showcase', 'fasttrack', 'parentSurvey']
  },
  
  // Generated token
  token: {
    type: String,
    required: true,
    unique: true
  },

  // Event/Campaign label to identify the fair or campaign
  eventLabel: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Contact Information (all forms)
  institution: {
    type: String,
    trim: true,
    maxlength: 200
  },
  position: {
    type: String,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Fast-Track specific fields
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    trim: true,
    maxlength: 100
  },
  areaOfInterest: {
    type: String,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Demo/Showcase Industry Background
  workInEducation: {
    type: String,
    enum: ['yes', 'no', '']
  },
  educationFields: [{
    type: String,
    trim: true
  }],
  educationFieldsOther: {
    type: String,
    trim: true,
    maxlength: 200
  },
  primaryRole: {
    type: String,
    trim: true,
    maxlength: 100
  },
  primaryRoleOther: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Demo/Showcase SparkOS Interest
  sparkosUsage: [{
    type: String,
    trim: true
  }],
  sparkosUsageOther: {
    type: String,
    trim: true,
    maxlength: 200
  },
  ageGroups: [{
    type: String,
    trim: true
  }],
  neurodiversityWork: {
    type: String,
    enum: ['frequently', 'occasionally', 'interestedNo', 'no', '']
  },
  supportedConditions: [{
    type: String,
    trim: true
  }],
  supportedConditionsOther: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Demo/Showcase Feature Interest
  featuresInterest: [{
    type: String,
    trim: true
  }],
  implementationTimeline: {
    type: String,
    enum: ['immediate', 'shortTerm', 'mediumTerm', 'longTerm', 'research', '']
  },
  pilotInterest: {
    type: String,
    enum: ['yes', 'no', 'maybe', '']
  },
  
  // Demo/Showcase Additional Information
  currentChallenges: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  additionalComments: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  // Status tracking
  status: {
    type: String,
    default: 'waiting',
    enum: ['waiting', 'contacted', 'completed', 'cancelled']
  },
  
  // Status transition timestamps
  contactedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  
  // Discord message tracking
  discordSent: {
    type: Boolean,
    default: false
  },
  discordError: {
    type: String
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
formSubmissionSchema.index({ formType: 1, submittedAt: -1 });
formSubmissionSchema.index({ token: 1 });
formSubmissionSchema.index({ email: 1 });
formSubmissionSchema.index({ eventLabel: 1, submittedAt: -1 });

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);
