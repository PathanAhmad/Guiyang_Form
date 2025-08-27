const axios = require('axios');
const config = require('../config/environment');

class DiscordService {
  constructor() {
    this.webhooks = config.DISCORD_WEBHOOKS;
  }

  /**
   * Format message for Discord based on form type and submission data
   */
  formatMessage(formType, submissionData) {
    const { name, email, phone, token, company, role, message } = submissionData;
    
    const formTitleMap = {
      'demo': 'Sparkie Demo Submission',
      'showcase': 'System Showcase Submission', 
      'fasttrack': 'Fast-Track Interest Submission'
    };
    
    const emojiMap = {
      'demo': '🎯',
      'showcase': '🚀',
      'fasttrack': '⚡'
    };
    
    let discordMessage = `${emojiMap[formType]} **New ${formTitleMap[formType]}**\n`;
    discordMessage += `👤 **Name:** ${name}\n`;
    discordMessage += `📧 **Email:** ${email}\n`;
    
    if (phone) {
      discordMessage += `📱 **Phone:** ${phone}\n`;
    }
    
    // Extra fields for Fast-Track form
    if (formType === 'fasttrack') {
      if (company) {
        discordMessage += `🏢 **Company:** ${company}\n`;
      }
      if (role) {
        discordMessage += `💼 **Role:** ${role}\n`;
      }
      if (message) {
        discordMessage += `💬 **Message:** ${message}\n`;
      }
    }
    
    discordMessage += `🔢 **Token:** ${token}\n`;
    discordMessage += `📌 **Status:** Waiting in Line\n`;
    discordMessage += `⏰ **Submitted:** ${new Date().toLocaleString()}`;
    
    return discordMessage;
  }

  /**
   * Send message to Discord webhook
   */
  async sendToDiscord(formType, submissionData) {
    try {
      const webhookUrl = this.webhooks[formType];
      
      if (!webhookUrl || webhookUrl === `YOUR_${formType.toUpperCase()}_WEBHOOK_URL`) {
        throw new Error(`Discord webhook URL not configured for ${formType}`);
      }
      
      const message = this.formatMessage(formType, submissionData);
      
      const response = await axios.post(webhookUrl, {
        content: message,
        username: 'Guiyang Form Bot',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Discord message sent successfully for ${formType} - Token: ${submissionData.token}`);
      return { success: true, response: response.data };
      
    } catch (error) {
      console.error(`❌ Failed to send Discord message for ${formType}:`, error.message);
      
      // Return error details for logging
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Test webhook connectivity
   */
  async testWebhook(formType) {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      token: `${formType.charAt(0).toUpperCase()}-TEST`,
      company: formType === 'fasttrack' ? 'Test Company' : undefined,
      role: formType === 'fasttrack' ? 'Test Role' : undefined,
      message: formType === 'fasttrack' ? 'This is a test message' : undefined
    };
    
    return await this.sendToDiscord(formType, testData);
  }

  /**
   * Get webhook status for all form types
   */
  getWebhookStatus() {
    const status = {};
    
    Object.keys(this.webhooks).forEach(formType => {
      const url = this.webhooks[formType];
      status[formType] = {
        configured: url && !url.includes('YOUR_'),
        url: url?.includes('YOUR_') ? 'Not configured' : 'Configured'
      };
    });
    
    return status;
  }
}

module.exports = new DiscordService();
