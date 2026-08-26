// ==========================================
// Base User Model
// ==========================================

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

/**
 * Base User Schema
 * Extended by Farmer and Buyer models
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

// Update timestamp on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Instance methods
userSchema.methods.getFullName = function() {
    return this.username || this.email;
};

userSchema.methods.isFarmer = function() {
    return this.constructor.modelName === 'Farmer';
};

userSchema.methods.isBuyer = function() {
    return this.constructor.modelName === 'Buyer';
};

module.exports = userSchema;