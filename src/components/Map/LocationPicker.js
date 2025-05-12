import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, Navigation, Crosshair, Check, X } from 'lucide-react';

const LocationPicker = ({ onLocationSelected, initialLocation = null }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locating, setLocating] = useState(false);
  
  // Default center on Chicago if no initial location
  const defaultCenter = { lat: 41.8781, lng: -87.6298 };
  
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.defer = true;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else if (!map) {
      initMap();
    }
  }, []);
  
  // Initialize the map
  const initMap = () => {
    if (mapRef.current && !map) {
      const center = initialLocation || defaultCenter;
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });
      
      // Add click event to map
      mapInstance.addListener('click', (e) => {
        placeMarker(e.latLng);
      });
      
      // Create geocoder for address lookup
      const geocoder = new window.google.maps.Geocoder();
      
      // Add initial marker if location is provided
      if (initialLocation) {
        const latLng = new window.google.maps.LatLng(initialLocation.lat, initialLocation.lng);
        placeMarker(latLng);
        
        // Get address for initial location
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address);
          }
        });
      }
      
      // Function to place marker on map
      function placeMarker(latLng) {
        // Remove existing marker
        if (marker) {
          marker.setMap(null);
        }
        
        // Create new marker
        const newMarker = new window.google.maps.Marker({
          position: latLng,
          map: mapInstance,
          animation: window.google.maps.Animation.DROP,
          draggable: true
        });
        
        // Get address when marker is placed
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address);
          } else {
            setAddress('Location selected');
          }
        });
        
        // Update selected location
        const location = {
          lat: latLng.lat(),
          lng: latLng.lng()
        };
        setSelectedLocation(location);
        
        // Add drag end event to marker
        newMarker.addListener('dragend', () => {
          const newPosition = newMarker.getPosition();
          const newLocation = {
            lat: newPosition.lat(),
            lng: newPosition.lng()
          };
          setSelectedLocation(newLocation);
          
          // Update address on drag end
          geocoder.geocode({ location: newPosition }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setAddress(results[0].formatted_address);
            } else {
              setAddress('Location selected');
            }
          });
        });
        
        setMarker(newMarker);
      }
      
      setMap(mapInstance);
      setMapLoaded(true);
    }
  };
  
  // Get current location
  const getCurrentLocation = () => {
    setLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Center map on current location
          if (map) {
            map.setCenter(location);
            
            // Place marker at current location
            const latLng = new window.google.maps.LatLng(location.lat, location.lng);
            
            // Remove existing marker
            if (marker) {
              marker.setMap(null);
            }
            
            // Create new marker
            const newMarker = new window.google.maps.Marker({
              position: latLng,
              map: map,
              animation: window.google.maps.Animation.DROP,
              draggable: true
            });
            
            // Get address for current location
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setAddress(results[0].formatted_address);
              } else {
                setAddress('Current location');
              }
            });
            
            // Add drag end event to marker
            newMarker.addListener('dragend', () => {
              const newPosition = newMarker.getPosition();
              const newLocation = {
                lat: newPosition.lat(),
                lng: newPosition.lng()
              };
              setSelectedLocation(newLocation);
              
              // Update address on drag end
              geocoder.geocode({ location: newPosition }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  setAddress(results[0].formatted_address);
                } else {
                  setAddress('Location selected');
                }
              });
            });
            
            setMarker(newMarker);
            setSelectedLocation(location);
          }
          
          setLocating(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setLocating(false);
          alert('Unable to get your current location. Please select location on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setLocating(false);
    }
  };
  
  // Confirm location selection
  const confirmLocation = () => {
    if (selectedLocation && onLocationSelected) {
      onLocationSelected({
        ...selectedLocation,
        address: address
      });
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Select Your Location
        </CardTitle>
        <CardDescription>
          Click on the map or use the current location button
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          style={{ height: '350px', width: '100%' }}
          className="relative"
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button 
              size="sm"
              variant="outline" 
              className="bg-white"
              onClick={getCurrentLocation}
              disabled={locating}
            >
              {locating ? (
                <div className="flex items-center">
                  <div className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent mr-1"></div>
                  <span>Locating...</span>
                </div>
              ) : (
                <>
                  <Crosshair className="h-4 w-4 mr-1" />
                  Current Location
                </>
              )}
            </Button>
          </div>
        </div>
        
        {selectedLocation && (
          <div className="p-4 border-t">
            <div className="mb-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-800">
                <MapPin className="h-3 w-3 mr-1" />
                {address}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (marker) {
                    marker.setMap(null);
                    setMarker(null);
                  }
                  setSelectedLocation(null);
                  setAddress('');
                }}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
              
              <Button onClick={confirmLocation} className="flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Confirm Location
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationPicker;