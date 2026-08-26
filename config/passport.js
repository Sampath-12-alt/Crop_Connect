// ==========================================
// Passport Configuration
// ==========================================

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');

/**
 * Configure Passport strategies
 */
const configurePassport = () => {
    // Farmer Local Strategy
    passport.use('farmer-local', new LocalStrategy(Farmer.authenticate()));

    // Buyer Local Strategy
    passport.use('buyer-local', new LocalStrategy(Buyer.authenticate()));

    // Serialize user for session
    passport.serializeUser(function (user, done) {
        done(null, {
            id: user.id,
            type: user.constructor.modelName
        });
    });

    // Deserialize user from session
    passport.deserializeUser(async function (obj, done) {
        try {
            const Model = obj.type === "Farmer" ? Farmer : Buyer;
            const user = await Model.findById(obj.id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

module.exports = {
    configurePassport
};