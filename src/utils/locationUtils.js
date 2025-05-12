/**
 * Location Utilities
 * 
 * Helper functions for working with geographic locations,
 * distance calculations, and other location-based operations
 */

/**
 * Calculate distance between two points using Haversine formula
 * 
 * @param {Object} point1 - First point { lat, lng }
 * @param {Object} point2 - Second point { lat, lng }
 * @param {string} unit - Unit of measurement (km, mi)
 * @returns {number} - Distance in requested units
 */
export const calculateDistance = (point1, point2, unit = 'km') => {
  if (!point1 || !point2 || !point1.lat || !point1.lng || !point2.lat || !point2.lng) {
    throw new Error('Invalid coordinates provided');
  }
  
  const R = unit === 'mi' ? 3958.8 : 6371; // Earth radius in miles or km
  
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km or miles
  
  return parseFloat(distance.toFixed(2));
};

/**
 * Filter array of items by distance from a center point
 * 
 * @param {Array} items - Array of items with location property { lat, lng }
 * @param {Object} center - Center point { lat, lng }
 * @param {number} maxDistance - Maximum distance in kilometers
 * @returns {Array} - Filtered array of items
 */
export const filterByDistance = (items, center, maxDistance) => {
  if (!Array.isArray(items) || !center || !center.lat || !center.lng) {
    return [];
  }
  
  return items.filter(item => {
    if (!item.location || !item.location.lat || !item.location.lng) {
      return false;
    }
    
    const distance = calculateDistance(center, item.location);
    
    // Add distance to the item for sorting or display
    item.distance = distance;
    
    return distance <= maxDistance;
  });
};

/**
 * Sort items by distance from a center point
 * 
 * @param {Array} items - Array of items with location property { lat, lng }
 * @param {Object} center - Center point { lat, lng }
 * @returns {Array} - Sorted array of items
 */
export const sortByDistance = (items, center) => {
  if (!Array.isArray(items) || !center || !center.lat || !center.lng) {
    return [];
  }
  
  // Calculate distances if they don't exist
  const itemsWithDistance = items.map(item => {
    if (!item.location || !item.location.lat || !item.location.lng) {
      return { ...item, distance: Infinity };
    }
    
    if (item.distance === undefined) {
      const distance = calculateDistance(center, item.location);
      return { ...item, distance };
    }
    
    return item;
  });
  
  // Sort by distance
  return itemsWithDistance.sort((a, b) => a.distance - b.distance);
};

/**
 * Format distance for display
 * 
 * @param {number} distance - Distance in kilometers
 * @param {string} unit - Unit of measurement (km, mi)
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distance, unit = 'km') => {
  if (typeof distance !== 'number') {
    return 'N/A';
  }
  
  // Convert to miles if needed
  const convertedDistance = unit === 'mi' ? distance * 0.621371 : distance;
  
  // Format based on distance
  if (convertedDistance < 1) {
    // Less than 1 km/mi, show in meters/feet
    const smallUnit = unit === 'mi' ? 'ft' : 'm';
    const smallDistance = unit === 'mi' 
      ? Math.round(convertedDistance * 5280) 
      : Math.round(convertedDistance * 1000);
    
    return `${smallDistance} ${smallUnit}`;
  } else if (convertedDistance < 10) {
    // Less than 10 km/mi, show with 1 decimal place
    return `${convertedDistance.toFixed(1)} ${unit}`;
  } else {
    // More than 10 km/mi, show as whole number
    return `${Math.round(convertedDistance)} ${unit}`;
  }
};

/**
 * Check if a point is within a given radius of another point
 * 
 * @param {Object} point - Point to check { lat, lng }
 * @param {Object} center - Center point { lat, lng }
 * @param {number} radius - Radius in kilometers
 * @returns {boolean} - True if point is within radius
 */
export const isPointWithinRadius = (point, center, radius) => {
  if (!point || !center || !point.lat || !point.lng || !center.lat || !center.lng) {
    return false;
  }
  
  const distance = calculateDistance(center, point);
  return distance <= radius;
};

/**
 * Calculate the center point of multiple coordinates
 * 
 * @param {Array} points - Array of points { lat, lng }
 * @returns {Object} - Center point { lat, lng }
 */
export const calculateCenterPoint = (points) => {
  if (!Array.isArray(points) || points.length === 0) {
    return null;
  }
  
  // Filter out invalid points
  const validPoints = points.filter(p => p && p.lat && p.lng);
  
  if (validPoints.length === 0) {
    return null;
  }
  
  // For simple cases, use average
  if (validPoints.length <= 3) {
    const sumLat = validPoints.reduce((sum, p) => sum + p.lat, 0);
    const sumLng = validPoints.reduce((sum, p) => sum + p.lng, 0);
    
    return {
      lat: sumLat / validPoints.length,
      lng: sumLng / validPoints.length
    };
  }
  
  // For larger sets, calculate geographic midpoint using vectors
  let x = 0;
  let y = 0;
  let z = 0;
  
  validPoints.forEach(point => {
    // Convert to radians
    const lat = point.lat * Math.PI / 180;
    const lng = point.lng * Math.PI / 180;
    
    // Convert to Cartesian coordinates
    x += Math.cos(lat) * Math.cos(lng);
    y += Math.cos(lat) * Math.sin(lng);
    z += Math.sin(lat);
  });
  
  // Average the components
  x /= validPoints.length;
  y /= validPoints.length;
  z /= validPoints.length;
  
  // Convert back to latitude and longitude
  const centralLongitude = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLatitude = Math.atan2(z, centralSquareRoot);
  
  return {
    lat: centralLatitude * 180 / Math.PI,
    lng: centralLongitude * 180 / Math.PI
  };
};

/**
 * Calculate a bounding box that contains all given points
 * 
 * @param {Array} points - Array of points { lat, lng }
 * @param {number} padding - Padding in degrees to add around the box
 * @returns {Object} - Bounding box { north, south, east, west }
 */
export const calculateBoundingBox = (points, padding = 0.01) => {
  if (!Array.isArray(points) || points.length === 0) {
    return null;
  }
  
  // Filter out invalid points
  const validPoints = points.filter(p => p && p.lat && p.lng);
  
  if (validPoints.length === 0) {
    return null;
  }
  
  // Initialize with first point
  let north = validPoints[0].lat;
  let south = validPoints[0].lat;
  let east = validPoints[0].lng;
  let west = validPoints[0].lng;
  
  // Find min/max coordinates
  validPoints.forEach(point => {
    if (point.lat > north) north = point.lat;
    if (point.lat < south) south = point.lat;
    if (point.lng > east) east = point.lng;
    if (point.lng < west) west = point.lng;
  });
  
  // Add padding
  north += padding;
  south -= padding;
  east += padding;
  west -= padding;
  
  return { north, south, east, west };
};

/**
 * Calculate optimal zoom level for a given bounding box
 * 
 * @param {Object} bounds - Bounding box { north, south, east, west }
 * @param {Object} mapSize - Map dimensions { width, height } in pixels
 * @returns {number} - Optimal zoom level
 */
export const calculateZoomLevel = (bounds, mapSize) => {
  if (!bounds || !mapSize || !mapSize.width || !mapSize.height) {
    return 10; // Default zoom level
  }
  
  const GLOBE_WIDTH = 256; // Width of the globe in pixels at zoom level 0
  
  const { north, south, east, west } = bounds;
  
  const latFraction = (north - south) / 180;
  const lngFraction = (east - west) / 360;
  
  const latZoom = Math.log2(mapSize.height / GLOBE_WIDTH / latFraction);
  const lngZoom = Math.log2(mapSize.width / GLOBE_WIDTH / lngFraction);
  
  // Use the minimum of the two zoom levels to ensure all points are visible
  return Math.min(latZoom, lngZoom);
};

/**
 * Generate a random point within a given radius
 * 
 * @param {Object} center - Center point { lat, lng }
 * @param {number} radius - Radius in kilometers
 * @returns {Object} - Random point { lat, lng }
 */
export const generateRandomNearbyPoint = (center, radius) => {
  if (!center || !center.lat || !center.lng) {
    throw new Error('Invalid center coordinates');
  }
  
  // Convert radius from km to degrees (rough approximation)
  const radiusInDegrees = radius / 111;
  
  // Generate random distance and angle
  const u = Math.random();
  const v = Math.random();
  
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  
  // Adjust for longitude shrinking with latitude
  const x = w * Math.cos(t) / Math.cos(center.lat * Math.PI / 180);
  const y = w * Math.sin(t);
  
  // Adjust from degrees to coordinates
  return {
    lat: center.lat + y,
    lng: center.lng + x
  };
};

export default {
  calculateDistance,
  filterByDistance,
  sortByDistance,
  formatDistance,
  isPointWithinRadius,
  calculateCenterPoint,
  calculateBoundingBox,
  calculateZoomLevel,
  generateRandomNearbyPoint
};