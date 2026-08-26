// ==========================================
// Map Service
// ==========================================

/**
 * Map Service Class for handling Mapbox operations
 */
class MapService {
    /**
     * Initialize Mapbox geocoding client
     * @param {Object} mbxGeocoding - Mapbox geocoding module
     * @param {string} accessToken - Mapbox access token
     * @returns {Object} Geocoding client
     */
    static initializeClient(mbxGeocoding, accessToken) {
        return mbxGeocoding({ accessToken });
    }

    /**
     * Get coordinates for a location
     * @param {Object} geocodingClient - Mapbox geocoding client
     * @param {string} location - Location string
     * @returns {Promise<Object>} Coordinates object
     */
    static async getCoordinates(geocodingClient, location) {
        try {
            const response = await geocodingClient
                .forwardGeocode({
                    query: location,
                    limit: 1
                })
                .send();

            if (!response.body.features || response.body.features.length === 0) {
                throw new Error('Location not found');
            }

            return response.body.features[0].geometry;
        } catch (error) {
            throw new Error(`Failed to get coordinates: ${error.message}`);
        }
    }

    /**
     * Get coordinates for multiple locations
     * @param {Object} geocodingClient - Mapbox geocoding client
     * @param {Array<string>} locations - Array of location strings
     * @returns {Promise<Array>} Array of coordinate objects
     */
    static async getMultipleCoordinates(geocodingClient, locations) {
        try {
            const promises = locations.map(location =>
                this.getCoordinates(geocodingClient, location)
            );

            return await Promise.all(promises);
        } catch (error) {
            throw new Error(`Failed to get multiple coordinates: ${error.message}`);
        }
    }

    /**
     * Calculate distance between two coordinates (simplified)
     * @param {Array<number>} coord1 - [longitude, latitude]
     * @param {Array<number>} coord2 - [longitude, latitude]
     * @returns {number} Distance in kilometers (approximate)
     */
    static calculateDistance(coord1, coord2) {
        const [lon1, lat1] = coord1;
        const [lon2, lat2] = coord2;

        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return Math.round(distance * 100) / 100; // Round to 2 decimal places
    }

    /**
     * Get map data for request (farmer and buyer locations)
     * @param {Object} geocodingClient - Mapbox geocoding client
     * @param {string} farmerLocation - Farmer's location
     * @param {string} buyerLocation - Buyer's location
     * @returns {Promise<Object>} Map data with coordinates
     */
    static async getRequestMapData(geocodingClient, farmerLocation, buyerLocation) {
        try {
            const [farmerCoords, buyerCoords] = await Promise.all([
                this.getCoordinates(geocodingClient, farmerLocation),
                this.getCoordinates(geocodingClient, buyerLocation)
            ]);

            const distance = this.calculateDistance(
                farmerCoords.coordinates,
                buyerCoords.coordinates
            );

            return {
                farmerCoordinates: farmerCoords,
                buyerCoordinates: buyerCoords,
                distance
            };
        } catch (error) {
            throw new Error(`Failed to get map data: ${error.message}`);
        }
    }

    /**
     * Get nearby buyers for a farmer's location
     * @param {Object} geocodingClient - Mapbox geocoding client
     * @param {string} farmerLocation - Farmer's location
     * @param {number} radius - Search radius in meters
     * @returns {Promise<Array>} Array of nearby buyer coordinates
     */
    static async getNearbyBuyers(geocodingClient, farmerLocation, radius = 50000) {
        try {
            const farmerCoords = await this.getCoordinates(geocodingClient, farmerLocation);

            // This would typically query the database for buyers within radius
            // For now, return the farmer coordinates as center point
            return {
                center: farmerCoords,
                radius
            };
        } catch (error) {
            throw new Error(`Failed to get nearby buyers: ${error.message}`);
        }
    }
}

module.exports = MapService;