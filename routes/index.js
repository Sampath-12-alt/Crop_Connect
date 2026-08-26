// ==========================================
// Routes Index
// ==========================================

const express = require('express');
const authRoutes = require('./auth');
const farmerRoutes = require('./farmer');
const buyerRoutes = require('./buyer');
const apiRoutes = require('./api');

const router = express.Router();

// Mount routes
router.use('/users', authRoutes);
router.use('/listings', farmerRoutes);
router.use('/listings', buyerRoutes);
router.use('/api', apiRoutes);

// Home route
router.get('/', (req, res) => {
    res.render('pages/home');
});

module.exports = router;