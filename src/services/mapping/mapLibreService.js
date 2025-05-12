/**
 * MapLibre Service
 * 
 * Provides enhanced map visualization capabilities using MapLibre GL JS
 * (open source alternative to Mapbox GL JS that doesn't require an API key)
 */

// URL for the map style
const MAP_STYLE_URL = 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL';

/**
 * Initialize a MapLibre GL map
 * 
 * @param {HTMLElement} container - DOM element to render the map in
 * @param {Object} options - Map options
 * @returns {Object} - The MapLibre map instance
 */
export const initializeMap = (container, options = {}) => {
  if (!window.maplibregl) {
    throw new Error('MapLibre GL JS is not loaded');
  }
  
  // Default options
  const defaultOptions = {
    container,
    style: MAP_STYLE_URL,
    center: [-87.6298, 41.8781], // Chicago coordinates [lng, lat]
    zoom: 11
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create map
  const map = new window.maplibregl.Map(mergedOptions);
  
  // Add navigation controls
  map.addControl(new window.maplibregl.NavigationControl(), 'top-right');
  
  return map;
};

/**
 * Add a user location marker to the map
 * 
 * @param {Object} map - The MapLibre map instance
 * @param {Object} location - The location coordinates { lat, lng }
 * @returns {Object} - The marker instance
 */
export const addUserLocationMarker = (map, location) => {
  if (!map || !location || !location.lat || !location.lng) {
    throw new Error('Invalid map or location');
  }
  
  // Create a custom HTML element for the marker
  const el = document.createElement('div');
  el.className = 'user-location-marker';
  el.innerHTML = '<i class="fas fa-user-circle"></i>';
  
  // Create and add the marker
  const marker = new window.maplibregl.Marker({
    element: el,
    anchor: 'center'
  })
    .setLngLat([location.lng, location.lat])
    .addTo(map);
  
  return marker;
};

/**
 * Add a producer marker to the map
 * 
 * @param {Object} map - The MapLibre map instance
 * @param {Object} producer - The producer object with location data
 * @param {Function} onClick - Click handler for the marker
 * @returns {Object} - The marker instance
 */
export const addProducerMarker = (map, producer, onClick) => {
  if (!map || !producer || !producer.location) {
    throw new Error('Invalid map or producer');
  }
  
  const location = producer.location;
  
  // Check if location is valid
  if (!location.lat || !location.lng) {
    console.error('Invalid producer location', producer);
    return null;
  }
  
  // Determine marker class based on availability
  const className = producer.availabilityPercent > 50 
    ? 'producer-marker high-availability' 
    : 'producer-marker low-availability';
  
  // Create a custom HTML element for the marker
  const el = document.createElement('div');
  el.className = className;
  el.innerHTML = '<i class="fas fa-print"></i>';
  
  // Create popup content
  const popupContent = `
    <div style="min-width: 150px;">
      <strong>${producer.name}</strong><br/>
      <div style="margin: 5px 0;">
        <span style="color: #F1C40F;">
          ${'★'.repeat(Math.floor(producer.rating))}${'☆'.repeat(5 - Math.floor(producer.rating))}
        </span>
        <span style="color: #555; font-size: 0.8em;">${producer.rating}</span>
      </div>
      <div style="margin-bottom: 5px;">
        <strong>Availability:</strong> ${producer.availabilityPercent}%
      </div>
      <div style="margin-bottom: 5px;">
        <strong>Distance:</strong> ${producer.distance ? producer.distance.toFixed(1) : 'N/A'} miles
      </div>
      <div style="margin-bottom: 5px;">
        <strong>Specialties:</strong> ${producer.capabilities ? producer.capabilities.join(', ') : 'General Printing'}
      </div>
      <button class="map-contact-btn" data-id="${producer.id}">Contact</button>
    </div>
  `;
  
  // Create popup
  const popup = new window.maplibregl.Popup({ offset: 25 })
    .setHTML(popupContent);
  
  // Create and add the marker
  const marker = new window.maplibregl.Marker({
    element: el,
    anchor: 'center'
  })
    .setLngLat([location.lng, location.lat])
    .setPopup(popup)
    .addTo(map);
  
  // Add click handler if provided
  if (onClick) {
    el.addEventListener('click', () => {
      onClick(producer);
    });
  }
  
  return marker;
};

/**
 * Add a GeoJSON route to the map
 * 
 * @param {Object} map - The MapLibre map instance
 * @param {Object} routeData - The route data with geometry
 * @param {string} sourceId - A unique ID for the source
 * @param {string} layerId - A unique ID for the layer
 * @returns {void}
 */
export const addRouteToMap = (map, routeData, sourceId, layerId) => {
  if (!map || !routeData || !routeData.geometry) {
    throw new Error('Invalid map or route data');
  }
  
  // Check if source already exists
  if (map.getSource(sourceId)) {
    // Update existing source
    map.getSource(sourceId).setData(routeData.geometry);
  } else {
    // Add new source
    map.addSource(sourceId, {
      type: 'geojson',
      data: routeData.geometry
    });
    
    // Determine color based on route efficiency
    let routeColor = '#ffc107'; // Default yellow for moderate
    
    if (routeData.efficiency) {
      switch (routeData.efficiency.classification) {
        case 'excellent':
          routeColor = '#28a745'; // Green
          break;
        case 'good':
          routeColor = '#17a2b8'; // Blue
          break;
        case 'poor':
          routeColor = '#dc3545'; // Red
          break;
      }
    }
    
    // Add new layer
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': routeColor,
        'line-width': 5,
        'line-opacity': 0.7
      }
    });
    
    // Add outline (for better visibility)
    map.addLayer({
      id: `${layerId}-outline`,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#000',
        'line-width': 7,
        'line-opacity': 0.3
      },
      filter: ['==', '$type', 'LineString']
    }, layerId); // Add before the main line layer
  }
};

/**
 * Create a heatmap layer showing printing activity
 * 
 * @param {Object} map - The MapLibre map instance
 * @param {Array} producers - Array of producers with location and activity data
 * @param {string} sourceId - A unique ID for the source
 * @param {string} layerId - A unique ID for the layer
 * @returns {void}
 */
export const createActivityHeatmap = (map, producers, sourceId, layerId) => {
  if (!map || !producers || producers.length === 0) {
    throw new Error('Invalid map or producers');
  }
  
  // Convert producers to GeoJSON points
  const geojson = {
    type: 'FeatureCollection',
    features: producers.map(producer => {
      if (!producer.location || !producer.location.lat || !producer.location.lng) {
        return null;
      }
      
      // Weight based on availability percentage
      const weight = producer.availabilityPercent / 100;
      
      return {
        type: 'Feature',
        properties: {
          weight: weight,
          name: producer.name,
          activity: 100 - producer.availabilityPercent // Higher activity = lower availability
        },
        geometry: {
          type: 'Point',
          coordinates: [producer.location.lng, producer.location.lat]
        }
      };
    }).filter(Boolean) // Remove null entries
  };
  
  // Check if source already exists
  if (map.getSource(sourceId)) {
    // Update existing source
    map.getSource(sourceId).setData(geojson);
  } else {
    // Add new source
    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson
    });
    
    // Add heatmap layer
    map.addLayer({
      id: layerId,
      type: 'heatmap',
      source: sourceId,
      paint: {
        // Increase weight as availability decreases
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'activity'],
          0, 0,
          50, 0.5,
          100, 1
        ],
        // Increase intensity as zoom level increases
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 3
        ],
        // Color heatmap based on activity
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        // Adjust radius based on zoom level
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          9, 20
        ],
        // Decrease opacity as zoom increases
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          11, 0.5
        ]
      }
    });
  }
};

/**
 * Load and display MapLibre GL CSS and JS
 * 
 * @returns {Promise} - Promise that resolves when MapLibre GL is loaded
 */
export const loadMapLibre = async () => {
  // Load CSS
  if (!document.querySelector('link[href*="maplibre-gl.css"]')) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
    document.head.appendChild(linkElement);
  }
  
  // Load JS
  if (!window.maplibregl) {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
  
  return window.maplibregl;
};

export default {
  initializeMap,
  addUserLocationMarker,
  addProducerMarker,
  addRouteToMap,
  createActivityHeatmap,
  loadMapLibre
};