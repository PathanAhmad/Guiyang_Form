import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Server error occurred';
      error.message = errorMessage;
    } else if (error.request) {
      // Network error
      error.message = 'Network error - please check your connection';
    }
    
    return Promise.reject(error);
  }
);

// Form submission endpoints
export const formsAPI = {
  // Submit demo form
  submitDemo: (data) => api.post('/forms/demo', data),
  
  // Submit showcase form
  submitShowcase: (data) => api.post('/forms/showcase', data),
  
  // Submit fast-track form
  submitFasttrack: (data) => api.post('/forms/fasttrack', data),
  
  // Get submission by token
  getSubmission: (token) => api.get(`/forms/submission/${token}`),
  
  // Update submission status
  updateStatus: (token, status) => api.patch(`/forms/submission/${token}/status`, { status }),
  
  // Get submissions by form type
  getSubmissions: (formType, page = 1, limit = 10) => 
    api.get(`/forms/submissions/${formType}?page=${page}&limit=${limit}`),
  
  // Get next waiting token for a form type
  getNextInQueue: (formType) => api.get(`/forms/queue/${formType}/next`),
  
  // Get queue status for all form types
  getQueueStatus: () => api.get('/forms/queue/status'),
  
  // Get counters
  getCounters: () => api.get('/forms/counters'),
  
  // Health check
  health: () => api.get('/forms/health'),
};

// Discord API endpoints  
export const discordAPI = {
  // Test webhook for specific form type
  testWebhook: (formType) => api.post(`/discord/test/${formType}`),
  
  // Test all webhooks
  testAllWebhooks: () => api.post('/discord/test-all'),
  
  // Get webhook status
  getStatus: () => api.get('/discord/status'),
  
  // Send custom test message
  sendCustomTest: (data) => api.post('/discord/custom-test', data),
};

// Authentication API endpoints
export const authAPI = {
  // Login with credentials
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Verify token
  verify: (token) => api.post('/auth/verify', { token }),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

// Function to set auth token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Function to get current auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('admin_token');
};

// Function to save auth token to localStorage
export const saveAuthToken = (token) => {
  localStorage.setItem('admin_token', token);
  setAuthToken(token);
};

// Function to remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('admin_token');
  setAuthToken(null);
};

// Initialize auth token on app start if it exists
const savedToken = getAuthToken();
if (savedToken) {
  setAuthToken(savedToken);
}

// Main API instance export
export default api;
