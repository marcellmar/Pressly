import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import GeocoderInput from '../components/Map/GeocoderInput';
import PrinterMap from '../components/Map/PrinterMap';
import NetworkMap from '../components/Map/NetworkMap';
import IndustryMap from '../components/Map/IndustryMap';
import ProductionNetworkMap from '../components/Map/ProductionNetworkMap';
import CommunityResourceMap from '../components/Map/CommunityResourceMap';
import { geocodeAddress } from '../services/mapping/nominatimService';
import { searchNearbyPrinters } from '../services/mapping/nominatimService';
import { calculateNetworkBenefits, formatEmissions } from '../utils/carbonCalculator';
import mapConfig from '../config/mapConfig';

/**
 * MappingDemo Page
 * 
 * Demonstrates the various mapping capabilities of the Pressly platform
 */
const MappingDemo = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [producers, setProducers] = useState([]);
  const [selectedProducers, setSelectedProducers] = useState([]);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'network', 'industry', 'production', 'community'
  const [transportMode, setTransportMode] = useState('car');
  const [searchRadius, setSearchRadius] = useState(10);
  const [showLocalImpact, setShowLocalImpact] = useState(false);
  const [networkBenefits, setNetworkBenefits] = useState(null);
  
  // Get user's current location on mount
  useEffect(() => {
    // Try to get user's location if permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(location);
          
          // Search for nearby producers
          fetchNearbyPrinters(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Set default location (Chicago)
          setUserLocation(mapConfig.defaultCenter);
          
          // Search for nearby producers
          fetchNearbyPrinters(mapConfig.defaultCenter);
        }
      );
    } else {
      // Geolocation not supported, use default location
      setUserLocation(mapConfig.defaultCenter);
      
      // Search for nearby producers
      fetchNearbyPrinters(mapConfig.defaultCenter);
    }
  }, []);
  
  // Handle location selection from GeocoderInput
  const handleLocationSelect = (location) => {
    if (!location) return;
    
    const newLocation = {
      lat: location.lat,
      lng: location.lng
    };
    
    setUserLocation(newLocation);
    setAddress(location.displayName || '');
    
    // Search for nearby producers
    fetchNearbyPrinters(newLocation);
  };
  
  // Fetch nearby print producers
  const fetchNearbyPrinters = async (location) => {
    if (!location || !location.lat || !location.lng) return;
    
    try {
      const result = await searchNearbyPrinters(location.lat, location.lng, searchRadius);
      
      if (result.success && result.producers) {
        setProducers(result.producers);
        
        // Reset selected producers
        setSelectedProducers([]);
      }
    } catch (error) {
      console.error('Error fetching nearby printers:', error);
    }
  };
  
  // Handle producer selection for routes
  const handleProducerSelect = (producer) => {
    // Check if this producer is already selected
    const isSelected = selectedProducers.some(p => p.id === producer.id);
    
    if (isSelected) {
      // Remove from selected
      setSelectedProducers(selectedProducers.filter(p => p.id !== producer.id));
    } else {
      // Add to selected
      setSelectedProducers([...selectedProducers, producer]);
    }
    
    // Calculate network benefits if this is the first producer selected
    if (!isSelected && selectedProducers.length === 0) {
      const benefits = calculateNetworkBenefits(producer.distance, 100);
      setNetworkBenefits(benefits);
      setShowLocalImpact(true);
    }
  };
  
  // Handle search radius change
  const handleRadiusChange = (e) => {
    const radius = parseInt(e.target.value);
    setSearchRadius(radius);
    
    // Refresh producer search
    fetchNearbyPrinters(userLocation);
  };
  
  // Handle transport mode change
  const handleTransportModeChange = (e) => {
    setTransportMode(e.target.value);
  };
  
  // Render active map component based on tab
  const renderActiveMap = () => {
    switch (activeTab) {
      case 'network':
        return (
          <NetworkMap
            userLocation={userLocation}
            producers={producers}
            selectedProducers={selectedProducers}
            onRouteSelect={handleProducerSelect}
            transportMode={transportMode}
          />
        );
      
      case 'industry':
        return (
          <IndustryMap
            center={userLocation}
            radius={searchRadius}
            includeSupport={true}
            onBusinessSelect={() => {}}
          />
        );
      
      case 'production':
        return (
          <ProductionNetworkMap
            userLocation={userLocation}
            producers={producers}
            showHeatmap={true}
            showCapacity={true}
            onProducerSelect={handleProducerSelect}
          />
        );
      
      case 'community':
        return (
          <CommunityResourceMap
            center={userLocation}
            radius={searchRadius}
            onResourceSelect={() => {}}
          />
        );
      
      case 'basic':
      default:
        return (
          <PrinterMap
            userLocation={userLocation}
            producers={producers}
            onProducerSelect={handleProducerSelect}
          />
        );
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--gray-light)' }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="main-layout flex-1 overflow-y-auto">
          <div className="content-container px-6 py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--gray-dark)' }}>Pressly Mapping Capabilities</h1>
              <p style={{ color: 'var(--gray)' }}>
                Explore the powerful mapping features that connect designers with print producers
              </p>
            </div>
      
      {/* Location Search */}
      <div className="card card-body mb-6">
        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--gray-dark)' }}>Find Your Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <GeocoderInput 
              onLocationSelect={handleLocationSelect}
              placeholder="Enter your address to find nearby print producers"
              initialValue={address}
              autoFocus={true}
              className="input"
            />
          </div>
          <div>
            <div className="flex items-center">
              <label htmlFor="radius" className="mr-2 font-medium" style={{ color: 'var(--gray-dark)' }}>Search Radius:</label>
              <select 
                id="radius" 
                className="input"
                value={searchRadius}
                onChange={handleRadiusChange}
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn ${activeTab === 'basic' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Map
          </button>
          <button
            className={`btn ${activeTab === 'network' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('network')}
          >
            Network Routes
          </button>
          <button
            className={`btn ${activeTab === 'industry' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('industry')}
          >
            Industry Map
          </button>
          <button
            className={`btn ${activeTab === 'production' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('production')}
          >
            Production Network
          </button>
          <button
            className={`btn ${activeTab === 'community' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('community')}
          >
            Community Resources
          </button>
        </div>
      </div>
      
      {/* Extra Settings for Network Tab */}
      {activeTab === 'network' && (
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
      )}
      
      {/* Map Display */}
      <div className="mb-6">
        {renderActiveMap()}
      </div>
      
      {/* Environmental Impact */}
      {showLocalImpact && networkBenefits && (
        <div className="card card-body mb-6" style={{ backgroundColor: 'var(--secondary-light)', borderColor: 'var(--secondary)' }}>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--secondary-dark)' }}>Environmental Impact of Local Production</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card card-body">
              <h3 className="text-lg font-medium" style={{ color: 'var(--secondary-dark)' }}>Carbon Reduction</h3>
              <p className="text-3xl font-bold" style={{ color: 'var(--secondary)' }}>{formatEmissions(networkBenefits.carbonEmissionsSaved)}</p>
              <p style={{ color: 'var(--gray)' }}>
                {networkBenefits.savingsPercentage.toFixed(0)}% less than traditional shipping
              </p>
            </div>
            <div className="card card-body">
              <h3 className="text-lg font-medium" style={{ color: 'var(--primary-dark)' }}>Water Saved</h3>
              <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>{networkBenefits.waterSaved.toFixed(0)} L</p>
              <p style={{ color: 'var(--gray)' }}>
                Reduced water usage in production and shipping
              </p>
            </div>
            <div className="card card-body">
              <h3 className="text-lg font-medium" style={{ color: 'var(--warning)' }}>Waste Reduction</h3>
              <p className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>{networkBenefits.wasteReduced.toFixed(1)} kg</p>
              <p style={{ color: 'var(--gray)' }}>
                Less packaging and material waste
              </p>
            </div>
          </div>
          <div className="mt-3 badge badge-secondary inline-flex">
            <strong>Tree Equivalent:</strong> Using local production for this order is equivalent to planting {networkBenefits.treeEquivalent.toFixed(1)} trees.
          </div>
        </div>
      )}
      
      {/* Producers List */}
      <div className="card card-body">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--gray-dark)' }}>Available Print Producers</h2>
        
        {producers.length === 0 ? (
          <p style={{ color: 'var(--gray)' }}>No producers found in your area. Try expanding your search radius.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {producers.map(producer => (
              <div 
                key={producer.id} 
                className="card cursor-pointer"
                style={{
                  border: selectedProducers.some(p => p.id === producer.id) ? `2px solid var(--primary)` : '1px solid #E5E7EB',
                  backgroundColor: selectedProducers.some(p => p.id === producer.id) ? 'var(--primary-light)' : 'white'
                }}
                onClick={() => handleProducerSelect(producer)}
              >
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold" style={{ color: 'var(--gray-dark)' }}>{producer.name}</h3>
                    <div style={{ color: 'var(--warning)' }}>
                      {'★'.repeat(Math.floor(producer.rating))}
                      {'☆'.repeat(5 - Math.floor(producer.rating))}
                      <span style={{ color: 'var(--gray)' }} className="text-xs ml-1">{producer.rating}</span>
                    </div>
                  </div>
                  
                  <span className="badge badge-primary mb-3">
                    {producer.distance.toFixed(1)} km away
                  </span>
                  
                  <div style={{ color: 'var(--gray)' }}>
                    <p className="mb-1"><strong>Capabilities:</strong> {producer.capabilities.join(', ')}</p>
                    <div className="flex items-center mb-1">
                      <strong className="mr-2">Availability:</strong>
                      <div className="capacity-bar-wrapper w-24">
                        <div 
                          className={`capacity-bar ${
                            producer.availabilityPercent > 70 ? 'capacity-high' : 
                            producer.availabilityPercent > 30 ? 'capacity-medium' : 'capacity-low'
                          }`}
                          style={{ width: `${producer.availabilityPercent}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{producer.availabilityPercent}%</span>
                    </div>
                    <p><strong>Turnaround:</strong> {producer.turnaround}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MappingDemo;