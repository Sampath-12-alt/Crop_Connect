// ==========================================
// Authentication Routes
// ==========================================

const express = require('express');
const passport = require('passport');
const { AuthController } = require('../controllers');
const { validateUser, redirectPath } = require('../middleware/index');

const router = express.Router();

// ==========================================
// FARMER AUTH ROUTES
// ==========================================

// Farmer login page
router.get('/loginfarmer', AuthController.getFarmerLogin);

// Farmer signup page
router.get('/signupfarmer', AuthController.getFarmerSignup);

// Farmer registration
router.post('/signupfarmer', validateUser, AuthController.postFarmerSignup);

// Farmer login
router.post('/loginfarmer',
    redirectPath,
    passport.authenticate('farmer-local', {
        failureRedirect: '/users/signupfarmer',
        failureFlash: true
    }),
    AuthController.postFarmerLogin
);

// Farmer logout
router.get('/logoutfarmer', AuthController.farmerLogout);

// ==========================================
// BUYER AUTH ROUTES
// ==========================================

// Buyer login page
router.get('/loginbuyer', AuthController.getBuyerLogin);

// Buyer signup page
router.get('/signupbuyer', AuthController.getBuyerSignup);

// Buyer registration
router.post('/signupbuyer', validateUser, AuthController.postBuyerSignup);

// Buyer login
router.post('/loginbuyer',
    redirectPath,
    passport.authenticate('buyer-local', {
        failureRedirect: '/users/signupbuyer',
        failureFlash: true
    }),
    AuthController.postBuyerLogin
);

// Buyer logout
router.get('/logoutbuyer', AuthController.buyerLogout);

module.exports = router;