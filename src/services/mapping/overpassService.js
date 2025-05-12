/**
 * Overpass Service
 * 
 * Provides access to OpenStreetMap data through the Overpass API
 * for querying local print industry and related POIs
 */

// Base URL for the Overpass API
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

/**
 * Query printing-related businesses near a location
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise} - Promise resolving to printer POIs
 */
export const queryPrintBusinesses = async (lat, lng, radius = 5000) => {
  try {
    // Validate input
    if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') {
      throw new Error('Invalid coordinates');
    }
    
    // Create Overpass query
    // This searches for:
    // - Shops tagged as 'copyshop'
    // - Businesses tagged with 'craft=print'
    // - Any node, way or relation with 'print' or 'printing' in the name
    const query = `
      [out:json][timeout:25];
      (
        node["shop"="copyshop"](around:${radius},${lat},${lng});
        way["shop"="copyshop"](around:${radius},${lat},${lng});
        node["craft"="print"](around:${radius},${lat},${lng});
        way["craft"="print"](around:${radius},${lat},${lng});
        node["name"~"print|printing|copy|copies",i](around:${radius},${lat},${lng});
        way["name"~"print|printing|copy|copies",i](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;
    
    // Make the request
    const response = await fetch(OVERPASS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `data=${encodeURIComponent(query)}`
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Filter and format the results
    const businesses = processOverpassResults(data, lat, lng);
    
    return {
      success: true,
      businesses,
      count: businesses.length
    };
  } catch (error) {
    console.error('Overpass query error:', error);
    return {
      success: false,
      error: error.message || 'Error querying print businesses'
    };
  }
};

/**
 * Query supportive businesses near a location
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise} - Promise resolving to supportive business POIs
 */
export const querySupportiveBusinesses = async (lat, lng, radius = 5000) => {
  try {
    // Validate input
    if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') {
      throw new Error('Invalid coordinates');
    }
    
    // Create Overpass query
    // This searches for businesses that support printing industry:
    // - Office supply shops
    // - Art supply shops
    // - Stationery shops
    const query = `
      [out:json][timeout:25];
      (
        node["shop"="stationery"](around:${radius},${lat},${lng});
        way["shop"="stationery"](around:${radius},${lat},${lng});
        node["shop"="art"](around:${radius},${lat},${lng});
        way["shop"="art"](around:${radius},${lat},${lng});
        node["shop"="office_supplies"](around:${radius},${lat},${lng});
        way["shop"="office_supplies"](around:${radius},${lat},${lng});
        node["craft"="photographer"](around:${radius},${lat},${lng});
        way["craft"="photographer"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;
    
    // Make the request
    const response = await fetch(OVERPASS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `data=${encodeURIComponent(query)}`
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Filter and format the results
    const businesses = processOverpassResults(data, lat, lng);
    
    return {
      success: true,
      businesses,
      count: businesses.length
    };
  } catch (error) {
    console.error('Overpass query error:', error);
    return {
      success: false,
      error: error.message || 'Error querying supportive businesses'
    };
  }
};

/**
 * Process Overpass API results and format them for the frontend
 * 
 * @param {Object} data - Raw data from the Overpass API
 * @param {number} centerLat - Center latitude for distance calculation
 * @param {number} centerLng - Center longitude for distance calculation
 * @returns {Array} - Formatted array of businesses
 */
function processOverpassResults(data, centerLat, centerLng) {
  if (!data || !data.elements || data.elements.length === 0) {
    return [];
  }
  
  // Filter to keep only nodes and ways with tags
  const elements = data.elements.filter(el => 
    (el.type === 'node' || el.type === 'way') && el.tags
  );
  
  // Map to common format
  return elements.map(el => {
    // Get coordinates
    let lat, lng;
    
    if (el.type === 'node') {
      lat = el.lat;
      lng = el.lon;
    } else if (el.type === 'way' && el.center) {
      lat = el.center.lat;
      lng = el.center.lon;
    } else {
      return null; // Skip if no coordinates
    }
    
    // Calculate distance
    const distance = calculateDistance(centerLat, centerLng, lat, lng);
    
    // Determine business type
    let businessType = 'unknown';
    
    if (el.tags.shop === 'copyshop') {
      businessType = 'copyshop';
    } else if (el.tags.craft === 'print') {
      businessType = 'printer';
    } else if (el.tags.shop === 'stationery') {
      businessType = 'stationery';
    } else if (el.tags.shop === 'art') {
      businessType = 'art_supply';
    } else if (el.tags.shop === 'office_supplies') {
      businessType = 'office_supply';
    } else if (el.tags.craft === 'photographer') {
      businessType = 'photographer';
    } else if (el.tags.name && /print|printing|copy|copies/i.test(el.tags.name)) {
      businessType = 'printer';
    }
    
    return {
      id: el.id,
      name: el.tags.name || `${businessType} (No Name)`,
      type: businessType,
      location: {
        lat,
        lng
      },
      address: {
        street: el.tags['addr:street'],
        housenumber: el.tags['addr:housenumber'],
        city: el.tags['addr:city'],
        postcode: el.tags['addr:postcode']
      },
      contact: {
        phone: el.tags.phone || el.tags['contact:phone'],
        website: el.tags.website || el.tags['contact:website']
      },
      osm_tags: el.tags,
      distance: parseFloat(distance.toFixed(1))
    };
  }).filter(Boolean) // Remove null entries
    .sort((a, b) => a.distance - b.distance); // Sort by distance
}

/**
 * Calculate distance between two coordinates
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
 * Query local resources beneficial for designers and producers
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise} - Promise resolving to community resource POIs
 */
export const queryCommunityResources = async (lat, lng, radius = 5000) => {
  try {
    // Validate input
    if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') {
      throw new Error('Invalid coordinates');
    }
    
    // Create Overpass query
    // This searches for community locations beneficial for designers and producers:
    // - Coworking spaces
    // - Libraries
    // - Maker spaces
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="coworking_space"](around:${radius},${lat},${lng});
        way["amenity"="coworking_space"](around:${radius},${lat},${lng});
        node["amenity"="library"](around:${radius},${lat},${lng});
        way["amenity"="library"](around:${radius},${lat},${lng});
        node["amenity"="hackerspace"](around:${radius},${lat},${lng});
        way["amenity"="hackerspace"](around:${radius},${lat},${lng});
        node["leisure"="hackerspace"](around:${radius},${lat},${lng});
        way["leisure"="hackerspace"](around:${radius},${lat},${lng});
        node["name"~"maker|makerspace|fab lab|fablab",i](around:${radius},${lat},${lng});
        way["name"~"maker|makerspace|fab lab|fablab",i](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;
    
    // Make the request
    const response = await fetch(OVERPASS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `data=${encodeURIComponent(query)}`
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Filter and format the results
    const resources = processResourceResults(data, lat, lng);
    
    return {
      success: true,
      resources,
      count: resources.length
    };
  } catch (error) {
    console.error('Overpass query error:', error);
    return {
      success: false,
      error: error.message || 'Error querying community resources'
    };
  }
};

/**
 * Process community resource results
 * 
 * @param {Object} data - Raw data from the Overpass API
 * @param {number} centerLat - Center latitude for distance calculation
 * @param {number} centerLng - Center longitude for distance calculation
 * @returns {Array} - Formatted array of resources
 */
function processResourceResults(data, centerLat, centerLng) {
  if (!data || !data.elements || data.elements.length === 0) {
    return [];
  }
  
  // Filter to keep only nodes and ways with tags
  const elements = data.elements.filter(el => 
    (el.type === 'node' || el.type === 'way') && el.tags
  );
  
  // Map to common format
  return elements.map(el => {
    // Get coordinates
    let lat, lng;
    
    if (el.type === 'node') {
      lat = el.lat;
      lng = el.lon;
    } else if (el.type === 'way' && el.center) {
      lat = el.center.lat;
      lng = el.center.lon;
    } else {
      return null; // Skip if no coordinates
    }
    
    // Calculate distance
    const distance = calculateDistance(centerLat, centerLng, lat, lng);
    
    // Determine resource type
    let resourceType = 'unknown';
    
    if (el.tags.amenity === 'coworking_space') {
      resourceType = 'coworking';
    } else if (el.tags.amenity === 'library') {
      resourceType = 'library';
    } else if (el.tags.amenity === 'hackerspace' || el.tags.leisure === 'hackerspace') {
      resourceType = 'hackerspace';
    } else if (el.tags.name && /maker|makerspace|fab lab|fablab/i.test(el.tags.name)) {
      resourceType = 'makerspace';
    }
    
    return {
      id: el.id,
      name: el.tags.name || `${resourceType} (No Name)`,
      type: resourceType,
      location: {
        lat,
        lng
      },
      address: {
        street: el.tags['addr:street'],
        housenumber: el.tags['addr:housenumber'],
        city: el.tags['addr:city'],
        postcode: el.tags['addr:postcode']
      },
      contact: {
        phone: el.tags.phone || el.tags['contact:phone'],
        website: el.tags.website || el.tags['contact:website']
      },
      opening_hours: el.tags.opening_hours,
      osm_tags: el.tags,
      distance: parseFloat(distance.toFixed(1))
    };
  }).filter(Boolean) // Remove null entries
    .sort((a, b) => a.distance - b.distance); // Sort by distance
}

export default {
  queryPrintBusinesses,
  querySupportiveBusinesses,
  queryCommunityResources
};