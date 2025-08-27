const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Test server is running! 🚀',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    endpoints: [
      'GET /',
      'GET /api/test',
      'POST /api/test-post'
    ]
  });
});

app.post('/api/test-post', (req, res) => {
  res.json({
    success: true,
    message: 'POST endpoint working!',
    receivedData: req.body
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('   GET  / - Root endpoint');
  console.log('   GET  /api/test - Test API endpoint');
  console.log('   POST /api/test-post - Test POST endpoint');
});

// Handle errors
app.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
