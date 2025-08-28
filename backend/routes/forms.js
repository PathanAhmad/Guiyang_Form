const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');
const TokenCounter = require('../models/TokenCounter');
const GlobalCounter = require('../models/GlobalCounter');
const discordService = require('../services/discordService');
const { validateFormSubmission } = require('../middleware/validation');
const { authenticateAdmin } = require('./auth');

/**
 * Helper function to process form submission
 */
const processFormSubmission = async (req, res) => {
  try {
    const { validatedData, formType } = req;
    
    // Generate unique token using global incremental counter
    const prefixMap = { demo: 'D', showcase: 'S', fasttrack: 'F' };
    const prefix = prefixMap[formType];
    if (!prefix) {
      return res.status(400).json({ success: false, error: 'Invalid form type' });
    }

    // On first use, ensure global counter starts after any existing tokens to avoid duplicates
    try {
      const agg = await FormSubmission.aggregate([
        { $match: { token: { $regex: '^[A-Z]-\\d+$' } } },
        { $project: { num: { $toInt: { $arrayElemAt: [ { $split: ['$token', '-'] }, 1 ] } } } },
        { $sort: { num: -1 } },
        { $limit: 1 }
      ]);
      if (agg && agg.length > 0 && typeof agg[0].num === 'number') {
        await GlobalCounter.ensureAtLeast(agg[0].num);
      }
    } catch (initErr) {
      console.warn('⚠️ Failed to initialize global counter from existing tokens:', initErr.message);
    }

    const globalNumber = await GlobalCounter.getNextNumber();
    const token = `${prefix}-${globalNumber.toString().padStart(3, '0')}`;

    // Update per-type counter for stats/monitoring
    try {
      await TokenCounter.findOneAndUpdate(
        { formType },
        {
          $inc: { count: 1 },
          $set: { prefix, lastUpdated: new Date() }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } catch (counterError) {
      console.warn('⚠️ Failed to update per-type counter:', counterError.message);
    }
    
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

// Route: Update submission status (Admin only)
router.patch('/submission/:token/status', authenticateAdmin, async (req, res) => {
  try {
    const { token } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['waiting', 'contacted', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: waiting, contacted, completed, or cancelled'
      });
    }
    
    const submission = await FormSubmission.findOne({ token });
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    const oldStatus = submission.status;
    submission.status = status;
    const now = new Date();
    submission.updatedAt = now;

    // Set status timestamps (first time only)
    if (status === 'contacted' && !submission.contactedAt) {
      submission.contactedAt = now;
    }
    if (status === 'completed' && !submission.completedAt) {
      submission.completedAt = now;
    }
    if (status === 'cancelled' && !submission.cancelledAt) {
      submission.cancelledAt = now;
    }
    await submission.save();
    
    console.log(`✅ Status updated - Token: ${token}, ${oldStatus} → ${status}`);
    
    // Send Discord status update notification
    try {
      await discordService.sendStatusUpdate(submission.formType, submission, oldStatus, status);
    } catch (discordError) {
      console.error('❌ Failed to send Discord status update:', discordError.message);
    }
    
    // If token was completed or cancelled, check for next in queue
    let nextToken = null;
    if (status === 'completed' || status === 'cancelled') {
      nextToken = await getNextWaitingToken(submission.formType);
      if (nextToken) {
        console.log(`📞 Next token ready for processing: ${nextToken.token}`);
        
        // Send Discord notification for next token
        try {
          const nextMessage = `🔔 **Next in Queue - ${nextToken.formType.toUpperCase()}**\n` +
            `Token **${nextToken.token}** is now ready for contact!\n\n` +
            `👤 **Name:** ${nextToken.name}\n` +
            `📧 **Email:** ${nextToken.email}\n` +
            `${nextToken.phone ? `📱 **Phone:** ${nextToken.phone}\n` : ''}` +
            `⏰ **Waiting since:** ${nextToken.submittedAt.toLocaleString()}`;
            
          await discordService.sendCustomMessage(nextToken.formType, nextMessage);
        } catch (discordError) {
          console.error('❌ Failed to send next token notification:', discordError.message);
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: {
        token: submission.token,
        oldStatus,
        newStatus: status,
        nextInQueue: nextToken ? {
          token: nextToken.token,
          name: nextToken.name,
          email: nextToken.email,
          waitingSince: nextToken.submittedAt
        } : null
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating submission status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update submission status',
      details: error.message
    });
  }
});

// Route: Get next waiting token for a form type (Admin only)
router.get('/queue/:formType/next', authenticateAdmin, async (req, res) => {
  try {
    const { formType } = req.params;
    
    // Validate form type
    if (!['demo', 'showcase', 'fasttrack'].includes(formType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid form type'
      });
    }
    
    const nextToken = await getNextWaitingToken(formType);
    
    if (!nextToken) {
      return res.json({
        success: true,
        message: 'No tokens waiting in queue',
        data: null
      });
    }
    
    res.json({
      success: true,
      data: {
        token: nextToken.token,
        name: nextToken.name,
        email: nextToken.email,
        phone: nextToken.phone,
        submittedAt: nextToken.submittedAt,
        waitingTime: getWaitingTime(nextToken.submittedAt)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching next token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch next token',
      details: error.message
    });
  }
});

// Route: Get queue status for all form types (Admin only)
router.get('/queue/status', authenticateAdmin, async (req, res) => {
  try {
    const queueStatus = {};
    
    for (const formType of ['demo', 'showcase', 'fasttrack']) {
      const waitingCount = await FormSubmission.countDocuments({ 
        formType, 
        status: 'waiting' 
      });
      
      const nextToken = await getNextWaitingToken(formType);
      
      queueStatus[formType] = {
        waitingCount,
        nextInQueue: nextToken ? {
          token: nextToken.token,
          name: nextToken.name,
          waitingSince: nextToken.submittedAt,
          waitingTime: getWaitingTime(nextToken.submittedAt)
        } : null
      };
    }
    
    res.json({
      success: true,
      data: queueStatus
    });
    
  } catch (error) {
    console.error('❌ Error fetching queue status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch queue status',
      details: error.message
    });
  }
});

/**
 * Helper function to get the next waiting token for a form type
 */
async function getNextWaitingToken(formType) {
  return await FormSubmission.findOne({ 
    formType, 
    status: 'waiting' 
  })
  .sort({ submittedAt: 1 }) // Oldest first (FIFO)
  .select('token name email phone submittedAt formType')
  .lean();
}

/**
 * Helper function to calculate waiting time
 */
function getWaitingTime(submittedAt) {
  const now = new Date();
  const diffMs = now - new Date(submittedAt);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMins}m`;
  } else {
    return `${diffMins}m`;
  }
}

// Route: Get all submissions for a form type (with pagination) (Admin only)
router.get('/submissions/:formType', authenticateAdmin, async (req, res) => {
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

// Route: Get token counters status (Admin only)
router.get('/counters', authenticateAdmin, async (req, res) => {
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
