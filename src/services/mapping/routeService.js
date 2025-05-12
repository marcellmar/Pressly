/**
 * Route Service
 * 
 * Provides routing services using OpenStreetMap's OSRM API
 * to calculate real road paths between points and route metrics
 */

// Base URL for the OSRM API (using the demo server)
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1';

/**
 * Calculate a route between two points
 * 
 * @param {Object} start - Starting coordinates { lat, lng }
 * @param {Object} end - Ending coordinates { lat, lng }
 * @param {string} mode - Transportation mode (car, bike, foot)
 * @returns {Promise} - Promise resolving to route data
 */
export const calculateRoute = async (start, end, mode = 'car') => {
  // Validate input
  if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
    throw new Error('Invalid coordinates provided');
  }
  
  try {
    // Determine OSRM profile based on transportation mode
    const profile = getOsrmProfile(mode);
    
    // Format coordinates for OSRM API
    const coordinates = `${start.lng},${start.lat};${end.lng},${end.lat}`;
    
    // Prepare the API URL with query parameters
    const url = `${OSRM_BASE_URL}/${profile}/${coordinates}?overview=full&geometries=geojson&steps=true`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Routing error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if we got valid routes
    if (!data || data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return {
        success: false,
        error: 'No route found between these locations'
      };
    }
    
    // Extract the route data
    const route = data.routes[0];
    
    // Calculate route efficiency metrics
    const efficiency = calculateRouteEfficiency(route, mode);
    
    return {
      success: true,
      route: {
        geometry: route.geometry,
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        steps: route.legs[0].steps,
        efficiency: efficiency
      }
    };
  } catch (error) {
    console.error('Routing error:', error);
    return {
      success: false,
      error: error.message || 'Error calculating route'
    };
  }
};

/**
 * Determine OSRM profile based on transportation mode
 */
const getOsrmProfile = (mode) => {
  switch (mode.toLowerCase()) {
    case 'car':
    case 'driving':
      return 'car';
    case 'bike':
    case 'bicycle':
    case 'cycling':
      return 'bike';
    case 'walk':
    case 'foot':
    case 'walking':
      return 'foot';
    default:
      return 'car';
  }
};

/**
 * Calculate the efficiency of a route based on metrics
 * Returns a score from 0-100 and classification
 */
export const calculateRouteEfficiency = (route, mode) => {
  // If no route is provided, return zero efficiency
  if (!route) {
    return {
      score: 0,
      classification: 'unknown',
      carbonImpact: 0,
      fuelConsumption: 0
    };
  }
  
  const distance = route.distance; // in meters
  const duration = route.duration; // in seconds
  
  // Calculate straight-line (crow flies) distance
  // This would normally use start and end coordinates
  // For demo purposes, we'll estimate based on route distance
  const straightLineDistance = distance * 0.8; // Estimated straight-line distance
  
  // Calculate winding factor (higher means more winding roads)
  const windingFactor = distance / straightLineDistance;
  
  // Calculate average speed in km/h
  const avgSpeedKmh = (distance / 1000) / (duration / 3600);
  
  // Base efficiency calculations on mode of transport
  let baseEfficiency = 0;
  let carbonImpact = 0;
  let fuelConsumption = 0;
  
  switch (mode.toLowerCase()) {
    case 'car':
      // Car efficiency decreases with winding roads and slow speeds
      baseEfficiency = 100 - ((windingFactor - 1) * 50) - Math.max(0, (60 - avgSpeedKmh) * 0.5);
      
      // Calculate carbon impact (g CO2 per km)
      carbonImpact = 120 + (windingFactor - 1) * 30; // Average car: ~120g CO2/km
      
      // Calculate fuel consumption (liters per 100km)
      fuelConsumption = 7 + (windingFactor - 1) * 2; // Average car: ~7L/100km
      break;
      
    case 'bike':
      // Bike efficiency decreases with steep hills (not calculated here)
      // But generally bikes are very efficient
      baseEfficiency = 95 - ((windingFactor - 1) * 20);
      carbonImpact = 0; // No direct carbon emissions
      fuelConsumption = 0; // No fuel consumption
      break;
      
    case 'foot':
      // Walking efficiency mainly depends on distance
      baseEfficiency = 90 - ((distance / 1000) * 5); // Efficiency decreases with distance
      carbonImpact = 0; // No direct carbon emissions
      fuelConsumption = 0; // No fuel consumption
      break;
      
    default:
      baseEfficiency = 70; // Default medium efficiency
      carbonImpact = 100; // Average carbon impact
      fuelConsumption = 6; // Average fuel consumption
  }
  
  // Ensure efficiency is between 0-100
  const efficiencyScore = Math.min(100, Math.max(0, baseEfficiency));
  
  // Classify the efficiency
  let classification;
  if (efficiencyScore >= 80) {
    classification = 'excellent';
  } else if (efficiencyScore >= 60) {
    classification = 'good';
  } else if (efficiencyScore >= 40) {
    classification = 'moderate';
  } else {
    classification = 'poor';
  }
  
  return {
    score: Math.round(efficiencyScore),
    classification,
    carbonImpact: Math.round(carbonImpact * (distance / 1000)), // Total carbon impact in grams
    fuelConsumption: parseFloat((fuelConsumption * (distance / 100000)).toFixed(2)) // Total fuel in liters
  };
};

/**
 * Get multiple routes between a user and various producers
 * 
 * @param {Object} userLocation - User's location coordinates { lat, lng }
 * @param {Array} producers - Array of producer objects with locations
 * @param {string} mode - Transportation mode
 * @returns {Promise} - Promise resolving to array of routes
 */
export const getMultipleRoutes = async (userLocation, producers, mode = 'car') => {
  if (!userLocation || !producers || producers.length === 0) {
    return {
      success: false,
      error: 'Invalid location or producer data'
    };
  }
  
  try {
    // Calculate routes for each producer in parallel
    const routePromises = producers.map(producer => {
      if (!producer.location || !producer.location.lat || !producer.location.lng) {
        return Promise.resolve({
          producerId: producer.id,
          success: false,
          error: 'Invalid producer location'
        });
      }
      
      return calculateRoute(userLocation, producer.location, mode)
        .then(result => ({
          producerId: producer.id,
          producerName: producer.name,
          ...result
        }));
    });
    
    const results = await Promise.all(routePromises);
    
    return {
      success: true,
      routes: results
    };
  } catch (error) {
    console.error('Error calculating multiple routes:', error);
    return {
      success: false,
      error: error.message || 'Error calculating routes'
    };
  }
};

/**
 * Format duration in seconds to a human-readable string
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} minutes`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
};

/**
 * Format distance in meters to a human-readable string
 * 
 * @param {number} meters - Distance in meters
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} meters`;
  } else {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  }
};

/**
 * Calculate carbon savings compared to average delivery
 * 
 * @param {Object} route - Route object with distance and efficiency data
 * @param {string} mode - Transportation mode used
 * @returns {Object} - Carbon savings data
 */
export const calculateCarbonSavings = (route, mode) => {
  if (!route || !route.distance) {
    return {
      savings: 0,
      percent: 0
    };
  }
  
  // Calculate baseline carbon impact (traditional centralized model)
  // Average shipping distance is much longer in centralized model
  const averageShippingDistance = 500000; // 500 km average for centralized shipping
  const averageShippingEmissions = 50; // 50g CO2 per km for truck delivery
  
  const baselineEmissions = averageShippingDistance * averageShippingEmissions / 1000; // in kg
  
  // Calculate actual emissions
  let actualEmissions = 0;
  
  if (mode === 'car') {
    actualEmissions = (route.distance / 1000) * (route.efficiency?.carbonImpact || 120) / 1000; // in kg
  } else if (mode === 'bike' || mode === 'foot') {
    actualEmissions = 0; // Zero emissions for bike or foot
  }
  
  // Calculate savings
  const savings = baselineEmissions - actualEmissions;
  const percent = (savings / baselineEmissions) * 100;
  
  return {
    savings: Math.round(savings * 100) / 100, // kg CO2 saved, rounded to 2 decimal places
    percent: Math.round(percent)
  };
};

export default {
  calculateRoute,
  getMultipleRoutes,
  calculateRouteEfficiency,
  formatDuration,
  formatDistance,
  calculateCarbonSavings
};