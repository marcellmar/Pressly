import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Upload, File, Image, CheckCircle, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import FileValidation from "./FileValidation";
import AIEnhanceButton from "./AITools/AIEnhanceButton";

// Import AI services (if needed directly in this component)
import aiServices from "../services/ai";

const FileUpload = ({ onFileAnalyzed }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState(null);
  const [error, setError] = useState("");
  const [aiEnhancements, setAiEnhancements] = useState(null);
  const fileInputRef = useRef(null);

  const allowedFileTypes = [
    "application/pdf",
    "image/png",
    "image/svg+xml",
    "image/jpeg",
    "application/illustrator",
    "image/jpg", 
    "application/postscript",
    "image/tiff",
    "application/eps"
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setError("");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Handle paste from clipboard (e.g., screenshots)
  const handlePaste = (e) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      validateAndProcessFile(e.clipboardData.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    setError("");
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    // Check file type
    const fileExt = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['pdf', 'png', 'svg', 'jpg', 'jpeg', 'ai', 'eps', 'tif', 'tiff'];
    
    if (!allowedFileTypes.includes(file.type) && !validExtensions.includes(fileExt)) {
      // Try to determine type by extension for files with generic MIME types
      if (file.type === 'application/octet-stream' || file.type === '') {
        if (validExtensions.includes(fileExt)) {
          // Accept file with valid extension even if MIME type is generic
          console.log(`Accepting file with extension .${fileExt} despite MIME type: ${file.type}`);
        } else {
          setError("Invalid file type. Please upload a PDF, PNG, SVG, JPEG, TIFF, EPS, or AI file.");
          return;
        }
      } else {
        setError("Invalid file type. Please upload a PDF, PNG, SVG, JPEG, TIFF, EPS, or AI file.");
        return;
      }
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File is too large. Maximum size is 50MB.");
      return;
    }
    
    setFile(file);
    analyzeFile(file);
  };

  // Simulated validation based on file attributes
  const validateFile = (file) => {
    // Extract file extension
    const fileExt = file.name.split('.').pop().toLowerCase();
    
    // Random number for dpi to simulate different file qualities
    const dpi = Math.floor(Math.random() * 400) + 100; // Between 100-500 DPI
    
    // Determine color space based on file type and random chance
    let colorSpace;
    if (fileExt === 'pdf' || fileExt === 'eps' || fileExt === 'ai') {
      colorSpace = Math.random() > 0.3 ? 'CMYK' : 'RGB';
    } else {
      colorSpace = Math.random() > 0.7 ? 'CMYK' : 'RGB';
    }
    
    // Calculate validation time (between 15-90 seconds)
    const validationTime = Math.floor(Math.random() * 75) + 15;
    
    const corrections = [];
    const detailedErrors = [];
    
    // Simulate auto-corrections
    if (colorSpace === 'RGB') {
      corrections.push('Converted RGB color space to CMYK for optimal print quality');
      colorSpace = 'CMYK (Converted)';
    }
    
    if (dpi < 300) {
      if (dpi > 150) {
        corrections.push('Upscaled image resolution for better print quality');
      } else {
        detailedErrors.push('Resolution too low for quality printing (minimum 300 DPI recommended)');
      }
    }
    
    // Other potential issues
    if (Math.random() > 0.8) {
      if (Math.random() > 0.5) {
        corrections.push('Embedded all fonts to prevent text rendering issues');
      } else {
        corrections.push('Added necessary bleed area (3mm) to ensure proper trimming');
      }
    }
    
    if (Math.random() > 0.9) {
      detailedErrors.push('Transparent elements detected - may cause unexpected results in printing');
    }
    
    // Determine overall status
    let status;
    let message;
    
    if (detailedErrors.length === 0 && corrections.length === 0) {
      status = 'success';
      message = 'File is print-ready with no issues detected.';
    } else if (detailedErrors.length === 0) {
      status = 'corrected';
      message = 'File has been automatically corrected and is now print-ready.';
    } else if (detailedErrors.length <= 2) {
      status = 'warning';
      message = 'File needs some adjustments before printing.';
    } else {
      status = 'error';
      message = 'File has critical issues that need to be addressed.';
    }
    
    // Calculate compatibility score
    let compatibilityScore;
    if (status === 'success') {
      compatibilityScore = Math.floor(Math.random() * 10) + 90; // 90-100
    } else if (status === 'corrected') {
      compatibilityScore = Math.floor(Math.random() * 10) + 80; // 80-90
    } else if (status === 'warning') {
      compatibilityScore = Math.floor(Math.random() * 15) + 65; // 65-80
    } else {
      compatibilityScore = Math.floor(Math.random() * 25) + 40; // 40-65
    }
    
    return {
      status,
      dpi,
      colorSpace,
      format: fileExt.toUpperCase(),
      corrections,
      detailedErrors,
      message,
      validationTime,
      compatibilityScore
    };
  };

  const analyzeFile = (file) => {
    setAnalyzing(true);
    setProgress(0);
    setValidationResults(null);
    
    // Simulate file upload and analysis process with a progress indicator
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 4; // Slower to make it more realistic
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Generate validation results
          const results = validateFile(file);
          setValidationResults(results);
          setAnalyzing(false);
          
          // Send file info and validation results to parent component
          const fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            file: file, // Include the actual file for AI processing
            compatibilityScore: results.compatibilityScore,
            validationResults: results
          };
          
          if (onFileAnalyzed) {
            onFileAnalyzed(fileInfo);
          }
          
          return 100;
        }
        
        return newProgress;
      });
    }, 100); 
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-12 w-12 text-gray-400" />;

    if (file.type.includes("image") || file.name.match(/\.(png|jpe?g|svg|tiff?)$/i)) {
      return <Image className="h-12 w-12 text-blue-500" />;
    } else {
      return <File className="h-12 w-12 text-blue-500" />;
    }
  };

  const resetFile = () => {
    setFile(null);
    setValidationResults(null);
    setProgress(0);
    setAnalyzing(false);
    setError("");
    setAiEnhancements(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle AI enhancement analysis start
  const handleAIAnalysisStart = () => {
    console.log("Starting AI analysis...");
  };

  // Handle AI enhancement analysis completion
  const handleAIAnalysisComplete = async (results) => {
    console.log("AI analysis complete:", results);
    
    // In a real implementation, we would use actual AI analysis
    // For now, let's simulate it with a mock response
    try {
      // This would be an actual API call in production
      // const optimizationResults = await aiServices.optimizeForProduction(file);
      
      // Mock optimization results
      const optimizationResults = {
        recommendations: {
          layout: [
            { 
              type: 'layout', 
              severity: 'medium', 
              issue: 'Content too close to trim edge', 
              recommendation: 'Add 1/8 inch bleed to all edges' 
            }
          ],
          colors: [
            { 
              type: 'color', 
              severity: 'high', 
              issue: 'RGB color profile detected', 
              recommendation: 'Convert to CMYK for better print results' 
            }
          ],
          materials: []
        },
        efficiencyScore: 78,
        potentialSavings: {
          cost: 'Medium',
          inkUsage: 'Up to 15%',
          materialWaste: 'Up to 8%',
          productionTime: 'Up to 5%'
        }
      };
      
      setAiEnhancements(optimizationResults);
    } catch (error) {
      console.error("Error during AI analysis:", error);
    }
  };

  // Handle AI analysis error
  const handleAIAnalysisError = (error) => {
    console.error("AI analysis error:", error);
    // You could set an error state here if needed
  };

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-red-800">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center ${
              dragging ? "border-blue-500 bg-blue-50" : error ? "border-red-300" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            tabIndex="0" // Make div focusable to capture keyboard events
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.png,.svg,.jpg,.jpeg,.ai,.eps,.tif,.tiff"
              onChange={handleFileInputChange}
            />

            <div className="mb-4">
              {getFileIcon()}
            </div>

            {!file ? (
              <>
                <h3 className="text-lg font-medium mb-2">
                  Drop your design file here
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Supports PDF, PNG, SVG, JPEG, TIFF, EPS, and AI files
                </p>
                <Button onClick={handleButtonClick} className="mb-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  Files are automatically validated for print compatibility
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  You can also paste images from clipboard or drag files from your desktop
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">
                  {file.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {analyzing ? (
                  <div className="w-full max-w-xs mb-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Validating file for print compatibility...
                    </p>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <Button onClick={resetFile} variant="outline" className="mb-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Change File
                    </Button>
                    
                    {validationResults && validationResults.status === 'success' && (
                      <Button variant="default" className="mb-2 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Print-Ready
                      </Button>
                    )}
                    
                    {/* AI Enhance Button */}
                    <AIEnhanceButton 
                      designFile={file}
                      disabled={analyzing}
                      onAnalysisStart={handleAIAnalysisStart}
                      onAnalysisComplete={handleAIAnalysisComplete}
                      onError={handleAIAnalysisError}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* AI Enhancements Section */}
      {aiEnhancements && (
        <Card className="mt-4 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-lg">AI-Powered Design Optimization</h3>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-gray-700 mb-2">
                Our AI has analyzed your design and found opportunities for optimization:
              </p>
              
              <div className="bg-blue-50 p-3 rounded-md mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Efficiency Score:</span>
                  <span className="text-sm font-medium">{aiEnhancements.efficiencyScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${aiEnhancements.efficiencyScore}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">Potential savings:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span>Cost: {aiEnhancements.potentialSavings.cost}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span>Ink Usage: {aiEnhancements.potentialSavings.inkUsage}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span>Material Waste: {aiEnhancements.potentialSavings.materialWaste}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span>Production Time: {aiEnhancements.potentialSavings.productionTime}</span>
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              {Object.keys(aiEnhancements.recommendations).map(category => 
                aiEnhancements.recommendations[category].length > 0 && (
                  <div key={category} className="mb-2">
                    {aiEnhancements.recommendations[category].map((rec, idx) => (
                      <div 
                        key={idx} 
                        className={`text-sm p-2 mb-2 rounded-md ${
                          rec.severity === 'high' ? 'bg-red-50 border border-red-100' : 
                          rec.severity === 'medium' ? 'bg-yellow-50 border border-yellow-100' : 
                          'bg-blue-50 border border-blue-100'
                        }`}
                      >
                        <p className="font-medium">{rec.issue}</p>
                        <p className="text-xs mt-1">{rec.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
            
            <div className="flex justify-end">
              <Button size="sm" variant="outline" className="text-xs mr-2">
                Download Report
              </Button>
              <Button size="sm" className="text-xs">
                View Detailed Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {file && validationResults && !analyzing && (
        <FileValidation 
          file={file} 
          validationResults={validationResults} 
        />
      )}
      
      {validationResults && !analyzing && (
        <div className="mt-4 text-sm">
          <h3 className="font-medium mb-2">Pressly's File Validation Benefits</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Automatically verifies optimal resolution (300 DPI), color spaces (CMYK), and format compatibility</li>
            <li>Auto-corrects common issues to avoid costly reprints and production delays</li>
            <li>Provides detailed feedback to improve future file preparation</li>
            <li>Streamlines production workflow with standardized file formats</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;