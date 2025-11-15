const express = require('express');
const router = express.Router();
const PilotSurveyResponse = require('../models/PilotSurveyResponse');
const DeploymentAccessKey = require('../models/DeploymentAccessKey');
const { authenticateAdmin } = require('./auth');

// Middleware to validate deployment access key
const validateDeploymentAuth = async (req, res, next) => {
  try {
    const accessKey = req.headers['x-deployment-access-key'];
    
    if (!accessKey) {
      return res.status(401).json({
        success: false,
        message: 'Access key is required',
      });
    }
    
    // Find and validate the access key
    const keyDoc = await DeploymentAccessKey.findOne({ accessKey, isActive: true });
    
    if (!keyDoc) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive access key',
      });
    }
    
    // Check if key is valid (not expired, within usage limits)
    const validation = keyDoc.isValid();
    if (!validation.valid) {
      return res.status(401).json({
        success: false,
        message: validation.reason,
      });
    }
    
    // Attach key info to request
    req.deploymentKey = {
      accessKey: keyDoc.accessKey,
      roleType: keyDoc.roleType,
      keyName: keyDoc.keyName,
    };
    
    next();
  } catch (error) {
    console.error('Deployment auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

// Form metadata mapping
const FORM_METADATA = {
  form1: {
    formId: 'form1',
    formType: 'student_survey',
    roles: ['learner', 'special'],
    totalSections: 7,
  },
  form2: {
    formId: 'form2',
    formType: 'teacher_assessment',
    roles: ['educator'],
    totalSections: 8,
  },
  form3: {
    formId: 'form3',
    formType: 'equity_inclusion',
    roles: ['school'],
    totalSections: 7,
  },
  form4: {
    formId: 'form4',
    formType: 'course_catalog',
    roles: ['school'],
    totalSections: 6,
  },
};

// GET /api/pilot-surveys/forms - Get available forms for user's role
router.get('/forms', validateDeploymentAuth, async (req, res) => {
  try {
    const { roleType } = req.deploymentKey;
    
    // Filter forms available for this role
    const availableForms = Object.values(FORM_METADATA).filter(form =>
      form.roles.includes(roleType)
    );
    
    // Get completion status for each form
    const formsWithStatus = await Promise.all(
      availableForms.map(async (form) => {
        const response = await PilotSurveyResponse.findByAccessKeyAndForm(
          req.deploymentKey.accessKey,
          form.formId
        );
        
        return {
          ...form,
          status: response ? response.status : 'not_started',
          completionPercentage: response
            ? response.getCompletionPercentage(form.totalSections)
            : 0,
          completedSections: response ? response.completedSections : [],
          lastModified: response ? response.updatedAt : null,
        };
      })
    );
    
    res.json({
      success: true,
      forms: formsWithStatus,
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forms',
      error: error.message,
    });
  }
});

// GET /api/pilot-surveys/responses - Get all responses for logged-in user
router.get('/responses', validateDeploymentAuth, async (req, res) => {
  try {
    const responses = await PilotSurveyResponse.findByAccessKey(
      req.deploymentKey.accessKey
    );
    
    res.json({
      success: true,
      responses,
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch responses',
      error: error.message,
    });
  }
});

// GET /api/pilot-surveys/responses/:formId - Get specific form response
router.get('/responses/:formId', validateDeploymentAuth, async (req, res) => {
  try {
    const { formId } = req.params;
    
    // Validate form ID
    if (!FORM_METADATA[formId]) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }
    
    // Check if user has access to this form
    const formMeta = FORM_METADATA[formId];
    if (!formMeta.roles.includes(req.deploymentKey.roleType)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this form',
      });
    }
    
    const response = await PilotSurveyResponse.findByAccessKeyAndForm(
      req.deploymentKey.accessKey,
      formId
    );
    
    res.json({
      success: true,
      response: response || null,
    });
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch response',
      error: error.message,
    });
  }
});

// POST /api/pilot-surveys/responses/:formId - Create/update response (auto-save)
router.post('/responses/:formId', validateDeploymentAuth, async (req, res) => {
  try {
    const { formId } = req.params;
    const { responses, completedSections, language } = req.body;
    
    // Validate form ID
    if (!FORM_METADATA[formId]) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }
    
    // Check if user has access to this form
    const formMeta = FORM_METADATA[formId];
    if (!formMeta.roles.includes(req.deploymentKey.roleType)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this form',
      });
    }
    
    // Find existing response or create new one
    let surveyResponse = await PilotSurveyResponse.findByAccessKeyAndForm(
      req.deploymentKey.accessKey,
      formId
    );
    
    if (surveyResponse) {
      // Update existing response (only if still in draft status)
      if (surveyResponse.status === 'submitted') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update a submitted form',
        });
      }
      
      surveyResponse.responses = responses || surveyResponse.responses;
      surveyResponse.completedSections = completedSections || surveyResponse.completedSections;
      surveyResponse.language = language || surveyResponse.language;
      await surveyResponse.save();
    } else {
      // Create new response
      surveyResponse = new PilotSurveyResponse({
        accessKey: req.deploymentKey.accessKey,
        formId,
        formType: formMeta.formType,
        responses: responses || {},
        completedSections: completedSections || [],
        language: language || 'en',
        status: 'draft',
      });
      await surveyResponse.save();
    }
    
    res.json({
      success: true,
      message: 'Response saved successfully',
      response: surveyResponse,
    });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save response',
      error: error.message,
    });
  }
});

// POST /api/pilot-surveys/responses/:formId/submit - Mark form as submitted
router.post('/responses/:formId/submit', validateDeploymentAuth, async (req, res) => {
  try {
    const { formId } = req.params;
    const { responses, completedSections, language } = req.body;
    
    // Validate form ID
    if (!FORM_METADATA[formId]) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }
    
    // Check if user has access to this form
    const formMeta = FORM_METADATA[formId];
    if (!formMeta.roles.includes(req.deploymentKey.roleType)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this form',
      });
    }
    
    // Find existing response
    let surveyResponse = await PilotSurveyResponse.findByAccessKeyAndForm(
      req.deploymentKey.accessKey,
      formId
    );
    
    if (!surveyResponse) {
      // Create new response if it doesn't exist
      surveyResponse = new PilotSurveyResponse({
        accessKey: req.deploymentKey.accessKey,
        formId,
        formType: formMeta.formType,
        responses: responses || {},
        completedSections: completedSections || [],
        language: language || 'en',
      });
    } else if (surveyResponse.status === 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Form has already been submitted',
      });
    } else {
      // Update with final data before submission
      surveyResponse.responses = responses || surveyResponse.responses;
      surveyResponse.completedSections = completedSections || surveyResponse.completedSections;
      surveyResponse.language = language || surveyResponse.language;
    }
    
    // Mark as submitted
    await surveyResponse.markSubmitted();
    
    res.json({
      success: true,
      message: 'Form submitted successfully',
      response: surveyResponse,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit form',
      error: error.message,
    });
  }
});

// Admin routes
// GET /api/pilot-surveys/admin/all-responses - Get all responses grouped by access key (Admin only)
router.get('/admin/all-responses', authenticateAdmin, async (req, res) => {
  try {
    const groupedResponses = await PilotSurveyResponse.getAllResponsesGroupedByAccessKey();
    
    res.json({
      success: true,
      data: groupedResponses,
      count: groupedResponses.length,
    });
  } catch (error) {
    console.error('Error fetching all survey responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch survey responses',
      error: error.message,
    });
  }
});

// GET /api/pilot-surveys/admin/export - Export all responses to CSV (Admin only)
router.get('/admin/export', authenticateAdmin, async (req, res) => {
  try {
    const responses = await PilotSurveyResponse.getAllForExport();
    
    if (responses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No responses found to export',
      });
    }
    
    // Convert to CSV
    const headers = [
      'Access Key',
      'Key Name',
      'Role Type',
      'Form ID',
      'Form Type',
      'Status',
      'Language',
      'Submitted At',
      'Created At',
      'Updated At',
      'Completed Sections',
      'Responses (JSON)'
    ];
    
    const csvRows = [headers.join(',')];
    
    responses.forEach(response => {
      const row = [
        response.accessKey,
        `"${response.keyName}"`,
        response.roleType,
        response.formId,
        response.formType,
        response.status,
        response.language,
        response.submittedAt ? new Date(response.submittedAt).toISOString() : '',
        new Date(response.createdAt).toISOString(),
        new Date(response.updatedAt).toISOString(),
        `"${response.completedSections}"`,
        `"${response.responses.replace(/"/g, '""')}"` // Escape quotes in JSON
      ];
      csvRows.push(row.join(','));
    });
    
    const csv = csvRows.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=pilot-survey-responses-${Date.now()}.csv`);
    res.send(csv);
    
    console.log(`✅ Exported ${responses.length} survey responses to CSV`);
  } catch (error) {
    console.error('Error exporting survey responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export survey responses',
      error: error.message,
    });
  }
});

module.exports = router;

