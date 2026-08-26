// ==========================================
// Views Configuration
// ==========================================

const path = require('path');

/**
 * View engine configuration
 * @param {Object} app - Express app instance
 */
const configureViews = (app) => {
    // Set view engine
    app.set('view engine', 'ejs');

    // Set views directory (parent directory of this file)
    app.set('views', path.join(__dirname));

    // Configure EJS
    app.engine('ejs', require('ejs-mate'));
};

/**
 * View helpers and locals
 * @param {Object} app - Express app instance
 */
const setupViewHelpers = (app) => {
    // Add global view helpers
    app.use((req, res, next) => {
        // Flash messages
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');

        // Current user
        res.locals.currentUser = req.user;

        // Helper functions
        res.locals.helpers = {
            formatCurrency: (amount) => `$${amount.toFixed(2)}`,
            formatDate: (date) => new Date(date).toLocaleDateString(),
            truncate: (str, len = 50) => str.length > len ? str.slice(0, len) + '...' : str
        };

        next();
    });
};

module.exports = {
    configureViews,
    setupViewHelpers
};