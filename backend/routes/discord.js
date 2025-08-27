const express = require('express');
const router = express.Router();
const discordService = require('../services/discordService');

// Route: Test Discord webhook for specific form type
router.post('/test/:formType', async (req, res) => {
  try {
    const { formType } = req.params;
    
    // Validate form type
    if (!['demo', 'showcase', 'fasttrack'].includes(formType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid form type. Must be one of: demo, showcase, fasttrack'
      });
    }
    
    console.log(`🧪 Testing Discord webhook for ${formType}...`);
    
    const result = await discordService.testWebhook(formType);
    
    res.json({
      success: result.success,
      message: result.success 
        ? `Discord webhook test successful for ${formType}`
        : `Discord webhook test failed for ${formType}`,
      details: result.success ? result.response : result.error,
      formType
    });
    
  } catch (error) {
    console.error('❌ Error testing Discord webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test Discord webhook',
      details: error.message
    });
  }
});

// Route: Test all Discord webhooks
router.post('/test-all', async (req, res) => {
  try {
    console.log('🧪 Testing all Discord webhooks...');
    
    const formTypes = ['demo', 'showcase', 'fasttrack'];
    const results = {};
    
    // Test all webhooks in parallel
    await Promise.all(
      formTypes.map(async (formType) => {
        const result = await discordService.testWebhook(formType);
        results[formType] = {
          success: result.success,
          error: result.success ? null : result.error
        };
      })
    );
    
    const allSuccessful = Object.values(results).every(result => result.success);
    
    res.json({
      success: allSuccessful,
      message: allSuccessful 
        ? 'All Discord webhooks tested successfully'
        : 'Some Discord webhook tests failed',
      results
    });
    
  } catch (error) {
    console.error('❌ Error testing all Discord webhooks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test Discord webhooks',
      details: error.message
    });
  }
});

// Route: Get webhook configuration status
router.get('/status', (req, res) => {
  try {
    const status = discordService.getWebhookStatus();
    
    const configuredCount = Object.values(status).filter(s => s.configured).length;
    const totalCount = Object.keys(status).length;
    
    res.json({
      success: true,
      message: `${configuredCount}/${totalCount} webhooks configured`,
      webhooks: status,
      allConfigured: configuredCount === totalCount
    });
    
  } catch (error) {
    console.error('❌ Error getting webhook status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get webhook status',
      details: error.message
    });
  }
});

// Route: Send custom test message
router.post('/custom-test', async (req, res) => {
  try {
    const { formType, name, email, phone, company, role, message } = req.body;
    
    // Validate required fields
    if (!formType || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: formType, name, email'
      });
    }
    
    // Validate form type
    if (!['demo', 'showcase', 'fasttrack'].includes(formType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid form type. Must be one of: demo, showcase, fasttrack'
      });
    }
    
    const testData = {
      name,
      email,
      phone,
      token: `${formType.charAt(0).toUpperCase()}-CUSTOM-TEST`,
      company: formType === 'fasttrack' ? company : undefined,
      role: formType === 'fasttrack' ? role : undefined,
      message: formType === 'fasttrack' ? message : undefined
    };
    
    const result = await discordService.sendToDiscord(formType, testData);
    
    res.json({
      success: result.success,
      message: result.success 
        ? 'Custom test message sent successfully'
        : 'Failed to send custom test message',
      details: result.success ? result.response : result.error
    });
    
  } catch (error) {
    console.error('❌ Error sending custom test message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send custom test message',
      details: error.message
    });
  }
});

module.exports = router;
