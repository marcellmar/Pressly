import React, { useEffect, useRef, useCallback } from 'react';

/**
 * PrinterMap Component
 * 
 * Displays a map of nearby print producers using Leaflet (no API key needed)
 * Integrates with OpenStreetMap for free map tiles
 */
const PrinterMap = ({ producers, userLocation, onProducerSelect, mapLayers = {} }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  
  // Expose references for testing
  window.mapRef = mapRef;
  window.mapInstanceRef = mapInstanceRef;
  window.markersRef = markersRef;

  // References to layer groups and overlays
  const layerGroupsRef = useRef({
    zoning: null,
    sustainability: null,
    truckRoutes: null,
    economicZones: null,
    productionDensity: null,
    chicagoCorridors: null
  });

  // Function to update map layers based on mapLayers props
  const updateMapLayers = useCallback(() => {
    if (!window.L || !mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    
    // Create layer groups if they don't exist
    if (!layerGroupsRef.current.zoning && mapLayers.zoning) {
      layerGroupsRef.current.zoning = createZoningLayer();
      layerGroupsRef.current.zoning.addTo(map);
    } else if (layerGroupsRef.current.zoning && !mapLayers.zoning) {
      map.removeLayer(layerGroupsRef.current.zoning);
      layerGroupsRef.current.zoning = null;
    }
    
    if (!layerGroupsRef.current.sustainability && mapLayers.sustainability) {
      layerGroupsRef.current.sustainability = createSustainabilityLayer();
      layerGroupsRef.current.sustainability.addTo(map);
    } else if (layerGroupsRef.current.sustainability && !mapLayers.sustainability) {
      map.removeLayer(layerGroupsRef.current.sustainability);
      layerGroupsRef.current.sustainability = null;
    }
    
    if (!layerGroupsRef.current.truckRoutes && mapLayers.truckRoutes) {
      layerGroupsRef.current.truckRoutes = createTruckRoutesLayer();
      layerGroupsRef.current.truckRoutes.addTo(map);
    } else if (layerGroupsRef.current.truckRoutes && !mapLayers.truckRoutes) {
      map.removeLayer(layerGroupsRef.current.truckRoutes);
      layerGroupsRef.current.truckRoutes = null;
    }
    
    if (!layerGroupsRef.current.economicZones && mapLayers.economicZones) {
      layerGroupsRef.current.economicZones = createEconomicZonesLayer();
      layerGroupsRef.current.economicZones.addTo(map);
    } else if (layerGroupsRef.current.economicZones && !mapLayers.economicZones) {
      map.removeLayer(layerGroupsRef.current.economicZones);
      layerGroupsRef.current.economicZones = null;
    }
    
    if (!layerGroupsRef.current.productionDensity && mapLayers.productionDensity) {
      layerGroupsRef.current.productionDensity = createProductionDensityLayer();
      layerGroupsRef.current.productionDensity.addTo(map);
    } else if (layerGroupsRef.current.productionDensity && !mapLayers.productionDensity) {
      map.removeLayer(layerGroupsRef.current.productionDensity);
      layerGroupsRef.current.productionDensity = null;
    }
    
    if (!layerGroupsRef.current.chicagoCorridors && mapLayers.chicagoCorridors) {
      layerGroupsRef.current.chicagoCorridors = createChicagoCorridorsLayer();
      layerGroupsRef.current.chicagoCorridors.addTo(map);
    } else if (layerGroupsRef.current.chicagoCorridors && !mapLayers.chicagoCorridors) {
      map.removeLayer(layerGroupsRef.current.chicagoCorridors);
      layerGroupsRef.current.chicagoCorridors = null;
    }
  }, [mapLayers]);
  
  // Expose updateMapMarkers to window for testing
  const updateMapMarkers = useCallback(() => {
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
    }
    
    // HARD RESET: Force all Chicago producers to be shown
    console.log(`Forcing ${producers ? producers.length : 0} producer markers on the map`);
    
    // Predefined coordinates across Chicago for random distribution
    const chicagoLocations = [
      [41.8781, -87.6298], // Downtown
      [41.9210, -87.6770], // Lincoln Park
      [41.8919, -87.6051], // River North
      [41.8855, -87.6627], // West Loop
      [41.7809, -87.5991], // Hyde Park
      [41.9231, -87.7093], // Logan Square
      [41.8296, -87.6236], // Bronzeville
      [41.8537, -87.6852], // Pilsen
      [41.9678, -87.6873], // Uptown
      [41.9664, -87.6376], // Lakeview
      [41.9483, -87.6556], // Wrigleyville
      [41.9170, -87.6926], // Wicker Park
      [41.8960, -87.6279], // Gold Coast
      [41.9742, -87.6680], // Ravenswood
      [41.8330, -87.6515], // Bridgeport
      [41.7955, -87.5917]  // University of Chicago
    ];
    
    if (producers && producers.length > 0) {
      let markersCreated = 0;
      let markersWithOriginalCoords = 0;
      
      // Each producer WILL get a marker, no exceptions
      producers.forEach((producer, index) => {
        // Try to get valid coordinates from producer data
        let lat, lng;
        let hasOriginalCoords = false;
        
        if (producer.location && 
            producer.location.lat && !isNaN(parseFloat(producer.location.lat)) && 
            producer.location.lng && !isNaN(parseFloat(producer.location.lng))) {
          lat = parseFloat(producer.location.lat);
          lng = parseFloat(producer.location.lng);
          hasOriginalCoords = true;
        } else if (producer.latitude && producer.longitude) {
          lat = parseFloat(producer.latitude);
          lng = parseFloat(producer.longitude);
          hasOriginalCoords = true;
        } else if (producer.lat && producer.lng) {
          lat = parseFloat(producer.lat);
          lng = parseFloat(producer.lng);
          hasOriginalCoords = true;
        } else {
          // Assign a predefined Chicago location (cycle through them)
          const locationIndex = index % chicagoLocations.length;
          const baseLocation = chicagoLocations[locationIndex];
          
          // Add a small random offset to prevent exact overlap
          lat = baseLocation[0] + (Math.random() * 0.02 - 0.01);
          lng = baseLocation[1] + (Math.random() * 0.02 - 0.01);
          
          console.warn(`Assigning Chicago location to ${producer.name || 'unnamed producer'}`);
        }
        
        // Count producers with original coordinates
        if (hasOriginalCoords) {
          markersWithOriginalCoords++;
        }
        
        // Create an icon with distinctive appearance
        const iconHtml = hasOriginalCoords ? 
          `<i class="fas fa-print"></i>` : 
          `<i class="fas fa-map-pin"></i>`;
        
        // Determine class based on availability and if it has original coordinates
        const markerClass = `producer-marker ${producer.availabilityPercent > 50 ? 'high-availability' : 'low-availability'} ${hasOriginalCoords ? '' : 'approximate'}`;
        
        // Create and add the marker - ALL producers get a marker
        const marker = window.L.marker([lat, lng], {
          icon: window.L.divIcon({
            className: markerClass,
            html: iconHtml,
            iconSize: [25, 25]
          })
        })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>${producer.name || `Producer #${index + 1}`}</strong><br/>
            <div style="margin: 5px 0;">
              <span style="color: #F1C40F;">
                ${'★'.repeat(Math.floor(producer.rating || 4))}${'☆'.repeat(5 - Math.floor(producer.rating || 4))}
              </span>
              <span style="color: #555; font-size: 0.8em;">${producer.rating || "4.0"}</span>
            </div>
            <div style="margin-bottom: 5px;">
              <strong>Availability:</strong> ${producer.availabilityPercent || "75"}%
            </div>
            ${!hasOriginalCoords ? `<div style="margin-bottom: 5px; color: orange;">
              <strong>Note:</strong> Approximate location
            </div>` : ''}
            <div style="margin-bottom: 5px;">
              <strong>ID:</strong> ${producer.id || index}
            </div>
            <button class="map-contact-btn" data-id="${producer.id || index}">Contact</button>
          </div>
        `);
        
        // Add to markers reference
        markersRef.current.push(marker);
        markersCreated++;
        
        // Also update the producer data with the coordinates used
        if (!hasOriginalCoords) {
          if (!producer.location) {
            producer.location = {};
          }
          producer.location.lat = lat;
          producer.location.lng = lng;
        }
      });
      
      // Log results
      console.log(`Created ${markersCreated} markers total:`);
      console.log(`- ${markersWithOriginalCoords} with original coordinates`);
      console.log(`- ${markersCreated - markersWithOriginalCoords} with assigned Chicago locations`);
      
      // Save marker stats to window for testing
      window.mapStats = {
        totalMarkers: markersCreated,
        markersWithOriginalCoords,
        markersWithAssignedCoords: markersCreated - markersWithOriginalCoords,
        totalProducers: producers.length
      };
      
      // Set bounds to include all markers if there are any
      if (markersRef.current.length > 0) {
        const bounds = window.L.latLngBounds(markersRef.current.map(marker => marker.getLatLng()));
        map.fitBounds(bounds, { padding: [50, 50] });
        
        // Force a map redraw to ensure all markers are visible
        setTimeout(() => {
          map.invalidateSize();
          console.log('Map refreshed to ensure all markers are visible');
        }, 100);
      } else {
        console.warn('No valid markers to display on map');
      }
    }
    
    // Apply map layers after adding markers
    updateMapLayers();
  }, [producers, userLocation, updateMapLayers]);

  // Expose updateMapMarkers to window for testing
  window.updateMapMarkers = updateMapMarkers;
  
  // Initialize map with markers and layers
  const initializeMap = useCallback(() => {
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
      .producer-marker.high-availability {
        background-color: #28a745;
      }
      .producer-marker.low-availability {
        background-color: #ffc107;
      }
      .map-contact-btn {
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 3px;
        padding: 4px 8px;
        margin-top: 5px;
        cursor: pointer;
      }
      .leaflet-popup-content {
        margin: 10px;
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
    
    // Add click handler for popup buttons
    document.addEventListener('click', (e) => {
      if (e.target.className === 'map-contact-btn' && e.target.dataset.id) {
        const producerId = parseInt(e.target.dataset.id);
        const producer = producers.find(p => p.id === producerId);
        if (producer && onProducerSelect) {
          onProducerSelect(producer);
        }
      }
    });
  }, [producers, userLocation, updateMapMarkers, onProducerSelect]);
  
  useEffect(() => {
    // Load Leaflet dynamically (to avoid SSR issues)
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
  }, [initializeMap]);
  
  // Update map when producers or user location changes
  useEffect(() => {
    if (window.L && mapInstanceRef.current && (producers || userLocation)) {
      updateMapMarkers();
    }
  }, [producers, userLocation, updateMapMarkers]);
  
  // Update map when layers change
  useEffect(() => {
    if (window.L && mapInstanceRef.current) {
      updateMapLayers();
    }
  }, [mapLayers, updateMapLayers]);

  // Create industrial zoning layer
  const createZoningLayer = () => {
    const zoningGroup = window.L.layerGroup();
    
    // Sample industrial zones (Chicago manufacturing districts)
    const industrialZones = [
      { name: "Kinzie Corridor", center: [41.889, -87.654], radius: 1000 },
      { name: "Pilsen Industrial Corridor", center: [41.857, -87.646], radius: 1200 },
      { name: "Calumet Industrial Corridor", center: [41.762, -87.586], radius: 1500 },
      { name: "Greater Southwest Industrial Corridor", center: [41.794, -87.694], radius: 1300 },
      { name: "Northwest Industrial Corridor", center: [41.917, -87.747], radius: 1100 }
    ];
    
    // Add industrial zone areas
    industrialZones.forEach(zone => {
      window.L.circle(zone.center, {
        radius: zone.radius,
        color: '#8e44ad',
        fillColor: '#9b59b6',
        fillOpacity: 0.2,
        weight: 2
      })
      .bindTooltip(zone.name)
      .addTo(zoningGroup);
    });
    
    return zoningGroup;
  };
  
  // Create sustainability heatmap layer
  const createSustainabilityLayer = () => {
    const sustainabilityGroup = window.L.layerGroup();
    
    // Only consider producers with sustainability data
    const producerData = producers.filter(p => 
      p.location && p.location.lat && p.location.lng && 
      p.sustainabilityScore !== undefined
    );
    
    // No heatmap if no data
    if (producerData.length === 0) return sustainabilityGroup;
    
    // Convert to heatmap points format
    const points = producerData.map(p => [
      p.location.lat, 
      p.location.lng, 
      p.sustainabilityScore / 100 // Normalize to 0-1 range
    ]);
    
    // Check if L.heatLayer is available
    if (!window.L.heatLayer) {
      // Load Leaflet.heat plugin
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.onload = () => {
        if (window.L.heatLayer) {
          // Create heatmap layer and add to the group
          window.L.heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
              0.4: '#66bb6a', // Green for high sustainability
              0.6: '#ffeb3b', // Yellow for medium
              0.8: '#ff9800', // Orange for lower
              1.0: '#f44336'  // Red for lowest
            }
          }).addTo(sustainabilityGroup);
        }
      };
      document.head.appendChild(script);
    } else {
      // Create heatmap layer if plugin is already loaded
      window.L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.4: '#66bb6a', // Green for high sustainability
          0.6: '#ffeb3b', // Yellow for medium
          0.8: '#ff9800', // Orange for lower
          1.0: '#f44336'  // Red for lowest
        }
      }).addTo(sustainabilityGroup);
    }
    
    return sustainabilityGroup;
  };
  
  // Create truck routes layer
  const createTruckRoutesLayer = () => {
    const routesGroup = window.L.layerGroup();
    
    // Sample truck routes in Chicago
    const truckRoutes = [
      // North-South routes
      { path: [[41.967, -87.679], [41.751, -87.679]], name: "Western Ave" },
      { path: [[41.965, -87.654], [41.750, -87.654]], name: "Ashland Ave" },
      { path: [[41.961, -87.629], [41.754, -87.629]], name: "Halsted St" },
      { path: [[41.974, -87.699], [41.754, -87.699]], name: "Cicero Ave" },
      
      // East-West routes
      { path: [[41.891, -87.725], [41.891, -87.595]], name: "Chicago Ave" },
      { path: [[41.851, -87.725], [41.851, -87.595]], name: "Roosevelt Rd" },
      { path: [[41.910, -87.725], [41.910, -87.595]], name: "Fullerton Ave" },
      { path: [[41.925, -87.725], [41.925, -87.595]], name: "Belmont Ave" },
      { path: [[41.875, -87.725], [41.875, -87.595]], name: "Madison St" }
    ];
    
    // Add truck route lines
    truckRoutes.forEach(route => {
      window.L.polyline(route.path, {
        color: '#2c3e50',
        weight: 5,
        opacity: 0.7,
        dashArray: '10, 5'
      })
      .bindTooltip(route.name)
      .addTo(routesGroup);
    });
    
    return routesGroup;
  };
  
  // Create economic zones layer
  const createEconomicZonesLayer = () => {
    const economicGroup = window.L.layerGroup();
    
    // Sample economic zones
    const economicZones = [
      { 
        name: "TIF District - Near North", 
        center: [41.895, -87.635], 
        radius: 800,
        color: '#3498db',
        fillColor: '#3498db'
      },
      { 
        name: "Enterprise Zone - West Side", 
        center: [41.875, -87.685], 
        radius: 1100,
        color: '#e74c3c',
        fillColor: '#e74c3c'
      },
      { 
        name: "Opportunity Zone - South", 
        center: [41.785, -87.625], 
        radius: 1200,
        color: '#f39c12',
        fillColor: '#f39c12'
      },
      { 
        name: "Neighborhood Opportunity Fund - Southwest", 
        center: [41.812, -87.695], 
        radius: 900,
        color: '#27ae60',
        fillColor: '#27ae60'
      }
    ];
    
    // Add economic zone areas
    economicZones.forEach(zone => {
      window.L.circle(zone.center, {
        radius: zone.radius,
        color: zone.color,
        fillColor: zone.fillColor,
        fillOpacity: 0.2,
        weight: 2
      })
      .bindTooltip(zone.name)
      .addTo(economicGroup);
    });
    
    return economicGroup;
  };
  
  // Create production density layer
  const createProductionDensityLayer = () => {
    const densityGroup = window.L.layerGroup();
    
    // Only create density layer if there are producers
    if (!producers || producers.length === 0) return densityGroup;
    
    // Count producers by neighborhood/area
    const productionClusters = {};
    producers.forEach(producer => {
      if (producer.location && producer.location.neighborhood) {
        const neighborhood = producer.location.neighborhood;
        if (!productionClusters[neighborhood]) {
          productionClusters[neighborhood] = {
            count: 0,
            lat: producer.location.lat,
            lng: producer.location.lng
          };
        }
        productionClusters[neighborhood].count++;
      }
    });
    
    // Create circles based on density
    Object.entries(productionClusters).forEach(([name, data]) => {
      const radius = Math.min(data.count * 100, 1000); // Scale radius based on count (capped at 1000m)
      const color = getColorForProductionDensity(data.count);
      
      window.L.circle([data.lat, data.lng], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
        weight: 1
      })
      .bindTooltip(`${name}: ${data.count} producers`)
      .addTo(densityGroup);
    });
    
    return densityGroup;
  };
  
  // Helper function to get color based on production density
  const getColorForProductionDensity = (count) => {
    if (count > 5) return '#d35400'; // High density
    if (count > 3) return '#e67e22'; // Medium-high density
    if (count > 1) return '#f39c12'; // Medium density
    return '#f1c40f'; // Low density
  };
  
  // Create Chicago Industrial Corridors layer from City of Chicago data
  const createChicagoCorridorsLayer = () => {
    const corridorsGroup = window.L.layerGroup();
    
    // Load GeoJSON data from Chicago Data Portal
    const fetchCorridorsGeoJSON = async () => {
      try {
        // Check if Leaflet is loaded
        if (!window.L) return;
        
        // Fetch data from the Chicago Data Portal
        const response = await fetch('https://data.cityofchicago.org/resource/dj47-wfun.geojson');
        
        if (!response.ok) {
          console.error('Failed to fetch Chicago Industrial Corridors:', response.statusText);
          return;
        }
        
        const geoJSONData = await response.json();
        
        // Add the GeoJSON layer to the map with styling
        window.L.geoJSON(geoJSONData, {
          style: () => ({
            color: '#16a085',
            weight: 3,
            opacity: 0.8,
            fillColor: '#1abc9c',
            fillOpacity: 0.2
          }),
          onEachFeature: (feature, layer) => {
            // Add tooltips with corridor names
            if (feature.properties && feature.properties.name) {
              layer.bindTooltip(feature.properties.name);
            } else if (feature.properties && feature.properties.corridor_n) {
              layer.bindTooltip(feature.properties.corridor_n);
            } else if (feature.properties && feature.properties.label) {
              layer.bindTooltip(feature.properties.label);
            }
            
            // Add popups with additional information
            let popupContent = '<div style="min-width: 150px;">';
            if (feature.properties) {
              // Add name if available
              if (feature.properties.name || feature.properties.corridor_n) {
                popupContent += `<strong>${feature.properties.name || feature.properties.corridor_n}</strong><br/>`;
              }
              
              // Add any other available properties
              if (feature.properties.acres) {
                popupContent += `<div>Size: ${feature.properties.acres} acres</div>`;
              }
              if (feature.properties.location) {
                popupContent += `<div>Location: ${feature.properties.location}</div>`;
              }
              if (feature.properties.area_numbe) {
                popupContent += `<div>Area Number: ${feature.properties.area_numbe}</div>`;
              }
            }
            popupContent += '<div>Official Chicago Industrial Corridor</div>';
            popupContent += '</div>';
            
            layer.bindPopup(popupContent);
          }
        }).addTo(corridorsGroup);
      } catch (error) {
        console.error('Error loading Chicago Industrial Corridors GeoJSON:', error);
        
        // If fetch fails, create a fallback with some key corridors
        createFallbackCorridors();
      }
    };
    
    // Create fallback corridors if GeoJSON fetch fails
    const createFallbackCorridors = () => {
      const fallbackCorridors = [
        {
          name: "Kinzie Corridor",
          // Rough polygon for Kinzie Corridor
          coords: [
            [41.8869, -87.6703],
            [41.8917, -87.6703],
            [41.8917, -87.6550],
            [41.8869, -87.6550]
          ]
        },
        {
          name: "Pilsen Industrial Corridor",
          // Rough polygon for Pilsen Corridor
          coords: [
            [41.8480, -87.6650],
            [41.8535, -87.6650],
            [41.8535, -87.6450],
            [41.8480, -87.6450]
          ]
        },
        {
          name: "Calumet Industrial Corridor",
          // Rough polygon for Calumet Corridor
          coords: [
            [41.7200, -87.5900],
            [41.7300, -87.5900],
            [41.7300, -87.5800],
            [41.7200, -87.5800]
          ]
        }
      ];
      
      // Add polygons for fallback corridors
      fallbackCorridors.forEach(corridor => {
        window.L.polygon(corridor.coords, {
          color: '#16a085',
          weight: 2,
          opacity: 0.8,
          fillColor: '#1abc9c',
          fillOpacity: 0.2
        })
        .bindTooltip(corridor.name)
        .bindPopup(`<strong>${corridor.name}</strong><br/><div>Chicago Industrial Corridor</div>`)
        .addTo(corridorsGroup);
      });
    };
    
    // Start loading GeoJSON data
    fetchCorridorsGeoJSON();
    
    return corridorsGroup;
  };

  return (
    <div className="rounded-lg overflow-hidden border map-container">
      <div 
        ref={mapRef} 
        style={{ 
          height: '400px', 
          width: '100%'
        }}
      ></div>
      <div className="p-3 bg-white text-xs text-gray-600">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-600 mr-2"></div>
            <span>High Availability</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Low Availability</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterMap;