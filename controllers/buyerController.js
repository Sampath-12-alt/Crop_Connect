// ==========================================
// Buyer Controller
// ==========================================

const { RequestService, MapService } = require('../services');
const Buyer = require('../models/Buyer');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = MapService.initializeClient(mbxGeocoding, process.env.MAP_TOKEN);

/**
 * Buyer Controller Class
 */
class BuyerController {
    /**
     * Render buyer dashboard
     */
    static async getDashboard(req, res) {
        try {
            const buyerId = req.user._id;
            const dashboardData = await req.user.getDashboardData();

            res.render('pages/listings/buyer', dashboardData);
        } catch (error) {
            console.error('Buyer dashboard error:', error);
            req.flash('error', error.message);
            res.redirect('/');
        }
    }

    /**
     * Render orders page (browse farmers)
     */
    static async getOrders(req, res) {
        try {
            const buyerLocation = req.user.location;
            const buyers = await Buyer.find({});

            // Get coordinates for buyer's location
            const coordinate = await MapService.getCoordinates(geocodingClient, buyerLocation);

            res.render('pages/listings/order', { buyerdata: buyers, coordinate });
        } catch (error) {
            console.error('Orders page error:', error);
            req.flash('error', error.message);
            res.redirect('/listings/buyer');
        }
    }

    /**
     * Handle send request to farmer
     */
    static async postSendRequest(req, res) {
        try {
            const farmerId = req.user._id;
            const { buyerId } = req.body;

            if (!req.user || !req.user._id) {
                req.flash('error', 'No user found');
                return res.redirect('/listings/Orders');
            }

            await RequestService.createRequest(farmerId, buyerId);
            req.flash('success', 'Request sent successfully!');
            res.redirect('/listings/Orders');
        } catch (error) {
            console.error('Send request error:', error);
            req.flash('error', error.message);
            res.redirect('/listings/Orders');
        }
    }

    /**
     * Handle accept inventory request
     */
    static async postAcceptInventory(req, res) {
        try {
            const { id } = req.params;
            const { crop, quantity, price } = req.body;

            // Process accepted items
            const acceptedItems = [];
            for (let i = 0; i < crop.length; i++) {
                if (quantity[i] > 0) {
                    acceptedItems.push({
                        crop: crop[i],
                        quantity: Number(quantity[i]),
                        price: Number(price[i])
                    });
                }
            }

            await RequestService.acceptRequest(id, acceptedItems);
            req.flash('success', 'Your Purchase is done Successfully');
            res.redirect('/listings/buyer');
        } catch (error) {
            console.error('Accept inventory error:', error);
            req.flash('error', error.message);
            res.redirect('/listings/buyer');
        }
    }

    /**
     * Render buyer order history
     */
    static async getOrderHistory(req, res) {
        try {
            const buyerId = req.user._id;
            const orders = await RequestService.getBuyerOrders(buyerId);
            const buyername = req.user.username;

            res.render('pages/listings/buyerorder', { orders, buyername });
        } catch (error) {
            console.error('Order history error:', error);
            req.flash('error', error.message);
            res.redirect('/');
        }
    }

    /**
     * Render request view page
     */
    static async getRequestView(req, res) {
        try {
            const { id } = req.params;
            const request = await RequestService.getRequestById(id);

            res.render('pages/listings/requestview', { request });
        } catch (error) {
            console.error('Request view error:', error);
            req.flash('error', error.message);
            res.redirect('/listings/buyer');
        }
    }

    /**
     * Handle delete all pending requests
     */
    static async getDeleteAllRequests(req, res) {
        try {
            const farmerId = req.user._id;
            await RequestService.deleteAllPendingRequests(farmerId);

            req.flash('success', 'Successfully deleted all pending requests');
            res.redirect('/listings/Orders');
        } catch (error) {
            console.error('Delete all requests error:', error);
            req.flash('error', error.message);
            res.redirect('/listings/Orders');
        }
    }

    /**
     * Render request map view
     */
    static async getRequestMap(req, res) {
        try {
            const { id } = req.params;
            const request = await RequestService.getRequestById(id);

            const farmerLocation = request.farmer.location;
            const buyerLocation = request.buyer.location;

            const mapData = await MapService.getRequestMapData(
                geocodingClient,
                farmerLocation,
                buyerLocation
            );

            res.render('pages/listings/viewRequestmap', {
                farmercoordinate: mapData.farmerCoordinates,
                buyercoordinate: mapData.buyerCoordinates
            });
        } catch (error) {
            console.error('Request map error:', error);
            req.flash('error', error.message);
            res.redirect('/listings/buyer');
        }
    }
}

module.exports = BuyerController;