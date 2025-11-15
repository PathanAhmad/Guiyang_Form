require('dotenv').config();

module.exports = {
  // MongoDB Configuration
  MONGO_URI: process.env.MONGO_URI,
  
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Cloudinary Configuration
  CLOUDINARY: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    url: process.env.CLOUDINARY_URL || '',
    // Default folder for organized uploads
    folder: process.env.CLOUDINARY_FOLDER || 'guiyang_form'
  },
  
  // Event / Campaign Labeling
  EVENT_LABEL: process.env.EVENT_LABEL || 'World of Internet Expo',
  
  // Discord Webhook URLs
  DISCORD_WEBHOOKS: {
    demo: process.env.DISCORD_WEBHOOK_DEMO || 'YOUR_DEMO_WEBHOOK_URL',
    showcase: process.env.DISCORD_WEBHOOK_SHOWCASE || 'YOUR_SHOWCASE_WEBHOOK_URL',
    fasttrack: process.env.DISCORD_WEBHOOK_FASTTRACK || 'YOUR_FASTTRACK_WEBHOOK_URL'
  },
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key'
};

