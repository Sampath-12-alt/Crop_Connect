// ==========================================
// Admin Controller
// ==========================================

const { Farmer, Buyer } = require('../models');
const { RequestService } = require('../services');

/**
 * Admin Controller Class
 * TODO: Implement admin authentication and authorization
 */
class AdminController {
    /**
     * Render admin dashboard
     */
    static async getDashboard(req, res) {
        try {
            // Get platform statistics
            const [totalFarmers, totalBuyers, requestStats] = await Promise.all([
                Farmer.countDocuments(),
                Buyer.countDocuments(),
                RequestService.getRequestStats()
            ]);

            const stats = {
                totalFarmers,
                totalBuyers,
                totalUsers: totalFarmers + totalBuyers,
                ...requestStats
            };

            res.render('admin/dashboard', { stats });
        } catch (error) {
            console.error('Admin dashboard error:', error);
            req.flash('error', 'Failed to load admin dashboard');
            res.redirect('/');
        }
    }

    /**
     * Get all users
     */
    static async getUsers(req, res) {
        try {
            const [farmers, buyers] = await Promise.all([
                Farmer.find({}).select('username email location createdAt'),
                Buyer.find({}).select('username email location createdAt')
            ]);

            res.render('admin/users', { farmers, buyers });
        } catch (error) {
            console.error('Get users error:', error);
            req.flash('error', 'Failed to load users');
            res.redirect('/admin');
        }
    }

    /**
     * Get all requests
     */
    static async getRequests(req, res) {
        try {
            const requests = await Request.find({})
                .populate('farmer', 'username email')
                .populate('buyer', 'username email')
                .sort({ createdAt: -1 });

            res.render('admin/requests', { requests });
        } catch (error) {
            console.error('Get requests error:', error);
            req.flash('error', 'Failed to load requests');
            res.redirect('/admin');
        }
    }

    /**
     * Delete user (admin action)
     */
    static async deleteUser(req, res) {
        try {
            const { id, type } = req.params;

            const Model = type === 'farmer' ? Farmer : Buyer;
            await Model.findByIdAndDelete(id);

            req.flash('success', `${type} deleted successfully`);
            res.redirect('/admin/users');
        } catch (error) {
            console.error('Delete user error:', error);
            req.flash('error', 'Failed to delete user');
            res.redirect('/admin/users');
        }
    }

    /**
     * Get platform analytics
     */
    static async getAnalytics(req, res) {
        try {
            // This would include more detailed analytics
            const analytics = {
                // TODO: Implement detailed analytics
                message: 'Analytics feature coming soon'
            };

            res.render('admin/analytics', { analytics });
        } catch (error) {
            console.error('Analytics error:', error);
            req.flash('error', 'Failed to load analytics');
            res.redirect('/admin');
        }
    }
}

module.exports = AdminController;