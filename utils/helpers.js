// ==========================================
// Helper Utilities
// ==========================================

/**
 * Generate random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Generate secure session secret
 * @returns {string} Secure session secret
 */
const generateSessionSecret = () => {
    return generateRandomString(64);
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
const truncate = (str, maxLength = 50) => {
    if (!str || str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (rounded to 2 decimal places)
 */
const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100 * 100) / 100;
};

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
};

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
const sortBy = (array, key, order = 'asc') => {
    return array.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (order === 'desc') {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }

        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
const isEmpty = (obj) => {
    return !obj || Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Get file extension
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = {
    generateRandomString,
    generateSessionSecret,
    capitalize,
    truncate,
    calculatePercentage,
    groupBy,
    sortBy,
    isEmpty,
    deepClone,
    getFileExtension,
    formatFileSize
};