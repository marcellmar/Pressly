import React, { useEffect, useState } from 'react';
import { queryCommunityResources } from '../../services/mapping/overpassService';
import { createUMapIframe, fetchUMapData, extractPOIsByType } from '../../services/mapping/uMapService';

/**
 * CommunityResourceMap Component
 * 
 * Displays a map of community resources beneficial for designers and producers
 * such as coworking spaces, libraries, maker spaces, etc.
 */
const CommunityResourceMap = ({
  center,
  radius = 5, // km
  mapId = '', // Optional uMap ID for enhanced community mapping
  resourceTypes = [], // Filter types if needed
  onResourceSelect
}) => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uMapHtml, setUMapHtml] = useState('');
  const [uMapData, setUMapData] = useState(null);
  
  // Fetch resources from OpenStreetMap
  useEffect(() => {
    if (center && center.lat && center.lng) {
      fetchResources();
    }
  }, [center, radius, resourceTypes.join(',')]);
  
  // Fetch uMap data if mapId is provided
  useEffect(() => {
    if (mapId) {
      fetchUMapResources();
    } else {
      // Clear uMap data if no mapId
      setUMapHtml('');
      setUMapData(null);
    }
  }, [mapId]);
  
  // Fetch resources from OpenStreetMap
  const fetchResources = async () => {
    if (!center || !center.lat || !center.lng) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await queryCommunityResources(center.lat, center.lng, radius * 1000);
      
      if (result.success) {
        // Filter by type if types are specified
        let filteredResources = result.resources || [];
        
        if (resourceTypes.length > 0) {
          filteredResources = filteredResources.filter(resource => 
            resourceTypes.includes(resource.type)
          );
        }
        
        setResources(filteredResources);
      } else {
        setError(result.error || 'Failed to fetch community resources');
      }
    } catch (error) {
      console.error('Error fetching community resources:', error);
      setError(error.message || 'Error fetching community resources');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch uMap data if mapId is provided
  const fetchUMapResources = async () => {
    if (!mapId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create iframe HTML
      const iframe = createUMapIframe(mapId, {
        height: '400px'
      });
      
      setUMapHtml(iframe);
      
      // Fetch actual map data for additional processing
      const result = await fetchUMapData(mapId);
      
      if (result.success) {
        // Extract POIs by type if needed
        const uMapPOIs = resourceTypes.length > 0
          ? extractPOIsByType(result.data, resourceTypes)
          : extractPOIsByType(result.data);
          
        setUMapData(uMapPOIs);
      }
    } catch (error) {
      console.error('Error fetching uMap data:', error);
      // Don't set error here to allow the iframe to still display
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render resource list
  const renderResourceList = () => {
    if (resources.length === 0) {
      return (
        <div className="text-center py-4 text-gray-600">
          No community resources found in this area
        </div>
      );
    }
    
    return (
      <div className="max-h-60 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {resources.map(resource => (
            <li key={resource.id} className="py-3 px-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{resource.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {getResourceTypeLabel(resource.type)} • {resource.distance.toFixed(2)} km away
                  </p>
                  
                  {resource.address && resource.address.street && (
                    <p className="text-sm text-gray-600 mt-1">
                      {[
                        resource.address.housenumber,
                        resource.address.street,
                        resource.address.city
                      ].filter(Boolean).join(', ')}
                    </p>
                  )}
                  
                  {resource.opening_hours && (
                    <p className="text-xs text-gray-500 mt-1">
                      Open: {resource.opening_hours}
                    </p>
                  )}
                </div>
                
                {onResourceSelect && (
                  <button 
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => onResourceSelect(resource)}
                  >
                    Details
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Get human-readable label for resource type
  const getResourceTypeLabel = (type) => {
    switch (type) {
      case 'coworking':
        return 'Coworking Space';
      case 'library':
        return 'Library';
      case 'hackerspace':
        return 'Hackerspace';
      case 'makerspace':
        return 'Makerspace';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  return (
    <div className="community-resource-map rounded-lg overflow-hidden border">
      {/* Map Section */}
      <div className="relative">
        {uMapHtml ? (
          // Render the uMap iframe if available
          <div className="w-full h-96" dangerouslySetInnerHTML={{ __html: uMapHtml }}></div>
        ) : (
          // Render a static image with link to view on OpenStreetMap if no uMap
          <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <p className="mb-3">
                {center ? 
                  `Showing ${resources.length} community resources within ${radius} km` :
                  'Community resource map will appear here'}
              </p>
              
              {center && (
                <a 
                  href={`https://www.openstreetmap.org/#map=15/${center.lat}/${center.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
                >
                  View on OpenStreetMap
                </a>
              )}
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
              <p>Loading community resources...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Resources List */}
      <div className="bg-white border-t">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h2 className="text-lg font-medium text-gray-900">Community Resources</h2>
          <p className="text-sm text-gray-600">
            Spaces and resources that can help designers and producers
          </p>
        </div>
        
        {renderResourceList()}
      </div>
      
      {/* Legend */}
      <div className="p-3 bg-white text-xs text-gray-600 border-t">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
            <span>Coworking Spaces</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></div>
            <span>Libraries</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Makerspaces</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
            <span>Hackerspaces</span>
          </div>
        </div>
        
        <div className="mt-2 text-gray-700">
          <span className="font-semibold">{resources.length}</span> resources found within {radius} km
        </div>
      </div>
    </div>
  );
};

export default CommunityResourceMap;