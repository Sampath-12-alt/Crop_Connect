// ==========================================
// Models Index
// ==========================================

const Farmer = require('./Farmer');
const Buyer = require('./Buyer');
const { AvailableInventory, SoldInventory, Inventory } = require('./Inventory');
const Request = require('./Request');

// Export all models
module.exports = {
    Farmer,
    Buyer,
    AvailableInventory,
    SoldInventory,
    Inventory,
    Request
};