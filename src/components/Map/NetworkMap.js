import React, { useEffect, useRef, useState } from 'react';
import { 
  calculateRoute, 
  formatDistance, 
  formatDuration, 
  calculateCarbonSavings 
} from '../../services/mapping/routeService';

/**
 * NetworkMap Component
 * 
 * Displays a geographic road network visualization between designers and producers
 * using Leaflet and OSRM (Open Source Routing Machine) for routing
 */
const NetworkMap = ({ 
  userLocation, 
  producers = [], 
  selectedProducers = [],
  onRouteSelect,
  transportMode = 'car',
  showEfficiency = true 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routesRef = useRef([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeMetrics, setRouteMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
        linkElement.integrity = 'sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=';
        linkElement.crossOrigin = '';
        document.head.appendChild(linkElement);
      }
      
      // Load Leaflet JS
      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
          script.integrity = 'sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=';
          script.crossOrigin = '';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      
      initializeMap();
    };
    
    if (mapRef.current) {
      loadLeaflet();
    }
    
    return () => {
      // Clean up map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Update map when producers or user location changes
  useEffect(() => {
    if (window.L && mapInstanceRef.current && userLocation) {
      updateMapMarkers();
    }
  }, [producers, userLocation, transportMode]);

  // Update routes when selected producers change
  useEffect(() => {
    if (window.L && mapInstanceRef.current && userLocation && selectedProducers.length > 0) {
      updateRoutes();
    }
  }, [selectedProducers, transportMode]);
  
  const initializeMap = () => {
    if (!window.L || !mapRef.current) return;
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }
    
    // Create map centered on Chicago by default or user location if available
    const defaultLocation = [41.8781, -87.6298]; // Chicago
    const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultLocation;
    
    // Add custom styles
    const mapStyle = document.createElement('style');
    mapStyle.textContent = `
      .user-location-marker {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
        font-size: 30px;
        width: 30px !important;
        height: 30px !important;
        margin-top: -15px !important;
        margin-left: -15px !important;
      }
      .producer-marker {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        width: 25px !important;
        height: 25px !important;
        margin-top: -12.5px !important;
        margin-left: -12.5px !important;
        background-color: var(--primary);
        border-radius: 50%;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
      }
      .producer-marker.selected {
        background-color: #28a745;
        box-shadow: 0 0 10px rgba(40,167,69,0.5);
        transform: scale(1.2);
      }
      .route-info-box {
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        padding: 10px;
        margin-bottom: 10px;
      }
      .route-efficiency-excellent {
        color: #28a745;
      }
      .route-efficiency-good {
        color: #17a2b8;
      }
      .route-efficiency-moderate {
        color: #ffc107;
      }
      .route-efficiency-poor {
        color: #dc3545;
      }
      .route-path {
        stroke-width: 5;
        opacity: 0.7;
      }
      .route-path-excellent {
        stroke: #28a745;
      }
      .route-path-good {
        stroke: #17a2b8;
      }
      .route-path-moderate {
        stroke: #ffc107;
      }
      .route-path-poor {
        stroke: #dc3545;
      }
    `;
    document.head.appendChild(mapStyle);
    
    // Create map
    const map = window.L.map(mapRef.current).setView(center, 12);
    
    // Add OpenStreetMap tiles (no API key needed)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    mapInstanceRef.current = map;
    
    // Add markers to the map
    updateMapMarkers();
  };
  
  const updateMapMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add user location marker if available
    if (userLocation) {
      // Create a custom icon for user location
      const userMarker = window.L.marker([userLocation.lat, userLocation.lng], {
        icon: window.L.divIcon({
          className: 'user-location-marker',
          html: '<i class="fas fa-user-circle"></i>',
          iconSize: [30, 30]
        })
      })
      .addTo(map)
      .bindPopup('<strong>Your Location</strong>');
      
      markersRef.current.push(userMarker);
      
      // Center map on user location
      map.setView([userLocation.lat, userLocation.lng], 12);
    }
    
    // Add producer markers
    if (producers && producers.length > 0) {
      producers.forEach(producer => {
        if (producer.location && producer.location.lat && producer.location.lng) {
          // Check if this producer is selected
          const isSelected = selectedProducers.some(p => p.id === producer.id);
          const markerClass = isSelected ? 'producer-marker selected' : 'producer-marker';
          
          // Add marker for this producer
          const marker = window.L.marker([producer.location.lat, producer.location.lng], {
            icon: window.L.divIcon({
              className: markerClass,
              html: `<i class="fas fa-print"></i>`,
              iconSize: [25, 25]
            })
          })
          .addTo(map)
          .bindPopup(`
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
                <strong>Distance:</strong> ${producer.distance?.toFixed(1) || 'N/A'} miles
              </div>
              <button class="map-contact-btn" data-id="${producer.id}">Show Route</button>
            </div>
          `);
          
          markersRef.current.push(marker);
        }
      });
      
      // Set bounds to include all markers if there are any
      if (markersRef.current.length > 0) {
        try {
          // Get valid marker positions
          const validMarkers = markersRef.current.filter(marker => {
            const pos = marker.getLatLng();
            return pos && !isNaN(pos.lat) && !isNaN(pos.lng);
          });
          
          if (validMarkers.length > 0) {
            const bounds = window.L.latLngBounds(validMarkers.map(marker => marker.getLatLng()));
            map.fitBounds(bounds, { padding: [50, 50] });
          } else if (userLocation) {
            // Fall back to centering on user location
            map.setView([userLocation.lat, userLocation.lng], 12);
          }
        } catch (error) {
          console.error('Error fitting bounds to markers:', error);
          // Fall back to centering on user location
          if (userLocation) {
            map.setView([userLocation.lat, userLocation.lng], 12);
          }
        }
      }
    }
  };
  
  const updateRoutes = async () => {
    if (!window.L || !mapInstanceRef.current || !userLocation) return;
    
    // Clear existing routes
    routesRef.current.forEach(route => route.remove());
    routesRef.current = [];
    
    setIsLoading(true);
    
    try {
      // Create a route for each selected producer
      for (const producer of selectedProducers) {
        if (!producer.location || !producer.location.lat || !producer.location.lng) {
          continue;
        }
        
        // Calculate route
        const result = await calculateRoute(
          userLocation, 
          producer.location, 
          transportMode
        );
        
        if (!result.success || !result.route || !result.route.geometry) {
          console.error(`Failed to calculate route for producer ${producer.name}`);
          continue;
        }
        
        const { route } = result;
        const { efficiency } = route;
        
        // Determine route color based on efficiency classification
        let routeClass = 'route-path route-path-moderate';
        if (efficiency.classification === 'excellent') {
          routeClass = 'route-path route-path-excellent';
        } else if (efficiency.classification === 'good') {
          routeClass = 'route-path route-path-good';
        } else if (efficiency.classification === 'poor') {
          routeClass = 'route-path route-path-poor';
        }
        
        // Add route to map
        const routePath = window.L.geoJSON(route.geometry, {
          style: {
            className: routeClass
          }
        }).addTo(mapInstanceRef.current);
        
        // Calculate carbon savings
        const carbonSavings = calculateCarbonSavings(route, transportMode);
        
        // Add tooltip to route
        routePath.bindTooltip(`
          <div>
            <strong>${producer.name}</strong><br/>
            Distance: ${formatDistance(route.distance)}<br/>
            Time: ${formatDuration(route.duration)}<br/>
            Efficiency: ${efficiency.score}/100 (${efficiency.classification})<br/>
            Carbon Savings: ${carbonSavings.savings} kg CO2 (${carbonSavings.percent}%)
          </div>
        `);
        
        // Add click handler to route
        routePath.on('click', () => {
          setSelectedRoute({
            producerId: producer.id,
            producerName: producer.name,
            route
          });
          
          setRouteMetrics({
            distance: formatDistance(route.distance),
            duration: formatDuration(route.duration),
            efficiency: efficiency,
            carbonSavings: carbonSavings
          });
          
          if (onRouteSelect) {
            onRouteSelect(producer, route);
          }
        });
        
        routesRef.current.push(routePath);
      }
      
      // Fit map to include all routes
      if (routesRef.current.length > 0) {
        try {
          const bounds = window.L.latLngBounds();
          
          // Make sure each route has valid bounds before extending
          routesRef.current.forEach(route => {
            try {
              const routeBounds = route.getBounds();
              // Check if bounds are valid
              if (routeBounds && routeBounds.isValid()) {
                bounds.extend(routeBounds);
              }
            } catch (err) {
              console.error('Error with route bounds:', err);
            }
          });
          
          // Only fit bounds if they're valid
          if (bounds.isValid()) {
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
          } else {
            // If no valid route bounds, fall back to showing user and selected producers
            updateMapMarkers();
          }
        } catch (error) {
          console.error('Error fitting bounds to routes:', error);
          // Fallback to updating markers if route bounds calculation fails
          updateMapMarkers();
        }
      }
    } catch (error) {
      console.error('Error updating routes:', error);
    }
    
    setIsLoading(false);
  };
  
  // Render route metrics if a route is selected
  const renderRouteMetrics = () => {
    if (!selectedRoute || !routeMetrics) return null;
    
    const { efficiency, carbonSavings } = routeMetrics;
    
    return (
      <div className="route-info-box mt-3 mb-3">
        <h4 className="text-lg font-semibold mb-2">
          Route to {selectedRoute.producerName}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p><strong>Distance:</strong> {routeMetrics.distance}</p>
            <p><strong>Travel Time:</strong> {routeMetrics.duration}</p>
          </div>
          <div>
            <p>
              <strong>Efficiency:</strong> 
              <span className={`ml-1 route-efficiency-${efficiency.classification}`}>
                {efficiency.score}/100 ({efficiency.classification})
              </span>
            </p>
            <p>
              <strong>Carbon Savings:</strong> 
              <span className="ml-1 text-green-600">
                {carbonSavings.savings} kg CO2 ({carbonSavings.percent}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // Handle transport mode change - This is now handled by the parent component
  const onTransportModeChange = (mode) => {
    // This is now handled by the parent
    if (window.L && mapInstanceRef.current && userLocation && selectedProducers.length > 0) {
      // Clear existing routes
      routesRef.current.forEach(route => route.remove());
      routesRef.current = [];
      
      // Update with new transport mode
      updateRoutes();
    }
  };
  
  return (
    <div className="rounded-lg overflow-hidden border">
      {selectedRoute && renderRouteMetrics()}
      
      <div 
        ref={mapRef} 
        style={{ 
          height: '400px', 
          width: '100%',
          position: 'relative'
        }}
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="text-center">
              <i className="fas fa-spinner fa-spin fa-2x mb-2"></i>
              <p>Calculating routes...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 bg-white text-xs text-gray-600 border-t">
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-2">
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></div>
            <span>Selected Producer</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
            <span>Available Producer</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <div className="flex items-center">
            <div className="inline-block h-2 w-6 bg-green-600 mr-2"></div>
            <span>Excellent Route</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block h-2 w-6 bg-blue-400 mr-2"></div>
            <span>Good Route</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block h-2 w-6 bg-yellow-500 mr-2"></div>
            <span>Moderate Route</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block h-2 w-6 bg-red-500 mr-2"></div>
            <span>Poor Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;