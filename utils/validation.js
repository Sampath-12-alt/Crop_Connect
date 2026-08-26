// ==========================================
// Validation Utilities
// ==========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long'
        };
    }

    // Check for at least one uppercase, one lowercase, and one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        };
    }

    return { isValid: true };
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .slice(0, 1000); // Limit length
};

/**
 * Validate location format
 * @param {string} location - Location to validate
 * @returns {boolean} True if valid location
 */
const isValidLocation = (location) => {
    if (!location || typeof location !== 'string') return false;

    const trimmed = location.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
};

/**
 * Validate crop name
 * @param {string} crop - Crop name to validate
 * @returns {boolean} True if valid crop name
 */
const isValidCrop = (crop) => {
    if (!crop || typeof crop !== 'string') return false;

    const trimmed = crop.trim().toLowerCase();
    return trimmed.length >= 2 && trimmed.length <= 50 && /^[a-zA-Z\s]+$/.test(trimmed);
};

/**
 * Validate numeric value
 * @param {*} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if valid number within range
 */
const isValidNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

/**
 * Format date
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
};

module.exports = {
    isValidEmail,
    validatePassword,
    sanitizeInput,
    isValidLocation,
    isValidCrop,
    isValidNumber,
    formatCurrency,
    formatDate
};