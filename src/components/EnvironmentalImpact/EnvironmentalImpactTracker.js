import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Leaf, 
  TreePine,
  Factory,
  Truck,
  BarChart2,
  Share2,
  TrendingUp,
  Info,
  CloudOff
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui';

/**
 * Environmental Impact Tracker Component
 * Shows carbon savings from local production compared to traditional methods
 */
const EnvironmentalImpactTracker = ({ userData, userType = 'designer' }) => {
  const [impactData, setImpactData] = useState({
    totalCarbonSaved: 0,
    equivalentTrees: 0,
    localMilesSaved: 0,
    trendPercentage: 0,
    historicalData: []
  });
  
  useEffect(() => {
    // In a real implementation, this would be fetched from an API
    // For the MVP, we'll use sample data with slight variance based on user type
    
    const sampleDesignerData = {
      totalCarbonSaved: 128.6, // kg CO2
      equivalentTrees: 5.8, // trees planted equivalent
      localMilesSaved: 587, // miles saved by local production
      trendPercentage: 12.4, // % increase month over month
      historicalData: [
        { month: 'Jan', carbonSaved: 68.2 },
        { month: 'Feb', carbonSaved: 82.5 },
        { month: 'Mar', carbonSaved: 105.8 },
        { month: 'Apr', carbonSaved: 128.6 }
      ]
    };
    
    const sampleProducerData = {
      totalCarbonSaved: 764.3, // kg CO2
      equivalentTrees: 34.7, // trees planted equivalent
      localMilesSaved: 3482, // miles saved by local production
      trendPercentage: 8.2, // % increase month over month
      historicalData: [
        { month: 'Jan', carbonSaved: 542.6 },
        { month: 'Feb', carbonSaved: 605.9 },
        { month: 'Mar', carbonSaved: 712.4 },
        { month: 'Apr', carbonSaved: 764.3 }
      ]
    };
    
    // Set data based on user type
    setImpactData(userType === 'designer' ? sampleDesignerData : sampleProducerData);
  }, [userData, userType]);
  
  // Calculate tree equivalent (rough approximation)
  const calculateTreeEquivalent = (carbonSaved) => {
    // Average tree absorbs ~22kg CO2 per year
    return (carbonSaved / 22).toFixed(1);
  };
  
  // Chart representation (simplified for MVP)
  const renderSimpleChart = () => {
    const maxValue = Math.max(...impactData.historicalData.map(d => d.carbonSaved));
    
    return (
      <div className="flex items-end h-24 space-x-1">
        {impactData.historicalData.map((data, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-12 bg-green-500 rounded-t-sm" 
              style={{ 
                height: `${(data.carbonSaved / maxValue) * 100}%`,
                opacity: 0.6 + (0.4 * (index / (impactData.historicalData.length - 1)))
              }}
            />
            <span className="text-xs mt-1">{data.month}</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden border-green-100">
      <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center text-green-800">
              <Leaf className="h-5 w-5 mr-2 text-green-600" />
              Environmental Impact
            </CardTitle>
            <CardDescription>
              Your contribution to sustainability through local production
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Badge className="bg-green-100 text-green-800 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {impactData.trendPercentage}% increase
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
            {/* Carbon Saved */}
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <CloudOff className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500">Carbon Saved</span>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{impactData.totalCarbonSaved.toFixed(1)}</span>
                  <span className="text-sm text-gray-500 ml-1">kg CO₂</span>
                </div>
              </div>
            </div>
            
            {/* Tree Equivalent */}
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <TreePine className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500">Tree Equivalent</span>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{impactData.equivalentTrees}</span>
                  <span className="text-sm text-gray-500 ml-1">trees</span>
                </div>
              </div>
            </div>
            
            {/* Miles Saved */}
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Truck className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500">Transport Reduced</span>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{impactData.localMilesSaved.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 ml-1">miles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-green-700 mr-2 mt-0.5" />
            <p className="text-sm text-green-800">
              By choosing local producers through Pressly, you've reduced carbon emissions 
              that would have been generated by traditional centralized production methods 
              and long-distance shipping.
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3">Monthly Carbon Savings</h4>
          {renderSimpleChart()}
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 flex justify-between">
        <span className="text-sm text-gray-500">
          Last updated: April 21, 2025
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                Share Impact
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share your environmental impact on social media</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default EnvironmentalImpactTracker;