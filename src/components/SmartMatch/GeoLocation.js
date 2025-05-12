import React, { useState, useEffect } from 'react';
import nominatimService from '../../services/mapping/nominatimService';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GeoLocation = ({ onLocationSelected }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [searchRadius, setSearchRadius] = useState(10); // in kilometers, default 10km for Chicago
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [addressSubmitted, setAddressSubmitted] = useState(false);
  const [neighborhoodInfo, setNeighborhoodInfo] = useState(null);
  
  // Chicago area producers with detailed data
  const [producers] = useState([
    { 
      id: 1, 
      name: 'PrintMasters Chicago', 
      rating: 4.9, 
      lat: 41.8781, 
      lng: -87.6298, 
      capabilities: ['Digital', 'Offset', 'Large Format'],
      address: '123 W Madison St, Chicago, IL 60602',
      specialties: ['Business Cards', 'Brochures', 'Banners'],
      turnaround: '2-3 business days',
      priceRange: '$$$'
    },
    { 
      id: 2, 
      name: 'Eco Print Solutions', 
      rating: 4.8, 
      lat: 41.9210, 
      lng: -87.6678, 
      capabilities: ['Digital', 'Eco-friendly', 'Recycled Materials'],
      address: '1658 N Milwaukee Ave, Chicago, IL 60647',
      specialties: ['Recycled Paper Products', 'Soy-based Inks', 'Carbon Neutral Printing'],
      turnaround: '3-5 business days',
      priceRange: '$$$'
    },
    { 
      id: 3, 
      name: 'Lincoln Park Printing', 
      rating: 4.7, 
      lat: 41.9230, 
      lng: -87.6397, 
      capabilities: ['Digital', 'Rush Service', 'Wide Format'],
      address: '2433 N Clark St, Chicago, IL 60614',
      specialties: ['Posters', 'Event Materials', 'Rush Orders'],
      turnaround: '1-2 business days',
      priceRange: '$$$$'
    },
    { 
      id: 4, 
      name: 'South Loop Graphics', 
      rating: 4.6, 
      lat: 41.8666, 
      lng: -87.6227, 
      capabilities: ['Digital', 'Offset', 'Design Services'],
      address: '731 S Plymouth Ct, Chicago, IL 60605',
      specialties: ['Corporate Identity', 'Marketing Materials', 'Catalogs'],
      turnaround: '3-4 business days',
      priceRange: '$$$'
    },
    { 
      id: 5, 
      name: 'Wicker Park Press', 
      rating: 4.5, 
      lat: 41.9088, 
      lng: -87.6796, 
      capabilities: ['Small Batch', 'Handcrafted', 'Letterpress'],
      address: '1515 N Milwaukee Ave, Chicago, IL 60622',
      specialties: ['Wedding Invitations', 'Custom Stationery', 'Specialty Papers'],
      turnaround: '5-7 business days',
      priceRange: '$$$$'
    },
    { 
      id: 6, 
      name: 'Loop Print Shop', 
      rating: 4.8, 
      lat: 41.8839, 
      lng: -87.6270, 
      capabilities: ['Digital', 'Same-Day', 'Walk-in Service'],
      address: '29 E Madison St, Chicago, IL 60602',
      specialties: ['Business Documents', 'Presentations', 'Last Minute Orders'],
      turnaround: 'Same day available',
      priceRange: '$$$'
    },
    { 
      id: 7, 
      name: 'Uptown Graphics & Print', 
      rating: 4.4, 
      lat: 41.9665, 
      lng: -87.6533, 
      capabilities: ['Digital', 'Apparel', 'Promotional Items'],
      address: '4656 N Clark St, Chicago, IL 60640',
      specialties: ['T-Shirts', 'Promotional Products', 'Corporate Gifts'],
      turnaround: '5-7 business days',
      priceRange: '$$'
    },
    { 
      id: 8, 
      name: 'West Town Printing Co.', 
      rating: 4.6, 
      lat: 41.8964, 
      lng: -87.6687, 
      capabilities: ['Digital', 'Offset', 'Fine Art'],
      address: '1017 N Western Ave, Chicago, IL 60622',
      specialties: ['Art Prints', 'Gallery Catalogs', 'Photography'],
      turnaround: '4-6 business days',
      priceRange: '$$$'
    },
    { 
      id: 9, 
      name: 'Lakeview Printing Services', 
      rating: 4.7, 
      lat: 41.9436, 
      lng: -87.6543, 
      capabilities: ['Digital', 'Variable Data', 'Mailing Services'],
      address: '3501 N Southport Ave, Chicago, IL 60657',
      specialties: ['Direct Mail', 'Personalized Print', 'Bulk Mailing'],
      turnaround: '3-5 business days',
      priceRange: '$$$'
    },
    { 
      id: 10, 
      name: 'Pilsen Print Works', 
      rating: 4.5, 
      lat: 41.8570, 
      lng: -87.6614, 
      capabilities: ['Digital', 'Screen Printing', 'Packaging'],
      address: '1800 S Racine Ave, Chicago, IL 60608',
      specialties: ['Custom Packaging', 'Labels', 'Boxes'],
      turnaround: '4-7 business days',
      priceRange: '$$'
    }
  ]);
  
  // Default center (Chicago downtown)
  const defaultCenter = [41.8781, -87.6298];
  
  // Use browser geolocation if available
  const detectCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true);
      setLocationError(null);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(newLocation);
          setIsLoadingLocation(false);
          
          // Get neighborhood information based on coordinates
          fetchNeighborhoodInfo(newLocation.lat, newLocation.lng);
          
          // Pass location to parent component
          onLocationSelected({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: searchRadius
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to access your location. Please enable location services or enter your address manually.');
          setIsLoadingLocation(false);
          
          // Default to Chicago downtown if geolocation fails
          const defaultLoc = { lat: defaultCenter[0], lng: defaultCenter[1] };
          setUserLocation(defaultLoc);
          onLocationSelected({
            ...defaultLoc,
            radius: searchRadius
          });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      
      // Default to Chicago downtown if geolocation not supported
      const defaultLoc = { lat: defaultCenter[0], lng: defaultCenter[1] };
      setUserLocation(defaultLoc);
      onLocationSelected({
        ...defaultLoc,
        radius: searchRadius
      });
    }
  };
  
  // Get neighborhood information using our nominatimService
  const fetchNeighborhoodInfo = async (lat, lng) => {
    try {
      const result = await nominatimService.reverseGeocode(lat, lng);
      
      if (result.success) {
        // Extract relevant neighborhood information
        const neighborhood = {
          neighborhood: result.address.city || result.address.town || 'Unknown neighborhood',
          city: result.address.city || 'Chicago',
          postcode: result.address.postcode || 'Unknown',
          fullAddress: result.address.displayName
        };
        
        setNeighborhoodInfo(neighborhood);
      } else {
        setNeighborhoodInfo(null);
      }
    } catch (error) {
      console.error('Error fetching neighborhood info:', error);
      setNeighborhoodInfo(null);
    }
  };
  
  // Use our nominatimService for geocoding
  const geocodeAddress = async (addressString) => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      // Ensure we're looking in Chicago
      let searchAddress = addressString;
      if (!addressString.toLowerCase().includes('chicago')) {
        searchAddress += ', Chicago, Illinois';
      }
      
      // Use the nominatimService to geocode the address
      const result = await nominatimService.geocodeAddress(searchAddress);
      
      if (result.success) {
        const location = {
          lat: result.location.lat,
          lng: result.location.lng
        };
        
        setUserLocation(location);
        
        // Get neighborhood information
        fetchNeighborhoodInfo(location.lat, location.lng);
        
        // Pass location to parent component
        onLocationSelected({
          ...location,
          radius: searchRadius,
          address: result.location.displayName
        });
      } else {
        setLocationError('Address not found. Please enter a valid Chicago address.');
        
        // Default to Chicago downtown
        const defaultLoc = { lat: defaultCenter[0], lng: defaultCenter[1] };
        setUserLocation(defaultLoc);
        onLocationSelected({
          ...defaultLoc,
          radius: searchRadius
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setLocationError('An error occurred while looking up the address. Please try again.');
      
      // Default to Chicago downtown
      const defaultLoc = { lat: defaultCenter[0], lng: defaultCenter[1] };
      setUserLocation(defaultLoc);
      onLocationSelected({
        ...defaultLoc,
        radius: searchRadius
      });
    } finally {
      setIsLoadingLocation(false);
      setAddressSubmitted(true);
    }
  };
  
  // Handle address form submission
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      geocodeAddress(address);
    }
  };
  
  // Initialize with default Chicago location
  useEffect(() => {
    const defaultLoc = { lat: defaultCenter[0], lng: defaultCenter[1] };
    setUserLocation(defaultLoc);
    onLocationSelected({
      ...defaultLoc,
      radius: searchRadius
    });
    
    // Get neighborhood information for the default location
    fetchNeighborhoodInfo(defaultLoc.lat, defaultLoc.lng);
  }, []);
  
  // Update when radius changes
  useEffect(() => {
    if (userLocation) {
      onLocationSelected({
        ...userLocation,
        radius: searchRadius
      });
    }
  }, [searchRadius]);
  
  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };
  
  // Filter producers by radius
  const producersInRadius = userLocation 
    ? producers.filter(producer => {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          producer.lat, 
          producer.lng
        );
        producer.distance = Math.round(distance * 10) / 10; // Round to 1 decimal
        return distance <= searchRadius;
      })
    : [];

  return (
    <div className="card">
      <h3 className="card-title">Chicago Area Print Producers</h3>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleAddressSubmit} style={{ flex: 1, minWidth: '300px' }}>
            <label htmlFor="address-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Your Chicago Address
            </label>
            <div style={{ display: 'flex' }}>
              <input 
                type="text" 
                id="address-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your Chicago address"
                style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }}
              />
              <button 
                type="submit" 
                className="btn"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
          
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              className="btn btn-outline" 
              onClick={detectCurrentLocation}
              disabled={isLoadingLocation}
            >
              <i className="fas fa-location-arrow" style={{ marginRight: '0.5rem' }}></i>
              Use My Current Location
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="radius-slider" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Search Radius: {searchRadius} km
          </label>
          <input 
            type="range"
            id="radius-slider"
            min="1"
            max="25"
            step="1"
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
            <span>1 km</span>
            <span>25 km</span>
          </div>
        </div>
      </div>
      
      {isLoadingLocation && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
          </div>
          <p>{addressSubmitted ? 'Looking up address...' : 'Detecting your location...'}</p>
        </div>
      )}
      
      {locationError && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '5px', marginBottom: '1rem' }}>
          <p>{locationError}</p>
        </div>
      )}
      
      {neighborhoodInfo && (
        <div style={{ padding: '0.75rem', backgroundColor: '#e9f7fe', color: '#0a58ca', borderRadius: '5px', marginBottom: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Location Information</h4>
          <p><strong>Neighborhood:</strong> {neighborhoodInfo.neighborhood}</p>
          <p><strong>City:</strong> {neighborhoodInfo.city}</p>
          <p><strong>Postal Code:</strong> {neighborhoodInfo.postcode}</p>
        </div>
      )}
      
      {userLocation && (
        <div style={{ height: '400px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
          <MapContainer 
            center={[userLocation.lat, userLocation.lng]} 
            zoom={12} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User location marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your location</Popup>
            </Marker>
            
            {/* Search radius circle */}
            <Circle 
              center={[userLocation.lat, userLocation.lng]}
              radius={searchRadius * 1000} // Convert km to meters
              pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
            />
            
            {/* Producer markers */}
            {producers.map(producer => {
              // Calculate if this producer is within radius
              const distance = calculateDistance(
                userLocation.lat, 
                userLocation.lng, 
                producer.lat, 
                producer.lng
              );
              const isInRadius = distance <= searchRadius;
              
              // Use different marker color based on whether in radius
              const markerIcon = new L.Icon({
                iconUrl: isInRadius 
                  ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
                  : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });
              
              return (
                <Marker 
                  key={producer.id} 
                  position={[producer.lat, producer.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div style={{ maxWidth: '200px' }}>
                      <h5 style={{ marginBottom: '0.5rem' }}>{producer.name}</h5>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
                            <i className="fas fa-star" style={{ color: '#ffc107', marginRight: '0.25rem' }}></i>
                            {producer.rating}
                          </span>
                          <span>
                            {Math.round(distance * 10) / 10} km away
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        <strong>Address:</strong> {producer.address}
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>
                        <strong>Capabilities:</strong> {producer.capabilities.join(', ')}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
      
      {producersInRadius.length > 0 ? (
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Chicago Print Producers Near You ({producersInRadius.length})</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {producersInRadius
              .sort((a, b) => a.distance - b.distance)
              .map(producer => (
                <div 
                  key={producer.id} 
                  style={{ 
                    padding: '1rem',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                >
                  <div>
                    <h5 style={{ marginBottom: '0.25rem' }}>{producer.name}</h5>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>
                      <span>{producer.distance} km • </span>
                      <span>{producer.priceRange} • </span>
                      <span>Turnaround: {producer.turnaround}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>
                      <strong>Specialties:</strong> {producer.specialties.join(', ')}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <strong>Address:</strong> {producer.address}
                    </div>
                  </div>
                  <div>
                    <button className="btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.9rem' }}>
                      Match
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      ) : userLocation ? (
        <div className="text-center" style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <i className="fas fa-map-marker-alt" style={{ fontSize: '2rem', color: '#666', marginBottom: '1rem' }}></i>
          <p>No print producers found within {searchRadius} km of your location.</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Try increasing your search radius or choosing a different location.</p>
        </div>
      ) : null}
    </div>
  );
};

export default GeoLocation;