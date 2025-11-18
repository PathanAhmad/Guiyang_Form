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
    const { flattenResponseToRows, generateCSV, createZipArchive } = require('../utils/csvExport');
    
    const responses = await PilotSurveyResponse.getAllForExport();
    
    // Group responses by formId
    const responsesByForm = {
      form1: [],
      form2: [],
      form3: [],
      form4: [],
    };
    
    responses.forEach(response => {
      if (responsesByForm[response.formId]) {
        responsesByForm[response.formId].push(response);
      }
    });
    
    const timestamp = Date.now();
    const csvFiles = [];
    
    // Create CSV for each form (even if empty)
    const formMetadata = {
      form1: 'student_survey',
      form2: 'teacher_assessment',
      form3: 'equity_inclusion',
      form4: 'course_catalog',
    };
    
    Object.keys(responsesByForm).forEach(formId => {
      const formResponses = responsesByForm[formId];
      const formType = formMetadata[formId];
      
      // Flatten all responses to rows
      const allRows = [];
      formResponses.forEach(response => {
        const rows = flattenResponseToRows(response);
        allRows.push(...rows);
      });
      
      const csv = generateCSV(allRows);
      const filename = `pilot-survey-${formId}-${formType}-all-${timestamp}.csv`;
      
      csvFiles.push({ filename, content: csv });
      
      console.log(`  📄 Generated ${filename} with ${formResponses.length} response(s)`);
    });
    
    // Create ZIP with all 4 CSVs
    const zipBuffer = await createZipArchive(csvFiles);
    const zipFilename = `pilot-survey-all-forms-${timestamp}.zip`;
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${zipFilename}`);
    res.send(zipBuffer);
    
    console.log(`✅ Exported ${responses.length} survey responses across 4 forms to ZIP`);
  } catch (error) {
    console.error('Error exporting survey responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export survey responses',
      error: error.message,
    });
  }
});

// GET /api/pilot-surveys/admin/export/:accessKey - Export responses for a specific access key to CSV (Admin only)
router.get('/admin/export/:accessKey', authenticateAdmin, async (req, res) => {
  try {
    const { accessKey } = req.params;
    const { flattenResponseToRows, generateCSV, createZipArchive, sanitizeFilename } = require('../utils/csvExport');
    
    const responses = await PilotSurveyResponse.getAllForExport(accessKey);
    
    if (responses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No responses found to export',
      });
    }
    
    // Group responses by formId
    const responsesByForm = {};
    responses.forEach(response => {
      if (!responsesByForm[response.formId]) {
        responsesByForm[response.formId] = [];
      }
      responsesByForm[response.formId].push(response);
    });
    
    const formIds = Object.keys(responsesByForm);
    const timestamp = Date.now();
    const keyName = responses[0]?.keyName || 'Unknown';
    const sanitizedKeyName = sanitizeFilename(keyName);
    
    // If single form, return CSV directly
    if (formIds.length === 1) {
      const formId = formIds[0];
      const formResponses = responsesByForm[formId];
      const formType = formResponses[0]?.formType || formId;
      
      // Flatten all responses to rows
      const allRows = [];
      formResponses.forEach(response => {
        const rows = flattenResponseToRows(response);
        allRows.push(...rows);
      });
      
      const csv = generateCSV(allRows);
      const filename = `pilot-survey-${formId}-${formType}-${sanitizedKeyName}-${accessKey}-${timestamp}.csv`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(csv);
      
      console.log(`✅ Exported ${formResponses.length} response(s) for form ${formId} from access key ${accessKey}`);
    } else {
      // Multiple forms, create ZIP
      const csvFiles = [];
      
      formIds.forEach(formId => {
        const formResponses = responsesByForm[formId];
        const formType = formResponses[0]?.formType || formId;
        
        // Flatten all responses to rows
        const allRows = [];
        formResponses.forEach(response => {
          const rows = flattenResponseToRows(response);
          allRows.push(...rows);
        });
        
        const csv = generateCSV(allRows);
        const filename = `pilot-survey-${formId}-${formType}-${sanitizedKeyName}-${accessKey}-${timestamp}.csv`;
        
        csvFiles.push({ filename, content: csv });
      });
      
      const zipBuffer = await createZipArchive(csvFiles);
      const zipFilename = `pilot-survey-${sanitizedKeyName}-${accessKey}-${timestamp}.zip`;
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=${zipFilename}`);
      res.send(zipBuffer);
      
      console.log(`✅ Exported ${responses.length} response(s) across ${formIds.length} forms for access key ${accessKey}`);
    }
  } catch (error) {
    console.error('Error exporting survey responses by access key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export survey responses',
      error: error.message,
    });
  }
});

// DELETE /api/pilot-surveys/admin/responses/single/:responseId - Delete a single response (Admin only)
// NOTE: This route must be defined BEFORE the generic /:accessKey route to prevent route collision
router.delete('/admin/responses/single/:responseId', authenticateAdmin, async (req, res) => {
  try {
    const { responseId } = req.params;
    
    // Find and delete the response
    const response = await PilotSurveyResponse.findByIdAndDelete(responseId);
    
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found',
      });
    }
    
    console.log(`✅ Deleted survey response ${responseId} (${response.formId} for ${response.accessKey})`);
    
    return res.status(200).json({
      success: true,
      message: 'Response deleted successfully',
      deletedResponse: {
        id: response._id,
        formId: response.formId,
        accessKey: response.accessKey,
      },
    });
  } catch (error) {
    console.error('Error deleting survey response:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete survey response',
      error: error.message,
    });
  }
});

// DELETE /api/pilot-surveys/admin/responses/:accessKey - Delete all responses for an access key (Admin only)
router.delete('/admin/responses/:accessKey', authenticateAdmin, async (req, res) => {
  try {
    const { accessKey } = req.params;
    
    // Delete all responses for this access key
    const result = await PilotSurveyResponse.deleteMany({ accessKey });
    
    console.log(`✅ Deleted ${result.deletedCount} survey responses for access key ${accessKey}`);
    
    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} response${result.deletedCount !== 1 ? 's' : ''}`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting survey responses by access key:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete survey responses',
      error: error.message,
    });
  }
});

module.exports = router;

