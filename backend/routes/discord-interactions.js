const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');
const discordService = require('../services/discordService');
const crypto = require('crypto');

// Middleware to verify Discord interactions
const verifyDiscordSignature = (req, res, next) => {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = req.rawBody;
  
  if (!signature || !timestamp || !body) {
    return res.status(401).json({ error: 'Invalid request signature' });
  }
  
  // For production, you would verify with your Discord application's public key
  // For now, we'll skip verification in development
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement proper Discord signature verification
    // const isValid = verifyDiscordRequest(signature, timestamp, body);
    // if (!isValid) {
    //   return res.status(401).json({ error: 'Invalid request signature' });
    // }
  }
  
  next();
};

// Middleware to parse raw body for signature verification
const parseRawBody = (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    req.rawBody = body;
    try {
      req.body = JSON.parse(body);
    } catch (error) {
      req.body = {};
    }
    next();
  });
};

/**
 * Handle Discord slash commands and button interactions
 */
router.post('/interactions', parseRawBody, verifyDiscordSignature, async (req, res) => {
  try {
    const { type, data, user, member } = req.body;
    
    // Handle ping (Discord verification)
    if (type === 1) {
      return res.json({ type: 1 });
    }
    
    // Handle application commands (slash commands)
    if (type === 2) {
      return handleApplicationCommand(req, res);
    }
    
    // Handle button interactions
    if (type === 3 && data.component_type === 2) {
      return handleButtonInteraction(req, res);
    }
    
    res.status(400).json({ error: 'Unknown interaction type' });
    
  } catch (error) {
    console.error('❌ Discord interaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Handle button interactions from Discord
 */
async function handleButtonInteraction(req, res) {
  try {
    const { data, user, member } = req.body;
    const customId = data.custom_id;
    const discordUser = user || member?.user;
    
    console.log(`🔘 Button clicked: ${customId} by ${discordUser?.username}`);
    
    // Parse action and token from custom_id (format: action_token)
    const [action, token] = customId.split('_');
    
    if (!token) {
      return res.json({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          content: '❌ Invalid button interaction - token not found',
          flags: 64 // EPHEMERAL
        }
      });
    }
    
    // Find the submission
    const submission = await FormSubmission.findOne({ token });
    
    if (!submission) {
      return res.json({
        type: 4,
        data: {
          content: `❌ Submission not found for token: ${token}`,
          flags: 64 // EPHEMERAL
        }
      });
    }
    
    let newStatus = null;
    let responseMessage = '';
    
    // Handle different button actions
    switch (action) {
      case 'contact':
        if (submission.status !== 'waiting') {
          return res.json({
            type: 4,
            data: {
              content: `⚠️ Token ${token} is already ${submission.status}`,
              flags: 64 // EPHEMERAL
            }
          });
        }
        newStatus = 'contacted';
        responseMessage = `📞 Token ${token} marked as **contacted** by ${discordUser?.username}`;
        break;
        
      case 'complete':
        if (submission.status !== 'contacted') {
          return res.json({
            type: 4,
            data: {
              content: `⚠️ Token ${token} must be contacted before completing (currently ${submission.status})`,
              flags: 64 // EPHEMERAL
            }
          });
        }
        newStatus = 'completed';
        responseMessage = `✅ Token ${token} marked as **completed** by ${discordUser?.username}`;
        break;
        
      case 'cancel':
        if (submission.status === 'completed') {
          return res.json({
            type: 4,
            data: {
              content: `⚠️ Cannot cancel completed token ${token}`,
              flags: 64 // EPHEMERAL
            }
          });
        }
        newStatus = 'cancelled';
        responseMessage = `❌ Token ${token} **cancelled** by ${discordUser?.username}`;
        break;
        
      case 'status':
        // Just show current status
        const statusEmoji = {
          'waiting': '⏳',
          'contacted': '📞',
          'completed': '✅',
          'cancelled': '❌'
        };
        
        return res.json({
          type: 4,
          data: {
            content: `📊 **Status Check - ${token}**\n` +
              `👤 Name: ${submission.name}\n` +
              `📧 Email: ${submission.email}\n` +
              `${statusEmoji[submission.status]} Status: **${submission.status}**\n` +
              `⏰ Last Updated: ${submission.updatedAt.toLocaleString()}`,
            flags: 64 // EPHEMERAL
          }
        });
        
      default:
        return res.json({
          type: 4,
          data: {
            content: '❌ Unknown action',
            flags: 64 // EPHEMERAL
          }
        });
    }
    
    // Update the submission status
    const oldStatus = submission.status;
    submission.status = newStatus;
    submission.updatedAt = new Date();
    await submission.save();
    
    console.log(`✅ Status updated via Discord - Token: ${token}, ${oldStatus} → ${newStatus}`);
    
    // Send status update message
    await discordService.sendStatusUpdate(submission.formType, submission, oldStatus, newStatus);
    
    // Check for next token if completed/cancelled
    let nextTokenMessage = '';
    if (newStatus === 'completed' || newStatus === 'cancelled') {
      const nextToken = await getNextWaitingToken(submission.formType);
      if (nextToken) {
        nextTokenMessage = `\n\n🔔 **Next in queue:** ${nextToken.token} (${nextToken.name})`;
        
        // Send next token notification
        const nextMessage = `🔔 **Next in Queue - ${nextToken.formType.toUpperCase()}**\n` +
          `Token **${nextToken.token}** is now ready for contact!\n\n` +
          `👤 **Name:** ${nextToken.name}\n` +
          `📧 **Email:** ${nextToken.email}\n` +
          `${nextToken.phone ? `📱 **Phone:** ${nextToken.phone}\n` : ''}` +
          `⏰ **Waiting since:** ${nextToken.submittedAt.toLocaleString()}`;
          
        await discordService.sendCustomMessage(nextToken.formType, nextMessage);
      }
    }
    
    // Respond to the interaction
    res.json({
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE  
      data: {
        content: responseMessage + nextTokenMessage,
        flags: 64 // EPHEMERAL
      }
    });
    
  } catch (error) {
    console.error('❌ Button interaction error:', error);
    res.json({
      type: 4,
      data: {
        content: '❌ An error occurred processing your request',
        flags: 64 // EPHEMERAL
      }
    });
  }
}

/**
 * Handle slash commands (future feature)
 */
async function handleApplicationCommand(req, res) {
  const { data } = req.body;
  
  if (data.name === 'queue') {
    // Handle /queue command
    const formType = data.options?.[0]?.value || 'demo';
    
    try {
      const nextToken = await getNextWaitingToken(formType);
      const waitingCount = await FormSubmission.countDocuments({ 
        formType, 
        status: 'waiting' 
      });
      
      let response = `📊 **Queue Status - ${formType.toUpperCase()}**\n`;
      response += `⏳ Waiting: ${waitingCount}\n`;
      
      if (nextToken) {
        response += `🔄 Next: ${nextToken.token} (${nextToken.name})\n`;
        response += `⏰ Waiting since: ${nextToken.submittedAt.toLocaleString()}`;
      } else {
        response += `✅ No tokens waiting in queue`;
      }
      
      res.json({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          content: response,
          flags: 64 // EPHEMERAL
        }
      });
      
    } catch (error) {
      console.error('❌ Queue command error:', error);
      res.json({
        type: 4,
        data: {
          content: '❌ Error fetching queue status',
          flags: 64 // EPHEMERAL  
        }
      });
    }
  } else {
    res.json({
      type: 4,
      data: {
        content: '❌ Unknown command',
        flags: 64 // EPHEMERAL
      }
    });
  }
}

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
 * Register slash commands with Discord (development endpoint)
 */
router.post('/register-commands', async (req, res) => {
  try {
    // This would register slash commands with Discord
    // For now, return success message
    res.json({
      success: true,
      message: 'Commands registered (placeholder for Discord API integration)'
    });
  } catch (error) {
    console.error('❌ Command registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register commands'
    });
  }
});

module.exports = router;
