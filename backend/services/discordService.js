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
    const { name, email, phone, token, company, role, message, wechatId, whatsappId, status = 'waiting', eventLabel } = submissionData;
    
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

    const statusEmojiMap = {
      'waiting': '⏳',
      'contacted': '📞',
      'completed': '✅',
      'cancelled': '❌'
    };
    
    let discordMessage = `${emojiMap[formType]} **New ${formTitleMap[formType]}**\n`;
    if (eventLabel) {
      discordMessage += `🏷️ **Event:** ${eventLabel}\n`;
    }
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
      if (wechatId) {
        discordMessage += `💬 **WeChat ID:** ${wechatId}\n`;
      }
      if (whatsappId) {
        discordMessage += `💬 **WhatsApp ID:** ${whatsappId}\n`;
      }
    }
    
    discordMessage += `🔢 **Token:** ${token}\n`;
    discordMessage += `${statusEmojiMap[status]} **Status:** ${status.charAt(0).toUpperCase() + status.slice(1)}\n`;
    discordMessage += `⏰ **Submitted:** ${new Date().toLocaleString()}`;
    
    return discordMessage;
  }

  /**
   * Create Discord action buttons for submission management
   */
  createActionButtons(token, currentStatus = 'waiting') {
    const buttons = [];
    
    // Add buttons based on current status
    if (currentStatus === 'waiting') {
      buttons.push({
        type: 2, // Button component
        style: 3, // Success/Green style
        label: "📞 Mark as Contacted",
        custom_id: `contact_${token}`
      });
      buttons.push({
        type: 2,
        style: 4, // Danger/Red style  
        label: "❌ Cancel",
        custom_id: `cancel_${token}`
      });
    } else if (currentStatus === 'contacted') {
      buttons.push({
        type: 2,
        style: 3, // Success/Green style
        label: "✅ Mark as Completed",
        custom_id: `complete_${token}`
      });
      buttons.push({
        type: 2,
        style: 4, // Danger/Red style
        label: "❌ Cancel", 
        custom_id: `cancel_${token}`
      });
    }
    
    // Always include status check button
    buttons.push({
      type: 2,
      style: 2, // Secondary/Gray style
      label: "📊 Check Status",
      custom_id: `status_${token}`
    });

    return {
      type: 1, // Action Row
      components: buttons
    };
  }

  /**
   * Send message to Discord webhook with interactive buttons
   */
  async sendToDiscord(formType, submissionData, includeButtons = true) {
    try {
      const webhookUrl = this.webhooks[formType];
      
      if (!webhookUrl || webhookUrl === `YOUR_${formType.toUpperCase()}_WEBHOOK_URL`) {
        throw new Error(`Discord webhook URL not configured for ${formType}`);
      }
      
      const message = this.formatMessage(formType, submissionData);
      const components = includeButtons ? [this.createActionButtons(submissionData.token, submissionData.status)] : [];
      
      const payload = {
        content: message,
        username: `${config.EVENT_LABEL} Form Bot`,
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        components: components
      };
      
      const response = await axios.post(webhookUrl, payload, {
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
   * Send status update message to Discord
   */
  async sendStatusUpdate(formType, submissionData, oldStatus, newStatus) {
    try {
      const webhookUrl = this.webhooks[formType];
      
      if (!webhookUrl || webhookUrl === `YOUR_${formType.toUpperCase()}_WEBHOOK_URL`) {
        throw new Error(`Discord webhook URL not configured for ${formType}`);
      }

      const statusEmojiMap = {
        'waiting': '⏳',
        'contacted': '📞',
        'completed': '✅',
        'cancelled': '❌'
      };

      const statusMessage = `🔄 **Status Update - ${submissionData.token}**\n` +
        `👤 **Name:** ${submissionData.name}\n` +
        `📧 **Email:** ${submissionData.email}\n` +
        `📊 **Status Changed:** ${statusEmojiMap[oldStatus]} ${oldStatus} → ${statusEmojiMap[newStatus]} ${newStatus}\n` +
        `⏰ **Updated:** ${new Date().toLocaleString()}`;

      // Include action buttons if not completed/cancelled
      const components = (newStatus !== 'completed' && newStatus !== 'cancelled') 
        ? [this.createActionButtons(submissionData.token, newStatus)] 
        : [];
      
      const payload = {
        content: statusMessage,
        username: `${config.EVENT_LABEL} Status Bot`,
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/2.png',
        components: components
      };
      
      const response = await axios.post(webhookUrl, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Discord status update sent for ${formType} - Token: ${submissionData.token}`);
      return { success: true, response: response.data };
      
    } catch (error) {
      console.error(`❌ Failed to send Discord status update for ${formType}:`, error.message);
      
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Send custom message to Discord webhook
   */
  async sendCustomMessage(formType, message) {
    try {
      const webhookUrl = this.webhooks[formType];
      
      if (!webhookUrl || webhookUrl === `YOUR_${formType.toUpperCase()}_WEBHOOK_URL`) {
        throw new Error(`Discord webhook URL not configured for ${formType}`);
      }
      
      const response = await axios.post(webhookUrl, {
        content: message,
        username: `${config.EVENT_LABEL} Queue Bot`,
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Custom Discord message sent successfully for ${formType}`);
      return { success: true, response: response.data };
      
    } catch (error) {
      console.error(`❌ Failed to send custom Discord message for ${formType}:`, error.message);
      
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
