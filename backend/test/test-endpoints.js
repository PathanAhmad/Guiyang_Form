const axios = require('axios');
const config = require('../config/environment');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Test data for each form type
const testData = {
  demo: {
    name: 'Alice Johnson',
    email: 'alice.demo@example.com',
    phone: '+1234567890'
  },
  showcase: {
    name: 'Bob Smith',
    email: 'bob.showcase@example.com',
    phone: '+0987654321'
  },
  fasttrack: {
    name: 'Charlie Wu',
    email: 'charlie.fasttrack@example.com',
    phone: '+1122334455',
    company: 'SparkOS Inc.',
    role: 'CTO',
    message: 'Interested in enterprise collaboration solutions'
  }
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.magenta}🧪 ${msg}${colors.reset}`),
  divider: () => console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`)
};

// Helper function to make HTTP requests
const makeRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE}${url}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
};

// Test functions
const testServerHealth = async () => {
  log.header('Testing Server Health');
  
  const response = await makeRequest('GET', '/forms/health');
  
  if (response.success) {
    log.success('Server health check passed');
    console.log('   Response:', response.data.message);
  } else {
    log.error('Server health check failed');
    console.log('   Error:', response.error);
  }
  
  return response.success;
};

const testFormSubmissions = async () => {
  log.header('Testing Form Submissions');
  
  const submissionResults = {};
  
  for (const [formType, data] of Object.entries(testData)) {
    log.info(`Testing ${formType} form submission...`);
    
    const response = await makeRequest('POST', `/forms/${formType}`, data);
    
    if (response.success) {
      log.success(`${formType} form submission successful`);
      console.log(`   Token: ${response.data.data.token}`);
      console.log(`   Discord sent: ${response.data.discord.sent}`);
      
      submissionResults[formType] = {
        success: true,
        token: response.data.data.token
      };
    } else {
      log.error(`${formType} form submission failed`);
      console.log('   Error:', response.error);
      
      submissionResults[formType] = {
        success: false,
        error: response.error
      };
    }
  }
  
  return submissionResults;
};

const testTokenRetrieval = async (submissionResults) => {
  log.header('Testing Token Retrieval');
  
  for (const [formType, result] of Object.entries(submissionResults)) {
    if (!result.success || !result.token) continue;
    
    log.info(`Testing token retrieval for ${result.token}...`);
    
    const response = await makeRequest('GET', `/forms/submission/${result.token}`);
    
    if (response.success) {
      log.success(`Token ${result.token} retrieved successfully`);
      console.log(`   Name: ${response.data.data.name}`);
      console.log(`   Status: ${response.data.data.status}`);
    } else {
      log.error(`Failed to retrieve token ${result.token}`);
      console.log('   Error:', response.error);
    }
  }
};

const testSubmissionsList = async () => {
  log.header('Testing Submissions List');
  
  const formTypes = ['demo', 'showcase', 'fasttrack'];
  
  for (const formType of formTypes) {
    log.info(`Testing submissions list for ${formType}...`);
    
    const response = await makeRequest('GET', `/forms/submissions/${formType}`);
    
    if (response.success) {
      log.success(`Retrieved ${response.data.data.submissions.length} ${formType} submissions`);
      console.log(`   Total: ${response.data.data.pagination.total}`);
    } else {
      log.error(`Failed to retrieve ${formType} submissions`);
      console.log('   Error:', response.error);
    }
  }
};

const testTokenCounters = async () => {
  log.header('Testing Token Counters');
  
  const response = await makeRequest('GET', '/forms/counters');
  
  if (response.success) {
    log.success('Token counters retrieved successfully');
    response.data.data.forEach(counter => {
      console.log(`   ${counter.formType}: ${counter.prefix}-${counter.count.toString().padStart(3, '0')}`);
    });
  } else {
    log.error('Failed to retrieve token counters');
    console.log('   Error:', response.error);
  }
};

const testDiscordWebhooks = async () => {
  log.header('Testing Discord Webhooks');
  
  // Test webhook status
  log.info('Testing webhook status...');
  const statusResponse = await makeRequest('GET', '/discord/status');
  
  if (statusResponse.success) {
    log.success('Webhook status retrieved successfully');
    Object.entries(statusResponse.data.webhooks).forEach(([type, status]) => {
      console.log(`   ${type}: ${status.configured ? '✅ Configured' : '❌ Not configured'}`);
    });
  } else {
    log.error('Failed to retrieve webhook status');
    console.log('   Error:', statusResponse.error);
  }
  
  // Test individual webhooks (only if configured)
  if (statusResponse.success) {
    const configuredWebhooks = Object.entries(statusResponse.data.webhooks)
      .filter(([, status]) => status.configured)
      .map(([type]) => type);
    
    if (configuredWebhooks.length > 0) {
      log.info('Testing configured webhooks...');
      
      for (const formType of configuredWebhooks) {
        const testResponse = await makeRequest('POST', `/discord/test/${formType}`);
        
        if (testResponse.success) {
          log.success(`${formType} webhook test passed`);
        } else {
          log.error(`${formType} webhook test failed`);
          console.log('   Error:', testResponse.error);
        }
      }
    } else {
      log.warning('No webhooks configured for testing');
    }
  }
};

const testValidation = async () => {
  log.header('Testing Input Validation');
  
  // Test invalid email
  log.info('Testing invalid email validation...');
  const invalidEmailResponse = await makeRequest('POST', '/forms/demo', {
    name: 'Test User',
    email: 'invalid-email',
    phone: '1234567890'
  });
  
  if (!invalidEmailResponse.success && invalidEmailResponse.status === 400) {
    log.success('Email validation working correctly');
  } else {
    log.error('Email validation failed');
  }
  
  // Test missing required fields
  log.info('Testing missing required fields...');
  const missingFieldsResponse = await makeRequest('POST', '/forms/fasttrack', {
    name: 'Test User',
    email: 'test@example.com'
    // Missing company and role
  });
  
  if (!missingFieldsResponse.success && missingFieldsResponse.status === 400) {
    log.success('Required fields validation working correctly');
  } else {
    log.error('Required fields validation failed');
  }
};

// Main test runner
const runAllTests = async () => {
  log.divider();
  console.log(`${colors.cyan}🚀 Starting ${config.EVENT_LABEL} Form Backend Tests${colors.reset}`);
  console.log(`${colors.cyan}📅 ${new Date().toISOString()}${colors.reset}`);
  log.divider();
  
  try {
    // Test server health first
    const isHealthy = await testServerHealth();
    if (!isHealthy) {
      log.error('Server is not healthy. Stopping tests.');
      process.exit(1);
    }
    
    // Run all tests
    await testValidation();
    const submissionResults = await testFormSubmissions();
    await testTokenRetrieval(submissionResults);
    await testSubmissionsList();
    await testTokenCounters();
    await testDiscordWebhooks();
    
    log.divider();
    log.success('All tests completed!');
    log.divider();
    
  } catch (error) {
    log.error('Test runner error:', error.message);
    process.exit(1);
  }
};

// Check if running directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testServerHealth,
  testFormSubmissions,
  testDiscordWebhooks,
  makeRequest
};
