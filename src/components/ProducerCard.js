import React from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardFooter 
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import SustainabilityScore from "./SustainabilityScore";
import { MapPin, Shirt, Phone, Route } from "lucide-react";
import { getPrinterImageUrl } from "../utils/unsplashUtils";
import { UnsplashImage } from "./ui/image";
import SupplyChainButton from "./SmartMatch/SupplyChainButton";
import { getReliableImageUrl, generateFallbackImages, getTypedPlaceholder } from "../utils/imageUtils";
import { formatDistance } from "../utils/locationUtils";

const ProducerCard = ({ 
  producer, 
  highlightGarments = false, 
  showDistance = false,
  onRouteClick = null 
}) => {
  
  // Check if producer offers garment or apparel printing
  const hasGarmentPrinting = producer?.capabilities?.some(
    capability => 
      capability.toLowerCase().includes("garment") || 
      capability.toLowerCase().includes("apparel") ||
      capability.toLowerCase().includes("shirt") ||
      capability.toLowerCase().includes("clothing")
  );

  // Get short representation of capabilities
  const displayCapabilities = producer?.capabilities?.slice(0, 3) || [];
  const extraCapabilities = (producer?.capabilities?.length || 0) - 3;

  // Get image URL based on producer type or specialty
  const getProducerImageUrl = () => {
    if (producer?.imageUrl) return producer.imageUrl;
    
    // Use reliable image source for producer
    return getReliableImageUrl('producer', producer.id || Math.random().toString(36).substring(7), {
      width: 400,
      height: 300,
      index: 0
    });
  };

  // Generate multiple fallback images in case primary image fails to load
  const getFallbackImages = () => {
    // Get a typed placeholder as the ultimate fallback
    const typedFallback = getTypedPlaceholder('producer', 400, 300);
    
    // Generate multiple fallbacks + the typed fallback
    return [
      ...generateFallbackImages('producer', producer.id || 'fallback', {
        width: 400,
        height: 300,
        count: 2
      }),
      typedFallback
    ];
  };

  // Handle route button click
  const handleRouteClick = () => {
    if (onRouteClick) {
      onRouteClick(producer);
    }
  };

  return (
    <>
      <Card className={`overflow-hidden ${highlightGarments && hasGarmentPrinting ? 'border-blue-300 shadow-md' : ''}`}>
        <div className="h-40 overflow-hidden">
          <UnsplashImage
            src={getProducerImageUrl()}
            alt={producer.name}
            className="w-full h-full"
            fallbackSrc={getFallbackImages()}
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{producer.name}</CardTitle>
              {highlightGarments && hasGarmentPrinting && (
                <Shirt className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <Badge variant="outline" className="bg-blue-50">
              {producer.location?.city || 'Chicago'}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{producer.location?.address?.split(',')[1]?.trim() || 'IL'}</span>
            
            {/* Show distance if available */}
            {showDistance && producer.distance !== undefined && (
              <span className="ml-2 flex items-center">
                • <span className="font-medium ml-1">{
                  typeof producer.distance === 'number' 
                    ? formatDistance(producer.distance, 'mi') 
                    : producer.distance
                }</span>
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2 space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {producer.specialties?.[0] || "Full service print studio specializing in custom designs"}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {displayCapabilities.map((capability, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className={`text-xs ${
                  highlightGarments && 
                  (capability.toLowerCase().includes("garment") || 
                   capability.toLowerCase().includes("apparel") ||
                   capability.toLowerCase().includes("shirt")) 
                    ? "bg-blue-100 text-blue-700" 
                    : ""
                }`}
              >
                {capability}
              </Badge>
            ))}
            {extraCapabilities > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{extraCapabilities} more
              </Badge>
            )}
          </div>
          
          {/* Availability indicator */}
          {producer.availabilityPercent !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Availability</span>
                <span className={`font-medium ${producer.availabilityPercent > 70 ? 'text-green-600' : producer.availabilityPercent > 30 ? 'text-amber-600' : 'text-red-600'}`}>
                  {producer.availabilityPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    producer.availabilityPercent > 70 ? 'bg-green-600' : 
                    producer.availabilityPercent > 30 ? 'bg-amber-500' : 'bg-red-600'
                  }`}
                  style={{width: `${producer.availabilityPercent}%`}}
                ></div>
              </div>
            </div>
          )}
          
          <SustainabilityScore score={producer.sustainabilityScore || 0} size="sm" />
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          {/* Show Route button if onRouteClick is provided */}
          {onRouteClick ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={handleRouteClick}
            >
              <Route className="h-3 w-3 mr-1" />
              View Route
            </Button>
          ) : (
            <SupplyChainButton producer={producer} />
          )}
          
          <Button size="sm" className="text-xs">
            <Phone className="h-3 w-3 mr-1" />
            Contact
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ProducerCard;