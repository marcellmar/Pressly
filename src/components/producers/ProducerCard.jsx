import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import showToast from '../ui/toast/toast';

/**
 * Enhanced producer card component with animations
 */
const ProducerCard = ({ producer, onSelect }) => {
  const handleContactClick = () => {
    showToast.success(`Request sent to ${producer.name}`);
  };

  return (
    <motion.div
      className="overflow-hidden border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200 bg-white rounded-lg"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <img
            src={producer.imageUrl}
            alt={producer.name}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:col-span-2 p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <div>
              <h2 className="text-xl font-bold">{producer.name}</h2>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium">{producer.rating}</span>
                <span className="text-gray-500 ml-1">({producer.reviews} reviews)</span>
              </div>
            </div>
            <div className="md:text-right">
              <div className="flex items-center text-gray-600 md:justify-end">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{producer.distance} miles away</span>
              </div>
              <div className="mt-1">
                <Badge 
                  variant="outline" 
                  className={`${producer.availabilityPercent > 50 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}
                >
                  {producer.availabilityPercent}% Available
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Capabilities</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {producer.capabilities.slice(0, 2).map((cap, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{cap}</Badge>
                ))}
                {producer.capabilities.length > 2 && (
                  <Badge variant="outline" className="text-xs">+{producer.capabilities.length - 2}</Badge>
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Specialties</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {producer.specialties.slice(0, 2).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">{spec}</Badge>
                ))}
                {producer.specialties.length > 2 && (
                  <Badge variant="secondary" className="text-xs">+{producer.specialties.length - 2}</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm">{producer.turnaround}</span>
            </div>
            
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-sm">{producer.priceRange}</span>
            </div>
            
            <div className="flex-grow text-right">
              <div className="text-xs text-gray-500">
                Updated: {format(new Date(), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          
          <motion.div 
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={() => onSelect(producer)}
              className="flex items-center gap-1"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleContactClick}
            >
              Quick Quote
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProducerCard;
