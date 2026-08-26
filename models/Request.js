// ==========================================
// Request Model
// ==========================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Request Schema for farmer-buyer transactions
 */
const requestSchema = new Schema({
    farmer: {
        type: Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    order: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
    inventorySent: [{
        crop: String,
        quantity: Number,
        price: Number
    }],
    inventoryAccepted: [{
        crop: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Indexes
requestSchema.index({ farmer: 1, order: 1 });
requestSchema.index({ buyer: 1, order: 1 });
requestSchema.index({ createdAt: -1 });

// Pre-save middleware
requestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();

    // Calculate total amount from accepted inventory
    if (this.inventoryAccepted && this.inventoryAccepted.length > 0) {
        this.totalAmount = this.inventoryAccepted.reduce(
            (total, item) => total + (item.quantity * item.price),
            0
        );
    }

    next();
});

// Instance methods
requestSchema.methods.acceptOrder = function(acceptedItems) {
    this.inventoryAccepted = acceptedItems;
    this.order = 'accepted';
    return this.save();
};

requestSchema.methods.rejectOrder = function() {
    this.order = 'rejected';
    return this.save();
};

requestSchema.methods.getTotalAmount = function() {
    return this.inventoryAccepted.reduce(
        (total, item) => total + (item.quantity * item.price),
        0
    );
};

requestSchema.methods.isPending = function() {
    return this.order === 'pending';
};

requestSchema.methods.isAccepted = function() {
    return this.order === 'accepted';
};

requestSchema.methods.isRejected = function() {
    return this.order === 'rejected';
};

// Static methods
requestSchema.statics.findPendingByFarmer = function(farmerId) {
    return this.find({ farmer: farmerId, order: 'pending' });
};

requestSchema.statics.findAcceptedByBuyer = function(buyerId) {
    return this.find({ buyer: buyerId, order: 'accepted' })
        .populate('farmer')
        .sort({ createdAt: -1 });
};

requestSchema.statics.findAcceptedByFarmer = function(farmerId) {
    return this.find({ farmer: farmerId, order: 'accepted' })
        .populate('buyer')
        .sort({ createdAt: -1 });
};

requestSchema.statics.deletePendingByFarmer = function(farmerId) {
    return this.deleteMany({ farmer: farmerId, order: 'pending' });
};

requestSchema.statics.getTotalRequests = function() {
    return this.countDocuments();
};

requestSchema.statics.getPendingRequests = function() {
    return this.countDocuments({ order: 'pending' });
};

requestSchema.statics.getAcceptedRequests = function() {
    return this.countDocuments({ order: 'accepted' });
};

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;