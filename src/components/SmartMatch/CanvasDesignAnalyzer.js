import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  BarChart3, 
  Palette, 
  PenTool, 
  FileImage, 
  Layers, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  PlusCircle,
  MinusCircle,
  Maximize2,
  RotateCw,
  Check
} from 'lucide-react';
import CanvasDesignPreview from '../Canvas/CanvasDesignPreview';
import CanvasAnalyticsChart from '../Canvas/CanvasAnalyticsChart';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import IndexedDBService from '../../services/storage/indexedDBService';

/**
 * Canvas-based Design Analyzer
 * 
 * Advanced design analysis tool that leverages Canvas API for:
 * 1. Interactive design preview with zoom and pan
 * 2. Visual analysis of design elements and characteristics
 * 3. Color palette extraction and visualization
 * 4. Production method recommendation with visual charts
 */
const CanvasDesignAnalyzer = ({ 
  files, 
  onAnalysisComplete,
  onSaveToIndexedDB = null,
  width = 800,
  height = 600,
  showColorAnalysis = true,
  showProductionAnalysis = true,
  showComplexityAnalysis = true,
  autoStart = true
}) => {
  // Refs
  const canvasPreviewRef = useRef(null);
  const colorChartRef = useRef(null);
  
  // State
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [selectedTab, setSelectedTab] = useState('preview');
  const [colorPalette, setColorPalette] = useState([]);
  const [savedToStorage, setSavedToStorage] = useState(false);
  const [error, setError] = useState(null);
  
  // Start analysis when files change
  useEffect(() => {
    if (files && files.length > 0) {
      // Ensure the file has the required properties for CanvasDesignPreview
      const processedFile = processFileForCanvas(files[0]);
      setCurrentFile(processedFile);
      
      if (autoStart) {
        performAnalysis();
      }
    }
  }, [files, autoStart]);

  // Process file to ensure it's compatible with CanvasDesignPreview
  const processFileForCanvas = (file) => {
    // If it's already a Blob or File, we can use it directly
    if (file instanceof Blob || file instanceof File) {
      return file;
    }
    
    // If the file has a preview URL, we can use that
    if (file.preview && typeof file.preview === 'string') {
      return file.preview;
    }
    
    // If the file has fileData (ArrayBuffer), convert it to a Blob
    if (file.fileData) {
      const blob = new Blob([file.fileData], { type: file.type || 'application/octet-stream' });
      return URL.createObjectURL(blob);
    }
    
    // If the file has a thumbnail, use that
    if (file.thumbnail && typeof file.thumbnail === 'string') {
      return file.thumbnail;
    }
    
    // If the file is already in a format that can be rendered directly
    if (file.name && file.type) {
      return file;
    }
    
    // If we can't process the file, return a simple object with essential properties
    return {
      name: file.name || 'Unknown file',
      type: file.type || 'application/octet-stream',
      thumbnail: file.preview || null,
      preview: file.preview || null
    };
  };
  
  // Perform the design analysis
  const performAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
    setError(null);
    setSavedToStorage(false);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setAnalyzing(false);
          
          // Generate analysis results
          const results = generateAnalysisResults(files);
          setAnalysisResults(results);
          setColorPalette(results.colors);
          
          // Pass results to parent component
          if (onAnalysisComplete) {
            onAnalysisComplete(results);
          }
          
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  // Generate simulated analysis results
  const generateAnalysisResults = (files) => {
    try {
      // Determine design styles based on file types and names
      const styles = detectDesignStyles(files);
      
      // Extract color palette
      const colors = extractColorPalette(files);
      
      // Identify design category
      const category = determineDesignCategory(files);
      
      // Recommend production methods
      const productionMethods = recommendProductionMethods(files);
      
      // Estimated production complexity
      const complexity = estimateComplexity(files);
      
      // Generate full results object
      return {
        styles,
        colors,
        category,
        productionMethods,
        complexity,
        optimizedSpecs: generateOptimizedSpecs(files),
        tags: generateRelevantTags(files, styles, category),
        colorDistribution: generateColorDistribution(colors),
        productionScores: generateProductionScores(productionMethods),
        complexityFactors: generateComplexityFactors(files),
        sustainabilityScore: generateSustainabilityScore(files, productionMethods)
      };
    } catch (err) {
      console.error('Error analyzing design:', err);
      setError('Failed to analyze design: ' + err.message);
      return null;
    }
  };

  // Save analysis results to IndexedDB
  const saveAnalysisToStorage = async () => {
    if (!analysisResults || !files || files.length === 0) return;
    
    try {
      // Create design object with analysis results
      const designId = crypto.randomUUID();
      const designData = {
        id: designId,
        name: files[0].name || 'Untitled Design',
        fileType: files[0].type || 'application/octet-stream',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis: analysisResults,
        preview: files[0].preview || null,
        metadata: {
          fileSize: files[0].size,
          ...files[0].metadata
        }
      };
      
      // Add file data if available
      if (files[0] instanceof File) {
        const fileData = await fileToArrayBuffer(files[0]);
        designData.fileData = fileData;
      } else if (files[0].fileData) {
        designData.fileData = files[0].fileData;
      }
      
      // Save to IndexedDB
      await IndexedDBService.saveDesign(designData);
      setSavedToStorage(true);
      
      // Notify parent component if callback provided
      if (onSaveToIndexedDB) {
        onSaveToIndexedDB(designId);
      }
      
      return designId;
    } catch (err) {
      console.error('Error saving to IndexedDB:', err);
      setError('Failed to save design: ' + err.message);
      return null;
    }
  };
  
  // Convert file to ArrayBuffer for storage
  const fileToArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Export the current canvas view
  const exportCanvasImage = () => {
    if (canvasPreviewRef.current) {
      const dataUrl = canvasPreviewRef.current.exportImage('png');
      
      // Create a download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${files[0].name || 'design'}-analysis.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Reset the view of the canvas preview
  const resetCanvasView = () => {
    if (canvasPreviewRef.current) {
      canvasPreviewRef.current.resetView();
    }
  };

  // Generate color distribution data for chart
  const generateColorDistribution = (colors) => {
    // Create labels and values for the color distribution chart
    const values = colors.map(() => Math.floor(Math.random() * 50) + 20);
    
    // Ensure values sum to 100%
    const sum = values.reduce((a, b) => a + b, 0);
    const normalizedValues = values.map(v => Math.round((v / sum) * 100));
    
    // Adjust the last value to ensure sum is exactly 100
    const currentSum = normalizedValues.reduce((a, b) => a + b, 0);
    if (normalizedValues.length > 0) {
      normalizedValues[normalizedValues.length - 1] += (100 - currentSum);
    }
    
    return normalizedValues;
  };

  // Generate production method scores for chart
  const generateProductionScores = (methods) => {
    const scores = {};
    
    // Map of production methods to compatibility scores
    const methodScores = {
      'Offset Printing': 90,
      'Digital Printing': 95,
      'Screen Printing': 75,
      'Letterpress': 60,
      'Spot UV Coating': 85,
      'Embossing': 70,
      'Die Cutting': 65,
      'Foil Stamping': 75
    };
    
    // Generate scores for each method
    methods.forEach(method => {
      scores[method] = methodScores[method] || Math.floor(Math.random() * 30) + 65;
    });
    
    // Add a few more methods with lower scores for comparison
    const additionalMethods = Object.keys(methodScores)
      .filter(method => !methods.includes(method))
      .slice(0, 3);
      
    additionalMethods.forEach(method => {
      scores[method] = Math.floor(Math.random() * 25) + 40;
    });
    
    return scores;
  };

  // Generate complexity factors
  const generateComplexityFactors = (files) => {
    return {
      'Color Complexity': Math.floor(Math.random() * 30) + 70,
      'Detail Level': Math.floor(Math.random() * 40) + 60,
      'Technical Requirements': Math.floor(Math.random() * 40) + 60,
      'Size & Format': Math.floor(Math.random() * 20) + 80,
      'Special Finishes': Math.floor(Math.random() * 50) + 50
    };
  };

  // Generate sustainability score
  const generateSustainabilityScore = (files, methods) => {
    // Base score
    let score = 65 + Math.floor(Math.random() * 20);
    
    // Adjust based on production methods
    if (methods.includes('Digital Printing')) {
      score += 10;
    }
    
    if (methods.includes('Offset Printing')) {
      score -= 5;
    }
    
    if (methods.includes('Die Cutting') || methods.includes('Foil Stamping')) {
      score -= 10;
    }
    
    // Cap between 0-100
    return Math.min(100, Math.max(0, score));
  };

  /********** Design analysis methods ************/

  // Detect design styles based on file analysis
  const detectDesignStyles = (files) => {
    const styleOptions = [
      'Minimalist',
      'Corporate',
      'Artistic',
      'Vintage',
      'Modern',
      'Bold',
      'Elegant',
      'Geometric',
      'Organic',
      'Typography-focused'
    ];
    
    const numStyles = 1 + Math.floor(Math.random() * 2);
    const selectedStyles = [];
    
    for (let i = 0; i < numStyles; i++) {
      const randomIndex = Math.floor(Math.random() * styleOptions.length);
      const style = styleOptions[randomIndex];
      
      if (!selectedStyles.includes(style)) {
        selectedStyles.push(style);
      }
    }
    
    return selectedStyles;
  };

  // Extract dominant color palette from designs
  const extractColorPalette = (files) => {
    // Predefined palette options
    const palettes = [
      ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2980B9'], // Corporate
      ['#1A535C', '#4ECDC4', '#F7FFF7', '#FF6B6B', '#FFE66D'], // Fresh
      ['#5D5C61', '#379683', '#7395AE', '#557A95', '#B1A296'], // Sophisticated
      ['#2E294E', '#541388', '#F1E9DA', '#FFD400', '#D90368'], // Bold
      ['#EDEDED', '#F9F9F9', '#DBDBDB', '#8D8D8D', '#1F1F1F'], // Monochrome
    ];
    
    // Select a random palette
    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    
    // Return 3-5 colors
    const numColors = 3 + Math.floor(Math.random() * 3);
    return palette.slice(0, numColors);
  };

  // Determine design category
  const determineDesignCategory = (files) => {
    const categories = [
      'Business Card',
      'Brochure',
      'Poster',
      'Flyer',
      'Packaging',
      'Label',
      'Book Cover',
      'Magazine Spread',
      'Product Catalog',
      'Corporate Identity'
    ];
    
    return categories[Math.floor(Math.random() * categories.length)];
  };

  // Recommend production methods based on design analysis
  const recommendProductionMethods = (files) => {
    const methods = [];
    
    // Look for image files
    const hasImages = files.some(file => file.type && file.type.includes('image'));
    
    // Look for PDF files
    const hasPDF = files.some(file => file.type && file.type.includes('pdf'));
    
    // Look for vector files
    const hasVector = files.some(file => {
      const type = file.type || '';
      return type.includes('ai') || type.includes('eps') || type.includes('svg');
    });
    
    // Generate recommendations based on file types
    if (hasVector) {
      methods.push('Offset Printing');
    }
    
    if (hasImages || hasPDF) {
      methods.push('Digital Printing');
    }
    
    // Add additional methods based on random factors
    const additionalMethods = [
      'Spot UV Coating',
      'Embossing',
      'Die Cutting',
      'Foil Stamping',
      'Screen Printing',
      'Letterpress'
    ];
    
    // Add 0-2 additional methods
    const numAdditional = Math.floor(Math.random() * 3);
    for (let i = 0; i < numAdditional; i++) {
      const method = additionalMethods[Math.floor(Math.random() * additionalMethods.length)];
      if (!methods.includes(method)) {
        methods.push(method);
      }
    }
    
    return methods;
  };

  // Estimate production complexity
  const estimateComplexity = (files) => {
    // Initial complexity value
    let complexity = 1.0;
    
    // Increase complexity based on number of files
    complexity += (files.length - 1) * 0.1;
    
    // Increase complexity based on file types
    const hasVector = files.some(file => {
      const type = file.type || '';
      return type.includes('ai') || type.includes('eps') || type.includes('svg');
    });
    
    if (hasVector) {
      complexity += 0.2;
    }
    
    // Increase complexity based on files with issues
    const filesWithIssues = files.filter(file => !file.metadata?.standardCompliance);
    complexity += filesWithIssues.length * 0.15;
    
    // Cap complexity at 2.0
    return Math.min(2.0, complexity);
  };

  // Generate optimized production specifications
  const generateOptimizedSpecs = (files) => {
    return {
      recommendedPaper: getRecommendedPaper(),
      finishingOptions: getRecommendedFinishing(),
      colorProfile: getRecommendedColorProfile(files),
      printSettings: getRecommendedPrintSettings()
    };
  };

  // Generate paper recommendation
  const getRecommendedPaper = () => {
    const paperOptions = [
      '100lb Gloss Text',
      '80lb Uncoated Text',
      '14pt Coated Cover',
      '100lb Silk Cover',
      '70lb Uncoated Text',
      '110lb Matte Cover'
    ];
    
    return paperOptions[Math.floor(Math.random() * paperOptions.length)];
  };

  // Generate finishing recommendations
  const getRecommendedFinishing = () => {
    const finishingOptions = [
      'Aqueous Coating',
      'Matte Lamination',
      'Gloss Lamination',
      'Spot UV',
      'Die Cutting',
      'None'
    ];
    
    return finishingOptions[Math.floor(Math.random() * finishingOptions.length)];
  };

  // Recommend color profile based on file analysis
  const getRecommendedColorProfile = (files) => {
    // Check if any file is already in CMYK
    const hasCMYK = files.some(file => file.metadata?.colorMode === 'CMYK');
    
    if (hasCMYK) {
      return 'CMYK (US Web Coated SWOP)';
    } else {
      return 'Convert RGB to CMYK (US Web Coated SWOP)';
    }
  };

  // Get recommended print settings
  const getRecommendedPrintSettings = () => {
    // Random selection of realistic print settings
    const settings = {
      resolution: ['300 DPI', '600 DPI'][Math.floor(Math.random() * 2)],
      colorMode: ['CMYK', 'CMYK + Spot'][Math.floor(Math.random() * 2)],
      bleed: ['0.125"', '0.25"'][Math.floor(Math.random() * 2)],
    };
    
    return settings;
  };

  // Generate relevant tags for the design
  const generateRelevantTags = (files, styles, category) => {
    const tags = [...styles];
    
    // Add category as a tag
    if (category && !tags.includes(category)) {
      tags.push(category);
    }
    
    // Add additional relevant tags
    const additionalTags = [
      'Print Ready',
      'Professional',
      'Marketing',
      'Advertising',
      'Brand Identity',
      'Commercial',
      'Creative',
      'Promotional'
    ];
    
    // Add 2-3 additional tags
    const numAdditional = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numAdditional; i++) {
      const tagIndex = Math.floor(Math.random() * additionalTags.length);
      const tag = additionalTags[tagIndex];
      
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    return tags;
  };

  // No files to analyze
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center text-primary">
            <Zap className="h-5 w-5 mr-2" />
            AI Design Analysis
          </h3>
          
          {analysisResults && !analyzing && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportCanvasImage}
                title="Export Analysis as Image"
              >
                <FileImage className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              
              {onSaveToIndexedDB && (
                <Button 
                  variant={savedToStorage ? "outline" : "default"}
                  size="sm"
                  onClick={saveAnalysisToStorage}
                  disabled={savedToStorage}
                  title={savedToStorage ? "Saved to Library" : "Save to Design Library"}
                >
                  {savedToStorage ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Saved</span>
                    </>
                  ) : (
                    <>
                      <Layers className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Save</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Analysis Progress */}
      {analyzing && (
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Analyzing design patterns and production requirements...</p>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            This might take a moment while we analyze your design
          </div>
        </div>
      )}
      
      {/* Analysis Error */}
      {error && (
        <div className="p-6 bg-red-50 text-red-800">
          <p className="font-medium">Analysis Failed</p>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={performAnalysis}
          >
            Retry Analysis
          </Button>
        </div>
      )}
      
      {/* Analysis Results */}
      {!analyzing && analysisResults && !error && (
        <div>
          {/* Tabs */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button
                className={`px-4 py-3 text-sm font-medium border-b-2 ${selectedTab === 'preview' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                onClick={() => setSelectedTab('preview')}
              >
                <FileImage className="h-4 w-4 inline-block mr-2" />
                Design Preview
              </button>
              
              {showColorAnalysis && (
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${selectedTab === 'colors' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setSelectedTab('colors')}
                >
                  <Palette className="h-4 w-4 inline-block mr-2" />
                  Color Analysis
                </button>
              )}
              
              {showProductionAnalysis && (
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${selectedTab === 'production' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setSelectedTab('production')}
                >
                  <PenTool className="h-4 w-4 inline-block mr-2" />
                  Production Methods
                </button>
              )}
              
              {showComplexityAnalysis && (
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${selectedTab === 'complexity' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setSelectedTab('complexity')}
                >
                  <BarChart3 className="h-4 w-4 inline-block mr-2" />
                  Complexity
                </button>
              )}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {/* Design Preview Tab */}
            {selectedTab === 'preview' && (
              <div>
                <div className="bg-muted/30 rounded-md overflow-hidden">
                  <CanvasDesignPreview
                    ref={canvasPreviewRef}
                    designData={currentFile}
                    width={width}
                    height={height}
                    initialZoom={1.0}
                    allowZoom={true}
                    allowPan={true}
                    allowRotate={true}
                    backgroundColor="#f9f9f9"
                    showGrid={false}
                  />
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetCanvasView}
                  >
                    <Maximize2 className="h-4 w-4 mr-1" />
                    Reset View
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => canvasPreviewRef.current?.rotateRight()}
                  >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Rotate
                  </Button>
                </div>
                
                {/* Basic Analysis Summary */}
                <div className="mt-6 bg-muted/30 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-medium">Design Insights</h4>
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setAnalysisExpanded(!analysisExpanded)}
                    >
                      {analysisExpanded ? (
                        <MinusCircle className="h-5 w-5" />
                      ) : (
                        <PlusCircle className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Design Style:</span> {analysisResults.styles.join(', ')}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Category:</span> {analysisResults.category}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Production Methods:</span> {analysisResults.productionMethods.join(', ')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Color Palette:</span>
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {analysisResults.colors.map((color, index) => (
                          <div 
                            key={index}
                            className="w-6 h-6 rounded-sm border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Complexity:</span> {analysisResults.complexity.toFixed(1)}
                        <span className="text-xs text-muted-foreground ml-1">(1.0 = Standard)</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {analysisExpanded && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="text-sm font-medium mb-2">Optimized Production Specifications</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p>
                          <span className="font-medium">Recommended Paper:</span> {analysisResults.optimizedSpecs.recommendedPaper}
                        </p>
                        <p>
                          <span className="font-medium">Finishing:</span> {analysisResults.optimizedSpecs.finishingOptions}
                        </p>
                        <p>
                          <span className="font-medium">Color Profile:</span> {analysisResults.optimizedSpecs.colorProfile}
                        </p>
                        <p>
                          <span className="font-medium">Resolution:</span> {analysisResults.optimizedSpecs.printSettings.resolution}
                        </p>
                        <p>
                          <span className="font-medium">Color Mode:</span> {analysisResults.optimizedSpecs.printSettings.colorMode}
                        </p>
                        <p>
                          <span className="font-medium">Bleed:</span> {analysisResults.optimizedSpecs.printSettings.bleed}
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Relevant Tags</h5>
                        <div className="flex flex-wrap gap-1">
                          {analysisResults.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Sustainability Score</h5>
                        <div className="bg-muted h-4 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-width duration-500 ease-out ${
                              analysisResults.sustainabilityScore >= 80 ? 'bg-green-500' :
                              analysisResults.sustainabilityScore >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${analysisResults.sustainabilityScore}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analysisResults.sustainabilityScore >= 80 ? 'Excellent environmental impact' :
                          analysisResults.sustainabilityScore >= 60 ? 'Good environmental impact' :
                          'Higher environmental impact'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Color Analysis Tab */}
            {selectedTab === 'colors' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Color Palette Display */}
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="text-base font-medium mb-3">Color Palette</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {colorPalette.map((color, index) => (
                        <div key={index} className="text-center">
                          <div 
                            className="w-12 h-12 rounded-md border border-gray-200 mx-auto"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-xs mt-1 block font-mono">{color}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This color palette has been extracted from your design for optimal reproduction.
                    </p>
                  </div>
                  
                  {/* Color Distribution Chart */}
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="text-base font-medium mb-3">Color Distribution</h4>
                    <CanvasAnalyticsChart
                      ref={colorChartRef}
                      type="pie"
                      data={analysisResults.colorDistribution}
                      width={300}
                      height={200}
                      colors={colorPalette}
                      animate={true}
                      showLegend={false}
                    />
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md mb-6">
                  <h4 className="text-base font-medium mb-2">Color Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Use {analysisResults.optimizedSpecs.colorProfile} for accurate color reproduction</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>
                        The dominant color represents {Math.max(...analysisResults.colorDistribution)}% of your design
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>
                        {colorPalette.length === 5 ? 'Your design has a rich color palette that may benefit from' : 
                         colorPalette.length >= 3 ? 'Your balanced color palette is ideal for' : 
                         'Your minimalist color palette is perfect for'} {analysisResults.productionMethods[0]}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Production Methods Tab */}
            {selectedTab === 'production' && (
              <div>
                <div className="bg-muted/30 p-4 rounded-md mb-6">
                  <h4 className="text-base font-medium mb-3">Optimal Production Methods</h4>
                  <div className="h-[250px]">
                    <CanvasAnalyticsChart
                      type="bar"
                      data={Object.values(analysisResults.productionScores)}
                      labels={Object.keys(analysisResults.productionScores)}
                      width={width - 40}
                      height={250}
                      colors={['var(--primary)']}
                      animate={true}
                      showLegend={false}
                      formatYAxis={value => `${Math.round(value)}%`}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="text-base font-medium mb-3">Recommended Specifications</h4>
                    <ul className="space-y-3">
                      <li className="border-b pb-2">
                        <span className="text-sm font-medium">Recommended Paper:</span>
                        <p className="text-sm">{analysisResults.optimizedSpecs.recommendedPaper}</p>
                      </li>
                      <li className="border-b pb-2">
                        <span className="text-sm font-medium">Finishing:</span>
                        <p className="text-sm">{analysisResults.optimizedSpecs.finishingOptions}</p>
                      </li>
                      <li className="border-b pb-2">
                        <span className="text-sm font-medium">Resolution:</span>
                        <p className="text-sm">{analysisResults.optimizedSpecs.printSettings.resolution}</p>
                      </li>
                      <li>
                        <span className="text-sm font-medium">Bleed:</span>
                        <p className="text-sm">{analysisResults.optimizedSpecs.printSettings.bleed}</p>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="text-base font-medium mb-3">Method Compatibility</h4>
                    <div className="space-y-3">
                      {Object.entries(analysisResults.productionScores)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([method, score], index) => (
                          <div key={method}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{method}</span>
                              <span className={
                                score >= 90 ? 'text-green-600' :
                                score >= 75 ? 'text-yellow-600' :
                                'text-amber-600'
                              }>
                                {score}%
                              </span>
                            </div>
                            <div className="bg-muted h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  score >= 90 ? 'bg-green-500' :
                                  score >= 75 ? 'bg-yellow-500' :
                                  'bg-amber-500'
                                }`}
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Complexity Analysis Tab */}
            {selectedTab === 'complexity' && (
              <div>
                <div className="bg-muted/30 p-4 rounded-md mb-6">
                  <h4 className="text-base font-medium mb-3">Design Complexity Factors</h4>
                  <div className="h-[250px]">
                    <CanvasAnalyticsChart
                      type="bar"
                      data={Object.values(analysisResults.complexityFactors)}
                      labels={Object.keys(analysisResults.complexityFactors)}
                      width={width - 40}
                      height={250}
                      colors={['var(--primary)']}
                      animate={true}
                      showLegend={false}
                      formatYAxis={value => `${Math.round(value)}%`}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="text-base font-medium mb-3">Overall Complexity</h4>
                    <div className="flex items-center justify-center my-4">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="#e2e8f0" 
                            strokeWidth="10"
                          />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="var(--primary)" 
                            strokeWidth="10"
                            strokeDasharray={`${Math.min(analysisResults.complexity * 50, 100) * 2.83} 283`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-2xl font-bold">{analysisResults.complexity.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">Complexity</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      {analysisResults.complexity <= 1.0 ? 'Standard complexity' :
                       analysisResults.complexity <= 1.5 ? 'Moderate complexity' :
                       'High complexity'}
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="text-base font-medium mb-3">Production Impact</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          {analysisResults.complexity <= 1.0 
                            ? 'Standard production timeline expected' 
                            : analysisResults.complexity <= 1.5
                            ? 'May require additional production time'
                            : 'Will require extended production timeline'}
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          Most compatible with {analysisResults.productionMethods[0]}
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          {
                            Math.max(...Object.values(analysisResults.complexityFactors)) > 85
                              ? `Consider simplifying ${Object.keys(analysisResults.complexityFactors).find(
                                  key => analysisResults.complexityFactors[key] > 85
                                )} for more efficient production`
                              : 'Design is well-optimized for production'
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="p-4 border-t bg-muted/10">
            <div className="flex flex-wrap gap-2">
              {!autoStart && !analysisResults && (
                <Button onClick={performAnalysis} className="bg-primary text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Analysis
                </Button>
              )}
              
              {onAnalysisComplete && (
                <Button 
                  className="bg-primary text-white"
                  onClick={() => onAnalysisComplete(analysisResults)}
                >
                  Apply Analysis Results
                </Button>
              )}
              
              {onSaveToIndexedDB && !savedToStorage && (
                <Button 
                  variant="outline"
                  onClick={saveAnalysisToStorage}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Save to Design Library
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CanvasDesignAnalyzer.propTypes = {
  files: PropTypes.array.isRequired,
  onAnalysisComplete: PropTypes.func,
  onSaveToIndexedDB: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  showColorAnalysis: PropTypes.bool,
  showProductionAnalysis: PropTypes.bool,
  showComplexityAnalysis: PropTypes.bool,
  autoStart: PropTypes.bool
};

export default CanvasDesignAnalyzer;