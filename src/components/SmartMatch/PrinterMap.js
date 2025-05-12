import React, { useEffect, useRef } from 'react';

/**
 * PrinterMap Component
 * 
 * Displays a map of nearby print producers using Leaflet (no API key needed)
 * Integrates with OpenStreetMap for free map tiles
 */
const PrinterMap = ({ producers, userLocation, onProducerSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  
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
  }, []);
  
  // Update map when producers or user location changes
  useEffect(() => {
    if (window.L && mapInstanceRef.current && (producers || userLocation)) {
      updateMapMarkers();
    }
  }, [producers, userLocation]);
  
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
          // Add marker for this producer
          const marker = window.L.marker([producer.location.lat, producer.location.lng], {
            icon: window.L.divIcon({
              className: `producer-marker ${producer.availabilityPercent > 50 ? 'high-availability' : 'low-availability'}`,
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
                <strong>Distance:</strong> ${producer.distance.toFixed(1)} miles
              </div>
              <button class="map-contact-btn" data-id="${producer.id}">Contact</button>
            </div>
          `);
          
          markersRef.current.push(marker);
        }
      });
      
      // Set bounds to include all markers if there are any
      if (markersRef.current.length > 0) {
        const bounds = window.L.latLngBounds(markersRef.current.map(marker => marker.getLatLng()));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };
  
  return (
    <div className="card">
      <h3 className="card-title">Print Producers Map</h3>
      <div 
        ref={mapRef} 
        style={{ 
          height: '400px', 
          width: '100%', 
          borderRadius: '5px',
          marginTop: '1rem'
        }}
      ></div>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p>
          <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i> Your Location
          &nbsp;&nbsp;
          <i className="fas fa-print" style={{ color: '#28a745' }}></i> High Availability
          &nbsp;&nbsp;
          <i className="fas fa-print" style={{ color: '#ffc107' }}></i> Low Availability
        </p>
        <p>Click on a marker to view producer details and contact options.</p>
      </div>
    </div>
  );
};

export default PrinterMap;