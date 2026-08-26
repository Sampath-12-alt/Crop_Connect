// ==========================================
// CropConnect - Main Application Entry Point
// ==========================================

// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// ==========================================
// IMPORTS
// ==========================================

const express = require("express");
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

// Import configurations
const { connectDB, configurePassport } = require('./config');
const { configureViews, setupViewHelpers } = require('./views');

// Import routes
const routes = require('./routes');

// Import middleware
const { isLoggedIn } = require('./middleware/index');

// ==========================================
// APP INITIALIZATION
// ==========================================

const app = express();

// ==========================================
// DATABASE CONNECTION
// ==========================================

const startServer = async () => {
    await connectDB(process.env.ATLASDB_URL);

    // ==========================================
    // VIEW ENGINE CONFIGURATION
    // ==========================================

    configureViews(app);

    // Set views directory explicitly
    app.set('views', path.join(__dirname, 'views'));

    // ==========================================
    // MIDDLEWARE SETUP
    // ==========================================

    // Body parsing
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Method override for PUT/PATCH/DELETE
    app.use(methodOverride('_method'));

    // Static files
    app.use(express.static(path.join(__dirname, "public")));

    // Session configuration
    const store = MongoStore.create({
        mongoUrl: process.env.ATLASDB_URL,
        crypto: {
            secret: process.env.SECRET || "devFallbackSecret"
        },
        touchAfter: 24 * 3600,
    });

    const sessionConfig = {
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        }
    };

    app.use(session(sessionConfig));
    app.use(flash());

    // Passport configuration
    configurePassport();

    // View helpers and locals
    setupViewHelpers(app);

    // ==========================================
    // ROUTES
    // ==========================================

    app.use('/', routes);

    // ==========================================
    // ERROR HANDLING
    // ==========================================

    app.use((req, res) => {
        res.status(404).render('pages/404', {
            title: 'Page Not Found',
            message: 'The page you are looking for does not exist.'
        });
    });

    app.use((err, req, res, next) => {
        console.error('Global error:', err);

        const statusCode = err.statusCode || 500;
        const message = err.message || 'Something went wrong!';

        res.status(statusCode).render('pages/error', {
            title: 'Error',
            message,
            statusCode,
            stack: process.env.NODE_ENV === 'development' ? err.stack : ''
        });
    });

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
        console.log(`🚀 CropConnect server is running on port ${PORT}`);
        console.log(`🌐 Visit: http://localhost:${PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});

// Export for testing
module.exports = app;

