import React from 'react';
import { Link, ExternalLink, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Network card component for displaying a node in the marketplace network
 * (designers, producers, or connections between them)
 */
const NetworkCard = ({ data, type, onConnect, onViewProfile }) => {
  // Set card styling based on node type
  const cardStyles = {
    designer: 'border-l-4 border-purple-500',
    producer: 'border-l-4 border-blue-500',
    connection: 'border-l-4 border-green-500',
  };
  
  // Set icon based on node type
  const CardIcon = () => {
    if (type === 'designer') return <Users className="h-6 w-6 text-purple-500" />;
    if (type === 'producer') return <Link className="h-6 w-6 text-blue-500" />;
    return <Calendar className="h-6 w-6 text-green-500" />;
  };
  
  return (
    <div className={`bg-white rounded-lg shadow p-5 ${cardStyles[type]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <CardIcon />
          <div className="ml-3">
            <h3 className="font-medium">{data.name}</h3>
            <div className="text-sm text-gray-500">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
          </div>
        </div>
        
        {data.status && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            data.status === 'active' ? 'bg-green-100 text-green-700' : 
            data.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
            'bg-gray-100 text-gray-700'
          }`}>
            {data.status}
          </div>
        )}
      </div>
      
      {data.location && (
        <div className="flex items-start mb-3">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-gray-600">{data.location}</div>
        </div>
      )}
      
      {data.description && (
        <p className="text-sm text-gray-600 mb-4">{data.description}</p>
      )}
      
      {data.metrics && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(data.metrics).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded p-2 text-center">
              <div className="text-xs text-gray-500">{key.split('_').join(' ')}</div>
              <div className="font-medium">{value}</div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex space-x-2 mt-3">
        {onViewProfile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => onViewProfile(data.id)}
          >
            <ExternalLink className="h-3 w-3" />
            <span>Profile</span>
          </Button>
        )}
        
        {onConnect && (
          <Button 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => onConnect(data.id)}
          >
            <Link className="h-3 w-3" />
            <span>Connect</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NetworkCard;
