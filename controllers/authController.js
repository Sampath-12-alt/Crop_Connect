// ==========================================
// Authentication Controller
// ==========================================

const { AuthService, MapService } = require('../services');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = MapService.initializeClient(mbxGeocoding, process.env.MAP_TOKEN);

/**
 * Auth Controller Class
 */
class AuthController {
    /**
     * Render farmer login page
     */
    static getFarmerLogin(req, res) {
        res.render('pages/users/loginfarmer');
    }

    /**
     * Render farmer signup page
     */
    static getFarmerSignup(req, res) {
        res.render('pages/users/signupfarmer');
    }

    /**
     * Handle farmer registration
     */
    static async postFarmerSignup(req, res) {
        try {
            const farmer = await AuthService.registerFarmer(req.body);

            req.login(farmer, (err) => {
                if (err) {
                    console.error('Login error after registration:', err);
                    req.flash('error', 'Registration successful but login failed');
                    return res.redirect('/users/loginfarmer');
                }
                req.flash('success', 'Welcome to Farmers Dashboard');
                res.redirect('/listings/farmers');
            });
        } catch (error) {
            console.error('Farmer registration error:', error);
            req.flash('error', error.message);
            res.redirect('/users/signupfarmer');
        }
    }

    /**
     * Handle farmer login
     */
    static postFarmerLogin(req, res) {
        req.flash('success', 'Welcome to Farmers Dashboard');
        const redirectPath = res.locals.redirect || '/listings/farmers';
        res.redirect(redirectPath);
    }

    /**
     * Render buyer login page
     */
    static getBuyerLogin(req, res) {
        res.render('pages/users/loginbuyer');
    }

    /**
     * Render buyer signup page
     */
    static getBuyerSignup(req, res) {
        res.render('pages/users/signupbuyer');
    }

    /**
     * Handle buyer registration
     */
    static async postBuyerSignup(req, res) {
        try {
            const buyer = await AuthService.registerBuyer(req.body, geocodingClient);

            req.login(buyer, (err) => {
                if (err) {
                    console.error('Login error after registration:', err);
                    req.flash('error', 'Registration successful but login failed');
                    return res.redirect('/users/loginbuyer');
                }
                req.flash('success', 'Welcome to Buyers Dashboard');
                res.redirect('/listings/buyer');
            });
        } catch (error) {
            console.error('Buyer registration error:', error);
            req.flash('error', error.message);
            res.redirect('/users/signupbuyer');
        }
    }

    /**
     * Handle buyer login
     */
    static postBuyerLogin(req, res) {
        req.flash('success', 'Welcome to Buyers Dashboard');
        const redirectPath = res.locals.redirect || '/listings/buyer';
        res.redirect(redirectPath);
    }

    /**
     * Handle farmer logout
     */
    static farmerLogout(req, res, next) {
        AuthService.logout(req)
            .then(() => {
                req.flash('success', 'Logged out successfully');
                res.redirect('/');
            })
            .catch((err) => {
                console.error('Logout error:', err);
                next(err);
            });
    }

    /**
     * Handle buyer logout
     */
    static buyerLogout(req, res, next) {
        AuthService.logout(req)
            .then(() => {
                req.flash('success', 'Logged out successfully');
                res.redirect('/');
            })
            .catch((err) => {
                console.error('Logout error:', err);
                next(err);
            });
    }
}

module.exports = AuthController;