// ==========================================
// Configuration Index
// ==========================================

const { connectDB, disconnectDB } = require('./database');
const { configurePassport } = require('./passport');

module.exports = {
    connectDB,
    disconnectDB,
    configurePassport
};