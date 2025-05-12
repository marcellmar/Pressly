import React, { useState, useEffect, useRef, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  Wifi as WifiIcon,
  Heart,
  MessageSquare,
  List,
  Shirt, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Zap, 
  AlertCircle, 
  Clock,
  Leaf,
  ArrowRight,
  Upload,
  X,
  RefreshCw
} from 'lucide-react';

// UI Components
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// SmartMatch Components
import FileUploader from '../components/SmartMatch/FileUploader';
import AdvancedFilters from '../components/AdvancedFilters';
import PrinterMap from '../components/Map/PrinterMap';

// Canvas Components
import CanvasFilePreview from '../components/SmartMatch/CanvasFilePreview';
import CanvasDesignAnalyzer from '../components/SmartMatch/CanvasDesignAnalyzer';

// Import utilities
import { getPrinterImageUrl, getEcoFriendlyImageUrl } from '../utils/unsplashUtils';
import UnsplashImage from '../components/ui/image/UnsplashImage';

// IndexedDB service
import IndexedDBService from '../services/storage/indexedDBService';

// Import the EcoLeanMatch algorithm
import { extractProjectRequirements, findEcoLeanMatches } from '../services/ecoLeanMatch/ecoLeanMatchAlgorithm';

// Error Boundary component to catch errors in rendering
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          <h3 className="font-medium">Something went wrong</h3>
          <p className="text-sm mt-1">{this.state.error?.message || "An error occurred while rendering this component"}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const CombinedSmartMatch = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Core state
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Analyze, 3: Match
  const [files, setFiles] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [matchResults, setMatchResults] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [designAnalysis, setDesignAnalysis] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [mapView, setMapView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('preview');
  const [uploadError, setUploadError] = useState(null);
  const [savedToStorage, setSavedToStorage] = useState(false);
  
  // Match preferences
  const [matchPreferences, setMatchPreferences] = useState({
    materialType: [],
    minimumSustainabilityScore: 0,
    maxDistance: 30,
    prioritizeLocalSupplyChain: true,
    services: [],
    ecoFriendly: false,
    useRecycledMaterials: false,
    lowEmissionDelivery: false,
  });
  
  // Sample producers data
  const [producers] = useState([
    { 
      id: 1, 
      name: 'Rowboat Creative', 
      rating: 4.9, 
      reviews: 42,
      location: {
        lat: 41.8959, 
        lng: -87.6678,
        city: 'Chicago',
        address: '1709 W Chicago Ave, Chicago, IL 60622',
        neighborhood: 'West Town'
      },
      distance: 3.2,
      capabilities: ['DTG Printing', 'Screen Printing', 'Embroidery', 'Dye Sublimation'],
      specialties: ['Detailed Images', 'Full Color Prints', 'T-Shirts', 'Custom Merch'],
      turnaround: '7-10 business days',
      turnaroundHours: 192,
      priceRange: '$$$',
      availabilityPercent: 65,
      sustainable: false,
      sustainabilityScore: 90,
      materialSources: ['Standard Apparel Distributors'],
      website: 'https://rowboatcreative.com/dtg',
      energyEfficiency: 0.8,
      imageUrl: getPrinterImageUrl('rowboat-creative', 400, 300),
      wifiEnabled: true
    },
    { 
      id: 2, 
      name: 'Sharprint', 
      rating: 4.8, 
      reviews: 36,
      location: {
        lat: 41.9262, 
        lng: -87.7068, 
        city: 'Chicago',
        address: '4200 W Diversey Ave, Chicago, IL 60639',
        neighborhood: 'Hermosa'
      },
      distance: 5.6,
      capabilities: ['Screen Printing', 'Embroidery', 'Digital Printing', 'Eco-Friendly Printing'],
      specialties: ['Eco-Friendly Clothing', 'Sustainable Apparel', 'Green Printing'],
      turnaround: '5-7 business days',
      turnaroundHours: 144,
      priceRange: '$$$',
      availabilityPercent: 60,
      sustainable: true,
      sustainabilityScore: 95,
      materialSources: ['Organic Cotton', 'Recycled Fabrics', 'Sustainable Sources'],
      website: 'https://www.sharprint.com/custom-apparel/eco-friendly-clothing',
      energyEfficiency: 1.4,
      imageUrl: getEcoFriendlyImageUrl('sharprint', 400, 300),
      wifiEnabled: true
    },
    { 
      id: 3, 
      name: 'Minuteman Press', 
      rating: 4.7, 
      reviews: 29,
      location: {
        lat: 41.8895, 
        lng: -87.6352,
        city: 'Chicago',
        address: '227 W Van Buren St #125, Chicago, IL 60607', 
        neighborhood: 'The Loop'
      },
      distance: 6.1,
      capabilities: ['DTG Printing', 'Screen Printing', 'Union Bug Printing'],
      specialties: ['Same Day Service', 'Fast Turnaround', 'Political Printing'],
      turnaround: '1-2 business days',
      turnaroundHours: 36,
      priceRange: '$',
      availabilityPercent: 75,
      sustainable: false,
      sustainabilityScore: 60,
      materialSources: ['Standard Suppliers'],
      website: 'https://www.samedayteeshirts.com/',
      energyEfficiency: 0.9,
      imageUrl: getPrinterImageUrl('minuteman-press', 400, 300),
      wifiEnabled: false
    },
    { 
      id: 4, 
      name: 'Chicago Signs and Screen Printing', 
      rating: 4.8, 
      reviews: 33,
      location: {
        lat: 41.9128, 
        lng: -87.6843,
        city: 'Chicago',
        address: '1383 N Milwaukee Ave, Chicago, IL 60622', 
        neighborhood: 'Wicker Park'
      },
      distance: 2.8,
      capabilities: ['Screen Printing', 'DTG Printing', 'DTF Printing', 'Embroidery'],
      specialties: ['Custom Apparel', 'Signage', 'Promotional Items'],
      turnaround: '3-5 business days',
      turnaroundHours: 96,
      priceRange: '$',
      availabilityPercent: 80,
      sustainable: false,
      sustainabilityScore: 70,
      materialSources: ['Standard Suppliers'],
      website: 'https://chicagosigns.com/customizations/',
      energyEfficiency: 1.0,
      imageUrl: getPrinterImageUrl('chicago-signs', 400, 300),
      wifiEnabled: true
    },
    { 
      id: 5, 
      name: 'Eco Prints Chicago',
      rating: 4.8, 
      reviews: 18,
      location: {
        lat: 41.8985, 
        lng: -87.6688,
        city: 'Chicago',
        address: '1739 W Grand Ave, Chicago, IL 60622', 
        neighborhood: 'Noble Square'
      },
      distance: 3.2,
      capabilities: ['Zero-waste printing', 'Eco-friendly materials', 'Sustainable practices', 'Carbon Neutral Printing'],
      specialties: ['Sustainable Printing', 'Eco-friendly Materials', 'Zero Waste'],
      turnaround: '5-7 business days',
      turnaroundHours: 144,
      priceRange: '$$$',
      availabilityPercent: 65,
      sustainable: true,
      sustainabilityScore: 98,
      materialSources: ['Recycled Materials', 'Organic Fabrics'],
      website: 'https://ecoprints-chicago.com/',
      energyEfficiency: 1.8,
      imageUrl: getEcoFriendlyImageUrl('eco-friendly', 400, 300),
      wifiEnabled: true
    }
  ]);
  
  // Filtered producers based on search, tab, and match results
  const filteredProducers = producers.filter(producer => {
    if (currentStep === 3 && matchResults.length > 0) {
      // In step 3, only show producers from match results
      return matchResults.some(match => match.id === producer.id);
    }
    
    // Filter by search query
    if (searchQuery && 
        !producer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !producer.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !producer.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Filter by selected tab
    if (selectedTab === "wifi-enabled" && !producer.wifiEnabled) {
      return false;
    }
    
    if (selectedTab === "eco-friendly" && producer.sustainabilityScore < 80) {
      return false;
    }
    
    if (selectedTab === "local" && producer.distance > 5) {
      return false;
    }
    
    return true;
  });
  
  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error getting location:", error);
          // Set default location to Chicago downtown
          setUserLocation({
            lat: 41.8781,
            lng: -87.6298
          });
        }
      );
    } else {
      // Set default location to Chicago downtown if geolocation not supported
      setUserLocation({
        lat: 41.8781,
        lng: -87.6298
      });
    }
  }, []);
  
  // File upload handlers
  const handleFilesUploaded = (uploadedFiles) => {
    console.log("Files uploaded:", uploadedFiles);
    setFiles(uploadedFiles);
    setUploadError(null);
    
    if (uploadedFiles && uploadedFiles.length > 0) {
      // Get basic file information for display
      const basicInfo = {
        name: uploadedFiles[0].name,
        type: uploadedFiles[0].type,
        size: uploadedFiles[0].size,
        compatibilityScore: Math.floor(Math.random() * 20) + 80, // Random compatibility score between 80-100
      };
      
      setFileInfo(basicInfo);
      setCurrentStep(2);
      setActiveAnalysisTab('preview');
    }
  };
  
  const handleFileUploadError = (error) => {
    console.error("File upload error:", error);
    setUploadError(error);
  };

  // Direct file input handler as a fallback
  const handleManualFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Manual file upload:", files);
      // Simulate the processing that would normally happen in FileUploader
      const uploadedFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        preview: URL.createObjectURL(file),
        metadata: {
          dimensions: file.type.includes('image') ? '1200x800 px' : 'N/A',
          colorMode: file.type.includes('image') ? 'CMYK' : 'N/A',
          dpi: file.type.includes('image') ? '300 DPI' : 'N/A',
          pages: file.type.includes('pdf') ? '2' : '1',
          standardCompliance: Math.random() > 0.3 // 70% chance of compliance
        }
      }));
      
      handleFilesUploaded(uploadedFiles);
    }
  };
  
  // Design analysis handlers
  const handleDesignAnalysisComplete = (analysisResults) => {
    setDesignAnalysis(analysisResults);
    
    // Update match preferences based on analysis
    if (analysisResults) {
      setMatchPreferences(prev => ({
        ...prev,
        // Add relevant services based on analysis
        services: [...prev.services, ...analysisResults.productionMethods.slice(0, 2)],
      }));
    }
  };
  
  // Match preference handlers
  const handleRequirementsChange = (newRequirements) => {
    setMatchPreferences({
      ...matchPreferences,
      ...newRequirements,
    });
  };
  
  const handleReset = () => {
    setMatchPreferences({
      materialType: [],
      minimumSustainabilityScore: 0,
      maxDistance: 30,
      prioritizeLocalSupplyChain: true,
      services: [],
      ecoFriendly: false,
      useRecycledMaterials: false,
      lowEmissionDelivery: false,
    });
  };
  
  // Find matches based on requirements
  const handleFindMatch = () => {
    // Generate project requirements from files and preferences
    const requirements = extractProjectRequirements(files, {
      ...matchPreferences,
      location: userLocation,
    });
    
    // Start matching process
    setIsMatching(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Use the EcoLeanMatch algorithm to find matches
      const matches = findEcoLeanMatches(requirements, producers);
      
      setMatchResults(matches);
      setIsMatching(false);
      setCurrentStep(3);
    }, 1500);
  };

  // Reset the entire process and start over
  const handleStartOver = () => {
    setFiles([]);
    setCurrentStep(1);
    setFileInfo(null);
    setMatchResults([]);
    setIsMatching(false);
    setSavedToStorage(false);
    handleReset();
  };
  
  // Producer selection handlers
  const handleProducerSelect = (producer) => {
    setSelectedProducer(producer);
  };
  
  const clearSelectedProducer = () => {
    setSelectedProducer(null);
  };
  
  // Handle contacting a producer
  const handleContactProducer = (producer) => {
    console.log("Contacting producer:", producer.name);
    // In a real app, this would open a contact form or messaging interface
    navigate(`/contact-producer/${producer.id}`);
  };
  
  // Save design to IndexedDB
  const handleSaveToIndexedDB = async (designId) => {
    console.log("Design saved to library with ID:", designId);
    setSavedToStorage(true);
    // In a real app, this might show a notification or update UI
  };
  
  // Remove a file from the files array
  const handleRemoveFile = (fileIndex) => {
    const newFiles = [...files];
    newFiles.splice(fileIndex, 1);
    setFiles(newFiles);
    
    if (newFiles.length === 0) {
      setCurrentStep(1);
      setFileInfo(null);
    }
  };

  // Get summary of active filters
  const getActiveFilters = () => {
    const filters = [];
    
    if (matchPreferences.materialType && matchPreferences.materialType.length > 0) {
      filters.push(`Materials: ${matchPreferences.materialType.join(', ')}`);
    }
    
    if (matchPreferences.minimumSustainabilityScore > 0) {
      filters.push(`Min. sustainability: ${matchPreferences.minimumSustainabilityScore}`);
    }
    
    if (matchPreferences.maxDistance !== 30) {
      filters.push(`Max distance: ${matchPreferences.maxDistance} miles`);
    }
    
    if (matchPreferences.prioritizeLocalSupplyChain) {
      filters.push(`Local supply chain`);
    }
    
    if (matchPreferences.ecoFriendly) {
      filters.push(`Eco-friendly`);
    }
    
    if (matchPreferences.useRecycledMaterials) {
      filters.push(`Recycled materials`);
    }
    
    if (matchPreferences.lowEmissionDelivery) {
      filters.push(`Low-emission delivery`);
    }
    
    if (matchPreferences.services && matchPreferences.services.length > 0) {
      filters.push(`Services: ${matchPreferences.services.join(', ')}`);
    }
    
    return filters;
  };
  
  // Step progression controller
  const goToStep = (step) => {
    if (step === 3 && !designAnalysis) {
      // Require design analysis before going to match step
      return;
    }
    setCurrentStep(step);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">EcoLean SmartMatch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find Chicago print producers with transparent, sustainable, and local supply chains
          </p>
        </div>
        
        {/* Step Sequence Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            {/* Step connector line */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-muted"></div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {/* Step 1: Upload */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10
                    ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  1
                </div>
                <div className="text-center mt-2">
                  <h3 className="font-semibold text-sm">Upload Design</h3>
                  <p className="text-xs text-muted-foreground">Submit your file</p>
                </div>
              </div>
              
              {/* Step 2: Analyze */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10
                    ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  2
                </div>
                <div className="text-center mt-2">
                  <h3 className="font-semibold text-sm">Analyze & Optimize</h3>
                  <p className="text-xs text-muted-foreground">AI-powered optimization</p>
                </div>
              </div>
              
              {/* Step 3: Match */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10
                    ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  3
                </div>
                <div className="text-center mt-2">
                  <h3 className="font-semibold text-sm">Match & Connect</h3>
                  <p className="text-xs text-muted-foreground">Optimal production quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar (only visible in steps 2-3) */}
          {currentStep >= 2 && (
            <div className="md:col-span-3">
              <div className="sticky top-8">
                {fileInfo && (
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Uploaded File</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{fileInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{fileInfo.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Compatibility:</span>
                          <span className="font-medium text-green-600">{fileInfo.compatibilityScore}%</span>
                        </div>
                      </div>
                      
                      {currentStep >= 2 && fileInfo && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                            onClick={handleStartOver}
                          >
                            Upload Different File
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* Filters */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">Production Requirements</CardTitle>
                      {currentStep === 2 && (
                        <button
                          className="text-sm text-blue-600"
                          onClick={() => setFiltersVisible(!filtersVisible)}
                        >
                          {filtersVisible ? 'Hide' : 'Show'}
                        </button>
                      )}
                    </div>
                  </CardHeader>
                  
                  {(currentStep === 3 || (currentStep === 2 && filtersVisible)) && (
                    <CardContent>
                      <AdvancedFilters
                        requirements={matchPreferences}
                        onRequirementsChange={handleRequirementsChange}
                        onReset={handleReset}
                        onApply={handleFindMatch}
                        showApplyButton={currentStep === 2}
                      />
                      
                      {/* Environmental Preferences */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                        <div className="flex items-center mb-3">
                          <Leaf className="h-5 w-5 text-green-600 mr-2" />
                          <h3 className="text-md font-semibold">Environmental Impact</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={matchPreferences.ecoFriendly}
                              onChange={(e) => handleRequirementsChange({ ecoFriendly: e.target.checked })}
                              className="rounded text-green-600"
                            />
                            <span>Prioritize eco-friendly producers</span>
                          </label>
                          
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={matchPreferences.useRecycledMaterials}
                              onChange={(e) => handleRequirementsChange({ useRecycledMaterials: e.target.checked })}
                              className="rounded text-green-600"
                            />
                            <span>Use recycled materials</span>
                          </label>
                          
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={matchPreferences.lowEmissionDelivery}
                              onChange={(e) => handleRequirementsChange({ lowEmissionDelivery: e.target.checked })}
                              className="rounded text-green-600"
                            />
                            <span>Low-emission delivery options</span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Find Match button for Step 2 */}
                      {currentStep === 2 && designAnalysis && (
                        <div className="mt-6">
                          <Button 
                            onClick={handleFindMatch} 
                            className="w-full bg-primary text-white"
                          >
                            Find Optimal Matches
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          )}
          
          {/* Main Content Area */}
          <div className={`${currentStep >= 2 ? 'md:col-span-9' : 'md:col-span-12'}`}>
            {/* Step 1: Upload */}
            {currentStep === 1 && (
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Your Design</CardTitle>
                    <CardDescription>
                      Drag and drop your design files or click to browse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <Leaf className="h-5 w-5 mr-1 text-green-600" />
                        Pressly's EcoLean File Validation
                      </h3>
                      <p className="text-blue-700 mb-3">Our validation technology dramatically reduces defect waste by ensuring your files are print-ready through automated checks and intelligent corrections.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-200 rounded-full p-1">
                            <Check className="h-4 w-4 text-blue-700" />
                          </div>
                          <div className="ml-2">
                            <h4 className="text-sm font-medium text-blue-800">Automated Quality Checks</h4>
                            <p className="text-xs text-blue-600">Verifies resolution, color space, and format compatibility</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-200 rounded-full p-1">
                            <Zap className="h-4 w-4 text-blue-700" />
                          </div>
                          <div className="ml-2">
                            <h4 className="text-sm font-medium text-blue-800">Intelligent Auto-Correction</h4>
                            <p className="text-xs text-blue-600">Converts RGB to CMYK and standardizes files</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-200 rounded-full p-1">
                            <AlertCircle className="h-4 w-4 text-blue-700" />
                          </div>
                          <div className="ml-2">
                            <h4 className="text-sm font-medium text-blue-800">Root Cause Feedback</h4>
                            <p className="text-xs text-blue-600">Provides specific feedback to prevent repeat errors</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-200 rounded-full p-1">
                            <Clock className="h-4 w-4 text-blue-700" />
                          </div>
                          <div className="ml-2">
                            <h4 className="text-sm font-medium text-blue-800">Rapid Processing</h4>
                            <p className="text-xs text-blue-600">Completes validation within 1-2 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Main FileUploader component */}
                    <FileUploader 
                      onFilesUploaded={handleFilesUploaded} 
                      onFileUploadError={handleFileUploadError}
                      maxSize={100 * 1024 * 1024} 
                    />
                    
                    {/* Fallback direct file upload button in case the component doesn't work */}
                    {uploadError && (
                      <div className="mt-4">
                        <p className="text-red-600 mb-2">
                          {uploadError.toString()}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          If you're having trouble with the upload area above, try this alternative method:
                        </p>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleManualFileUpload}
                          accept="image/jpeg,image/png,image/svg+xml,application/pdf,application/illustrator"
                          style={{ display: 'none' }}
                        />
                        <Button 
                          onClick={() => fileInputRef.current.click()}
                          className="flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Select File from Computer
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Step 2: Design Analysis */}
            {currentStep === 2 && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Analyze & Optimize Your Design</CardTitle>
                    <CardDescription>
                      Our AI will analyze your design and provide optimization recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {files && files.length > 0 && (
                      <Tabs
                        defaultValue="preview"
                        value={activeAnalysisTab}
                        onValueChange={setActiveAnalysisTab}
                        className="mb-6"
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="preview">File Preview</TabsTrigger>
                          <TabsTrigger value="analysis">Design Analysis</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="mt-4">
                          <ErrorBoundary fallback={
                            <div className="p-6 border rounded-lg bg-red-50 text-red-800">
                              <h3 className="font-medium text-lg mb-2">Error Loading Design</h3>
                              <p>We encountered an error while loading your design file. This could be due to an unsupported file format or corrupted data.</p>
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleStartOver()}
                                  className="border-red-800 text-red-800 hover:bg-red-100"
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Upload a Different File
                                </Button>
                              </div>
                            </div>
                          }>
                            <CanvasFilePreview 
                              files={files}
                              onRemoveFile={handleRemoveFile}
                              onSaveToIndexedDB={handleSaveToIndexedDB}
                              width={800}
                              height={500}
                              showFileInfo={true}
                              showValidation={true}
                              showControls={true}
                            />
                          </ErrorBoundary>
                        </TabsContent>
                        <TabsContent value="analysis" className="mt-4">
                          <ErrorBoundary fallback={
                            <div className="p-6 border rounded-lg bg-red-50 text-red-800">
                              <h3 className="font-medium text-lg mb-2">Error Analyzing Design</h3>
                              <p>We encountered an error while analyzing your design file. This could be due to an unsupported file format or corrupted data.</p>
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleStartOver()}
                                  className="border-red-800 text-red-800 hover:bg-red-100"
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Upload a Different File
                                </Button>
                              </div>
                            </div>
                          }>
                            <CanvasDesignAnalyzer 
                              files={files}
                              onAnalysisComplete={handleDesignAnalysisComplete}
                              onSaveToIndexedDB={handleSaveToIndexedDB}
                              width={800}
                              height={500}
                              showColorAnalysis={true}
                              showProductionAnalysis={true}
                              showComplexityAnalysis={true}
                              autoStart={true}
                            />
                          </ErrorBoundary>
                        </TabsContent>
                      </Tabs>
                    )}
                    
                    {designAnalysis && (
                      <div className="mt-6 text-center">
                        <p className="text-muted-foreground mb-4">
                          Your design has been analyzed. Use the filters on the left to set your production requirements or proceed directly to finding matches.
                        </p>
                        <Button 
                          onClick={handleFindMatch} 
                          size="lg"
                          className="bg-primary text-white"
                        >
                          Find Optimal Matches
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Step 3: Match & Connect */}
            {currentStep === 3 && (
              <div>
                {/* Search and Filters for Match Results */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-blue-600" />
                      {matchResults.length} Optimal Matches
                    </h2>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={!mapView ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMapView(false)}
                        className="flex items-center gap-2"
                      >
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">List</span>
                      </Button>
                      <Button 
                        variant={mapView ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMapView(true)}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="hidden sm:inline">Map</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Quick search input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search within matches..."
                      className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Active filter badges */}
                  {getActiveFilters().length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {getActiveFilters().map((filter, index) => (
                        <Badge 
                          key={index}
                          variant={filter.includes("Eco") || filter.includes("sustain") ? "outline" : "secondary"}
                          className={filter.includes("Eco") || filter.includes("sustain") 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : ""}
                        >
                          {filter.includes("Eco") && <Leaf className="inline-block mr-1 h-3 w-3" />}
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Category tabs */}
                  <Card>
                    <CardContent className="p-1">
                      <div className="grid grid-cols-4 gap-1">
                        <Button 
                          variant={selectedTab === "all" ? "default" : "ghost"} 
                          className="rounded-md text-xs" 
                          onClick={() => setSelectedTab("all")}
                        >
                          All
                        </Button>
                        <Button 
                          variant={selectedTab === "wifi-enabled" ? "default" : "ghost"} 
                          className="rounded-md text-xs" 
                          onClick={() => setSelectedTab("wifi-enabled")}
                        >
                          <div className="flex items-center space-x-1">
                            <WifiIcon className="h-3 w-3" />
                            <span>WiFi Ready</span>
                          </div>
                        </Button>
                        <Button 
                          variant={selectedTab === "eco-friendly" ? "default" : "ghost"} 
                          className="rounded-md text-xs" 
                          onClick={() => setSelectedTab("eco-friendly")}
                        >
                          <span>Eco-Friendly</span>
                        </Button>
                        <Button 
                          variant={selectedTab === "local" ? "default" : "ghost"} 
                          className="rounded-md text-xs" 
                          onClick={() => setSelectedTab("local")}
                        >
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>Local</span>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Map View */}
                {mapView && (
                  <Card className="mb-6 overflow-hidden">
                    <div className="h-[400px]">
                      <PrinterMap
                        producers={filteredProducers}
                        userLocation={userLocation || {lat: 41.8781, lng: -87.6298}}
                        onProducerSelect={handleProducerSelect}
                      />
                    </div>
                  </Card>
                )}
                
                {/* Producer List */}
                {!mapView && filteredProducers.length > 0 && (
                  <div className="space-y-4">
                    {filteredProducers.map(producer => (
                      <Card key={producer.id} className="overflow-hidden">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            <UnsplashImage
                              src={producer.imageUrl}
                              alt={producer.name}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <div className="md:col-span-2 p-4">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                              <div>
                                <div className="flex items-center">
                                  <h2 className="text-xl font-bold">{producer.name}</h2>
                                  {producer.wifiEnabled && (
                                    <Badge variant="outline" className="ml-2">
                                      <WifiIcon className="w-3 h-3 mr-1" />
                                      WiFi Ready
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center mt-1">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span>{producer.rating}</span>
                                  <span className="text-muted-foreground ml-1">({producer.reviews} reviews)</span>
                                </div>
                              </div>
                              <div className="md:text-right">
                                <div className="flex items-center text-muted-foreground md:justify-end">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{producer.distance} miles away</span>
                                </div>
                                <div className="mt-1">
                                  <Badge variant="outline">
                                    {producer.availabilityPercent}% Available
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Capabilities</div>
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
                                <div className="text-sm text-muted-foreground">Specialties</div>
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
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button 
                                onClick={() => handleProducerSelect(producer)}
                                className="flex items-center gap-1"
                              >
                                <span>View Details</span>
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                className="flex items-center gap-1"
                                onClick={() => handleContactProducer(producer)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span>Contact</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* No Results */}
                {filteredProducers.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <p className="text-muted-foreground">No producers found matching your criteria.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedTab('all');
                        }}
                      >
                        Reset Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {/* Loading State */}
            {isMatching && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium">Finding the perfect match for your project...</p>
                <p className="text-muted-foreground mt-2">Analyzing waste reduction and environmental impact data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Producer Detail Modal */}
      {selectedProducer && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <Button 
                onClick={clearSelectedProducer}
                variant="ghost"
                className="flex items-center gap-1"
              >
                <span>Back to results</span>
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>Save</span>
                </Button>
                
                <Button 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleContactProducer(selectedProducer)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="overflow-hidden">
                  <UnsplashImage
                    src={selectedProducer.imageUrl}
                    alt={selectedProducer.name}
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-2xl font-bold">{selectedProducer.name}</h2>
                          {selectedProducer.wifiEnabled && (
                            <Badge variant="outline" className="ml-2">
                              <WifiIcon className="w-3 h-3 mr-1" />
                              WiFi Ready
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{selectedProducer.rating}</span>
                          <span className="text-muted-foreground ml-1">({selectedProducer.reviews} reviews)</span>
                        </div>
                        
                        <div className="flex items-center mt-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{selectedProducer.location.address}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div>Turnaround: {selectedProducer.turnaround}</div>
                        <div>Price Range: {selectedProducer.priceRange}</div>
                        <div>Availability: {selectedProducer.availabilityPercent}%</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Capabilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProducer.capabilities.map((cap, index) => (
                          <Badge key={index} variant="outline">{cap}</Badge>
                        ))}
                      </div>
                      
                      <h3 className="font-medium mb-2 mt-4">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProducer.specialties.map((spec, index) => (
                          <Badge key={index} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Request a Quote</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Project Details</label>
                      <textarea
                        rows={4}
                        className="w-full rounded-md border px-4 py-2 bg-background"
                        placeholder="Describe your project..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Timeline</label>
                      <select className="w-full rounded-md border px-4 py-2 bg-background">
                        <option value="standard">Standard ({selectedProducer.turnaround})</option>
                        <option value="rush">Rush (additional fees apply)</option>
                        <option value="flexible">Flexible (may receive discount)</option>
                      </select>
                    </div>
                    
                    <Button className="w-full">Submit Request</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Address:</strong> {selectedProducer.location.address}
                    </div>
                    <div>
                      <strong>Website:</strong> <a href={selectedProducer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedProducer.website}</a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CombinedSmartMatch;