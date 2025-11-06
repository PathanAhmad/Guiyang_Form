/**
 * Utilities for progressive error display: only the first error in a
 * predefined top-to-bottom field order should be shown to the user.
 */

/**
 * Return the key of the first field that has an error, according to the
 * provided field order.
 */
export function getFirstErrorField(errors = {}, fieldOrder = []) {
  if (!errors || typeof errors !== 'object') return null;
  for (const fieldName of fieldOrder) {
    if (errors[fieldName]) {
      return fieldName;
    }
  }
  // If none of the ordered fields have errors, fall back to any error key
  const anyKey = Object.keys(errors).find((k) => Boolean(errors[k]));
  return anyKey || null;
}

/**
 * Given the full errors object and the field order, produce a helper that will
 * return the error message only for the topmost errored field. All other
 * fields return an empty string.
 */
export function makeErrorGetter(errors = {}, fieldOrder = []) {
  const firstErrorField = getFirstErrorField(errors, fieldOrder);
  return function getError(fieldName) {
    return fieldName === firstErrorField ? (errors[fieldName] || '') : '';
  };
}


