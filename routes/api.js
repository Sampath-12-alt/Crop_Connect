// ==========================================
// API Routes
// ==========================================

const express = require('express');
const { RequestService, MapService } = require('../services');
const { isLoggedIn } = require('../middleware/index');

const router = express.Router();

// ==========================================
// REQUEST API ROUTES
// ==========================================

// Get request details (JSON response)
router.get('/request/:id', isLoggedIn, async (req, res) => {
    try {
        const request = await RequestService.getRequestById(req.params.id);
        res.json({
            success: true,
            request: {
                id: request._id,
                farmer: {
                    id: request.farmer._id,
                    username: request.farmer.username,
                    location: request.farmer.location
                },
                buyer: {
                    id: request.buyer._id,
                    username: request.buyer.username,
                    location: request.buyer.location
                },
                order: request.order,
                inventorySent: request.inventorySent,
                inventoryAccepted: request.inventoryAccepted,
                totalAmount: request.totalAmount,
                createdAt: request.createdAt
            }
        });
    } catch (error) {
        console.error('API request error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==========================================
// STATISTICS API ROUTES
// ==========================================

// Get platform statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await RequestService.getRequestStats();
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('API stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==========================================
// MAP API ROUTES
// ==========================================

// Get coordinates for location
router.get('/coordinates', async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).json({
                success: false,
                message: 'Location parameter is required'
            });
        }

        const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
        const geocodingClient = MapService.initializeClient(mbxGeocoding, process.env.MAP_TOKEN);
        const coordinates = await MapService.getCoordinates(geocodingClient, location);

        res.json({
            success: true,
            coordinates
        });
    } catch (error) {
        console.error('API coordinates error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;