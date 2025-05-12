import React, { useEffect, useRef, useState } from 'react';
import { queryPrintBusinesses, querySupportiveBusinesses } from '../../services/mapping/overpassService';
import { calculateBoundingBox, calculateCenterPoint } from '../../utils/locationUtils';

/**
 * IndustryMap Component
 * 
 * Displays a map of print industry businesses and supportive businesses
 * using OpenStreetMap data through the Overpass API
 */
const IndustryMap = ({ 
  center, 
  radius = 5, // km
  includeSupport = true,
  onBusinessSelect = null
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  
  const [businesses, setBusinesses] = useState([]);
  const [supportBusinesses, setSupportBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize map
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
  
  // Fetch data when center or radius changes
  useEffect(() => {
    if (center && center.lat && center.lng) {
      fetchBusinesses();
    }
  }, [center, radius, includeSupport]);
  
  // Update markers when businesses change
  useEffect(() => {
    if (mapInstanceRef.current && businesses.length > 0) {
      updateMapMarkers();
    }
  }, [businesses, supportBusinesses]);
  
  const initializeMap = () => {
    if (!window.L || !mapRef.current) return;
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }
    
    // Set default center (Chicago) if none provided
    const defaultLocation = [41.8781, -87.6298]; // Chicago
    const mapCenter = center ? [center.lat, center.lng] : defaultLocation;
    
    // Create map
    const map = window.L.map(mapRef.current).setView(mapCenter, 12);
    
    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    mapInstanceRef.current = map;
    
    // Add markers if data is already loaded
    if (businesses.length > 0) {
      updateMapMarkers();
    }
  };
  
  const fetchBusinesses = async () => {
    if (!center || !center.lat || !center.lng) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch print businesses
      const printResult = await queryPrintBusinesses(center.lat, center.lng, radius * 1000);
      
      if (printResult.success) {
        setBusinesses(printResult.businesses || []);
      } else {
        setError(printResult.error || 'Failed to fetch print businesses');
      }
      
      // Fetch supportive businesses if enabled
      if (includeSupport) {
        const supportResult = await querySupportiveBusinesses(center.lat, center.lng, radius * 1000);
        
        if (supportResult.success) {
          setSupportBusinesses(supportResult.businesses || []);
        }
      } else {
        setSupportBusinesses([]);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setError(error.message || 'Error fetching businesses');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateMapMarkers = () => {
    if (!window.L || !mapInstanceRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Create marker for center point
    if (center && center.lat && center.lng) {
      const centerMarker = window.L.marker([center.lat, center.lng], {
        icon: window.L.divIcon({
          className: 'user-location-marker',
          html: '<i class="fas fa-user-circle"></i>',
          iconSize: [30, 30]
        })
      }).addTo(mapInstanceRef.current);
      
      markersRef.current.push(centerMarker);
    }
    
    // Add markers for print businesses
    businesses.forEach(business => {
      if (!business.location || !business.location.lat || !business.location.lng) return;
      
      // Create marker icon based on business type
      const markerHtml = getBusinessIcon(business.type);
      
      // Add marker
      const marker = window.L.marker([business.location.lat, business.location.lng], {
        icon: window.L.divIcon({
          className: 'business-marker print-business',
          html: markerHtml,
          iconSize: [30, 30]
        })
      })
      .addTo(mapInstanceRef.current)
      .bindPopup(createBusinessPopup(business));
      
      // Add click handler if provided
      if (onBusinessSelect) {
        marker.on('click', () => {
          onBusinessSelect(business);
        });
      }
      
      markersRef.current.push(marker);
    });
    
    // Add markers for supportive businesses if enabled
    if (includeSupport) {
      supportBusinesses.forEach(business => {
        if (!business.location || !business.location.lat || !business.location.lng) return;
        
        // Create marker icon based on business type
        const markerHtml = getBusinessIcon(business.type, false);
        
        // Add marker
        const marker = window.L.marker([business.location.lat, business.location.lng], {
          icon: window.L.divIcon({
            className: 'business-marker support-business',
            html: markerHtml,
            iconSize: [30, 30]
          })
        })
        .addTo(mapInstanceRef.current)
        .bindPopup(createBusinessPopup(business, false));
        
        // Add click handler if provided
        if (onBusinessSelect) {
          marker.on('click', () => {
            onBusinessSelect(business);
          });
        }
        
        markersRef.current.push(marker);
      });
    }
    
    // Fit bounds to include all markers
    if (markersRef.current.length > 0) {
      const allPoints = [
        ...businesses.map(b => b.location),
        ...includeSupport ? supportBusinesses.map(b => b.location) : []
      ].filter(loc => loc && loc.lat && loc.lng);
      
      if (allPoints.length > 0) {
        const bounds = window.L.latLngBounds(allPoints.map(loc => [loc.lat, loc.lng]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };
  
  // Get icon HTML based on business type
  const getBusinessIcon = (type, isPrintBusiness = true) => {
    let icon = 'fas fa-print';
    let color = isPrintBusiness ? '#3a6ea5' : '#ff6b6b';
    
    switch (type) {
      case 'copyshop':
        icon = 'fas fa-copy';
        break;
      case 'printer':
        icon = 'fas fa-print';
        break;
      case 'stationery':
        icon = 'fas fa-pen';
        color = '#ff9f43';
        break;
      case 'art_supply':
        icon = 'fas fa-paint-brush';
        color = '#ee5253';
        break;
      case 'office_supply':
        icon = 'fas fa-paperclip';
        color = '#10ac84';
        break;
      case 'photographer':
        icon = 'fas fa-camera';
        color = '#2e86de';
        break;
      default:
        icon = isPrintBusiness ? 'fas fa-print' : 'fas fa-store';
    }
    
    return `<i class="${icon}" style="color: ${color};"></i>`;
  };
  
  // Create popup HTML for a business
  const createBusinessPopup = (business, isPrintBusiness = true) => {
    const addressParts = [];
    
    if (business.address) {
      if (business.address.housenumber && business.address.street) {
        addressParts.push(`${business.address.housenumber} ${business.address.street}`);
      } else if (business.address.street) {
        addressParts.push(business.address.street);
      }
      
      if (business.address.city) {
        addressParts.push(business.address.city);
      }
      
      if (business.address.postcode) {
        addressParts.push(business.address.postcode);
      }
    }
    
    const addressText = addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
    
    return `
      <div class="business-popup">
        <h3 class="text-lg font-semibold">${business.name}</h3>
        <p class="text-sm text-gray-600">${isPrintBusiness ? 'Print Business' : 'Support Business'}</p>
        <p class="text-sm mt-2">${addressText}</p>
        ${business.distance ? `<p class="text-sm mt-1">Distance: ${business.distance.toFixed(1)} km</p>` : ''}
        ${business.contact && business.contact.phone ? `<p class="text-sm mt-1">Phone: ${business.contact.phone}</p>` : ''}
        ${business.contact && business.contact.website ? 
          `<p class="text-sm mt-1">
            <a href="${business.contact.website}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
              Website
            </a>
          </p>` : ''}
        <div class="mt-3">
          <button class="business-details-btn px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${business.id}">
            View Details
          </button>
        </div>
      </div>
    `;
  };
  
  return (
    <div className="relative rounded-lg overflow-hidden border">
      <div 
        ref={mapRef} 
        className="w-full h-96"
        style={{ height: '400px' }}
      ></div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading industry data...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="p-3 bg-white text-xs text-gray-600 border-t">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Print Businesses</span>
          </div>
          {includeSupport && (
            <div className="flex items-center">
              <div className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Supportive Businesses</span>
            </div>
          )}
        </div>
        
        <div className="mt-2 text-gray-700">
          <span className="font-semibold">{businesses.length}</span> printing businesses
          {includeSupport && (
            <>
              {' and '}
              <span className="font-semibold">{supportBusinesses.length}</span> supportive businesses
            </>
          )}
          {' found within '}
          <span className="font-semibold">{radius} km</span>
        </div>
      </div>
    </div>
  );
};

export default IndustryMap;