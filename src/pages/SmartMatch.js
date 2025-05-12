import React, { useState, useEffect, useRef, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdvancedFilters from '../components/AdvancedFilters';
import ProducerCard from '../components/ProducerCard';
import { 
  Shirt, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Zap, 
  AlertCircle, 
  Clock,
  Leaf,
  Upload,
  RotateCw,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import CanvasFilePreview from '../components/SmartMatch/CanvasFilePreview';
import CanvasDesignAnalyzer from '../components/SmartMatch/CanvasDesignAnalyzer';
import FileUploader from '../components/SmartMatch/FileUploader';
import EcoMatchResults from '../components/SmartMatch/EcoMatchResults';
import IndexedDBService from '../services/storage/indexedDBService';
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

const SmartMatch = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Core state
  const [files, setFiles] = useState([]);
  const [matchStep, setMatchStep] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [matchResults, setMatchResults] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [designAnalysis, setDesignAnalysis] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [uploadError, setUploadError] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  
  // Match preferences
  const [matchPreferences, setMatchPreferences] = useState({
    materialType: [],
    minimumSustainabilityScore: 0,
    maxDistance: 30,
    prioritizeLocalSupplyChain: true,
    services: [],
    ecoFriendly: false,  // Environmental preference
    useRecycledMaterials: false, // Environmental preference
    lowEmissionDelivery: false, // Environmental preference
  });
  
  // Chicago area producers with detailed data including environmental impact info
  const [producers] = useState([
    { 
      id: 1, 
      name: 'Rowboat Creative', 
      rating: 4.9, 
      location: {
        lat: 41.8959, 
        lng: -87.6678,
        city: 'Chicago',
        address: '1709 W Chicago Ave, Chicago, IL 60622',
      },
      distance: 3.2,
      capabilities: ['DTG Printing', 'Screen Printing', 'Embroidery', 'Dye Sublimation'],
      specialties: ['Detailed Images', 'Full Color Prints', 'T-Shirts', 'Custom Merch'],
      turnaround: '7-10 business days',
      turnaroundHours: 192, // For the algorithm
      priceRange: '$$$',
      availabilityPercent: 65,
      sustainable: false,
      sustainabilityScore: 90,
      materialSources: ['Standard Apparel Distributors'],
      website: 'https://rowboatcreative.com/dtg',
      energyEfficiency: 0.8, // Added for EcoLeanMatch, 1.0 is average
    },
    { 
      id: 2, 
      name: 'Sharprint', 
      rating: 4.8, 
      location: {
        lat: 41.9262, 
        lng: -87.7068, 
        city: 'Chicago',
        address: '4200 W Diversey Ave, Chicago, IL 60639',
      },
      distance: 5.6,
      capabilities: ['Screen Printing', 'Embroidery', 'Digital Printing', 'Eco-Friendly Printing'],
      specialties: ['Eco-Friendly Clothing', 'Sustainable Apparel', 'Green Printing'],
      turnaround: '5-7 business days',
      turnaroundHours: 144, // For the algorithm
      priceRange: '$$$',
      availabilityPercent: 60,
      sustainable: true,
      sustainabilityScore: 95,
      materialSources: ['Organic Cotton', 'Recycled Fabrics', 'Sustainable Sources'],
      website: 'https://www.sharprint.com/custom-apparel/eco-friendly-clothing',
      energyEfficiency: 1.4, // Better than average energy efficiency
    },
    { 
      id: 3, 
      name: 'Minuteman Press', 
      rating: 4.7, 
      location: {
        lat: 41.8895, 
        lng: -87.6352,
        city: 'Chicago',
        address: '227 W Van Buren St #125, Chicago, IL 60607', 
      },
      distance: 6.1,
      capabilities: ['DTG Printing', 'Screen Printing', 'Union Bug Printing'],
      specialties: ['Same Day Service', 'Fast Turnaround', 'Political Printing'],
      turnaround: '1-2 business days',
      turnaroundHours: 36, // For the algorithm
      priceRange: '$',
      availabilityPercent: 75,
      sustainable: false,
      sustainabilityScore: 60,
      materialSources: ['Standard Suppliers'],
      website: 'https://www.samedayteeshirts.com/',
      energyEfficiency: 0.9, // Slightly below average energy efficiency
    },
    { 
      id: 4, 
      name: 'Chicago Signs and Screen Printing', 
      rating: 4.8, 
      location: {
        lat: 41.9128, 
        lng: -87.6843,
        city: 'Chicago',
        address: '1383 N Milwaukee Ave, Chicago, IL 60622', 
      },
      distance: 2.8,
      capabilities: ['Screen Printing', 'DTG Printing', 'DTF Printing', 'Embroidery'],
      specialties: ['Custom Apparel', 'Signage', 'Promotional Items'],
      turnaround: '3-5 business days',
      turnaroundHours: 96, // For the algorithm
      priceRange: '$',
      availabilityPercent: 80,
      sustainable: false,
      sustainabilityScore: 70,
      materialSources: ['Standard Suppliers'],
      website: 'https://chicagosigns.com/customizations/',
      energyEfficiency: 1.0, // Average energy efficiency
    },
    { 
      id: 5, 
      name: 'LuckyPrints', 
      rating: 4.9, 
      location: {
        lat: 41.9178, 
        lng: -87.6873,
        city: 'Chicago', 
        address: '2140 N Milwaukee Ave, Chicago, IL 60647',
      },
      distance: 2.5,
      capabilities: ['Screen Printing', 'Embroidery', 'Finishing'],
      specialties: ['Custom Apparel', 'High Quality Prints', 'T-Shirts'],
      turnaround: '7-10 business days',
      turnaroundHours: 192, // For the algorithm
      priceRange: '$',
      availabilityPercent: 55,
      sustainable: false,
      sustainabilityScore: 85,
      materialSources: ['Standard Suppliers'],
      website: 'https://luckyprints.com/',
      energyEfficiency: 1.1, // Slightly above average energy efficiency
    },
    { 
      id: 6, 
      name: 'Eco Prints Chicago',
      rating: 4.8, 
      location: {
        lat: 41.8985, 
        lng: -87.6688,
        city: 'Chicago',
        address: '1739 W Grand Ave, Chicago, IL 60622', 
      },
      distance: 3.2,
      capabilities: ['Zero-waste printing', 'Eco-friendly materials', 'Sustainable practices', 'Carbon Neutral Printing'],
      specialties: ['Sustainable Printing', 'Eco-friendly Materials', 'Zero Waste'],
      turnaround: '5-7 business days',
      turnaroundHours: 144, // For the algorithm
      priceRange: '$$$',
      availabilityPercent: 65,
      sustainable: true,
      sustainabilityScore: 98,
      materialSources: ['Recycled Materials', 'Organic Fabrics'],
      website: 'https://ecoprints-chicago.com/',
      energyEfficiency: 1.8, // Very high energy efficiency
    },
    { 
      id: 7, 
      name: 'Chicago Garment Printers', 
      rating: 4.7, 
      location: {
        lat: 41.9649, 
        lng: -87.6768,
        city: 'Chicago',
        address: '4035 N Ravenswood Ave, Chicago, IL 60613', 
      },
      distance: 4.5,
      capabilities: ['Screen Printing', 'Embroidery', 'Promotional Products', 'Eco-Friendly Printing'],
      specialties: ['Eco-Friendly Printing', 'Custom Garments', 'Quality Service'],
      turnaround: '5-7 business days',
      turnaroundHours: 144, // For the algorithm
      priceRange: '$',
      availabilityPercent: 70,
      sustainable: true,
      sustainabilityScore: 92,
      materialSources: ['Environmentally Friendly Materials'],
      website: 'https://chicagogarmentprinters.com/',
      energyEfficiency: 1.5, // Above average energy efficiency
    }
  ]);
  
  // Get user's location when component mounts
  useEffect(() => {
    // Only ask for location if browser supports it
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
  
  // Handle file upload via the FileUploader component
  const handleFilesUploaded = (uploadedFiles) => {
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
      setMatchStep(2);
      setActiveTab('preview');
    }
  };
  
  // Handle manual file upload (fallback for FileUploader)
  const handleManualFileUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Process the files to have the same format as FileUploader output
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
  
  // Handle file upload error
  const handleFileUploadError = (error) => {
    console.error("File upload error:", error);
    setUploadError(error);
  };
  
  // Handle design analysis completion
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
  
  // Handle change in match requirements
  const handleRequirementsChange = (newRequirements) => {
    setMatchPreferences({
      ...matchPreferences,
      ...newRequirements,
    });
  };
  
  // Reset match preferences to defaults
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
  
  // Find matches based on preferences
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
      // Use the EcoLeanMatch algorithm instead of the standard filtering
      const matches = findEcoLeanMatches(requirements, producers);
      
      setMatchResults(matches);
      setIsMatching(false);
      setMatchStep(4);
    }, 1500);
  };

  // Reset the entire form and start over
  const handleStartOver = () => {
    setFiles([]);
    setMatchStep(1);
    setFileInfo(null);
    setMatchResults([]);
    setIsMatching(false);
    handleReset();
  };
  
  // Handle contact producer action from match results
  const handleContactProducer = (producer) => {
    console.log("Contacting producer:", producer.name);
    // In a real app, this would open a contact form or messaging interface
    navigate(`/contact-producer/${producer.id}`);
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

  // Save design to IndexedDB
  const handleSaveToIndexedDB = async (designId) => {
    console.log("Design saved to library with ID:", designId);
    // In a real app, this might show a notification or update UI
  };

  // Remove a file from the files array
  const handleRemoveFile = (fileIndex) => {
    const newFiles = [...files];
    newFiles.splice(fileIndex, 1);
    setFiles(newFiles);
    
    if (newFiles.length === 0) {
      setMatchStep(1);
      setFileInfo(null);
    }
  };

  return (
    <section className="py-8">
      {/* Desktop navigation for SmartMatch page */}
      <div className="container mx-auto">
        <div className="hidden md:flex mb-6 bg-muted p-2 rounded-lg">
          <button
            className="mr-2 px-3 py-1 rounded bg-background shadow-sm font-medium text-primary"
            onClick={() => {}} // Already on SmartMatch
          >
            <Zap size={16} className="inline mr-1" />
            SmartMatch
          </button>
          <div className="flex-grow"></div>
          <button
            className="px-3 py-1 text-muted-foreground font-medium rounded hover:bg-background"
            onClick={() => navigate('/producers')}
          >
            <MapPin size={16} className="inline mr-1" />
            Browse All Producers
          </button>
          <button
            className="ml-2 px-3 py-1 text-blue-600 font-medium rounded hover:bg-background"
            onClick={() => navigate('/designs')}
          >
            <Shirt size={16} className="inline mr-1" />
            My Designs
          </button>
        </div>
      </div>
      
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">EcoLean SmartMatch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find Chicago print producers with transparent, sustainable, and local supply chains
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Lean Waste Reduction</Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Environmental Impact Analysis</Badge>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Kaizen Continuous Improvement</Badge>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Self-Optimizing Matching</Badge>
          </div>
          
          {fileInfo && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mt-4">
              <span className="font-medium">
                {fileInfo.name} - Compatibility: {fileInfo.compatibilityScore}%
              </span>
            </div>
          )}

          {/* Only show this when the user has gotten results */}
          {matchStep >= 4 && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={handleStartOver}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over with New Design
              </Button>
            </div>
          )}
        </div>
        
        {/* Step 1: Upload */}
        {matchStep === 1 && (
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
                
                {/* File Uploader */}
                <FileUploader 
                  onFilesUploaded={handleFilesUploaded} 
                  onFileUploadError={handleFileUploadError}
                  maxSize={100 * 1024 * 1024} /* Increase max size to 100MB for professional designers */
                />
                
                {/* Fallback manual upload */}
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

        {/* Steps 2-4: File Analysis, Matching, and Results */}
        {matchStep >= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Sidebar with Filters */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <div className="flex md:hidden justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    className="inline-flex items-center text-sm font-medium"
                    onClick={() => setFiltersVisible(!filtersVisible)}
                  >
                    {filtersVisible ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide Filters
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show Filters
                      </>
                    )}
                  </button>
                </div>

                {filtersVisible && (
                  <>
                    <Card className="mb-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Production Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AdvancedFilters
                          requirements={matchPreferences}
                          onRequirementsChange={handleRequirementsChange}
                          onReset={handleReset}
                          onApply={handleFindMatch}
                          showApplyButton={matchStep === 3}
                        />
                      </CardContent>
                    </Card>
                    
                    {/* Environmental Preferences Section */}
                    <Card className="bg-green-50 border-green-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Leaf className="h-5 w-5 text-green-600 mr-2" />
                          Environmental Impact
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
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
                        
                        <div className="mt-4 text-xs text-green-700">
                          <p>Selecting these options will prioritize producers with sustainable practices and materials, reducing your project's carbon footprint.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2">
              {/* File Analysis */}
              {files && files.length > 0 && matchStep === 2 && (
                <>
                  <Tabs 
                    defaultValue="preview" 
                    value={activeTab} 
                    onValueChange={setActiveTab}
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
                              onClick={handleStartOver}
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
                          width={600}
                          height={400}
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
                              onClick={handleStartOver}
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
                          width={600}
                          height={400}
                          showColorAnalysis={true}
                          showProductionAnalysis={true}
                          showComplexityAnalysis={true}
                          autoStart={true}
                        />
                      </ErrorBoundary>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="text-center mt-6">
                    <Button onClick={() => setMatchStep(3)} className="bg-primary text-white">
                      Continue to Matching
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
              
              {/* Match Preparation */}
              {matchStep === 3 && (
                <>
                  <Card className="text-center mb-6">
                    <CardHeader>
                      <CardTitle>Ready to Find Your Perfect Match?</CardTitle>
                      <CardDescription>
                        Use the filters to specify your requirements and find the best Chicago print producers for your project.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        size="lg"
                        className="bg-primary text-white hover:bg-primary/90"
                        onClick={handleFindMatch}
                      >
                        <Zap className="mr-2 h-5 w-5" />
                        Find Matches
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Leaf className="h-5 w-5 text-green-600 mr-2" />
                        EcoLean Matching
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-700">
                        Our enhanced algorithm reduces waste by optimizing for proximity, equipment compatibility, availability, and environmental impact. Use the environmental filters to further prioritize sustainability.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* Match Results */}
              {matchStep === 4 && matchResults.length > 0 && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-blue-600" />
                      {matchResults.length} Matching Chicago Print Producers
                    </h2>
                    
                    {/* Active Filters */}
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
                  </div>
                  
                  {/* Enhanced Match Results Component */}
                  <EcoMatchResults 
                    matches={matchResults} 
                    onContactProducer={handleContactProducer}
                  />
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
        )}
      </div>
    </section>
  );
};

export default SmartMatch;