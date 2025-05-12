import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Printer, 
  User, 
  Calendar, 
  Tag, 
  Leaf, 
  ChevronLeft, 
  Eye, 
  Layers,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

/**
 * Detailed view for a single gallery item
 * @param {Object} props Component props
 * @param {Object} props.item Gallery item data
 * @param {Function} props.onBack Function to call when back button is clicked
 */
const GalleryItemDetail = ({ item, onBack }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  if (!item) return null;
  
  // Format date
  const formattedDate = new Date(item.dateCreated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="gallery-item-detail bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Gallery
          </Button>
          
          {item.featured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 ml-2">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            <Eye className="h-4 w-4 inline-block mr-1" />
            124 views
          </span>
          
          <Link 
            to={`/producers/${item.producerId}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View Producer
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="gallery-images">
          <div className="main-image-container mb-4 h-80 bg-gray-100 rounded-lg overflow-hidden">
            {item.images && item.images.length > 0 ? (
              <img 
                src={item.images[activeImageIndex]} 
                alt={item.title} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          {item.images && item.images.length > 1 && (
            <div className="thumbnails grid grid-cols-5 gap-2">
              {item.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`h-16 w-full bg-gray-100 rounded overflow-hidden cursor-pointer border-2 ${
                    index === activeImageIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="gallery-item-info">
          <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-4">
            <Printer className="h-5 w-5 mr-1" />
            <span className="font-medium">Produced by: </span>
            <Link 
              to={`/producers/${item.producerId}`}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              {item.producerName}
            </Link>
          </div>
          
          <div className="flex items-center text-gray-600 mb-4">
            <User className="h-5 w-5 mr-1" />
            <span className="font-medium">Designed by: </span>
            <span className="ml-1">{item.designerName}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-4">
            <Calendar className="h-5 w-5 mr-1" />
            <span className="font-medium">Created on: </span>
            <span className="ml-1">{formattedDate}</span>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Production Details</h3>
            <p className="text-gray-700">{item.productionDetails}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium mb-2">Materials Used</h3>
              <ul className="list-none space-y-1">
                {item.materials && item.materials.map((material, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {material}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Production Methods</h3>
              <ul className="list-none space-y-1">
                {item.methods && item.methods.map((method, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <Layers className="h-4 w-4 text-blue-500 mr-2" />
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags && item.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  <Tag className="h-3 w-3 mr-1" /> 
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="sustainability-score bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Leaf className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium">Sustainability Score</h3>
            </div>
            
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${item.sustainabilityScore}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Score: {item.sustainabilityScore}/100</span>
              <span className="font-medium text-green-600">
                {item.sustainabilityScore >= 90 
                  ? 'Excellent' 
                  : item.sustainabilityScore >= 75 
                    ? 'Very Good' 
                    : item.sustainabilityScore >= 60 
                      ? 'Good' 
                      : 'Standard'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <Button size="lg">
              <Printer className="h-5 w-5 mr-2" />
              Contact Producer
            </Button>
            
            <Button variant="outline" size="lg">
              <Eye className="h-5 w-5 mr-2" />
              View Similar Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItemDetail;