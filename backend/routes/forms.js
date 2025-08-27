const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');
const TokenCounter = require('../models/TokenCounter');
const discordService = require('../services/discordService');
const { validateFormSubmission } = require('../middleware/validation');

/**
 * Helper function to process form submission
 */
const processFormSubmission = async (req, res) => {
  try {
    const { validatedData, formType } = req;
    
    // Generate unique token
    const token = await TokenCounter.getNextToken(formType);
    
    // Create form submission record
    const submission = new FormSubmission({
      ...validatedData,
      formType,
      token,
      status: 'waiting'
    });
    
    // Save to database first
    await submission.save();
    
    // Send to Discord
    const discordResult = await discordService.sendToDiscord(formType, submission);
    
    // Update submission with Discord status
    submission.discordSent = discordResult.success;
    if (!discordResult.success) {
      submission.discordError = discordResult.error;
    }
    await submission.save();
    
    // Prepare response
    const response = {
      success: true,
      message: 'Form submitted successfully',
      data: {
        token: submission.token,
        formType: submission.formType,
        submittedAt: submission.submittedAt,
        status: submission.status
      },
      discord: {
        sent: discordResult.success,
        error: discordResult.success ? null : discordResult.error
      }
    };
    
    res.status(201).json(response);
    
    console.log(`✅ Form submission processed - Type: ${formType}, Token: ${token}`);
    
  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process form submission',
      details: error.message
    });
  }
};

// Route: Submit Sparkie Demo form
router.post('/demo', validateFormSubmission('demo'), processFormSubmission);

// Route: Submit System Showcase form
router.post('/showcase', validateFormSubmission('showcase'), processFormSubmission);

// Route: Submit Fast-Track Interest form
router.post('/fasttrack', validateFormSubmission('fasttrack'), processFormSubmission);

// Route: Get submission by token
router.get('/submission/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const submission = await FormSubmission.findOne({ token })
      .select('-discordError -__v')
      .lean();
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      data: submission
    });
    
  } catch (error) {
    console.error('❌ Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submission'
    });
  }
});

// Route: Get all submissions for a form type (with pagination)
router.get('/submissions/:formType', async (req, res) => {
  try {
    const { formType } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Validate form type
    if (!['demo', 'showcase', 'fasttrack'].includes(formType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid form type'
      });
    }
    
    const submissions = await FormSubmission.find({ formType })
      .select('-discordError -__v')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await FormSubmission.countDocuments({ formType });
    
    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
});

// Route: Get token counters status
router.get('/counters', async (req, res) => {
  try {
    const counters = await TokenCounter.find().sort({ formType: 1 }).lean();
    
    res.json({
      success: true,
      data: counters
    });
    
  } catch (error) {
    console.error('❌ Error fetching counters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch counters'
    });
  }
});

// Route: Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Forms API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
