import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { Sparkles, TrendingUp, DollarSign, Truck, AlertTriangle, CheckCircle } from 'lucide-react';

// Import AI utilities
import { analyzeDesignWithAI, calculateDesignQualityScore } from '../../utils/designAIUtils';

/**
 * AI-Powered Order Form Component
 * Integrates AI recommendations for materials, costs, and optimizations
 */
const OrderForm = ({ 
  designFile, 
  designData, 
  onSubmit, 
  onCancel,
  preloadedMaterials
}) => {
  // Base form state
  const [orderData, setOrderData] = useState({
    quantity: 100,
    productType: designData?.productType || 'tshirt',
    material: '',
    shipping: 'standard',
    additionalNotes: '',
    turnaroundTime: 'standard',
    estimatedCost: null
  });
  
  // AI analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [designScore, setDesignScore] = useState(null);
  const [recommendedMaterials, setRecommendedMaterials] = useState(preloadedMaterials || []);
  const [showAiInsights, setShowAiInsights] = useState(false);
  
  // Load AI recommendations if design file is available
  useEffect(() => {
    if (designFile && !aiAnalysis && !preloadedMaterials) {
      runAiAnalysis();
    }
    
    // If preloaded materials are provided, use them
    if (preloadedMaterials && preloadedMaterials.length > 0) {
      setRecommendedMaterials(preloadedMaterials);
      // Select the first material as default
      setOrderData(prev => ({
        ...prev,
        material: preloadedMaterials[0].id
      }));
      
      // Set design score if available
      if (designData && designData.aiScore) {
        setDesignScore(designData.aiScore);
      }
    }
  }, [designFile, preloadedMaterials]);
  
  // Run AI analysis on the design file
  const runAiAnalysis = async () => {
    if (!designFile) return;
    
    setIsAnalyzing(true);
    
    try {
      // Run analysis with options for the current product type
      const results = await analyzeDesignWithAI(designFile, {
        productType: orderData.productType,
        quantity: orderData.quantity
      });
      
      setAiAnalysis(results);
      
      // Extract recommended materials
      if (results.materialRecommendations && 
          results.materialRecommendations.recommendations) {
        setRecommendedMaterials(results.materialRecommendations.recommendations);
        
        // Select the first material as default
        if (results.materialRecommendations.recommendations.length > 0) {
          setOrderData(prev => ({
            ...prev,
            material: results.materialRecommendations.recommendations[0].id
          }));
        }
      }
      
      // Calculate design quality score
      const scoreData = calculateDesignQualityScore(results);
      setDesignScore(scoreData);
      
      // Update estimated cost if available
      if (results.costEstimates && results.costEstimates.summary) {
        setOrderData(prev => ({
          ...prev,
          estimatedCost: results.costEstimates.summary.totalCost
        }));
      }
      
      // Show AI insights
      setShowAiInsights(true);
    } catch (error) {
      console.error('Error running AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setOrderData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle quantity slider changes
  const handleQuantityChange = (value) => {
    setOrderData(prev => ({ ...prev, quantity: value[0] }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Include AI analysis data with the order if available
    const orderWithAnalysis = {
      ...orderData,
      aiAnalysis: aiAnalysis,
      designScore
    };
    
    onSubmit(orderWithAnalysis);
  };
  
  // Get current selected material
  const getSelectedMaterial = () => {
    if (!orderData.material || recommendedMaterials.length === 0) return null;
    return recommendedMaterials.find(m => m.id === orderData.material);
  };
  
  // Get quality score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create Your Order</CardTitle>
        <CardDescription>
          Configure your production options and get instant AI-powered recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Design Preview and AI Insights */}
          {(designFile || designData) && (
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <div className="rounded-md overflow-hidden bg-gray-100 h-52 flex items-center justify-center">
                    {designData?.imageUrl ? (
                      <img 
                        src={designData.imageUrl} 
                        alt={designData.title || "Design preview"} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <Sparkles className="mx-auto h-8 w-8 mb-2" />
                        <p>AI-Optimized Design</p>
                        <p className="text-xs mt-1">{designFile?.name}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-2/3">
                  {/* Design Name and Score */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium">
                        {designData?.title || designFile?.name || "Your Design"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {designData?.description || "Ready for production optimization"}
                      </p>
                    </div>
                    
                    {designScore && (
                      <div className="text-center">
                        <span className={`text-2xl font-bold ${getScoreColor(designScore.overall)}`}>
                          {designScore.overall}
                        </span>
                        <p className="text-xs text-gray-500">AI Quality Score</p>
                      </div>
                    )}
                  </div>
                  
                  {/* AI Insights Toggle */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mb-3 flex items-center justify-center"
                    onClick={() => setShowAiInsights(!showAiInsights)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {showAiInsights ? "Hide AI Insights" : "Show AI Insights"}
                  </Button>
                  
                  {/* AI Insights Panel */}
                  {showAiInsights && designScore && (
                    <div className="bg-blue-50 p-3 rounded-md mb-3">
                      <h4 className="font-medium flex items-center text-blue-700 mb-2">
                        <Sparkles className="h-4 w-4 mr-1" />
                        AI-Powered Design Insights
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Print Quality:</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${designScore.breakdown.printability}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-600 mb-1">Production Efficiency:</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${designScore.breakdown.optimization}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-600 mb-1">Quality Check:</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ width: `${designScore.breakdown.issues}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-600 mb-1">Material Compatibility:</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${designScore.breakdown.material}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {aiAnalysis?.qualityIssues?.issues && aiAnalysis.qualityIssues.issues.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-600 mb-1">Potential Issues:</p>
                          <ul className="text-xs space-y-1">
                            {aiAnalysis.qualityIssues.issues
                              .filter(issue => issue.severity === 'high')
                              .slice(0, 2)
                              .map((issue, idx) => (
                                <li key={idx} className="flex items-start">
                                  <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                                  <span>{issue.description}</span>
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Order Details Form */}
          <div className="space-y-4">
            {/* Product Type */}
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select 
                value={orderData.productType} 
                onValueChange={(value) => handleSelectChange('productType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tshirt">T-Shirt</SelectItem>
                  <SelectItem value="hoodie">Hoodie</SelectItem>
                  <SelectItem value="tote">Tote Bag</SelectItem>
                  <SelectItem value="poster">Poster</SelectItem>
                  <SelectItem value="business-card">Business Card</SelectItem>
                  <SelectItem value="flyer">Flyer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Quantity */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="quantity">Quantity</Label>
                <span className="text-sm font-medium">{orderData.quantity} units</span>
              </div>
              <Slider
                id="quantity"
                min={10}
                max={1000}
                step={10}
                value={[orderData.quantity]}
                onValueChange={handleQuantityChange}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10</span>
                <span>100</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>
            
            {/* Materials - AI Powered */}
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              {isAnalyzing ? (
                <div className="flex items-center space-x-2 h-10 px-3 py-2 border border-input rounded-md">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="text-sm text-gray-500">Analyzing best materials...</span>
                </div>
              ) : recommendedMaterials.length > 0 ? (
                <Select 
                  value={orderData.material} 
                  onValueChange={(value) => handleSelectChange('material', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {recommendedMaterials.map((material) => (
                      <SelectItem 
                        key={material.id} 
                        value={material.id}
                      >
                        {material.name} {material.score > 0.8 && '✨'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select 
                  value={orderData.material} 
                  onValueChange={(value) => handleSelectChange('material', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Material</SelectItem>
                    <SelectItem value="premium">Premium Quality</SelectItem>
                    <SelectItem value="organic">Organic/Eco-Friendly</SelectItem>
                    <SelectItem value="recycled">Recycled Material</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {/* Material Details Panel */}
              {getSelectedMaterial() && (
                <div className="mt-2 bg-gray-50 p-2 rounded-md text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{getSelectedMaterial().name}</span>
                    {getSelectedMaterial().score && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {Math.round(getSelectedMaterial().score * 100)}% Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {getSelectedMaterial().properties?.description || 
                     getSelectedMaterial().bestFor && `Best for: ${getSelectedMaterial().bestFor.join(', ')}`}
                  </p>
                  
                  {getSelectedMaterial().properties && (
                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                      {getSelectedMaterial().properties.printQuality && (
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          <span>Quality: {getSelectedMaterial().properties.printQuality}/100</span>
                        </div>
                      )}
                      {getSelectedMaterial().properties.sustainability && (
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          <span>Eco: {getSelectedMaterial().properties.sustainability}/100</span>
                        </div>
                      )}
                      {getSelectedMaterial().properties.durability && (
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          <span>Durability: {getSelectedMaterial().properties.durability}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Turnaround Time */}
            <div className="space-y-2">
              <Label htmlFor="turnaroundTime">Turnaround Time</Label>
              <Select 
                value={orderData.turnaroundTime} 
                onValueChange={(value) => handleSelectChange('turnaroundTime', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select turnaround time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rush">Rush (1-2 Days)</SelectItem>
                  <SelectItem value="expedited">Expedited (3-5 Days)</SelectItem>
                  <SelectItem value="standard">Standard (7-10 Days)</SelectItem>
                  <SelectItem value="economy">Economy (14+ Days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Shipping Method */}
            <div className="space-y-2">
              <Label htmlFor="shipping">Shipping Method</Label>
              <Select 
                value={orderData.shipping} 
                onValueChange={(value) => handleSelectChange('shipping', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Shipping</SelectItem>
                  <SelectItem value="express">Express Shipping</SelectItem>
                  <SelectItem value="overnight">Overnight Shipping</SelectItem>
                  <SelectItem value="pickup">Local Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea 
                id="additionalNotes" 
                name="additionalNotes" 
                value={orderData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any special instructions or requirements..."
                rows={3}
              />
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t px-6 py-4 bg-gray-50">
        {/* Cost Estimate */}
        <div className="text-center sm:text-left">
          {orderData.estimatedCost ? (
            <div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-lg font-bold">${orderData.estimatedCost.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">Estimated Total</p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Calculating estimate...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Get a cost estimate with AI analysis</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          {!aiAnalysis && !preloadedMaterials && (
            <Button 
              type="button" 
              onClick={runAiAnalysis}
              disabled={isAnalyzing || !designFile}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            className="min-w-[120px]"
            disabled={isAnalyzing}
          >
            Create Order
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderForm;