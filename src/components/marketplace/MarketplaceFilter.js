import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

/**
 * MarketplaceFilter component for filtering marketplace entities
 * (producers, designers, designs, etc.)
 */
const MarketplaceFilter = ({ 
  type = 'producer', 
  onFilter, 
  initialFilters = {}, 
  showAdvanced = true 
}) => {
  // Filter state
  const [filters, setFilters] = useState({
    searchQuery: '',
    capabilities: [],
    specialties: [],
    location: 'all',
    sustainability: [0, 100],
    price: [0, 100],
    turnaround: [0, 14],
    rating: 0,
    availability: 0,
    ...initialFilters
  });
  
  // Advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Available options based on filter type
  const getFilterOptions = () => {
    if (type === 'producer') {
      return {
        capabilities: [
          'DTG Printing',
          'Screen Printing',
          'Embroidery',
          'Dye Sublimation',
          'Large Format',
          'Eco-Friendly Printing',
          'Union Printing'
        ],
        specialties: [
          'T-Shirts',
          'Hoodies',
          'Posters',
          'Stickers',
          'Business Cards',
          'Banners',
          'Promotional Products'
        ],
        locations: [
          'all',
          'nearby',
          'city',
          'region',
          'nationwide'
        ]
      };
    }
    
    // For designer filters
    return {
      capabilities: [
        'Apparel Design',
        'Graphic Design',
        'Logo Design',
        'Illustration',
        'Typography',
        'Branding',
        'Product Design'
      ],
      specialties: [
        'Streetwear',
        'Minimalist',
        'Vintage',
        'Abstract',
        'Corporate',
        'Sports',
        'Fashion'
      ],
      locations: [
        'all',
        'nearby',
        'city',
        'region',
        'nationwide'
      ]
    };
  };
  
  const options = getFilterOptions();
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle checkbox filters (capabilities, specialties)
  const handleCheckboxChange = (field, value) => {
    setFilters(prev => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };
  
  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      capabilities: [],
      specialties: [],
      location: 'all',
      sustainability: [0, 100],
      price: [0, 100],
      turnaround: [0, 14],
      rating: 0,
      availability: 0
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    if (onFilter) {
      onFilter(filters);
    }
  };
  
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={`Search ${type}s...`}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>
        
        {/* Quick filters */}
        <div className="flex gap-2">
          <div className="w-40">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="nearby">Within 5 miles</option>
              <option value="city">This City</option>
              <option value="region">This Region</option>
              <option value="nationwide">Nationwide</option>
            </select>
          </div>
          
          <Button onClick={applyFilters} className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Apply</span>
          </Button>
          
          {showAdvanced && (
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Advanced filters */}
      {showAdvancedFilters && showAdvanced && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Advanced Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Capabilities */}
            <div>
              <h4 className="text-sm font-medium mb-2">Capabilities</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                {options.capabilities.map((capability) => (
                  <label key={capability} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.capabilities.includes(capability)}
                      onChange={() => handleCheckboxChange('capabilities', capability)}
                    />
                    <span className="text-sm">{capability}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Specialties */}
            <div>
              <h4 className="text-sm font-medium mb-2">Specialties</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                {options.specialties.map((specialty) => (
                  <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.specialties.includes(specialty)}
                      onChange={() => handleCheckboxChange('specialties', specialty)}
                    />
                    <span className="text-sm">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Sliders for various metrics */}
            <div className="space-y-4">
              {/* Turnaround time */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Max Turnaround Time: {filters.turnaround[1]} days
                </h4>
                <Slider
                  value={filters.turnaround}
                  min={0}
                  max={30}
                  step={1}
                  onValueChange={(value) => handleFilterChange('turnaround', value)}
                  className="py-1"
                />
              </div>
              
              {/* Price range */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Price Range: ${filters.price[0]} - ${filters.price[1]}
                </h4>
                <Slider
                  value={filters.price}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={(value) => handleFilterChange('price', value)}
                  className="py-1"
                />
              </div>
              
              {/* Sustainability score */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Min Sustainability Score: {filters.sustainability[0]}%
                </h4>
                <Slider
                  value={[filters.sustainability[0]]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => handleFilterChange('sustainability', [value[0], 100])}
                  className="py-1"
                />
              </div>
              
              {/* Minimum rating */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Minimum Rating: {filters.rating} stars
                </h4>
                <Slider
                  value={[filters.rating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => handleFilterChange('rating', value[0])}
                  className="py-1"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvancedFilters(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={applyFilters}
              className="flex items-center gap-1"
            >
              <Save className="h-3 w-3" />
              <span>Apply Filters</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceFilter;
