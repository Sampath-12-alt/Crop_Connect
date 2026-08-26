// ==========================================
// Database Configuration
// ==========================================

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @param {string} dbUrl - MongoDB connection URL
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async (dbUrl) => {
    if (!dbUrl || dbUrl.trim() === '' || dbUrl.startsWith('your_')) {
        throw new Error('ATLASDB_URL is not configured. Set a valid MongoDB connection string in the .env file.');
    }

    try {
        const conn = await mongoose.connect(dbUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

/**
 * Close database connection
 * @returns {Promise} Mongoose disconnect promise
 */
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Database disconnected successfully');
    } catch (error) {
        console.error('Database disconnection error:', error);
    }
};

module.exports = {
    connectDB,
    disconnectDB
};