// ==========================================
// Authentication Service
// ==========================================

const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');

/**
 * Auth Service Class
 */
class AuthService {
    /**
     * Register a new farmer
     * @param {Object} farmerData - Farmer registration data
     * @returns {Promise<Object>} Registered farmer
     */
    static async registerFarmer(farmerData) {
        try {
            const { username, password, email, location } = farmerData;

            const farmer = new Farmer({
                username,
                email,
                location
            });

            const registeredFarmer = await Farmer.register(farmer, password);
            return registeredFarmer;
        } catch (error) {
            throw new Error(`Farmer registration failed: ${error.message}`);
        }
    }

    /**
     * Register a new buyer
     * @param {Object} buyerData - Buyer registration data
     * @param {Object} geocodingClient - Mapbox geocoding client
     * @returns {Promise<Object>} Registered buyer
     */
    static async registerBuyer(buyerData, geocodingClient) {
        try {
            const { username, password, email, location } = buyerData;

            // Get coordinates for location
            const response = await geocodingClient
                .forwardGeocode({
                    query: location,
                    limit: 1
                })
                .send();

            const buyer = new Buyer({
                username,
                email,
                location,
                geometry: response.body.features[0].geometry
            });

            const registeredBuyer = await Buyer.register(buyer, password);
            return registeredBuyer;
        } catch (error) {
            throw new Error(`Buyer registration failed: ${error.message}`);
        }
    }

    /**
     * Authenticate user login
     * @param {string} strategy - Passport strategy name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} Authenticated user
     */
    static authenticate(strategy, req, res) {
        return new Promise((resolve, reject) => {
            passport.authenticate(strategy, (err, user, info) => {
                if (err) {
                    return reject(err);
                }
                if (!user) {
                    return reject(new Error(info.message || 'Authentication failed'));
                }
                resolve(user);
            })(req, res);
        });
    }

    /**
     * Logout user
     * @param {Object} req - Express request object
     * @returns {Promise<void>}
     */
    static logout(req) {
        return new Promise((resolve, reject) => {
            req.logout((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = AuthService;