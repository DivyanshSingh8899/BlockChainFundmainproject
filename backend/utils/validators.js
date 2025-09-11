const { ethers } = require('ethers');

/**
 * Validates Ethereum address format
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid address
 */
function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }
  return ethers.isAddress(address);
}

/**
 * Validates private key format
 * @param {string} privateKey - The private key to validate
 * @returns {boolean} - True if valid private key
 */
function validatePrivateKey(privateKey) {
  if (!privateKey || typeof privateKey !== 'string') {
    return false;
  }
  
  try {
    // Remove 0x prefix if present
    const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    
    // Check if it's 64 hex characters
    if (cleanKey.length !== 64) {
      return false;
    }
    
    // Check if all characters are valid hex
    if (!/^[0-9a-fA-F]+$/.test(cleanKey)) {
      return false;
    }
    
    // Try to create a wallet with it
    new ethers.Wallet(privateKey);
    return true;
    
  } catch (error) {
    return false;
  }
}

/**
 * Validates project data structure
 * @param {Object} projectData - The project data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateProjectData(projectData) {
  const errors = [];
  
  // Validate required fields
  if (!projectData.name || typeof projectData.name !== 'string' || projectData.name.trim().length === 0) {
    errors.push('Project name is required and must be a non-empty string');
  } else if (projectData.name.length > 100) {
    errors.push('Project name must be less than 100 characters');
  }
  
  if (!projectData.description || typeof projectData.description !== 'string' || projectData.description.trim().length === 0) {
    errors.push('Project description is required and must be a non-empty string');
  } else if (projectData.description.length > 1000) {
    errors.push('Project description must be less than 1000 characters');
  }
  
  if (!validateAddress(projectData.sponsor)) {
    errors.push('Valid sponsor address is required');
  }
  
  // Validate milestones
  if (!Array.isArray(projectData.milestones) || projectData.milestones.length === 0) {
    errors.push('At least one milestone is required');
  } else if (projectData.milestones.length > 20) {
    errors.push('Maximum 20 milestones allowed');
  } else {
    projectData.milestones.forEach((milestone, index) => {
      const milestoneErrors = validateMilestone(milestone, index);
      errors.push(...milestoneErrors);
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates individual milestone data
 * @param {Object} milestone - The milestone to validate
 * @param {number} index - The milestone index for error messages
 * @returns {Array} - Array of error messages
 */
function validateMilestone(milestone, index) {
  const errors = [];
  const milestonePrefix = `Milestone ${index + 1}:`;
  
  // Validate description
  if (!milestone.description || typeof milestone.description !== 'string' || milestone.description.trim().length === 0) {
    errors.push(`${milestonePrefix} Description is required and must be a non-empty string`);
  } else if (milestone.description.length > 200) {
    errors.push(`${milestonePrefix} Description must be less than 200 characters`);
  }
  
  // Validate amount
  if (!milestone.amount || isNaN(milestone.amount) || parseFloat(milestone.amount) <= 0) {
    errors.push(`${milestonePrefix} Amount must be a positive number`);
  } else if (parseFloat(milestone.amount) > 1000) {
    errors.push(`${milestonePrefix} Amount cannot exceed 1000 ETH`);
  }
  
  // Validate due date
  if (!milestone.dueDate) {
    errors.push(`${milestonePrefix} Due date is required`);
  } else {
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    
    if (isNaN(dueDate.getTime())) {
      errors.push(`${milestonePrefix} Due date must be a valid date`);
    } else if (dueDate <= now) {
      errors.push(`${milestonePrefix} Due date must be in the future`);
    } else if (dueDate.getTime() > now.getTime() + (365 * 24 * 60 * 60 * 1000)) {
      errors.push(`${milestonePrefix} Due date cannot be more than 1 year in the future`);
    }
  }
  
  return errors;
}

/**
 * Validates transaction hash format
 * @param {string} txHash - The transaction hash to validate
 * @returns {boolean} - True if valid transaction hash
 */
function validateTransactionHash(txHash) {
  if (!txHash || typeof txHash !== 'string') {
    return false;
  }
  
  // Remove 0x prefix if present
  const cleanHash = txHash.startsWith('0x') ? txHash.slice(2) : txHash;
  
  // Check if it's 64 hex characters
  return cleanHash.length === 64 && /^[0-9a-fA-F]+$/.test(cleanHash);
}

/**
 * Validates amount format for ETH transactions
 * @param {string|number} amount - The amount to validate
 * @returns {Object} - Validation result with isValid and parsed amount
 */
function validateAmount(amount) {
  if (!amount) {
    return { isValid: false, error: 'Amount is required' };
  }
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 1000) {
    return { isValid: false, error: 'Amount cannot exceed 1000 ETH' };
  }
  
  // Check for reasonable decimal places (max 18 for wei precision)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 18) {
    return { isValid: false, error: 'Amount has too many decimal places (max 18)' };
  }
  
  return { isValid: true, amount: numAmount };
}

/**
 * Sanitizes string input to prevent XSS and other attacks
 * @param {string} input - The input to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized string
 */
function sanitizeString(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters and trim
  let sanitized = input
    .replace(/[<>\"'&]/g, '') // Remove HTML/JS injection chars
    .trim();
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validates pagination parameters
 * @param {Object} params - Object containing limit and offset
 * @returns {Object} - Validated pagination parameters
 */
function validatePagination(params) {
  let { limit = 20, offset = 0 } = params;
  
  limit = parseInt(limit);
  offset = parseInt(offset);
  
  // Ensure reasonable limits
  if (isNaN(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100;
  
  if (isNaN(offset) || offset < 0) offset = 0;
  
  return { limit, offset };
}

module.exports = {
  validateAddress,
  validatePrivateKey,
  validateProjectData,
  validateMilestone,
  validateTransactionHash,
  validateAmount,
  sanitizeString,
  validatePagination
};
