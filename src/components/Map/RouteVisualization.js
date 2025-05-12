import React, { useEffect, useState } from 'react';
import NetworkMap from './NetworkMap';
import NetworkMetrics from './NetworkMetrics';
import { getMultipleRoutes } from '../../services/mapping/routeService';

/**
 * RouteVisualization Component
 * 
 * Top-level component that coordinates route visualization between designers and producers
 */
const RouteVisualization = ({
  userLocation,
  producers = [],
  selectedProducers = [], // Already selected producers, if any
  onRouteSelect,
  className = ''
}) => {
  const [routeData, setRouteData] = useState([]);
  const [transportMode, setTransportMode] = useState('car');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate routes whenever selected producers change
  useEffect(() => {
    if (userLocation && selectedProducers.length > 0) {
      calculateRoutes();
    }
  }, [selectedProducers, transportMode]);
  
  const calculateRoutes = async () => {
    if (!userLocation || selectedProducers.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get routes for all selected producers
      const result = await getMultipleRoutes(
        userLocation,
        selectedProducers,
        transportMode
      );
      
      if (result.success) {
        setRouteData(result.routes);
      } else {
        setError(result.error || 'Error calculating routes');
      }
    } catch (error) {
      console.error('Error in route calculation:', error);
      setError('Unexpected error calculating routes');
    }
    
    setIsLoading(false);
  };
  
  const handleTransportModeChange = (mode) => {
    setTransportMode(mode);
  };
  
  const handleRouteSelect = (producer, route) => {
    if (onRouteSelect) {
      onRouteSelect(producer, route);
    }
  };
  
  return (
    <div className={`route-visualization ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Geographic Route Network</h3>
        <p className="text-gray-600 text-sm">
          View actual road networks between you and your connected producers.
          Select different transportation modes to compare efficiency.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          
          <NetworkMap
            userLocation={userLocation}
            producers={producers}
            selectedProducers={selectedProducers}
            onRouteSelect={handleRouteSelect}
            transportMode={transportMode}
          />
          
          {error && (
            <div className="mt-3 p-3 bg-red-100 text-red-700 rounded">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">Transportation Mode:</span>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-sm ${transportMode === 'car' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleTransportModeChange('car')}
              >
                <i className="fas fa-car mr-1"></i> Car
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${transportMode === 'bike' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleTransportModeChange('bike')}
              >
                <i className="fas fa-bicycle mr-1"></i> Bike
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${transportMode === 'foot' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleTransportModeChange('foot')}
              >
                <i className="fas fa-walking mr-1"></i> Walk
              </button>
            </div>
          </div>
          
          <NetworkMetrics
            routes={routeData.filter(r => r.success)}
            transportMode={transportMode}
          />
          
          {/* Sustainability impact now integrated into NetworkMetrics component */}
        </div>
      </div>
    </div>
  );
};

export default RouteVisualization;