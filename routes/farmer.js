// ==========================================
// Farmer Routes
// ==========================================

const express = require('express');
const { FarmerController } = require('../controllers');
const { isFarmer, validateInventory } = require('../middleware/index');

const router = express.Router();

// ==========================================
// FARMER DASHBOARD ROUTES
// ==========================================

// Farmer dashboard
router.get('/farmers', isFarmer, FarmerController.getDashboard);

// ==========================================
// INVENTORY MANAGEMENT ROUTES
// ==========================================

// Add inventory page
router.get('/addInventory', isFarmer, FarmerController.getAddInventory);

// Add inventory
router.post('/addInventory', validateInventory, isFarmer, FarmerController.postAddInventory);

// Update inventory page
router.get('/update', isFarmer, FarmerController.getUpdateInventory);

// Update specific crop
router.patch('/update/:crop', isFarmer, FarmerController.patchUpdateCrop);

// Delete specific crop
router.get('/delete/:crop', isFarmer, FarmerController.getDeleteCrop);

// ==========================================
// ORDER MANAGEMENT ROUTES
// ==========================================

// Farmer orders
router.get('/farmer', isFarmer, FarmerController.getOrders);

module.exports = router;