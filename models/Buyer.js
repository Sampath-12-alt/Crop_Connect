// ==========================================
// Buyer Model
// ==========================================

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = require('./User');

/**
 * Buyer Schema extending base User schema
 */
const buyerSchema = new mongoose.Schema({});
buyerSchema.add(userSchema);

// Add buyer-specific fields
buyerSchema.add({
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

buyerSchema.plugin(passportLocalMongoose);

// Add geospatial index for location-based queries
buyerSchema.index({ geometry: '2dsphere' });

// Static methods
buyerSchema.statics.findNearbyBuyers = function(coordinates, maxDistance = 50000) {
    return this.find({
        geometry: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                $maxDistance: maxDistance
            }
        }
    });
};

buyerSchema.statics.findByLocation = function(location) {
    return this.find({ location: new RegExp(location, 'i') });
};

buyerSchema.statics.getTotalBuyers = function() {
    return this.countDocuments();
};

// Instance methods
buyerSchema.methods.getDashboardData = async function() {
    const Request = mongoose.model('Request');

    const requests = await Request.find({ buyer: this._id }).populate('farmer');

    return {
        requests,
        buyername: this.username
    };
};

buyerSchema.methods.getOrderHistory = async function() {
    const Request = mongoose.model('Request');

    const orders = await Request.find({
        buyer: this._id,
        order: 'accepted'
    })
    .populate('farmer')
    .sort({ createdAt: -1 });

    return orders;
};

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;