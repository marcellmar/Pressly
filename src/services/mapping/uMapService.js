/**
 * uMap Service
 * 
 * Provides integration with uMap (an OpenStreetMap-based mapping service)
 * for collaborative community mapping
 */

/**
 * Create a uMap iframe for embedded maps
 * 
 * @param {string} mapId - uMap map ID
 * @param {Object} options - Iframe options
 * @returns {string} - HTML iframe code
 */
export const createUMapIframe = (mapId, options = {}) => {
  if (!mapId) {
    throw new Error('Map ID is required');
  }
  
  const defaults = {
    width: '100%',
    height: '400px',
    showControls: true,
    allowFullscreen: true,
    miniMap: false,
    scaleControl: true,
    allowEdit: false,
    captionBar: true
  };
  
  const settings = { ...defaults, ...options };
  
  // Build URL parameters based on settings
  const params = new URLSearchParams();
  
  if (!settings.showControls) params.append('noControl', '1');
  if (settings.miniMap) params.append('miniMap', '1');
  if (!settings.scaleControl) params.append('no_scale', '1');
  if (settings.allowEdit) params.append('editInOSMControl', '1');
  if (!settings.captionBar) params.append('captionBar', '0');
  
  // Build iframe HTML
  const iframe = `
    <iframe 
      src="https://umap.openstreetmap.fr/en/map/${mapId}?${params.toString()}" 
      width="${settings.width}" 
      height="${settings.height}"
      ${settings.allowFullscreen ? 'allowfullscreen' : ''}
      frameborder="0"
      title="Community Resource Map"
    ></iframe>
  `;
  
  return iframe;
};

/**
 * Fetch map data from uMap
 * 
 * @param {string} mapId - uMap map ID
 * @returns {Promise} - Promise resolving to map data
 */
export const fetchUMapData = async (mapId) => {
  if (!mapId) {
    throw new Error('Map ID is required');
  }
  
  try {
    const response = await fetch(`https://umap.openstreetmap.fr/en/map//${mapId}/geojson/`);
    
    if (!response.ok) {
      throw new Error(`uMap API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching uMap data:', error);
    return {
      success: false,
      error: error.message || 'Error fetching uMap data'
    };
  }
};

/**
 * Create export URL for a uMap map
 * 
 * @param {string} mapId - uMap map ID
 * @param {string} format - Export format (geojson, gpx, kml, csv)
 * @returns {string} - Export URL
 */
export const getUMapExportUrl = (mapId, format = 'geojson') => {
  if (!mapId) {
    throw new Error('Map ID is required');
  }
  
  // Validate format
  const validFormats = ['geojson', 'gpx', 'kml', 'csv'];
  if (!validFormats.includes(format)) {
    throw new Error(`Invalid format: ${format}. Must be one of: ${validFormats.join(', ')}`);
  }
  
  return `https://umap.openstreetmap.fr/en/map/${mapId}/export/${format}/`;
};

/**
 * Parse uMap data to extract specific POI types
 * 
 * @param {Object} data - uMap GeoJSON data
 * @param {Array} types - Array of types to extract
 * @returns {Array} - Filtered and formatted POIs
 */
export const extractPOIsByType = (data, types = []) => {
  if (!data || !data.features || !Array.isArray(data.features)) {
    return [];
  }
  
  // If no types specified, return all POIs
  if (!types.length) {
    return formatUMapPOIs(data.features);
  }
  
  // Filter by type (stored in properties)
  const filteredFeatures = data.features.filter(feature => {
    const properties = feature.properties || {};
    
    // Check if any type matches
    return types.some(type => {
      // Check for type in different possible property fields
      return (
        (properties.type && properties.type.toLowerCase().includes(type.toLowerCase())) ||
        (properties.description && properties.description.toLowerCase().includes(type.toLowerCase())) ||
        (properties.name && properties.name.toLowerCase().includes(type.toLowerCase()))
      );
    });
  });
  
  return formatUMapPOIs(filteredFeatures);
};

/**
 * Format uMap POIs for use in the application
 * 
 * @param {Array} features - GeoJSON features from uMap
 * @returns {Array} - Formatted POIs
 */
function formatUMapPOIs(features) {
  return features.map(feature => {
    const properties = feature.properties || {};
    const geometry = feature.geometry || {};
    
    // Extract coordinates
    let coordinates = [];
    if (geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
      coordinates = geometry.coordinates;
    }
    
    // Basic POI object
    return {
      id: feature._umap_options?.id || Math.random().toString(36).substr(2, 9),
      name: properties.name || 'Unnamed POI',
      description: properties.description || '',
      type: properties.type || 'general',
      location: {
        lat: coordinates[1],
        lng: coordinates[0]
      },
      // Keep original properties and geometry for reference
      originalProperties: properties,
      originalGeometry: geometry
    };
  }).filter(poi => poi.location && poi.location.lat && poi.location.lng); // Filter out POIs without coordinates
}

export default {
  createUMapIframe,
  fetchUMapData,
  getUMapExportUrl,
  extractPOIsByType
};