import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import RouteVisualization from '../components/Map/RouteVisualization';
import { searchNearbyPrinters } from '../services/mapping/nominatimService';
import { Map, Route, Truck, Leaf, Clock } from 'lucide-react';
import '../styles/pressly-theme.css';

/**
 * NetworkVisualization Page
 * 
 * Demonstrates the Geographic Road Network Visualization feature 
 * for showing actual routes between designers and producers.
 */
const NetworkVisualization = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [producers, setProducers] = useState([]);
  const [selectedProducers, setSelectedProducers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transportMode, setTransportMode] = useState('car');
  
  // Load user location and nearby producers on component mount
  useEffect(() => {
    loadUserLocationAndProducers();
  }, []);
  
  const loadUserLocationAndProducers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get user's location (or use Chicago as default)
      let location;
      
      try {
        // Try to get user's actual location
        const position = await getCurrentPosition();
        location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      } catch (locationError) {
        console.warn('Failed to get user location, using Chicago as default');
        // Use Chicago as default location
        location = {
          lat: 41.8781,
          lng: -87.6298
        };
      }
      
      setUserLocation(location);
      
      // Find nearby print producers
      const result = await searchNearbyPrinters(location.lat, location.lng, 20);
      
      if (result.success) {
        setProducers(result.producers);
        
        // Select the first 3 producers by default for demo purposes
        const defaultSelected = result.producers.slice(0, 3);
        setSelectedProducers(defaultSelected);
      } else {
        setError('Failed to find nearby producers');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Unexpected error loading data');
    }
    
    setIsLoading(false);
  };
  
  // Promise wrapper for geolocation API
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };
  
  // Toggle producer selection
  const toggleProducerSelection = (producer) => {
    if (selectedProducers.some(p => p.id === producer.id)) {
      // Remove from selection
      setSelectedProducers(selectedProducers.filter(p => p.id !== producer.id));
    } else {
      // Add to selection
      setSelectedProducers([...selectedProducers, producer]);
    }
  };
  
  // Handle route selection
  const handleRouteSelect = (producer, route) => {
    console.log('Selected route to producer:', producer.name);
    // Could highlight this producer or show detailed route information
  };

  // Handle transport mode change
  const handleTransportModeChange = (e) => {
    setTransportMode(e.target.value);
  };
  
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--gray-light)' }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="content-container px-6 py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--gray-dark)' }}>Geographic Road Network</h1>
              <p style={{ color: 'var(--gray)' }}>
                Visualize real-world transportation routes between designers and producers
              </p>
            </div>
            
            <div className="card card-body mb-6" style={{ borderLeft: '4px solid var(--info)' }}>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--primary-dark)' }}>About This Feature</h2>
              <p style={{ color: 'var(--gray)' }}>
                The Geographic Road Network Visualization shows actual road routes between 
                designers and producers, replacing abstract connection lines with real-world 
                travel paths. This helps demonstrate the benefits of local production, 
                visualize sustainability impact, and provide practical logistics information.
              </p>
            </div>
            
            {isLoading ? (
              <div className="card card-body flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="spinner-border mb-4" style={{ color: 'var(--primary)' }}></div>
                  <p>Loading network data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="card card-body" style={{ borderLeft: '4px solid var(--error)' }}>
                <p style={{ color: 'var(--error)' }}>
                  {error}
                  <button 
                    className="btn btn-sm ml-4"
                    onClick={loadUserLocationAndProducers}
                    style={{ color: 'var(--error)' }}
                  >
                    Try Again
                  </button>
                </p>
              </div>
            ) : (
              <>
                {/* Transport Mode Selector */}
                <div className="card card-body mb-6 flex flex-wrap items-center">
                  <div className="mr-6">
                    <label className="mr-2 font-medium" style={{ color: 'var(--gray-dark)' }}>Transport Mode:</label>
                    <select 
                      className="input"
                      value={transportMode}
                      onChange={handleTransportModeChange}
                    >
                      <option value="car">Car</option>
                      <option value="bike">Bicycle</option>
                      <option value="foot">Walking</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3" style={{ color: 'var(--gray)' }}>
                      {selectedProducers.length} producer(s) selected
                    </span>
                    {selectedProducers.length > 0 && (
                      <button 
                        className="btn btn-sm"
                        onClick={() => setSelectedProducers([])}
                        style={{ backgroundColor: 'var(--error)', color: 'white' }}
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                  {/* Map Display */}
                  <div className="lg:col-span-3 card card-body">
                    <div style={{ height: '500px' }}>
                      <RouteVisualization
                        userLocation={userLocation}
                        producers={producers}
                        selectedProducers={selectedProducers}
                        onRouteSelect={handleRouteSelect}
                        transportMode={transportMode}
                      />
                    </div>
                  </div>
                  
                  {/* Sidebar Content */}
                  <div className="lg:col-span-1">
                    <div className="card card-body mb-6">
                      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--gray-dark)' }}>Available Producers</h3>
                      <p className="text-sm mb-3" style={{ color: 'var(--gray)' }}>
                        Select producers to display their routes on the map.
                      </p>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {producers.map(producer => (
                          <div 
                            key={producer.id}
                            className="p-3 cursor-pointer border-b last:border-b-0 transition-colors"
                            style={{ 
                              backgroundColor: selectedProducers.some(p => p.id === producer.id) 
                                ? 'var(--primary-light)' 
                                : 'transparent',
                              borderColor: 'var(--gray-light)'
                            }}
                            onClick={() => toggleProducerSelection(producer)}
                          >
                            <div className="flex items-center">
                              <input 
                                type="checkbox"
                                className="mr-3"
                                checked={selectedProducers.some(p => p.id === producer.id)}
                                onChange={() => {}} // Handled by div click
                                style={{ 
                                  accentColor: 'var(--primary)'
                                }}
                              />
                              <div>
                                <div className="font-medium" style={{ color: 'var(--gray-dark)' }}>{producer.name}</div>
                                <div className="badge badge-primary mt-1">
                                  {producer.distance.toFixed(1)} km away
                                </div>
                                <div className="text-xs mt-1" style={{ color: 'var(--gray)' }}>
                                  {producer.capabilities.join(' • ')}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="card card-body">
                      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--gray-dark)' }}>Network Overview</h3>
                      <div>
                        <div className="flex justify-between mb-2 pb-2" style={{ borderBottom: '1px solid var(--gray-light)' }}>
                          <span style={{ color: 'var(--gray)' }}>Producers nearby:</span>
                          <span className="font-semibold" style={{ color: 'var(--gray-dark)' }}>{producers.length}</span>
                        </div>
                        <div className="flex justify-between mb-2 pb-2" style={{ borderBottom: '1px solid var(--gray-light)' }}>
                          <span style={{ color: 'var(--gray)' }}>Producers selected:</span>
                          <span className="font-semibold" style={{ color: 'var(--gray-dark)' }}>{selectedProducers.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--gray)' }}>Average distance:</span>
                          <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                            {(selectedProducers.reduce((sum, p) => sum + p.distance, 0) / 
                              (selectedProducers.length || 1)).toFixed(1)
                            } km
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--gray-dark)' }}>Benefits of Network Visualization</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="card card-body">
                      <div className="text-3xl mb-3" style={{ color: 'var(--primary)' }}>
                        <Map size={36} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--gray-dark)' }}>Enhanced Local Connection</h3>
                      <p style={{ color: 'var(--gray)' }}>
                        Visually demonstrate the proximity advantage of working with nearby producers, 
                        making the benefits of local production tangible.
                      </p>
                    </div>
                    
                    <div className="card card-body">
                      <div className="text-3xl mb-3" style={{ color: 'var(--secondary)' }}>
                        <Leaf size={36} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--gray-dark)' }}>Sustainability Visualization</h3>
                      <p style={{ color: 'var(--gray)' }}>
                        Make carbon savings tangible through actual route visualization, 
                        showcasing the environmental benefits of local production.
                      </p>
                    </div>
                    
                    <div className="card card-body">
                      <div className="text-3xl mb-3" style={{ color: 'var(--accent)' }}>
                        <Truck size={36} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--gray-dark)' }}>Practical Logistics</h3>
                      <p style={{ color: 'var(--gray)' }}>
                        Provide realistic travel times and transportation considerations for 
                        both parties, enabling better planning and coordination.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NetworkVisualization;