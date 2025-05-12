import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  Clock,
  Truck,
  Droplet,
  Zap,
  AlertCircle,
  Leaf,
  BarChart,
  HelpCircle
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui';

/**
 * Kaizen Pulse component for Producer Dashboard
 * Shows continuous improvement metrics that affect matching score
 */
const KaizenMetrics = ({ producerData, onMetricClick }) => {
  const [kaizenScores, setKaizenScores] = useState({
    turnaround: 0,
    qualityRate: 0,
    capacityUtilization: 0,
    wastageReduction: 0,
    transportEfficiency: 0,
    energyEfficiency: 0
  });
  
  const [previousScores, setPreviousScores] = useState({});
  const [matchImpact, setMatchImpact] = useState({});
  
  useEffect(() => {
    // In a real implementation, this would be fetched from an API
    // For the MVP, using sample data
    const sampleScores = {
      turnaround: 87, // Improvement in delivery time
      qualityRate: 95, // Reduction in defects/reprints
      capacityUtilization: 82, // Efficient use of capacity
      wastageReduction: 79, // Material waste reduction
      transportEfficiency: 88, // Transport optimization
      energyEfficiency: 91 // Energy usage reduction
    };
    
    const samplePrevious = {
      turnaround: 84,
      qualityRate: 92,
      capacityUtilization: 80,
      wastageReduction: 72,
      transportEfficiency: 85,
      energyEfficiency: 88
    };
    
    // Calculate impact on matching score (simplified)
    const sampleImpact = {
      turnaround: 0.15, // +15% boost to matching score
      qualityRate: 0.18,
      capacityUtilization: 0.08,
      wastageReduction: 0.12,
      transportEfficiency: 0.14,
      energyEfficiency: 0.20
    };
    
    setKaizenScores(sampleScores);
    setPreviousScores(samplePrevious);
    setMatchImpact(sampleImpact);
  }, [producerData]);
  
  // Maps metrics to waste reduction categories
  const metricToWasteMapping = {
    turnaround: 'WAITING',
    qualityRate: 'DEFECT',
    capacityUtilization: 'OVERPRODUCTION',
    wastageReduction: 'DEFECT',
    transportEfficiency: 'TRANSPORT',
    energyEfficiency: 'ECO'
  };
  
  // Description for each metric
  const metricDescriptions = {
    turnaround: 'Average time to complete orders. Faster turnaround improves your waiting waste score.',
    qualityRate: 'Percentage of orders without defects or reprints. Higher quality reduces defect waste.',
    capacityUtilization: 'How efficiently you use your production capacity. Better utilization reduces overproduction waste.',
    wastageReduction: 'Reduction in material waste compared to industry standards. Less waste improves defect score.',
    transportEfficiency: 'Efficiency in local delivery and transportation. Better transport reduces transportation waste.',
    energyEfficiency: 'Energy consumption relative to production volume. More efficiency improves your eco score.'
  };
  
  // Icons for each metric
  const metricIcons = {
    turnaround: <Clock className="h-5 w-5" />,
    qualityRate: <AlertCircle className="h-5 w-5" />,
    capacityUtilization: <BarChart className="h-5 w-5" />,
    wastageReduction: <Droplet className="h-5 w-5" />,
    transportEfficiency: <Truck className="h-5 w-5" />,
    energyEfficiency: <Zap className="h-5 w-5" />
  };
  
  // Calculate change direction and percentage
  const getChangeData = (metric) => {
    const current = kaizenScores[metric];
    const previous = previousScores[metric] || current;
    const change = current - previous;
    const percentChange = previous ? ((change / previous) * 100).toFixed(1) : '0.0';
    
    return {
      isPositive: change >= 0,
      percentChange,
      impact: matchImpact[metric]
    };
  };
  
  // Render a metric card
  const renderMetricCard = (metric, title) => {
    const score = kaizenScores[metric];
    const changeData = getChangeData(metric);
    const wasteCategory = metricToWasteMapping[metric];
    
    return (
      <Card className="hover:border-blue-400 cursor-pointer transition-colors" onClick={() => onMetricClick && onMetricClick(metric)}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center 
                ${score >= 90 ? 'bg-green-100' : 
                score >= 80 ? 'bg-blue-100' : 
                score >= 70 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {metricIcons[metric]}
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{title}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{metricDescriptions[metric]}</p>
                        <p className="text-xs mt-1">Affects <strong>{wasteCategory}</strong> in matching algorithm</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{score}</span>
                  <span className="text-gray-500 ml-1">/100</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center justify-end ${changeData.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {changeData.isPositive ? 
                  <TrendingUp className="h-3.5 w-3.5 mr-1" /> : 
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />}
                <span className="text-sm font-medium">{changeData.percentChange}%</span>
              </div>
              <div className="mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                  +{(changeData.impact * 100).toFixed(0)}% match score
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Calculate overall Kaizen score
  const overallScore = Object.values(kaizenScores).reduce((sum, score) => sum + score, 0) / Object.values(kaizenScores).length;
  const totalMatchImpact = Object.values(matchImpact).reduce((sum, impact) => sum + impact, 0);
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                Kaizen Pulse
                <Badge className="ml-2 bg-blue-100 text-blue-800">Beta</Badge>
              </CardTitle>
              <CardDescription>
                Continuous improvement metrics affecting your match score
              </CardDescription>
            </div>
            <div className="flex items-center">
              <div className="flex flex-col items-end mr-4">
                <div className="text-3xl font-bold">
                  {Math.round(overallScore)}
                  <span className="text-base text-gray-500 ml-1">/100</span>
                </div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm text-blue-700">
              <strong>Kaizen Pulse</strong> monitors your continuous improvement and affects how often you're matched with designers. 
              Your current metrics are boosting your matching score by <strong>{(totalMatchImpact * 100).toFixed(0)}%</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderMetricCard('turnaround', 'Turnaround Time')}
            {renderMetricCard('qualityRate', 'Quality Rate')}
            {renderMetricCard('transportEfficiency', 'Transport Efficiency')}
            {renderMetricCard('energyEfficiency', 'Energy Efficiency')}
            {renderMetricCard('wastageReduction', 'Waste Reduction')}
            {renderMetricCard('capacityUtilization', 'Capacity Utilization')}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between">
          <span className="text-sm text-gray-500">
            Updated 2 days ago
          </span>
          <Button variant="outline" size="sm">
            View Improvement History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default KaizenMetrics;