require('dotenv').config();

module.exports = {
  // MongoDB Configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/guiyang_forms',
  
  // Server Configuration
  PORT: process.env.PORT || 6000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Discord Webhook URLs
  DISCORD_WEBHOOKS: {
    demo: process.env.DISCORD_WEBHOOK_DEMO || 'YOUR_DEMO_WEBHOOK_URL',
    showcase: process.env.DISCORD_WEBHOOK_SHOWCASE || 'YOUR_SHOWCASE_WEBHOOK_URL',
    fasttrack: process.env.DISCORD_WEBHOOK_FASTTRACK || 'YOUR_FASTTRACK_WEBHOOK_URL'
  },
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key'
};
