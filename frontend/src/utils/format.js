/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format phone number for display
 */
export const formatPhoneDisplay = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format US phone numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return as-is for international numbers
  return phone;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'waiting':
      return 'badge-yellow';
    case 'contacted':
      return 'badge-blue';
    case 'completed':
      return 'badge-green';
    case 'cancelled':
      return 'badge-red';
    default:
      return 'badge-blue';
  }
};

/**
 * Get form type display name
 */
export const getFormTypeDisplayName = (formType) => {
  switch (formType) {
    case 'demo':
      return 'Sparkie Demo';
    case 'showcase':
      return 'System Showcase';
    case 'fasttrack':
      return 'Fast-Track';
    default:
      return formType;
  }
};

/**
 * Get form type description
 */
export const getFormTypeDescription = (formType) => {
  switch (formType) {
    case 'demo':
      return 'Request a personalized demo of our Sparkie system';
    case 'showcase':
      return 'See our system showcase and capabilities';
    case 'fasttrack':
      return 'Express interest for priority access and consultation';
    default:
      return '';
  }
};

/**
 * Generate random ID for components
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};
