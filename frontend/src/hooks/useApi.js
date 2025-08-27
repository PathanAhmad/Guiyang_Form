import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls with loading and error states
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Execute API call
  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      setData(response.data);
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        data: null,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
};

/**
 * Custom hook for form submissions
 */
export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  // Submit form
  const submitForm = useCallback(async (apiCall) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      
      const response = await apiCall();
      setSubmissionData(response.data);
      setSubmitSuccess(true);
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to submit form';
      setSubmitError(errorMessage);
      
      return {
        success: false,
        data: null,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Reset submission state
  const resetSubmission = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmissionData(null);
  }, []);

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submissionData,
    submitForm,
    resetSubmission
  };
};
