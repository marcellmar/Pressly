import React, { useEffect, useRef, useState } from 'react';
import { loadMapLibre, initializeMap, addUserLocationMarker, addProducerMarker, createActivityHeatmap } from '../../services/mapping/mapLibreService';

/**
 * ProductionNetworkMap Component
 * 
 * Displays a real-time visualization of the Pressly production network
 * showing activity heatmaps, capacity, and network connections
 * using MapLibre GL for advanced visualization
 */
const ProductionNetworkMap = ({
  userLocation,
  producers = [],
  showHeatmap = true,
  showCapacity = true,
  onProducerSelect
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [activeView, setActiveView] = useState('standard'); // 'standard', 'heatmap', 'capacity'
  
  // Initialize map on mount
  useEffect(() => {
    const setupMap = async () => {
      setIsLoading(true);
      
      try {
        // Load MapLibre GL library
        await loadMapLibre();
        
        // Initialize the map
        if (mapContainerRef.current && window.maplibregl) {
          // Create map instance
          const mapOptions = {
            center: userLocation ? [userLocation.lng, userLocation.lat] : [-87.6298, 41.8781], // Chicago
            zoom: 11
          };
          
          const map = initializeMap(mapContainerRef.current, mapOptions);
          
          // Wait for map to load
          map.on('load', () => {
            mapInstanceRef.current = map;
            setMapReady(true);
            setIsLoading(false);
          });
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };
    
    setupMap();
    
    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Add markers and layers when map is ready or data changes
  useEffect(() => {
    if (mapReady && mapInstanceRef.current) {
      updateMapData();
    }
  }, [mapReady, userLocation, producers, activeView]);
  
  const updateMapData = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    // Clear existing layers
    clearMapLayers();
    
    // Add user location marker
    if (userLocation && userLocation.lat && userLocation.lng) {
      addUserLocationMarker(map, userLocation);
    }
    
    // Add producer markers
    if (producers && producers.length > 0) {
      producers.forEach(producer => {
        addProducerMarker(map, producer, onProducerSelect);
      });
      
      // Create activity heatmap if requested
      if (showHeatmap && activeView === 'heatmap') {
        createActivityHeatmap(map, producers, 'activity-source', 'activity-heatmap');
      }
      
      // Add capacity visualization if requested
      if (showCapacity && activeView === 'capacity') {
        createCapacityVisualization(map, producers);
      }
      
      // Add network connections in standard view
      if (activeView === 'standard') {
        createNetworkConnections(map, userLocation, producers);
      }
      
      // Fit map to include all markers
      fitMapToMarkers(map, userLocation, producers);
    }
  };
  
  // Clear existing map layers
  const clearMapLayers = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    // Remove heatmap layer and source
    if (map.getLayer('activity-heatmap')) {
      map.removeLayer('activity-heatmap');
    }
    if (map.getSource('activity-source')) {
      map.removeSource('activity-source');
    }
    
    // Remove capacity layers and sources
    if (map.getLayer('capacity-circles')) {
      map.removeLayer('capacity-circles');
    }
    if (map.getSource('capacity-source')) {
      map.removeSource('capacity-source');
    }
    
    // Remove network connections
    if (map.getLayer('network-connections')) {
      map.removeLayer('network-connections');
    }
    if (map.getSource('network-connections-source')) {
      map.removeSource('network-connections-source');
    }
    
    // Remove any markers (they need to be managed separately)
    // This would be handled by implementing a marker management system
  };
  
  // Create capacity visualization
  const createCapacityVisualization = (map, producers) => {
    // Create GeoJSON for capacity circles
    const capacityGeoJSON = {
      type: 'FeatureCollection',
      features: producers.map(producer => {
        if (!producer.location || !producer.location.lat || !producer.location.lng) {
          return null;
        }
        
        // Calculate radius based on availability percentage
        // Higher availability = larger circle
        const radius = producer.availabilityPercent / 100 * 500; // Max 500m radius
        
        return {
          type: 'Feature',
          properties: {
            name: producer.name,
            availability: producer.availabilityPercent,
            capacity: 100 - producer.availabilityPercent // Inverse of availability
          },
          geometry: {
            type: 'Point',
            coordinates: [producer.location.lng, producer.location.lat]
          }
        };
      }).filter(Boolean) // Remove null entries
    };
    
    // Add source for capacity data
    if (map.getSource('capacity-source')) {
      map.getSource('capacity-source').setData(capacityGeoJSON);
    } else {
      map.addSource('capacity-source', {
        type: 'geojson',
        data: capacityGeoJSON
      });
      
      // Add circle layer
      map.addLayer({
        id: 'capacity-circles',
        type: 'circle',
        source: 'capacity-source',
        paint: {
          // Circle radius based on availability
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'availability'],
            0, 5,
            50, 15,
            100, 25
          ],
          // Circle color based on availability (green = high, red = low)
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'availability'],
            0, '#dc3545',
            50, '#ffc107',
            100, '#28a745'
          ],
          'circle-opacity': 0.7,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
    }
  };
  
  // Create network connections between user and producers
  const createNetworkConnections = (map, userLocation, producers) => {
    if (!userLocation || !userLocation.lat || !userLocation.lng) return;
    
    // Create GeoJSON for connections
    const connections = {
      type: 'FeatureCollection',
      features: producers.map(producer => {
        if (!producer.location || !producer.location.lat || !producer.location.lng) {
          return null;
        }
        
        return {
          type: 'Feature',
          properties: {
            name: producer.name,
            // Use availability to determine line thickness and opacity
            weight: producer.availabilityPercent / 100
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [userLocation.lng, userLocation.lat],
              [producer.location.lng, producer.location.lat]
            ]
          }
        };
      }).filter(Boolean) // Remove null entries
    };
    
    // Add source for network connections
    if (map.getSource('network-connections-source')) {
      map.getSource('network-connections-source').setData(connections);
    } else {
      map.addSource('network-connections-source', {
        type: 'geojson',
        data: connections
      });
      
      // Add line layer
      map.addLayer({
        id: 'network-connections',
        type: 'line',
        source: 'network-connections-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          // Line width based on availability weight
          'line-width': [
            'interpolate',
            ['linear'],
            ['get', 'weight'],
            0, 1,
            1, 3
          ],
          // Line color based on availability (more available = brighter)
          'line-color': '#3a6ea5',
          // Line opacity based on availability
          'line-opacity': [
            'interpolate',
            ['linear'],
            ['get', 'weight'],
            0, 0.3,
            1, 0.8
          ]
        }
      });
    }
  };
  
  // Fit map to include all markers
  const fitMapToMarkers = (map, userLocation, producers) => {
    const coordinates = [];
    
    // Add user location
    if (userLocation && userLocation.lat && userLocation.lng) {
      coordinates.push([userLocation.lng, userLocation.lat]);
    }
    
    // Add producer locations
    producers.forEach(producer => {
      if (producer.location && producer.location.lat && producer.location.lng) {
        coordinates.push([producer.location.lng, producer.location.lat]);
      }
    });
    
    // Only proceed if we have at least one valid coordinate
    if (coordinates.length > 0) {
      try {
        // Create a bounds object
        const bounds = coordinates.reduce((bounds, coord) => {
          // Make sure coordinates are valid
          if (coord && coord.length === 2 && 
              !isNaN(coord[0]) && !isNaN(coord[1])) {
            return bounds.extend(coord);
          }
          return bounds;
        }, new window.maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
        
        // Fit the map to the bounds
        map.fitBounds(bounds, {
          padding: 50
        });
      } catch (error) {
        console.error('Error fitting map to bounds:', error);
        // Fall back to centering on user location or first producer
        if (userLocation && userLocation.lat && userLocation.lng) {
          map.setCenter([userLocation.lng, userLocation.lat]);
          map.setZoom(10);
        } else if (producers.length > 0 && producers[0].location) {
          const loc = producers[0].location;
          if (loc.lat && loc.lng) {
            map.setCenter([loc.lng, loc.lat]);
            map.setZoom(10);
          }
        }
      }
    }
  };
  
  // Toggle between different map views
  const toggleMapView = (view) => {
    setActiveView(view);
  };
  
  return (
    <div className="production-network-map relative rounded-lg overflow-hidden border">
      <div className="absolute top-3 right-3 z-10 bg-white rounded shadow-md">
        <div className="view-toggle p-2 flex space-x-2">
          <button 
            className={`px-2 py-1 text-xs rounded ${activeView === 'standard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleMapView('standard')}
          >
            Network
          </button>
          {showHeatmap && (
            <button 
              className={`px-2 py-1 text-xs rounded ${activeView === 'heatmap' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => toggleMapView('heatmap')}
            >
              Activity
            </button>
          )}
          {showCapacity && (
            <button 
              className={`px-2 py-1 text-xs rounded ${activeView === 'capacity' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => toggleMapView('capacity')}
            >
              Capacity
            </button>
          )}
        </div>
      </div>
      
      <div 
        ref={mapContainerRef}
        className="w-full"
        style={{ height: '400px' }}
      ></div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading network map...</p>
          </div>
        </div>
      )}
      
      <div className="p-3 bg-white text-xs text-gray-600 border-t">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>High Availability</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Medium Availability</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Low Availability</span>
          </div>
        </div>
        
        <div className="mt-2 text-gray-700">
          <span className="font-semibold">{producers.length}</span> active producers in the network
        </div>
      </div>
    </div>
  );
};

export default ProductionNetworkMap;