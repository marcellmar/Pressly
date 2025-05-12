import React, { useState, useEffect, useCallback } from 'react';
import showToast from '../../components/ui/toast/toast';
import producersApi from '../../services/producers';
import ProducerCard from './ProducerCard';
import ProducerCardSkeleton from './ProducerCardSkeleton';
import ProducersTable from './ProducersTable';
import VirtualizedProducerList from './VirtualizedProducerList';
import { Search, Filter, SlidersHorizontal, X, MapPin, View, List, Table } from 'lucide-react';
import debounce from 'lodash/debounce';

/**
 * Enhanced Producer Manager Component
 * Handles fetching, filtering, and displaying producers using the API
 */
const EnhancedProducerManager = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [producers, setProducers] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', or 'virtual'
  const [filters, setFilters] = useState({
    searchQuery: '',
    capabilities: [],
    specialties: [],
    location: 'all',
    sustainabilityMin: 0,
    availabilityMin: 0
  });
  const [error, setError] = useState(null);
  
  // Fetch all producers
  const fetchProducers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await producersApi.getAllProducers();
      setProducers(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch producers:', error);
      setError('Failed to load producers. Please try again later.');
      showToast.error('Failed to load producers');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch producers on mount
  useEffect(() => {
    fetchProducers();
  }, [fetchProducers]);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchFilters) => {
      try {
        setLoading(true);
        const data = await producersApi.searchProducers(searchFilters);
        setProducers(data);
        setError(null);
      } catch (error) {
        console.error('Failed to search producers:', error);
        setError('Search failed. Please try again with different criteria.');
        showToast.error('Search failed');
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };
  
  // Handle search input
  const handleSearchInput = (e) => {
    handleFilterChange('searchQuery', e.target.value);
  };
  
  // Handle capability filter change
  const handleCapabilityChange = (capability, checked) => {
    const newCapabilities = checked 
      ? [...filters.capabilities, capability]
      : filters.capabilities.filter(cap => cap !== capability);
    
    handleFilterChange('capabilities', newCapabilities);
  };
  
  // Handle location filter change
  const handleLocationChange = (e) => {
    handleFilterChange('location', e.target.value);
  };
  
  // Handle selecting a producer
  const handleSelectProducer = async (producer) => {
    try {
      setLoading(true);
      // Get detailed producer data
      const producerDetails = await producersApi.getProducerById(producer.id);
      setSelectedProducer(producerDetails);
      showToast.success('Producer details loaded');
    } catch (error) {
      console.error('Failed to load producer details:', error);
      showToast.error('Failed to load producer details');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle closing producer details
  const handleCloseDetails = () => {
    setSelectedProducer(null);
  };
  
  // Handle submitting a quote request
  const handleSubmitQuoteRequest = async (producerId, quoteData) => {
    try {
      setLoading(true);
      const result = await producersApi.submitQuoteRequest(producerId, quoteData);
      if (result.success) {
        showToast.success('Quote request submitted successfully');
        handleCloseDetails();
      } else {
        showToast.error(result.message || 'Failed to submit quote request');
      }
    } catch (error) {
      console.error('Failed to submit quote request:', error);
      showToast.error('Failed to submit quote request');
    } finally {
      setLoading(false);
    }
  };
  
  // Render producer list based on view mode
  const renderProducers = () => {
    if (loading) {
      return <ProducerCardSkeleton count={3} />;
    }
    
    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={fetchProducers}
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (producers.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No producers found matching your criteria.</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              setFilters({
                searchQuery: '',
                capabilities: [],
                specialties: [],
                location: 'all',
                sustainabilityMin: 0,
                availabilityMin: 0
              });
              fetchProducers();
            }}
          >
            Reset Filters
          </button>
        </div>
      );
    }
    
    switch (viewMode) {
      case 'table':
        return (
          <ProducersTable
            producers={producers}
            onSelectProducer={handleSelectProducer}
          />
        );
      case 'virtual':
        return (
          <VirtualizedProducerList
            producers={producers}
            onSelectProducer={handleSelectProducer}
          />
        );
      case 'cards':
      default:
        return (
          <div className="space-y-4">
            {producers.map((producer) => (
              <ProducerCard
                key={producer.id}
                producer={producer}
                onSelect={() => handleSelectProducer(producer)}
              />
            ))}
          </div>
        );
    }
  };
  
  return (
    <div className="producers-manager">
      {/* Filters and search */}
      <div className="bg-white rounded-lg border p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search producers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={filters.searchQuery}
              onChange={handleSearchInput}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="w-40">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.location}
                onChange={handleLocationChange}
              >
                <option value="all">All Locations</option>
                <option value="nearby">Within 5 miles</option>
                <option value="city">Chicago</option>
              </select>
            </div>
            
            <button 
              onClick={fetchProducers}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span>Apply</span>
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {producers.length} producers
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">View:</div>
            
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`px-3 py-1.5 ${viewMode === 'cards' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('cards')}
              >
                <View className="h-4 w-4" />
              </button>
              
              <button
                className={`px-3 py-1.5 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('table')}
              >
                <Table className="h-4 w-4" />
              </button>
              
              <button
                className={`px-3 py-1.5 ${viewMode === 'virtual' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('virtual')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Producer listing */}
      {renderProducers()}
      
      {/* Selected Producer Modal */}
      {selectedProducer && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedProducer.businessName}</h2>
              <button 
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Producer details would be rendered here */}
              <p>{selectedProducer.description}</p>
              
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={() => handleSubmitQuoteRequest(selectedProducer.id, { 
                    projectType: 'Custom T-Shirts',
                    quantity: 100,
                    deadline: '2023-06-30'
                  })}
                >
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProducerManager;
