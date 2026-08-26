// ==========================================
// Buyer Routes
// ==========================================

const express = require('express');
const { BuyerController } = require('../controllers');
const { isLoggedIn } = require('../middleware/index');

const router = express.Router();

// ==========================================
// BUYER DASHBOARD ROUTES
// ==========================================

// Buyer dashboard
router.get('/buyer', isLoggedIn, BuyerController.getDashboard);

// ==========================================
// ORDER MANAGEMENT ROUTES
// ==========================================

// Browse orders (farmers)
router.get('/Orders', isLoggedIn, BuyerController.getOrders);

// Send request to farmer
router.post('/request/send', isLoggedIn, BuyerController.postSendRequest);

// Accept inventory request
router.post('/accept-inventory/:id', isLoggedIn, BuyerController.postAcceptInventory);

// Buyer order history
router.get('/dashboard/buyer', isLoggedIn, BuyerController.getOrderHistory);

// View specific request
router.get('/request/view/:id', isLoggedIn, BuyerController.getRequestView);

// Delete all pending requests
router.get('/requests/deleteall', isLoggedIn, BuyerController.getDeleteAllRequests);

// View request map
router.get('/request/map/:id', isLoggedIn, BuyerController.getRequestMap);

module.exports = router;