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

// Static method: Get all responses grouped by access key with metadata
pilotSurveyResponseSchema.statics.getAllResponsesGroupedByAccessKey = async function() {
  const DeploymentAccessKey = require('./DeploymentAccessKey');
  const School = require('./School');
  
  // Get all responses
  const responses = await this.find().sort({ accessKey: 1, createdAt: -1 }).lean();
  
  // Group by access key
  const grouped = {};
  responses.forEach(response => {
    if (!grouped[response.accessKey]) {
      grouped[response.accessKey] = {
        accessKey: response.accessKey,
        responses: []
      };
    }
    grouped[response.accessKey].responses.push(response);
  });
  
  // Enrich with access key and school metadata
  const result = [];
  for (const accessKey in grouped) {
    const keyDoc = await DeploymentAccessKey.findOne({ accessKey }).lean();
    const group = grouped[accessKey];
    
    // Get school information if key exists
    let school = null;
    if (keyDoc && keyDoc.schoolId) {
      school = await School.findById(keyDoc.schoolId).lean();
    }
    
    // Count submitted forms
    const submittedCount = group.responses.filter(r => r.status === 'submitted').length;
    const lastSubmission = group.responses.find(r => r.submittedAt);
    
    result.push({
      accessKey,
      keyName: keyDoc ? keyDoc.keyName : 'Unknown',
      roleType: keyDoc ? keyDoc.roleType : 'Unknown',
      isActive: keyDoc ? keyDoc.isActive : false,
      school: school ? {
        id: school._id,
        schoolName: school.schoolName,
        isActive: school.isActive,
      } : null,
      totalResponses: group.responses.length,
      submittedCount,
      lastSubmissionDate: lastSubmission ? lastSubmission.submittedAt : null,
      responses: group.responses
    });
  }
  
  return result;
};

// Static method: Get all responses for CSV export (optionally filtered by access key)
pilotSurveyResponseSchema.statics.getAllForExport = async function(accessKey) {
  const DeploymentAccessKey = require('./DeploymentAccessKey');
  const School = require('./School');
  const query = accessKey ? { accessKey } : {};
  const responses = await this.find(query).sort({ createdAt: -1 }).lean();
  
  // Enrich with access key and school info
  const enriched = await Promise.all(
    responses.map(async (response) => {
      const keyDoc = await DeploymentAccessKey.findOne({ accessKey: response.accessKey }).lean();
      let school = null;
      if (keyDoc && keyDoc.schoolId) {
        school = await School.findById(keyDoc.schoolId).lean();
      }
      
      return {
        schoolName: school ? school.schoolName : 'Unknown',
        accessKey: response.accessKey,
        keyName: keyDoc ? keyDoc.keyName : 'Unknown',
        roleType: keyDoc ? keyDoc.roleType : 'Unknown',
        formId: response.formId,
        formType: response.formType,
        status: response.status,
        language: response.language,
        submittedAt: response.submittedAt,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        completedSections: response.completedSections.join(', '),
        responses: JSON.stringify(response.responses)
      };
    })
  );
  
  return enriched;
};

module.exports = mongoose.model('PilotSurveyResponse', pilotSurveyResponseSchema);

