import { useState } from 'react';

/**
 * Custom hook for form state management
 */
export const useForm = (initialValues = {}, validationFn = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle input blur (touched state)
  const handleBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur if validation function provided
    if (validationFn && touched[name]) {
      const validation = validationFn(values);
      if (validation.errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: validation.errors[name]
        }));
      }
    }
  };

  // Validate form
  const validate = () => {
    if (!validationFn) return { isValid: true, errors: {} };
    
    const validation = validationFn(values);
    setErrors(validation.errors || {});
    
    // Mark all fields as touched
    const touchedFields = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(touchedFields);
    
    return validation;
  };

  // Reset form
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Set specific field values
  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Set specific field error
  const setFieldError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Set multiple field errors
  const setFieldErrors = (errorObj) => {
    setErrors(prev => ({
      ...prev,
      ...errorObj
    }));
  };

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFieldValue,
    setFieldError,
    setFieldErrors,
    setIsSubmitting,
    setValues,
  };
};
