const mongoose = require('mongoose');

const pilotSurveyResponseSchema = new mongoose.Schema(
  {
    // Reference to the access key used
    accessKey: {
      type: String,
      required: true,
      index: true,
    },
    
    // Form identification
    formId: {
      type: String,
      required: true,
      enum: ['form1', 'form2', 'form3', 'form4'],
      index: true,
    },
    
    // Form type for categorization
    formType: {
      type: String,
      required: true,
      enum: ['student_survey', 'teacher_assessment', 'equity_inclusion', 'course_catalog'],
    },
    
    // Survey responses (flexible JSON structure)
    responses: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    // Submission status
    status: {
      type: String,
      required: true,
      enum: ['draft', 'submitted'],
      default: 'draft',
      index: true,
    },
    
    // Language used when filling the form
    language: {
      type: String,
      enum: ['en', 'zh'],
      default: 'en',
    },
    
    // Track which sections have been completed
    completedSections: {
      type: [String],
      default: [],
    },
    
    // Submission timestamp
    submittedAt: {
      type: Date,
      default: null,
    },
    
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
pilotSurveyResponseSchema.index({ accessKey: 1, formId: 1 }, { unique: true });
pilotSurveyResponseSchema.index({ status: 1, createdAt: -1 });

// Instance method: Mark form as submitted
pilotSurveyResponseSchema.methods.markSubmitted = async function() {
  this.status = 'submitted';
  this.submittedAt = new Date();
  await this.save();
  return this;
};

// Instance method: Update progress
pilotSurveyResponseSchema.methods.updateProgress = async function(sectionId) {
  if (!this.completedSections.includes(sectionId)) {
    this.completedSections.push(sectionId);
    await this.save();
  }
  return this;
};

// Instance method: Calculate completion percentage
pilotSurveyResponseSchema.methods.getCompletionPercentage = function(totalSections) {
  if (!totalSections || totalSections === 0) return 0;
  return Math.round((this.completedSections.length / totalSections) * 100);
};

// Static method: Get response by access key and form ID
pilotSurveyResponseSchema.statics.findByAccessKeyAndForm = async function(accessKey, formId) {
  return this.findOne({ accessKey, formId });
};

// Static method: Get all responses for an access key
pilotSurveyResponseSchema.statics.findByAccessKey = async function(accessKey) {
  return this.find({ accessKey }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('PilotSurveyResponse', pilotSurveyResponseSchema);

