import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Settings, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import GeocoderInput from './Map/GeocoderInput';
import { formatDistance } from '../utils/locationUtils';

/**
 * ProducerFilters component
 * 
 * Provides granular control over the producer search process through
 * detailed filtering options for producer capabilities, location, and specialties.
 */
const ProducerFilters = ({ onFiltersChange, onLocationChange, initialFilters = {} }) => {
  const [expandedSections, setExpandedSections] = useState({
    'location': true,
    'garmentPrinting': true,
    'supplyChain': true,
    'otherServices': true,
    'budget': true
  });
  
  // Filter states with defaults
  const [filters, setFilters] = useState({
    garmentPrintingServices: false,
    screenPrinting: false,
    dtgPrinting: false,
    localSupplyChain: false,
    recycledMaterials: false,
    organicMaterials: false,
    fscCertified: false,
    sustainabilityScore: 0,
    maxDistance: 30,
    largeFormatPrinting: false,
    digitalPrinting: false,
    finishingServices: false,
    specialtyPrinting: false,
    budgetFriendly: false,
    premiumQuality: false,
    ...initialFilters
  });

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [displayAddress, setDisplayAddress] = useState('');

  // Update filters if initialFilters changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ...initialFilters
    }));
  }, [initialFilters]);

  // Notify parent component of changes
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  // Notify parent component of location changes
  useEffect(() => {
    if (onLocationChange && locationEnabled) {
      onLocationChange(selectedLocation);
    } else if (onLocationChange && !locationEnabled) {
      onLocationChange(null);
    }
  }, [selectedLocation, locationEnabled, onLocationChange]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (name) => {
    setFilters(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Handle toggle change
  const handleToggleChange = (name) => {
    setFilters(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Handle slider change
  const handleSliderChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    if (!location) return;
    
    setSelectedLocation({
      lat: location.lat,
      lng: location.lng
    });
    
    setDisplayAddress(location.displayName || '');
  };

  // Toggle location filter
  const toggleLocationFilter = () => {
    setLocationEnabled(prev => !prev);
    
    // Reset location if disabling
    if (locationEnabled && onLocationChange) {
      onLocationChange(null);
    }
  };

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setSelectedLocation(location);
          setLocationEnabled(true);
          setDisplayAddress('Your current location');
          
          if (onLocationChange) {
            onLocationChange(location);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // Could show an error message to the user here
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Could show a notification to the user here
    }
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (typeof value === 'boolean' && value === true) return count + 1;
    if (typeof value === 'number' && value > 0 && value !== 30) return count + 1;
    return count;
  }, 0) + (locationEnabled ? 1 : 0);

  return (
    <div className="space-y-5">
      {/* Location Section */}
      <div className="filter-section">
        <div 
          className="flex justify-between items-center py-2 px-1 rounded hover:bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('location')}
        >
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span className="font-medium">Location</span>
          </div>
          {expandedSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
        
        {expandedSections.location && (
          <div className="mt-2 space-y-4 pl-2 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">Enable Location-Based Search</span>
              <Switch
                checked={locationEnabled}
                onCheckedChange={toggleLocationFilter}
              />
            </div>
            
            {locationEnabled && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Search Near:</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 px-2 text-xs"
                      onClick={getCurrentLocation}
                    >
                      <MapPin className="h-3 w-3 mr-1" /> Use Current Location
                    </Button>
                  </div>
                  
                  <GeocoderInput 
                    onLocationSelect={handleLocationSelect}
                    placeholder="Enter address or postal code..."
                    initialValue={displayAddress}
                    className="text-sm h-9"
                  />
                  
                  {selectedLocation && (
                    <div className="text-xs text-gray-500 mt-1">
                      {displayAddress || 'Selected location'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-1">Max Distance</div>
                  <Slider
                    value={[filters.maxDistance]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleSliderChange('maxDistance', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    <span>Very Local</span>
                    <span className="font-medium">{filters.maxDistance} miles</span>
                    <span>Regional</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Garment Printing Section */}
      <div className="filter-section border-t pt-4">
        <div 
          className="flex justify-between items-center py-2 px-1 rounded hover:bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('garmentPrinting')}
        >
          <div className="flex items-center">
            <span className="mr-2">🧵</span>
            <span className="font-medium">Garment Printing</span>
          </div>
          {expandedSections.garmentPrinting ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
        
        {expandedSections.garmentPrinting && (
          <div className="mt-2 space-y-2 pl-2 pr-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="garmentPrintingServices"
                checked={filters.garmentPrintingServices}
                onCheckedChange={() => handleCheckboxChange('garmentPrintingServices')}
              />
              <label 
                htmlFor="garmentPrintingServices"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Garment Printing Services
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="screenPrinting"
                checked={filters.screenPrinting}
                onCheckedChange={() => handleCheckboxChange('screenPrinting')}
              />
              <label 
                htmlFor="screenPrinting"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Screen Printing
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dtgPrinting"
                checked={filters.dtgPrinting}
                onCheckedChange={() => handleCheckboxChange('dtgPrinting')}
              />
              <label 
                htmlFor="dtgPrinting"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                DTG Printing
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Supply Chain Preferences Section */}
      <div className="filter-section border-t pt-4">
        <div 
          className="flex justify-between items-center py-2 px-1 rounded hover:bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('supplyChain')}
        >
          <div className="flex items-center">
            <span className="mr-2">⚙️</span>
            <span className="font-medium">Supply Chain Preferences</span>
          </div>
          {expandedSections.supplyChain ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
        
        {expandedSections.supplyChain && (
          <div className="mt-2 space-y-4 pl-2 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">Local Supply Chain Priority</span>
              <Switch
                checked={filters.localSupplyChain}
                onCheckedChange={() => handleToggleChange('localSupplyChain')}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium mb-1">Material Type</div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recycledMaterials"
                  checked={filters.recycledMaterials}
                  onCheckedChange={() => handleCheckboxChange('recycledMaterials')}
                />
                <label 
                  htmlFor="recycledMaterials"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Recycled Materials
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="organicMaterials"
                  checked={filters.organicMaterials}
                  onCheckedChange={() => handleCheckboxChange('organicMaterials')}
                />
                <label 
                  htmlFor="organicMaterials"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Organic Materials
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fscCertified"
                  checked={filters.fscCertified}
                  onCheckedChange={() => handleCheckboxChange('fscCertified')}
                />
                <label 
                  htmlFor="fscCertified"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  FSC Certified
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium mb-1">Minimum Sustainability Score</div>
              <Slider
                value={[filters.sustainabilityScore]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleSliderChange('sustainabilityScore', value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>Any</span>
                <span className="font-medium">{filters.sustainabilityScore}</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Other Services Section */}
      <div className="filter-section border-t pt-4">
        <div 
          className="flex justify-between items-center py-2 px-1 rounded hover:bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('otherServices')}
        >
          <div className="flex items-center">
            <span className="mr-2">🔧</span>
            <span className="font-medium">Other Services</span>
          </div>
          {expandedSections.otherServices ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
        
        {expandedSections.otherServices && (
          <div className="mt-2 space-y-2 pl-2 pr-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="largeFormatPrinting"
                checked={filters.largeFormatPrinting}
                onCheckedChange={() => handleCheckboxChange('largeFormatPrinting')}
              />
              <label 
                htmlFor="largeFormatPrinting"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Large Format Printing
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="digitalPrinting"
                checked={filters.digitalPrinting}
                onCheckedChange={() => handleCheckboxChange('digitalPrinting')}
              />
              <label 
                htmlFor="digitalPrinting"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Digital Printing
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="finishingServices"
                checked={filters.finishingServices}
                onCheckedChange={() => handleCheckboxChange('finishingServices')}
              />
              <label 
                htmlFor="finishingServices"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Finishing Services
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="specialtyPrinting"
                checked={filters.specialtyPrinting}
                onCheckedChange={() => handleCheckboxChange('specialtyPrinting')}
              />
              <label 
                htmlFor="specialtyPrinting"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Specialty Printing
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Budget Section */}
      <div className="filter-section border-t pt-4">
        <div 
          className="flex justify-between items-center py-2 px-1 rounded hover:bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('budget')}
        >
          <div className="flex items-center">
            <span className="mr-2">💰</span>
            <span className="font-medium">Budget</span>
          </div>
          {expandedSections.budget ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
        
        {expandedSections.budget && (
          <div className="mt-2 space-y-2 pl-2 pr-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="budgetFriendly"
                checked={filters.budgetFriendly}
                onCheckedChange={() => handleCheckboxChange('budgetFriendly')}
              />
              <label 
                htmlFor="budgetFriendly"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Budget-Friendly Options
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="premiumQuality"
                checked={filters.premiumQuality}
                onCheckedChange={() => handleCheckboxChange('premiumQuality')}
              />
              <label 
                htmlFor="premiumQuality"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Premium Quality
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Active Filters Count */}
      {activeFilterCount > 0 && (
        <div className="border-t pt-4 flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">{activeFilterCount}</span> active {activeFilterCount === 1 ? 'filter' : 'filters'}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setFilters({
                garmentPrintingServices: false,
                screenPrinting: false,
                dtgPrinting: false,
                localSupplyChain: false,
                recycledMaterials: false,
                organicMaterials: false,
                fscCertified: false,
                sustainabilityScore: 0,
                maxDistance: 30,
                largeFormatPrinting: false,
                digitalPrinting: false,
                finishingServices: false,
                specialtyPrinting: false,
                budgetFriendly: false,
                premiumQuality: false,
              });
              setLocationEnabled(false);
              setSelectedLocation(null);
              setDisplayAddress('');
              if (onLocationChange) {
                onLocationChange(null);
              }
            }}
          >
            Reset All
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProducerFilters;