// ==========================================
// Farmer Controller
// ==========================================

const { InventoryService, RequestService } = require('../services');

/**
 * Farmer Controller Class
 */
class FarmerController {
    /**
     * Render farmer dashboard
     */
    static async getDashboard(req, res) {
        try {
            const farmerId = req.user._id;
            const dashboardData = await req.user.getDashboardData();

            res.render('pages/listings/farmers', {
                available: dashboardData.available,
                sold: dashboardData.sold,
                hasPending: dashboardData.hasPending
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            req.flash('error', error.message);
            res.redirect('/');
        }
    }

    /**
     * Render add inventory page
     */
    static getAddInventory(req, res) {
        res.render('pages/listings/addInventory');
    }

    /**
     * Handle add inventory
     */
    static async postAddInventory(req, res) {
        try {
            const farmerId = req.user._id;
            const { crop, price, quantity } = req.body;

            if (!crop || !price || !quantity) {
                req.flash('error', 'All fields are required.');
                return res.redirect('/listings/addInventory');
            }

            await InventoryService.addCrop(farmerId, { crop, price, quantity });
            res.redirect('/listings/farmers');
        } catch (error) {
            console.error('Add inventory error:', error);
            req.flash('error', 'Something went wrong while adding inventory.');
            res.redirect('/');
        }
    }

    /**
     * Render update inventory page
     */
    static async getUpdateInventory(req, res) {
        try {
            const farmerId = req.user._id;
            const available = await InventoryService.getAvailableInventory(farmerId);
            res.render('pages/listings/update', { available });
        } catch (error) {
            console.error('Update inventory page error:', error);
            req.flash('error', error.message);
            res.redirect('/listings/farmers');
        }
    }

    /**
     * Handle update specific crop
     */
    static async patchUpdateCrop(req, res) {
        try {
            const farmerId = req.user._id;
            const { crop } = req.params;
            const { quantity, price } = req.body;

            await InventoryService.updateCrop(farmerId, crop, { quantity, price });
            res.redirect('/listings/farmers');
        } catch (error) {
            console.error('Update crop error:', error);
            req.flash('error', 'Something went wrong while updating inventory.');
            res.redirect('/listings/farmers');
        }
    }

    /**
     * Handle delete crop
     */
    static async getDeleteCrop(req, res) {
        try {
            const farmerId = req.user._id;
            const { crop } = req.params;

            await InventoryService.removeCrop(farmerId, crop);
            res.redirect('/listings/farmers');
        } catch (error) {
            console.error('Delete crop error:', error);
            req.flash('error', 'Something went wrong while deleting inventory.');
            res.redirect('/listings/farmers');
        }
    }

    /**
     * Render farmer orders page
     */
    static async getOrders(req, res) {
        try {
            const farmerId = req.user._id;
            const orders = await RequestService.getFarmerOrders(farmerId);
            const farmername = req.user.username;

            res.render('pages/listings/farmerorders', { orders, farmername });
        } catch (error) {
            console.error('Farmer orders error:', error);
            req.flash('error', error.message);
            res.redirect('/');
        }
    }
}

module.exports = FarmerController;