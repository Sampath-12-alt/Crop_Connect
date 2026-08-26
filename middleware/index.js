// ==========================================
// Middleware Index
// ==========================================

const { isLoggedIn, isFarmer, isBuyer, redirectPath } = require('./auth');
const { validateInventory, validateUser, schemas } = require('./validation');

module.exports = {
    isLoggedIn,
    isFarmer,
    isBuyer,
    redirectPath,
    validateInventory,
    validateUser,
    schemas
};