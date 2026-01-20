/**
 * API Helpers
 * Utilities for handling API response data that may contain nested objects
 */

/**
 * Extract text value from API fields that may be objects with {text, score} structure
 * @param {string|object} value - The value to extract text from
 * @returns {string|null} - The extracted text value or null
 */
export const getTextValue = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.text !== undefined) return value.text;
  return String(value);
};

/**
 * Recursively normalize an object, extracting text values from {text, score} structures
 * @param {any} obj - The object to normalize
 * @returns {any} - The normalized object
 */
export const normalizeApiObject = (obj) => {
  if (obj === null || obj === undefined) return obj;

  // If it's a {text, score} object, extract the text
  if (typeof obj === 'object' && !Array.isArray(obj) && 'text' in obj && 'score' in obj) {
    return obj.text;
  }

  // If it's an array, normalize each element
  if (Array.isArray(obj)) {
    return obj.map(normalizeApiObject);
  }

  // If it's an object, normalize each property
  if (typeof obj === 'object') {
    const normalized = {};
    for (const key in obj) {
      normalized[key] = normalizeApiObject(obj[key]);
    }
    return normalized;
  }

  return obj;
};

/**
 * Normalize document data from API
 * @param {object} doc - Document object from API
 * @returns {object} - Normalized document object
 */
export const normalizeDocument = (doc) => {
  if (!doc) return doc;
  return {
    ...doc,
    name: getTextValue(doc.name) || doc.type || 'Document',
    type: getTextValue(doc.type),
  };
};

/**
 * Normalize loan data from API
 * @param {object} loan - Loan object from API
 * @returns {object} - Normalized loan object
 */
export const normalizeLoan = (loan) => {
  if (!loan) return loan;
  return {
    ...loan,
    loan_name: getTextValue(loan.loan_name) || getTextValue(loan.name) || 'Personal Loan',
    name: getTextValue(loan.name),
  };
};

export default {
  getTextValue,
  normalizeApiObject,
  normalizeDocument,
  normalizeLoan,
};
