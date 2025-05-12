import React, { useState, useRef, useEffect } from 'react';
import { geocodeAddress } from '../../services/mapping/nominatimService';

/**
 * GeocoderInput Component
 * 
 * A search input that geocodes addresses and returns location data
 * using OpenStreetMap's Nominatim service
 */
const GeocoderInput = ({ 
  onLocationSelect, 
  placeholder = "Search for an address...",
  initialValue = '',
  className = '',
  autoFocus = false
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const searchTimeout = useRef(null);
  
  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Handle clicks outside the component to hide results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (value.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    // Debounce search to avoid too many requests
    searchTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };
  
  // Perform geocoding search
  const performSearch = async (value) => {
    setIsSearching(true);
    
    try {
      const result = await geocodeAddress(value);
      
      if (result.success) {
        // We might get a single result in an object or multiple results in an array
        // Let's standardize to array format
        const locations = Array.isArray(result.locations) 
          ? result.locations 
          : [result.location];
          
        setResults(locations);
        setShowResults(true);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle result selection
  const handleResultSelect = (location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    
    // Update input with selected address
    setSearchTerm(location.displayName);
    setShowResults(false);
  };
  
  // Handle input focus
  const handleInputFocus = () => {
    if (searchTerm.length >= 3 && results.length > 0) {
      setShowResults(true);
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };
  
  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
        
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {results.map((location, index) => (
              <li
                key={`${location.lat}-${location.lng}-${index}`}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleResultSelect(location)}
              >
                {location.displayName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeocoderInput;