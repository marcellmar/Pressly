import React from 'react';
import { formatDistance, formatDuration } from '../../services/mapping/routeService';

/**
 * NetworkMetrics Component
 * 
 * Displays metrics and analytics about routes between designers and producers
 */
const NetworkMetrics = ({ 
  routes = [], 
  transportMode = 'car',
  className = ''
}) => {
  // Skip rendering if no routes provided
  if (!routes || routes.length === 0) {
    return null;
  }
  
  // Calculate aggregate metrics
  const totalDistance = routes.reduce((sum, route) => 
    sum + (route.route?.distance || 0), 0);
  
  const totalDuration = routes.reduce((sum, route) => 
    sum + (route.route?.duration || 0), 0);
  
  const totalCarbonSavings = routes.reduce((sum, route) => {
    const carbonSavings = route.route?.efficiency?.carbonImpact || 0;
    return sum + carbonSavings;
  }, 0);
  
  const averageEfficiencyScore = routes.reduce((sum, route) => 
    sum + (route.route?.efficiency?.score || 0), 0) / routes.length;
  
  // Count routes by efficiency classification
  const efficiencyBreakdown = routes.reduce((counts, route) => {
    const classification = route.route?.efficiency?.classification || 'unknown';
    counts[classification] = (counts[classification] || 0) + 1;
    return counts;
  }, {});
  
  // Format distance and duration
  const formattedDistance = formatDistance(totalDistance);
  const formattedDuration = formatDuration(totalDuration);
  
  // Get efficiency classification
  let efficiencyClass = 'text-yellow-500'; // Default: moderate
  if (averageEfficiencyScore >= 80) {
    efficiencyClass = 'text-green-600'; // Excellent
  } else if (averageEfficiencyScore >= 60) {
    efficiencyClass = 'text-blue-600'; // Good
  } else if (averageEfficiencyScore < 40) {
    efficiencyClass = 'text-red-600'; // Poor
  }
  
  // Transportation mode icon
  let transportIcon;
  switch (transportMode) {
    case 'car':
      transportIcon = <i className="fas fa-car mr-1"></i>;
      break;
    case 'bike':
      transportIcon = <i className="fas fa-bicycle mr-1"></i>;
      break;
    case 'foot':
      transportIcon = <i className="fas fa-walking mr-1"></i>;
      break;
    default:
      transportIcon = <i className="fas fa-truck mr-1"></i>;
  }
  
  return (
    <div className={`network-metrics bg-white rounded-lg p-4 shadow ${className}`}>
      <h3 className="text-lg font-semibold mb-3">Network Metrics</h3>
      
      <div className="space-y-5">
        <div className="stats-card">
          <div className="text-sm text-gray-600 mb-1">Total Network Distance</div>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold">{totalDistance/1000 < 10 ? (totalDistance/1000).toFixed(1) : Math.round(totalDistance/1000)}</div>
            <div className="ml-1 text-lg">km</div>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center">
            {transportIcon} Via {transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}
          </div>
        </div>
        
        <div className="stats-card">
          <div className="text-sm text-gray-600 mb-1">Total Travel Time</div>
          <div className="text-2xl font-bold">{Math.round(totalDuration/60)} minutes</div>
          <div className="text-xs text-gray-500 mt-1">
            Across {routes.length} connection{routes.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="stats-card">
          <div className="text-sm text-gray-600 mb-1">Network Efficiency</div>
          <div className="flex items-baseline">
            <div className={`text-2xl font-bold ${efficiencyClass}`}>
              {Math.round(averageEfficiencyScore)}
            </div>
            <div className="ml-1 text-lg">/100</div>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center">
            <span className="inline-flex items-center">
              <span className="h-2 w-2 bg-blue-600 rounded-full mr-1"></span>
              <span>{efficiencyBreakdown.good || 0} Good</span>
            </span>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="text-sm text-gray-600 mb-1">Carbon Impact</div>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(totalCarbonSavings * 10) / 10}
            </div>
            <div className="ml-1 text-lg text-green-600">kg CO<sub>2</sub> saved</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Compared to traditional shipping
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-3">Optimization Opportunities</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          {transportMode === 'car' && (
            <div className="flex items-start">
              <i className="fas fa-leaf text-green-500 mt-1 mr-2"></i>
              <p className="text-sm">
                Consider using bike delivery for short distances to reduce carbon footprint.
              </p>
            </div>
          )}
          
          {transportMode !== 'car' && (
            <div className="flex items-start">
              <i className="fas fa-leaf text-green-500 mt-1 mr-2"></i>
              <p className="text-sm">
                Great choice! Using {transportMode} transport helps reduce carbon emissions.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-3">Sustainability Impact</h4>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="bg-green-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center mr-2">
              <i className="fas fa-leaf"></i>
            </div>
            <span className="font-medium">Localized Production Benefits</span>
          </div>
          
          <p className="text-sm mb-4">
            Working with {routes.length} local producers reduces shipping distances by an average of 65% compared to centralized production.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(totalCarbonSavings)}
              </div>
              <div className="text-xs text-gray-600">kg CO<sub>2</sub> Savings</div>
            </div>
            
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(routes.length * 1.2)}
              </div>
              <div className="text-xs text-gray-600">Local Jobs Supported</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMetrics;