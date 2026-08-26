// ==========================================
// Farmer Model
// ==========================================

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = require('./User');

/**
 * Farmer Schema extending base User schema
 */
const farmerSchema = new mongoose.Schema({});
farmerSchema.add(userSchema);

// Add farmer-specific fields if needed in the future
// farmerSchema.add({
//     farmSize: Number,
//     certifications: [String],
//     experience: Number
// });

farmerSchema.plugin(passportLocalMongoose);

// Static methods
farmerSchema.statics.findByLocation = function(location) {
    return this.find({ location: new RegExp(location, 'i') });
};

farmerSchema.statics.getTotalFarmers = function() {
    return this.countDocuments();
};

// Instance methods
farmerSchema.methods.getDashboardData = async function() {
    const AvailableInventory = mongoose.model('AvailableInventory');
    const SoldInventory = mongoose.model('SoldInventory');
    const Request = mongoose.model('Request');

    const [available, sold, pendingRequests] = await Promise.all([
        AvailableInventory.findOne({ farmer: this._id }),
        SoldInventory.findOne({ farmer: this._id }),
        Request.find({ farmer: this._id, order: 'pending' })
    ]);

    return {
        available: available || { inventory: [] },
        sold: sold || { inventory: [] },
        hasPending: pendingRequests.length > 0
    };
};

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;