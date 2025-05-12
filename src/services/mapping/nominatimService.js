/**
 * Nominatim Service
 * 
 * Provides geocoding and reverse geocoding services using OpenStreetMap's
 * Nominatim API (requires no API key)
 */

// Base URL for the Nominatim API
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Geocode an address to geographic coordinates
 * 
 * @param {string} address - The address to geocode
 * @returns {Promise} - Promise resolving to location object with coordinates
 */
export const geocodeAddress = async (address) => {
  // Validate input
  if (!address || typeof address !== 'string') {
    throw new Error('Invalid address provided');
  }
  
  try {
    // Prepare the API URL with query parameters
    const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`;
    
    // Add a custom user agent as required by Nominatim's usage policy
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Pressly MVP Application'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if we got results
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No results found for this address'
      };
    }
    
    // Extract location data
    const result = data[0];
    
    return {
      success: true,
      location: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        type: result.type,
        importance: result.importance,
        address: {
          city: result.address.city || result.address.town || result.address.village || result.address.hamlet,
          state: result.address.state,
          country: result.address.country,
          postcode: result.address.postcode
        },
        boundingBox: result.boundingbox
      }
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      success: false,
      error: error.message || 'Error geocoding address'
    };
  }
};

/**
 * Reverse geocode coordinates to an address
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise} - Promise resolving to address information
 */
export const reverseGeocode = async (lat, lng) => {
  // Validate input
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('Invalid coordinates provided');
  }
  
  try {
    // Prepare the API URL with query parameters
    const url = `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    
    // Add a custom user agent as required by Nominatim's usage policy
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Pressly MVP Application'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if we got results
    if (!data) {
      return {
        success: false,
        error: 'No results found for these coordinates'
      };
    }
    
    return {
      success: true,
      address: {
        displayName: data.display_name,
        street: data.address.road,
        houseNumber: data.address.house_number,
        city: data.address.city || data.address.town || data.address.village || data.address.hamlet,
        county: data.address.county,
        state: data.address.state,
        postcode: data.address.postcode,
        country: data.address.country,
        countryCode: data.address.country_code
      },
      originalData: data
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      success: false,
      error: error.message || 'Error reverse geocoding coordinates'
    };
  }
};

/**
 * Search for nearby print producers
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in kilometers
 * @returns {Promise} - Promise resolving to nearby print producers
 */
export const searchNearbyPrinters = async (lat, lng, radius = 10) => {
  // In a real app, this would query a database or specialized API
  // Here we'll simulate finding nearby printers with mock data
  
  // Chicago coordinates as center reference
  const chicagoLat = 41.8781;
  const chicagoLng = -87.6298;
  
  // Calculate distance (in KM) from Chicago center
  const distance = calculateDistance(lat, lng, chicagoLat, chicagoLng);
  
  // Filter mock producers based on distance
  const mockProducers = generateMockPrintProducers(lat, lng, 10);
  
  // Filter by radius
  const nearbyProducers = mockProducers.filter(producer => producer.distance <= radius);
  
  return {
    success: true,
    producers: nearbyProducers,
    center: { lat, lng },
    radius,
    total: nearbyProducers.length
  };
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * 
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} - Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
}

/**
 * Generate mock print producers around given coordinates
 * 
 * @param {number} centerLat - Center latitude
 * @param {number} centerLng - Center longitude
 * @param {number} count - Number of producers to generate
 * @returns {Array} - Array of producer objects
 */
function generateMockPrintProducers(centerLat, centerLng, count = 5) {
  const producers = [];
  
  // Business names for variation
  const businessNames = [
    'Quick Prints',
    'Eco Printing Solutions',
    'Premium Press',
    'Urban Graphics',
    'Print Masters',
    'Design & Print Co',
    'Rush Printing Services',
    'Creative Press',
    'Modern Print Shop',
    'Custom Graphics',
    'High Quality Prints',
    'Digital Press Studio',
    'Express Printing',
    'Pro Print Solutions',
    'Elite Graphics'
  ];
  
  // Capabilities for variation
  const capabilities = [
    ['Digital', 'Large Format', 'Eco-friendly'],
    ['Digital', 'Offset', 'Binding'],
    ['Screen Printing', 'Apparel', 'Promotional'],
    ['Digital', 'Rush Service', 'Design'],
    ['Specialty Papers', 'Embossing', 'Die Cutting'],
    ['Digital', 'Offset', 'Mailing'],
    ['Eco-friendly', 'Recycled Materials', 'Design'],
    ['Large Format', 'Signage', 'Banners'],
    ['Digital', 'Variable Data', 'Direct Mail'],
    ['Fine Art Printing', 'Photography', 'Gallery Quality'],
    ['Apparel', 'Screen Printing', 'Embroidery'],
    ['Digital', 'Same-Day', 'Business Cards'],
    ['Books', 'Binding', 'Catalogs'],
    ['Vehicle Wraps', 'Signage', 'Large Format'],
    ['Labels', 'Packaging', 'Small Business Specialist']
  ];
  
  for (let i = 0; i < count; i++) {
    // Generate random offset from center (within ~5km)
    const latOffset = (Math.random() - 0.5) * 0.1; // ~5km in lat
    const lngOffset = (Math.random() - 0.5) * 0.1; // ~5km in lng
    
    // Calculate coordinates
    const lat = centerLat + latOffset;
    const lng = centerLng + lngOffset;
    
    // Calculate distance from center
    const distance = calculateDistance(centerLat, centerLng, lat, lng);
    
    // Generate random business details
    const nameIndex = Math.floor(Math.random() * businessNames.length);
    const name = businessNames[nameIndex];
    
    const rating = (3.5 + Math.random() * 1.5).toFixed(1); // Rating between 3.5-5.0
    const availabilityPercent = Math.floor(Math.random() * 70) + 30; // 30-100%
    
    // Create producer object
    producers.push({
      id: 1000 + i,
      name,
      rating: parseFloat(rating),
      location: {
        lat,
        lng,
        address: '123 Print St, Chicago, IL'
      },
      distance: parseFloat(distance.toFixed(1)),
      capabilities: capabilities[i % capabilities.length],
      availabilityPercent,
      turnaround: ['1-2 days', '2-3 days', '3-5 days', 'Same day'][Math.floor(Math.random() * 4)],
      priceRange: ['$', '$$', '$$$', '$$$$'][Math.floor(Math.random() * 4)]
    });
  }
  
  // Sort by distance
  return producers.sort((a, b) => a.distance - b.distance);
}

export default {
  geocodeAddress,
  reverseGeocode,
  searchNearbyPrinters
};