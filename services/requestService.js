// ==========================================
// Request Service
// ==========================================

const Request = require('../models/Request');
const InventoryService = require('./inventoryService');

/**
 * Request Service Class
 */
class RequestService {
    /**
     * Create a new request from farmer to buyer
     * @param {string} farmerId - Farmer ID
     * @param {string} buyerId - Buyer ID
     * @returns {Promise<Object>} Created request
     */
    static async createRequest(farmerId, buyerId) {
        try {
            // Check if pending request already exists
            const existingRequest = await Request.findOne({
                farmer: farmerId,
                buyer: buyerId,
                order: 'pending'
            });

            if (existingRequest) {
                throw new Error('You already have a pending request with this buyer');
            }

            // Get farmer's available inventory
            const inventory = await InventoryService.getAvailableInventory(farmerId);
            if (!inventory.inventory || inventory.inventory.length === 0) {
                throw new Error('No inventory found');
            }

            const inventorySent = inventory.inventory.map(crop => ({
                crop: crop.crop,
                quantity: crop.quantity,
                price: crop.price
            }));

            const request = new Request({
                farmer: farmerId,
                buyer: buyerId,
                inventorySent
            });

            await request.save();
            return request;
        } catch (error) {
            throw new Error(`Failed to create request: ${error.message}`);
        }
    }

    /**
     * Accept a request with selected items
     * @param {string} requestId - Request ID
     * @param {Array} acceptedItems - Items accepted by buyer
     * @returns {Promise<Object>} Updated request
     */
    static async acceptRequest(requestId, acceptedItems) {
        try {
            const request = await Request.findById(requestId).populate('farmer');
            if (!request) {
                throw new Error('Request not found');
            }

            if (request.order !== 'pending') {
                throw new Error('Request is not pending');
            }

            // Validate accepted items
            const hasValidItems = acceptedItems.some(item => item.quantity > 0);
            if (!hasValidItems) {
                throw new Error('At least one product must be selected');
            }

            // Process the accepted order
            await InventoryService.processAcceptedOrder(request.farmer._id, acceptedItems);

            // Update request
            request.inventoryAccepted = acceptedItems;
            request.order = 'accepted';
            await request.save();

            // Delete all other pending requests from this farmer
            await Request.deleteMany({
                farmer: request.farmer._id,
                order: 'pending',
                _id: { $ne: requestId }
            });

            return request;
        } catch (error) {
            throw new Error(`Failed to accept request: ${error.message}`);
        }
    }

    /**
     * Get requests for buyer
     * @param {string} buyerId - Buyer ID
     * @returns {Promise<Array>} Buyer's requests
     */
    static async getBuyerRequests(buyerId) {
        try {
            const requests = await Request.find({ buyer: buyerId })
                .populate('farmer')
                .sort({ createdAt: -1 });

            return requests;
        } catch (error) {
            throw new Error(`Failed to get buyer requests: ${error.message}`);
        }
    }

    /**
     * Get accepted orders for buyer
     * @param {string} buyerId - Buyer ID
     * @returns {Promise<Array>} Buyer's accepted orders
     */
    static async getBuyerOrders(buyerId) {
        try {
            const orders = await Request.find({
                buyer: buyerId,
                order: 'accepted'
            })
            .populate('farmer')
            .sort({ createdAt: -1 });

            return orders;
        } catch (error) {
            throw new Error(`Failed to get buyer orders: ${error.message}`);
        }
    }

    /**
     * Get accepted orders for farmer
     * @param {string} farmerId - Farmer ID
     * @returns {Promise<Array>} Farmer's accepted orders
     */
    static async getFarmerOrders(farmerId) {
        try {
            const orders = await Request.find({
                farmer: farmerId,
                order: 'accepted'
            })
            .populate('buyer')
            .sort({ createdAt: -1 });

            return orders;
        } catch (error) {
            throw new Error(`Failed to get farmer orders: ${error.message}`);
        }
    }

    /**
     * Get pending requests for farmer
     * @param {string} farmerId - Farmer ID
     * @returns {Promise<Array>} Farmer's pending requests
     */
    static async getPendingRequests(farmerId) {
        try {
            const requests = await Request.find({
                farmer: farmerId,
                order: 'pending'
            });

            return requests;
        } catch (error) {
            throw new Error(`Failed to get pending requests: ${error.message}`);
        }
    }

    /**
     * Get request by ID with populated references
     * @param {string} requestId - Request ID
     * @returns {Promise<Object>} Request with populated data
     */
    static async getRequestById(requestId) {
        try {
            const request = await Request.findById(requestId)
                .populate('farmer')
                .populate('buyer');

            if (!request) {
                throw new Error('Request not found');
            }

            return request;
        } catch (error) {
            throw new Error(`Failed to get request: ${error.message}`);
        }
    }

    /**
     * Delete all pending requests for farmer
     * @param {string} farmerId - Farmer ID
     * @returns {Promise<Object>} Deletion result
     */
    static async deleteAllPendingRequests(farmerId) {
        try {
            const result = await Request.deleteMany({
                farmer: farmerId,
                order: 'pending'
            });

            return result;
        } catch (error) {
            throw new Error(`Failed to delete pending requests: ${error.message}`);
        }
    }

    /**
     * Get request statistics
     * @returns {Promise<Object>} Request statistics
     */
    static async getRequestStats() {
        try {
            const [total, pending, accepted] = await Promise.all([
                Request.countDocuments(),
                Request.countDocuments({ order: 'pending' }),
                Request.countDocuments({ order: 'accepted' })
            ]);

            return {
                totalRequests: total,
                pendingRequests: pending,
                acceptedRequests: accepted,
                completionRate: total > 0 ? (accepted / total * 100).toFixed(2) : 0
            };
        } catch (error) {
            throw new Error(`Failed to get request stats: ${error.message}`);
        }
    }
}

module.exports = RequestService;