/**
 * Map Configuration
 * 
 * Central configuration for mapping services and components
 */

const mapConfig = {
  // Default map center (Chicago)
  defaultCenter: {
    lat: 41.8781,
    lng: -87.6298
  },
  
  // Default zoom levels
  defaultZoom: 12,
  closeZoom: 15,
  farZoom: 9,
  
  // Default radius for searches (in km)
  defaultRadius: 5,
  maxRadius: 50,
  
  // Map styling
  mapStyle: {
    // Marker styles
    markers: {
      user: {
        color: '#3a6ea5',
        size: 30
      },
      producer: {
        color: '#28a745',
        size: 25,
        lowAvailability: '#ffc107'
      },
      supportBusiness: {
        color: '#ff6b6b',
        size: 25
      },
      community: {
        color: '#6f42c1',
        size: 25
      }
    },
    
    // Route styles
    routes: {
      excellent: '#28a745',
      good: '#17a2b8',
      moderate: '#ffc107',
      poor: '#dc3545'
    }
  },
  
  // Map service URLs
  services: {
    // OSM Tile Server
    tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    
    // Nominatim (Geocoding)
    nominatim: 'https://nominatim.openstreetmap.org',
    
    // OSRM (Routing)
    osrm: 'https://router.project-osrm.org/route/v1',
    
    // Overpass (POI data)
    overpass: 'https://overpass-api.de/api/interpreter',
    
    // uMap (Collaborative mapping)
    umap: 'https://umap.openstreetmap.fr/en'
  },
  
  // Production network map settings
  productionNetwork: {
    // Activity heatmap colors
    heatmapColors: [
      'rgba(33,102,172,0)',
      'rgb(103,169,207)',
      'rgb(209,229,240)',
      'rgb(253,219,199)',
      'rgb(239,138,98)',
      'rgb(178,24,43)'
    ],
    
    // Capacity visualization settings
    capacityCircleMaxRadius: 25
  },
  
  // Icon mapping for different business types
  businessIcons: {
    copyshop: 'fas fa-copy',
    printer: 'fas fa-print',
    stationery: 'fas fa-pen',
    art_supply: 'fas fa-paint-brush',
    office_supply: 'fas fa-paperclip',
    photographer: 'fas fa-camera',
    
    // Community resources
    coworking: 'fas fa-laptop',
    library: 'fas fa-book',
    hackerspace: 'fas fa-terminal',
    makerspace: 'fas fa-hammer'
  },
  
  // User agent for API requests
  userAgent: 'Pressly MVP Application',
  
  // Whether to use MapLibre for advanced visualization
  useMapLibre: true,
  
  // Example community map IDs for demo purposes
  communityMaps: {
    chicago: 'sample-chicago-creative-spaces',
    newyork: 'sample-nyc-maker-network',
    losangeles: 'sample-la-design-hubs'
  }
};

export default mapConfig;