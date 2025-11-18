const archiver = require('archiver');

/**
 * Escape CSV value to handle quotes, commas, and newlines
 */
function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Flatten a single response document into rows (one per question-answer pair)
 * @param {Object} response - Enriched response object with accessKey, keyName, roleType, etc.
 * @returns {Array} Array of row objects
 */
function flattenResponseToRows(response) {
  const rows = [];
  const baseData = {
    accessKey: response.accessKey,
    keyName: response.keyName,
    roleType: response.roleType,
    formId: response.formId,
    formType: response.formType,
    status: response.status,
    language: response.language,
    submittedAt: response.submittedAt ? new Date(response.submittedAt).toISOString() : '',
  };
  
  // Parse responses if it's a JSON string
  let responsesObj = response.responses;
  if (typeof responsesObj === 'string') {
    try {
      responsesObj = JSON.parse(responsesObj);
    } catch (e) {
      console.error('Failed to parse responses JSON:', e);
      responsesObj = {};
    }
  }
  
  // Flatten each question-answer pair
  for (const [questionId, answerValue] of Object.entries(responsesObj)) {
    // Handle array values by joining with ", "
    let formattedAnswer = answerValue;
    if (Array.isArray(answerValue)) {
      formattedAnswer = answerValue.join(', ');
    } else if (typeof answerValue === 'object' && answerValue !== null) {
      // For objects, stringify them
      formattedAnswer = JSON.stringify(answerValue);
    }
    
    rows.push({
      ...baseData,
      questionId,
      answerValue: formattedAnswer,
    });
  }
  
  return rows;
}

/**
 * Generate CSV string from rows
 * @param {Array} rows - Array of row objects
 * @returns {String} CSV string
 */
function generateCSV(rows) {
  if (rows.length === 0) {
    // Return headers only if no rows
    const headers = [
      'Access Key',
      'Key Name',
      'Role Type',
      'Form ID',
      'Form Type',
      'Status',
      'Language',
      'Submitted At',
      'Question ID',
      'Answer Value',
    ];
    return headers.join(',') + '\n';
  }
  
  // Headers
  const headers = [
    'Access Key',
    'Key Name',
    'Role Type',
    'Form ID',
    'Form Type',
    'Status',
    'Language',
    'Submitted At',
    'Question ID',
    'Answer Value',
  ];
  
  const csvRows = [headers.join(',')];
  
  // Data rows
  rows.forEach(row => {
    const csvRow = [
      escapeCsvValue(row.accessKey),
      escapeCsvValue(row.keyName),
      escapeCsvValue(row.roleType),
      escapeCsvValue(row.formId),
      escapeCsvValue(row.formType),
      escapeCsvValue(row.status),
      escapeCsvValue(row.language),
      escapeCsvValue(row.submittedAt),
      escapeCsvValue(row.questionId),
      escapeCsvValue(row.answerValue),
    ];
    csvRows.push(csvRow.join(','));
  });
  
  return csvRows.join('\n');
}

/**
 * Create a ZIP archive containing multiple CSV files
 * @param {Array} csvFiles - Array of {filename, content} objects
 * @returns {Promise<Buffer>} ZIP buffer
 */
function createZipArchive(csvFiles) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });
    
    const chunks = [];
    
    archive.on('data', chunk => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);
    
    // Add each CSV file to the archive
    csvFiles.forEach(({ filename, content }) => {
      archive.append(content, { name: filename });
    });
    
    archive.finalize();
  });
}

/**
 * Sanitize filename by removing/replacing invalid characters
 */
function sanitizeFilename(str) {
  return str
    .replace(/[^a-z0-9_-]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

module.exports = {
  escapeCsvValue,
  flattenResponseToRows,
  generateCSV,
  createZipArchive,
  sanitizeFilename,
};




