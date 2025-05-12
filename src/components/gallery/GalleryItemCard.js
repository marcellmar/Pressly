import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, User, Tag, Calendar, Leaf, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';

/**
 * Card component to display a gallery item
 * @param {Object} props Component props
 * @param {Object} props.item Gallery item data
 * @param {Function} props.onClick Function to call when the card is clicked
 */
const GalleryItemCard = ({ item, onClick }) => {
  if (!item) return null;

  // Format date
  const formattedDate = new Date(item.dateCreated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card 
      className="gallery-item-card h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-300"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {item.images && item.images.length > 0 ? (
          <img 
            src={item.images[0]} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        {item.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-bold truncate">{item.title}</h3>
        </div>
      </div>
      
      <CardContent className="flex-grow pt-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Printer className="h-4 w-4 mr-1" />
          <span className="truncate">{item.producerName}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <User className="h-4 w-4 mr-1" />
          <span>Design by {item.designerName}</span>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-2 mb-1">
          {item.tags && item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" /> 
              {tag}
            </Badge>
          ))}
          {item.tags && item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mt-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between items-center">
        <div className="flex items-center">
          <Leaf className="h-4 w-4 mr-1 text-green-600" />
          <span className="text-sm font-medium">
            {item.sustainabilityScore}% Sustainable
          </span>
        </div>
        
        <Link 
          to={`/gallery/${item.id}`} 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          View details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GalleryItemCard;