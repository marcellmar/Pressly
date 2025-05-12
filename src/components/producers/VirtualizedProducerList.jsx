import React, { useRef, useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

/**
 * Virtualized list of producers for improved performance with large datasets
 */
const VirtualizedProducerList = ({ producers, onSelectProducer }) => {
  const [scrolled, setScrolled] = useState(false);
  const listRef = useRef();

  // Handle scrolling for shadow effect
  const handleScroll = ({ scrollOffset }) => {
    setScrolled(scrollOffset > 10);
  };

  // Row renderer for the virtualized list
  const ProducerRow = ({ index, style }) => {
    const producer = producers[index];
    
    return (
      <motion.div
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="p-2"
      >
        <div className="border rounded-lg shadow-sm bg-white p-4 flex items-center hover:shadow-md transition-shadow duration-200">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
            <img 
              src={producer.imageUrl} 
              alt={producer.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{producer.name}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                  <span>{producer.rating}</span>
                  <span className="mx-1">•</span>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{producer.distance} miles</span>
                </div>
              </div>
              
              <Badge 
                variant="outline"
                className={`${producer.availabilityPercent > 50 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}
              >
                {producer.availabilityPercent}%
              </Badge>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-1">
              {producer.capabilities.slice(0, 2).map((cap, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">{cap}</Badge>
              ))}
            </div>
          </div>
          
          <Button 
            size="sm"
            variant="ghost"
            className="ml-2 flex-shrink-0"
            onClick={() => onSelectProducer(producer)}
          >
            View
          </Button>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">{producers.length} Producers Available</h3>
        <div className="text-xs text-gray-500">Sorted by proximity</div>
      </div>
      
      <div 
        className={`h-[600px] ${scrolled ? 'shadow-inner' : ''}`}
      >
        <List
          ref={listRef}
          height={600}
          width={"100%"}
          itemCount={producers.length}
          itemSize={100}
          onScroll={handleScroll}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {ProducerRow}
        </List>
      </div>
    </div>
  );
};

export default VirtualizedProducerList;
