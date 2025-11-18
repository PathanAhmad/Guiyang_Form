const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api/pilot-surveys/admin`;

// Mock admin token - In production, get this from auth endpoint
// For testing purposes, you'll need to set this to a valid admin token
const ADMIN_TOKEN = process.env.TEST_ADMIN_TOKEN || 'test-admin-token';

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

// Helper function to make authenticated admin requests
const makeAdminRequest = async (method, path, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE}${path}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
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
      status: error.response?.status || 500,
      errorData: error.response?.data
    };
  }
};

/**
 * Test DELETE /admin/responses/single/:responseId route
 * This route must be defined BEFORE /admin/responses/:accessKey to prevent route collision
 */
const testDeleteSingleResponse = async (testResponseId) => {
  log.header('Testing DELETE /admin/responses/single/:responseId');
  
  log.info(`Attempting to delete single response: ${testResponseId || 'MOCK_ID'}`);
  
  // Use a mock ID for testing route resolution
  const responseId = testResponseId || '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format
  const response = await makeAdminRequest('DELETE', `/responses/single/${responseId}`);
  
  // We expect either a 404 (response not found) or 200 (response deleted)
  // The key is that we should NOT get a 500 error about invalid accessKey format
  if (response.status === 404) {
    log.success('Route correctly resolved to single response endpoint (404 response not found)');
    console.log('   This is expected when testing with a non-existent ID');
    return true;
  } else if (response.status === 200) {
    log.success('Route correctly resolved and response deleted');
    console.log(`   Deleted response: ${response.data.deletedResponse?.id}`);
    return true;
  } else if (response.status === 500) {
    // Check if error is related to treating 'single' as accessKey
    const errorMsg = JSON.stringify(response.error);
    if (errorMsg.includes('accessKey') || errorMsg.includes('Cast to ObjectId failed')) {
      log.error('Route collision detected! Request hit /:accessKey route instead of /single/:responseId');
      console.log('   Error:', response.error);
      return false;
    } else {
      log.warning('Unexpected 500 error (not route collision)');
      console.log('   Error:', response.error);
      return false;
    }
  } else {
    log.warning(`Unexpected status code: ${response.status}`);
    console.log('   Response:', response.error || response.data);
    return false;
  }
};

/**
 * Test DELETE /admin/responses/:accessKey route
 * This should delete all responses for an access key
 */
const testDeleteByAccessKey = async (testAccessKey) => {
  log.header('Testing DELETE /admin/responses/:accessKey');
  
  log.info(`Attempting to delete responses by access key: ${testAccessKey || 'MOCK_KEY'}`);
  
  // Use a mock access key for testing
  const accessKey = testAccessKey || 'test-access-key-12345';
  const response = await makeAdminRequest('DELETE', `/responses/${accessKey}`);
  
  // We expect 200 with deletedCount (could be 0 if no responses exist)
  if (response.status === 200 && response.success) {
    log.success('Route correctly resolved to access key endpoint');
    console.log(`   Deleted ${response.data.deletedCount || 0} response(s)`);
    return true;
  } else {
    log.error('Failed to delete by access key');
    console.log('   Status:', response.status);
    console.log('   Error:', response.error);
    return false;
  }
};

/**
 * Test route collision prevention
 * Ensures /admin/responses/single/XXX doesn't match /:accessKey route
 */
const testRouteCollisionPrevention = async () => {
  log.header('Testing Route Collision Prevention');
  
  log.info('Testing that /single/:id route is correctly prioritized over /:accessKey route');
  
  // Try to delete using 'single' as if it were an access key
  // This should NOT work - it should hit the /single/:id route instead
  const responseId = '507f1f77bcf86cd799439011';
  const singleRouteResponse = await makeAdminRequest('DELETE', `/responses/single/${responseId}`);
  
  // Try to delete using a regular access key
  const accessKeyRouteResponse = await makeAdminRequest('DELETE', `/responses/test-key-123`);
  
  // Check that both routes work independently
  const singleRouteWorks = singleRouteResponse.status === 404 || singleRouteResponse.status === 200;
  const accessKeyRouteWorks = accessKeyRouteResponse.status === 200;
  
  if (singleRouteWorks && accessKeyRouteWorks) {
    log.success('Route collision prevention working correctly');
    console.log('   ✓ /single/:responseId route resolves correctly');
    console.log('   ✓ /:accessKey route resolves correctly');
    return true;
  } else {
    log.error('Route collision detected or routes not working correctly');
    console.log('   Single route status:', singleRouteResponse.status);
    console.log('   Access key route status:', accessKeyRouteResponse.status);
    return false;
  }
};

/**
 * Test all admin responses endpoints
 */
const testAllResponsesEndpoint = async () => {
  log.header('Testing GET /admin/all-responses');
  
  const response = await makeAdminRequest('GET', '/all-responses');
  
  if (response.success && response.status === 200) {
    log.success('Successfully retrieved all responses');
    console.log(`   Found ${response.data.count || 0} access key(s) with responses`);
    return response.data.data || [];
  } else {
    log.error('Failed to retrieve all responses');
    console.log('   Error:', response.error);
    return [];
  }
};

/**
 * Main test runner
 */
const runAllTests = async () => {
  log.divider();
  console.log(`${colors.cyan}🚀 Starting Pilot Survey Admin Route Tests${colors.reset}`);
  console.log(`${colors.cyan}📅 ${new Date().toISOString()}${colors.reset}`);
  log.divider();
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };
  
  try {
    // First, get all responses to see if we have real data to test with
    const allResponses = await testAllResponsesEndpoint();
    
    let realResponseId = null;
    let realAccessKey = null;
    
    if (allResponses && allResponses.length > 0) {
      const firstGroup = allResponses[0];
      realAccessKey = firstGroup.accessKey;
      if (firstGroup.responses && firstGroup.responses.length > 0) {
        realResponseId = firstGroup.responses[0]._id;
      }
      log.info(`Found real test data: accessKey=${realAccessKey}, responseId=${realResponseId || 'none'}`);
    } else {
      log.warning('No real response data found - tests will use mock IDs');
    }
    
    // Test single response deletion (critical for route ordering)
    const singleResponseTest = await testDeleteSingleResponse(realResponseId);
    if (singleResponseTest) results.passed++; else results.failed++;
    
    // Test access key deletion
    // Note: We won't delete real data in these tests
    const accessKeyTest = await testDeleteByAccessKey('test-mock-key-for-testing');
    if (accessKeyTest) results.passed++; else results.failed++;
    
    // Test route collision prevention
    const collisionTest = await testRouteCollisionPrevention();
    if (collisionTest) results.passed++; else results.failed++;
    
    // Summary
    log.divider();
    console.log(`${colors.cyan}📊 Test Results${colors.reset}`);
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   ⚠️  Warnings: ${results.warnings}`);
    log.divider();
    
    if (results.failed === 0) {
      log.success('All tests passed! Route ordering is correct.');
    } else {
      log.error('Some tests failed. Check route ordering in pilot-surveys.js');
      process.exit(1);
    }
    
  } catch (error) {
    log.error('Test runner error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Check if running directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testDeleteSingleResponse,
  testDeleteByAccessKey,
  testRouteCollisionPrevention,
  makeAdminRequest
};

