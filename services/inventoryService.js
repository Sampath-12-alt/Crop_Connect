// ==========================================
// Inventory Service
// ==========================================

const { AvailableInventory, SoldInventory } = require('../models/Inventory');
const Request = require('../models/Request');

/**
 * Inventory Service Class
 */
class InventoryService {
    /**
     * Add crop to farmer's available inventory
     * @param {string} farmerId - Farmer ID
     * @param {Object} cropData - Crop data (crop, quantity, price)
     * @returns {Promise<Object>} Updated inventory
     */
    static async addCrop(farmerId, cropData) {
        try {
            const { crop, quantity, price } = cropData;

            let inventory = await AvailableInventory.findOne({ farmer: farmerId });

            if (!inventory) {
                inventory = new AvailableInventory({
                    farmer: farmerId,
                    inventory: [{ crop: crop.toLowerCase(), quantity: Number(quantity), price: Number(price) }]
                });
            } else {
                await inventory.addCrop(crop, quantity, price);
            }

            return inventory;
        } catch (error) {
            throw new Error(`Failed to add crop: ${error.message}`);
        }
    }

    /**
     * Update crop in farmer's inventory
     * @param {string} farmerId - Farmer ID
     * @param {string} crop - Crop name
     * @param {Object} updateData - Update data (quantity, price)
     * @returns {Promise<Object>} Updated inventory
     */
    static async updateCrop(farmerId, crop, updateData) {
        try {
            const { quantity, price } = updateData;

            const inventory = await AvailableInventory.findOne({ farmer: farmerId });
            if (!inventory) {
                throw new Error('Inventory not found');
            }

            await inventory.updateCrop(crop, quantity, price);
            return inventory;
        } catch (error) {
            throw new Error(`Failed to update crop: ${error.message}`);
        }
    }

    /**
     * Remove crop from farmer's inventory
     * @param {string} farmerId - Farmer ID
     * @param {string} crop - Crop name
     * @returns {Promise<Object>} Updated inventory
     */
    static async removeCrop(farmerId, crop) {
        try {
            const inventory = await AvailableInventory.findOne({ farmer: farmerId });
            if (!inventory) {
                throw new Error('Inventory not found');
            }

            await inventory.removeCrop(crop);
            return inventory;
        } catch (error) {
            throw new Error(`Failed to remove crop: ${error.message}`);
        }
    }

    /**
     * Get farmer's available inventory
     * @param {string} farmerId - Farmer ID
     * @returns {Promise<Object>} Available inventory
     */
    static async getAvailableInventory(farmerId) {
        try {
            const inventory = await AvailableInventory.findOne({ farmer: farmerId });
            return inventory || { inventory: [] };
        } catch (error) {
            throw new Error(`Failed to get available inventory: ${error.message}`);
        }
    }

    /**
     * Get farmer's sold inventory
     * @param {string} farmerId - Farmer ID
     * @returns {Promise<Object>} Sold inventory
     */
    static async getSoldInventory(farmerId) {
        try {
            const inventory = await SoldInventory.findOne({ farmer: farmerId });
            return inventory || { inventory: [] };
        } catch (error) {
            throw new Error(`Failed to get sold inventory: ${error.message}`);
        }
    }

    /**
     * Process accepted order - move items from available to sold inventory
     * @param {string} farmerId - Farmer ID
     * @param {Array} acceptedItems - Accepted inventory items
     * @returns {Promise<void>}
     */
    static async processAcceptedOrder(farmerId, acceptedItems) {
        try {
            // Add to sold inventory
            let soldInventory = await SoldInventory.findOne({ farmer: farmerId });
            if (!soldInventory) {
                soldInventory = new SoldInventory({
                    farmer: farmerId,
                    inventory: [...acceptedItems]
                });
            } else {
                await soldInventory.addSoldItems(acceptedItems);
            }

            // Remove from available inventory
            const availableInventory = await AvailableInventory.findOne({ farmer: farmerId });
            if (availableInventory) {
                for (const item of acceptedItems) {
                    const existingItem = availableInventory.inventory.find(inv =>
                        inv.crop === item.crop && inv.price === item.price
                    );

                    if (existingItem) {
                        existingItem.quantity -= item.quantity;

                        // Remove item if quantity becomes 0
                        if (existingItem.quantity <= 0) {
                            availableInventory.inventory = availableInventory.inventory.filter(inv =>
                                !(inv.crop === item.crop && inv.price === item.price)
                            );
                        }
                    }
                }
                await availableInventory.save();
            }
        } catch (error) {
            throw new Error(`Failed to process accepted order: ${error.message}`);
        }
    }

    /**
     * Get inventory statistics for farmer
     * @param {string} farmerId - Farmer ID
     * @returns {Promise<Object>} Inventory statistics
     */
    static async getInventoryStats(farmerId) {
        try {
            const [available, sold] = await Promise.all([
                this.getAvailableInventory(farmerId),
                this.getSoldInventory(farmerId)
            ]);

            const totalAvailableValue = available.inventory.reduce(
                (total, item) => total + (item.quantity * item.price), 0
            );

            const totalSoldValue = sold.inventory.reduce(
                (total, item) => total + (item.quantity * item.price), 0
            );

            return {
                availableItems: available.inventory.length,
                totalAvailableValue,
                soldItems: sold.inventory.length,
                totalSoldValue,
                totalRevenue: totalSoldValue
            };
        } catch (error) {
            throw new Error(`Failed to get inventory stats: ${error.message}`);
        }
    }
}

module.exports = InventoryService;