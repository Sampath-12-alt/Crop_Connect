// ==========================================
// Inventory Models
// ==========================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Inventory Item Schema
 */
const inventoryItemSchema = new Schema({
    crop: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

/**
 * Available Inventory Schema
 */
const availableInventorySchema = new Schema({
    farmer: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    inventory: [inventoryItemSchema]
}, { timestamps: true });

// Indexes
availableInventorySchema.index({ farmer: 1 });

// Instance methods
availableInventorySchema.methods.addCrop = function(crop, quantity, price) {
    const existingCrop = this.inventory.find(item => item.crop === crop.toLowerCase());

    if (existingCrop) {
        existingCrop.quantity += Number(quantity);
        existingCrop.price = Number(price);
    } else {
        this.inventory.push({
            crop: crop.toLowerCase(),
            quantity: Number(quantity),
            price: Number(price)
        });
    }

    return this.save();
};

availableInventorySchema.methods.updateCrop = function(crop, quantity, price) {
    const existingCrop = this.inventory.find(item => item.crop === crop.toLowerCase());

    if (existingCrop) {
        existingCrop.quantity = Number(quantity);
        existingCrop.price = Number(price);
        return this.save();
    }

    throw new Error('Crop not found in inventory');
};

availableInventorySchema.methods.removeCrop = function(crop) {
    this.inventory = this.inventory.filter(item => item.crop !== crop.toLowerCase());
    return this.save();
};

availableInventorySchema.methods.getTotalValue = function() {
    return this.inventory.reduce((total, item) => total + (item.quantity * item.price), 0);
};

/**
 * Sold Inventory Schema
 */
const soldInventorySchema = new Schema({
    farmer: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    inventory: [inventoryItemSchema]
}, { timestamps: true });

// Indexes
soldInventorySchema.index({ farmer: 1 });

// Instance methods
soldInventorySchema.methods.addSoldItems = function(items) {
    items.forEach(item => {
        const existingItem = this.inventory.find(inv =>
            inv.crop === item.crop && inv.price === item.price
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.inventory.push(item);
        }
    });

    return this.save();
};

soldInventorySchema.methods.getTotalRevenue = function() {
    return this.inventory.reduce((total, item) => total + (item.quantity * item.price), 0);
};

// Static methods
availableInventorySchema.statics.findByFarmer = function(farmerId) {
    return this.findOne({ farmer: farmerId });
};

soldInventorySchema.statics.findByFarmer = function(farmerId) {
    return this.findOne({ farmer: farmerId });
};

// Models
const AvailableInventory = mongoose.model('AvailableInventory', availableInventorySchema);
const SoldInventory = mongoose.model('SoldInventory', soldInventorySchema);
const Inventory = mongoose.model('Inventory', inventoryItemSchema);

module.exports = {
    AvailableInventory,
    SoldInventory,
    Inventory
};