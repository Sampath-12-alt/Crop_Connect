
/**
 * Middleware to check if user is authenticated
 * Redirects to home page with error flash if not logged in
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first!");
        return res.redirect("/");
    }
    next();
};



/**
 * Middleware to check if authenticated user is a farmer
 * Access denied for non-farmers
 */
module.exports.isFarmer = (req, res, next) => {
    if (req.user && req.user.constructor.modelName === "FarmerLogin") {
        return next();
    }
    req.flash("error", "Access denied.");
    res.redirect("/");
};



/**
 * Middleware to handle redirect path storage in session
 * Makes redirect path available in response locals
 */
module.exports.redirectPath = (req, res, next) => {
    if (req.session.redirectpath) {
        res.locals.redirect = req.session.redirectpath;
    }
    next();
};
