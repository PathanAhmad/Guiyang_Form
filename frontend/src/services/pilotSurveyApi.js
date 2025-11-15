import api from './api';

/**
 * Pilot Survey API Service
 * Handles all API calls related to pilot surveys
 */

// Get deployment access key from localStorage
const getAccessKey = () => {
  const authData = localStorage.getItem('deployment_auth');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.accessKey;
    } catch (error) {
      console.error('Error parsing deployment auth:', error);
      return null;
    }
  }
  return null;
};

// Create config with access key header
const getConfig = () => {
  const accessKey = getAccessKey();
  if (!accessKey) {
    throw new Error('No access key found. Please log in again.');
  }
  
  return {
    headers: {
      'x-deployment-access-key': accessKey,
    },
  };
};

/**
 * Get all available forms for the current user's role
 * @returns {Promise<Array>} Array of form objects with completion status
 */
export const getAvailableForms = async () => {
  try {
    const config = getConfig();
    const response = await api.get('/pilot-surveys/forms', config);
    return response.data.forms || [];
  } catch (error) {
    console.error('Error fetching available forms:', error);
    throw error;
  }
};

/**
 * Get all survey responses for the current user
 * @returns {Promise<Array>} Array of survey responses
 */
export const getResponses = async () => {
  try {
    const config = getConfig();
    const response = await api.get('/pilot-surveys/responses', config);
    return response.data.responses || [];
  } catch (error) {
    console.error('Error fetching responses:', error);
    throw error;
  }
};

/**
 * Get a specific form response
 * @param {string} formId - The form ID (form1, form2, form3, form4)
 * @returns {Promise<Object|null>} Survey response or null if not found
 */
export const getResponse = async (formId) => {
  try {
    const config = getConfig();
    const response = await api.get(`/pilot-surveys/responses/${formId}`, config);
    return response.data.response;
  } catch (error) {
    console.error(`Error fetching response for ${formId}:`, error);
    throw error;
  }
};

/**
 * Save a form response (create or update draft)
 * @param {string} formId - The form ID
 * @param {Object} data - Form data
 * @param {Object} data.responses - Form responses
 * @param {Array} data.completedSections - Array of completed section IDs
 * @param {string} data.language - Language used (en/zh)
 * @returns {Promise<Object>} Saved response
 */
export const saveResponse = async (formId, data) => {
  try {
    const config = getConfig();
    const response = await api.post(`/pilot-surveys/responses/${formId}`, data, config);
    return response.data.response;
  } catch (error) {
    console.error(`Error saving response for ${formId}:`, error);
    throw error;
  }
};

/**
 * Submit a form response (final submission)
 * @param {string} formId - The form ID
 * @param {Object} data - Form data
 * @param {Object} data.responses - Form responses
 * @param {Array} data.completedSections - Array of completed section IDs
 * @param {string} data.language - Language used (en/zh)
 * @returns {Promise<Object>} Submitted response
 */
export const submitResponse = async (formId, data) => {
  try {
    const config = getConfig();
    const response = await api.post(`/pilot-surveys/responses/${formId}/submit`, data, config);
    return response.data.response;
  } catch (error) {
    console.error(`Error submitting response for ${formId}:`, error);
    throw error;
  }
};

/**
 * Auto-save helper with debouncing
 * @param {string} formId - The form ID
 * @param {Object} data - Form data to save
 * @param {Function} callback - Optional callback after save
 * @returns {Promise<Object>} Saved response
 */
export const autoSave = async (formId, data, callback) => {
  try {
    const response = await saveResponse(formId, data);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error('Auto-save failed:', error);
    // Don't throw error for auto-save failures to avoid disrupting user experience
    return null;
  }
};

export default {
  getAvailableForms,
  getResponses,
  getResponse,
  saveResponse,
  submitResponse,
  autoSave,
};

