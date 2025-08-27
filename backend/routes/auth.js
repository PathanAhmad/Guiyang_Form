const express = require('express');
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  userid: 'saraundre',
  password: 'saraundre@2334'
};

// Route: Admin login
router.post('/login', (req, res) => {
  try {
    const { userid, password } = req.body;
    
    // Validate request body
    if (!userid || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }
    
    // Check credentials
    if (userid === ADMIN_CREDENTIALS.userid && password === ADMIN_CREDENTIALS.password) {
      // Create session token (simple token for this implementation)
      const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In a real application, you would store this in a database or session store
      // For this simple implementation, we'll just return the token
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          userid: ADMIN_CREDENTIALS.userid,
          role: 'admin',
          loginTime: new Date().toISOString()
        }
      });
      
      console.log(`✅ Admin login successful - User: ${userid}`);
    } else {
      console.log(`❌ Failed login attempt - User: ${userid}`);
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Route: Verify token (for protected routes)
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }
    
    // Simple token validation (in production, use proper JWT or session management)
    if (token.startsWith('admin_')) {
      res.json({
        success: true,
        data: {
          valid: true,
          userid: ADMIN_CREDENTIALS.userid,
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Route: Logout
router.post('/logout', (req, res) => {
  try {
    // In a real application, you would invalidate the token/session here
    res.json({
      success: true,
      message: 'Logout successful'
    });
    
    console.log('✅ Admin logout');
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Auth middleware for protecting routes
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }
  
  const token = authHeader.substring(7); // Remove "Bearer " prefix
  
  // Simple token validation
  if (token.startsWith('admin_')) {
    req.user = {
      userid: ADMIN_CREDENTIALS.userid,
      role: 'admin'
    };
    next();
  } else {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Invalid token.'
    });
  }
};

module.exports = { router, authenticateAdmin };
