const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./config/environment');
const { errorHandler, notFoundHandler } = require('./middleware/validation');

// Import routes
const formsRoutes = require('./routes/forms');
const discordRoutes = require('./routes/discord');
const discordInteractionsRoutes = require('./routes/discord-interactions');
const { router: authRoutes } = require('./routes/auth');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow for development; configure properly for production
}));

// CORS configuration
const isProduction = process.env.NODE_ENV === 'production';
const defaultProdOrigins = ['https://sparkie-user-form.onrender.com'];
const defaultDevOrigins = [
  'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3500', 'http://localhost:5173',
  'http://127.0.0.1:3000', 'http://127.0.0.1:3500', 'http://127.0.0.1:5173'
];
const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : null;
const allowedOrigins = envOrigins || (isProduction ? defaultProdOrigins : defaultDevOrigins);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Guiyang Form Backend is running! 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      forms: '/api/forms',
      discord: '/api/discord',
      auth: '/api/auth',
      health: '/api/forms/health'
    }
  });
});

// API Routes
app.use('/api/forms', formsRoutes);
app.use('/api/discord', discordRoutes);
app.use('/api/discord', discordInteractionsRoutes);
app.use('/api/auth', authRoutes);

// Catch-all route for undefined API routes
app.all('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Non-API routes return 404 - frontend is served separately
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found. This is an API-only server.`
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Log database name
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Server will continue without MongoDB (some features disabled)');
    console.log('💡 To enable full functionality, please ensure MongoDB is running');
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed');
    process.exit(0);
  });
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  await connectDB();
  
  const server = app.listen(config.PORT, () => {
    console.log(`\n🚀 Server running on port ${config.PORT}`);
    console.log(`📱 Environment: ${config.NODE_ENV}`);
    console.log(`🌐 Local: http://localhost:${config.PORT}`);
    console.log(`📋 API Docs: http://localhost:${config.PORT}/api/forms/health`);
    
    // Log Discord webhook status
    const discordService = require('./services/discordService');
    const webhookStatus = discordService.getWebhookStatus();
    const configuredWebhooks = Object.values(webhookStatus).filter(s => s.configured).length;
    console.log(`🔗 Discord Webhooks: ${configuredWebhooks}/3 configured`);
    
    console.log('\n📝 Available Endpoints:');
    console.log('   POST /api/forms/demo - Submit Sparkie Demo form');
    console.log('   POST /api/forms/showcase - Submit System Showcase form');
    console.log('   POST /api/forms/fasttrack - Submit Fast-Track form');
    console.log('   GET  /api/forms/submission/:token - Get submission by token');
    console.log('   GET  /api/forms/submissions/:formType - Get submissions by type');
    console.log('   POST /api/discord/test/:formType - Test Discord webhook');
    console.log('   GET  /api/discord/status - Check webhook status');
    console.log('   POST /api/auth/login - Admin login');
    console.log('   POST /api/auth/verify - Verify admin token');
    console.log('   POST /api/auth/logout - Admin logout');
    console.log('\n✨ Ready to accept form submissions!');
  });
  
  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${config.PORT} is already in use`);
    } else {
      console.error('❌ Server error:', error);
    }
    process.exit(1);
  });
};

// Initialize everything
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
