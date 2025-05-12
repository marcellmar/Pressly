import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Zap, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Leaf,
  CloudOff,
  Info
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui';

/**
 * EcoMatchResults component
 * 
 * Enhanced version of MatchResults that includes environmental impact
 * data and Lean waste reduction metrics from the EcoLeanMatch algorithm
 */
const EcoMatchResults = ({ matches, onContactProducer }) => {
  const [showDesignerProfile, setShowDesignerProfile] = useState(false);
  const [sortBy, setSortBy] = useState('score'); // 'score', 'price', 'distance', 'rating', 'eco'
  const [expandedMatch, setExpandedMatch] = useState(null);
  
  if (!matches || matches.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-6xl text-gray-300 mb-4 flex justify-center">
          <AlertCircle />
        </div>
        <h3 className="text-xl font-bold mb-2">No Matches Found</h3>
        <p className="text-gray-600">Try adjusting your filters or location to find more producers.</p>
      </Card>
    );
  }

  // Sort the matches based on selected criteria
  const sortedMatches = [...matches].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        // Extract min price from price range strings like "$100-150"
        const aPrice = parseInt(a.estimatedPrice.replace('$', '').split('-')[0]);
        const bPrice = parseInt(b.estimatedPrice.replace('$', '').split('-')[0]);
        return aPrice - bPrice;
      case 'distance':
        return a.producer.distance - b.producer.distance;
      case 'rating':
        return b.producer.rating - a.producer.rating;
      case 'eco':
        return b.environmentalImpact.sustainabilityScore - a.environmentalImpact.sustainabilityScore;
      case 'score':
      default:
        return b.matchScore - a.matchScore;
    }
  });

  // Toggle expanded view for a match
  const toggleMatchExpand = (matchId) => {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
    } else {
      setExpandedMatch(matchId);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Smart Match Results</h3>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded border border-gray-300 text-sm"
          >
            <option value="score">Best Match</option>
            <option value="eco">Most Sustainable</option>
            <option value="price">Lowest Price</option>
            <option value="distance">Closest</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>
      
      <p className="mb-6 text-gray-600">
        Found {matches.length} producers that match your project requirements.
      </p>
      
      {sortedMatches.map((match, index) => (
        <div 
          key={match.producer.id}
          className={`p-6 mb-4 rounded-lg border-2 ${
            index === 0 && sortBy === 'score' 
              ? 'border-blue-500 bg-blue-50' 
              : sortBy === 'eco' && index === 0 
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
          } relative`}
        >
          {index === 0 && (
            <div className={`absolute -top-2 right-5 px-3 py-1 rounded-full text-xs font-bold text-white ${
              sortBy === 'eco' ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              {sortBy === 'eco' ? 'MOST SUSTAINABLE' : 'BEST MATCH'}
            </div>
          )}
          
          <div className="flex justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold mb-2">{match.producer.name}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center mr-4">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {match.producer.rating}
                </div>
                <div className="flex items-center mr-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {match.producer.distance} mi
                </div>
                <div>
                  {match.producer.location?.city || 'Local Area'}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {match.producer.address || match.producer.location?.address}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end mb-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-2 ${getScoreColor(match.matchScore)}`}>
                  {match.matchScore}
                </div>
                <span className="text-lg font-medium text-gray-700">Match Score</span>
              </div>
              <div className="flex flex-wrap justify-end gap-1 text-xs text-gray-600">
                {match.producer.capabilities.map((cap, i) => (
                  <Badge key={i} variant="outline" className="bg-gray-100">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Estimated Price</div>
              <div className="font-bold flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                {match.estimatedPrice}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Turnaround Time</div>
              <div className="font-bold flex items-center">
                <Clock className="h-4 w-4 mr-1 text-blue-600" />
                {match.turnaround}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Environmental Impact</div>
              <div className="font-bold flex items-center">
                <CloudOff className="h-4 w-4 mr-1 text-green-600" />
                {match.environmentalImpact?.carbonSavings} kg CO₂ saved
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Sustainability Score</div>
              <div className="flex items-center">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                  <div 
                    className={`h-full ${getSustainabilityColor(match.environmentalImpact?.sustainabilityScore || 0)}`} 
                    style={{ width: `${match.environmentalImpact?.sustainabilityScore || 0}%` }}
                  ></div>
                </div>
                <span className="font-bold">{match.environmentalImpact?.sustainabilityScore || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-700 mb-4 p-3 bg-gray-50 rounded">
            <strong className="text-gray-900">Smart Match Analysis:</strong> {match.notes}
          </div>
          
          {expandedMatch === match.producer.id && (
            <div className="mt-6 mb-6 bg-gray-50 p-4 rounded-md">
              <h5 className="font-bold mb-4">Waste Reduction Analysis</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <h6 className="text-sm font-semibold mb-2 flex items-center">
                    <Truck className="h-4 w-4 mr-1 text-blue-600" />
                    Transport Waste Reduction
                  </h6>
                  <div className="flex items-center mb-1">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${match.wasteVector?.transport * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-sm">{Math.round((match.wasteVector?.transport || 0) * 100)}%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {getWasteDescription('transport', match.wasteVector?.transport || 0, match.producer.distance)}
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded shadow-sm">
                  <h6 className="text-sm font-semibold mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-purple-600" />
                    Defect Waste Reduction
                  </h6>
                  <div className="flex items-center mb-1">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ width: `${match.wasteVector?.defect * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-sm">{Math.round((match.wasteVector?.defect || 0) * 100)}%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {getWasteDescription('defect', match.wasteVector?.defect || 0)}
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded shadow-sm">
                  <h6 className="text-sm font-semibold mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-yellow-600" />
                    Waiting Waste Reduction
                  </h6>
                  <div className="flex items-center mb-1">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-yellow-500" 
                        style={{ width: `${match.wasteVector?.waiting * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-sm">{Math.round((match.wasteVector?.waiting || 0) * 100)}%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {getWasteDescription('waiting', match.wasteVector?.waiting || 0)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-100">
                <h6 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Leaf className="h-4 w-4 mr-1" />
                  Environmental Impact Details
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <CloudOff className="h-10 w-10 text-green-600 mr-2" />
                    <div>
                      <div className="text-xs text-gray-600">CO₂ Emissions Saved</div>
                      <div className="font-bold">{match.environmentalImpact?.carbonSavings} kg</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-10 w-10 text-green-600 mr-2" />
                    <div>
                      <div className="text-xs text-gray-600">Transportation Distance</div>
                      <div className="font-bold">{match.producer.distance} miles</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Leaf className="h-10 w-10 text-green-600 mr-2" />
                    <div>
                      <div className="text-xs text-gray-600">Eco Rating</div>
                      <div className="font-bold">{match.environmentalImpact?.ecoRating || 'Good'}</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-700 mt-3">
                  <Info className="h-3 w-3 inline mr-1" />
                  These environmental impact estimates are based on comparison with traditional centralized production methods.
                </div>
              </div>
              
              <div className="mt-4">
                <h6 className="font-semibold mb-2">Producer Eco Certifications</h6>
                <div className="flex flex-wrap gap-2">
                  {getEcoCertifications(match.producer).map((cert, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800">
                      <Leaf className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => onContactProducer && onContactProducer(match.producer)}
            >
              Connect
            </Button>
            <Button 
              variant="outline"
              onClick={() => toggleMatchExpand(match.producer.id)}
            >
              {expandedMatch === match.producer.id ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  View Details
                </>
              )}
            </Button>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-1" />
              Get Directions
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-green-600" />
                    View Environmental Impact
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>See the detailed environmental benefits of using this producer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ))}
    </Card>
  );
};

// Helper functions for score color coding
const getScoreColor = (score) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Helper function for sustainability color
const getSustainabilityColor = (score) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 75) return 'bg-green-400';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Helper descriptions for waste reduction factors
const getWasteDescription = (type, score, distance) => {
  switch (type) {
    case 'transport':
      if (score >= 0.9) return `Very close to your location (${distance} miles)`;
      if (score >= 0.7) return `Good proximity to your location (${distance} miles)`;
      if (score >= 0.5) return `Moderate distance, some transportation waste (${distance} miles)`;
      return `Significant transportation waste due to distance (${distance} miles)`;
    
    case 'defect':
      if (score >= 0.9) return 'Perfect technical match, minimizing defect waste';
      if (score >= 0.7) return 'Strong technical capabilities, low defect risk';
      if (score >= 0.5) return 'Adequate capabilities, moderate defect risk';
      return 'Limited capabilities match, higher defect risk';
    
    case 'waiting':
      if (score >= 0.9) return 'Immediate availability, minimal waiting waste';
      if (score >= 0.7) return 'Good availability, low waiting waste';
      if (score >= 0.5) return 'Moderate availability, some waiting waste';
      return 'Limited availability, significant waiting waste';
      
    default:
      return 'No waste data available';
  }
};

// Helper function to generate eco certifications (mock data for now)
const getEcoCertifications = (producer) => {
  // In a real implementation, this would come from the producer data
  const baseCerts = ['Sustainable Printing Certified'];
  
  // Add more certifications based on various factors
  if (producer.sustainabilityScore >= 90 || producer.rating >= 4.8) {
    baseCerts.push('Carbon Neutral Operations');
  }
  
  if (producer.capabilities.some(cap => 
    cap.toLowerCase().includes('eco') || 
    cap.toLowerCase().includes('recycl') ||
    cap.toLowerCase().includes('green')
  )) {
    baseCerts.push('Eco-Friendly Materials');
  }
  
  // Random additional certs based on producer id to simulate variety
  const additionalCerts = [
    'Forest Stewardship Council',
    'Energy Star Partner',
    'Green Business Certified',
    'Renewable Energy User',
    'Zero Waste Facility'
  ];
  
  // Add 0-2 additional certs based on producer id
  const idSum = (producer.id || '').toString().split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const numAdditionalCerts = idSum % 3; // 0, 1, or 2 additional certs
  
  for (let i = 0; i < numAdditionalCerts; i++) {
    const certIndex = (idSum + i) % additionalCerts.length;
    baseCerts.push(additionalCerts[certIndex]);
  }
  
  return baseCerts;
};

export default EcoMatchResults;