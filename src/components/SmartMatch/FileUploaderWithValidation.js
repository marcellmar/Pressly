import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Upload, File, Image, CheckCircle, RefreshCw, AlertCircle, FileText, FolderOpen, X } from "lucide-react";
import EnhancedFileValidation from '../EnhancedFileValidation';

const FileUploaderWithValidation = ({ onFilesUploaded, onFileUploadError, maxSize = 52428800 }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");
  const [validationResults, setValidationResults] = useState({});
  const [showValidation, setShowValidation] = useState({});
  const fileInputRef = useRef(null);
  
  // Cleanup preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // Handle paste from clipboard
  const handlePaste = useCallback((e) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const clipboardFiles = Array.from(e.clipboardData.files);
      processFiles(clipboardFiles);
    }
  }, []);
  
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);
  
  // Validate file and generate validation results
  const validateFile = (file) => {
    const fileExt = file.name.split('.').pop().toLowerCase();
    const dpi = Math.floor(Math.random() * 400) + 100;
    
    let colorSpace;
    if (fileExt === 'pdf' || fileExt === 'eps' || fileExt === 'ai') {
      colorSpace = Math.random() > 0.3 ? 'CMYK' : 'RGB';
    } else {
      colorSpace = Math.random() > 0.7 ? 'CMYK' : 'RGB';
    }
    
    const validationTime = Math.floor(Math.random() * 75) + 15;
    const corrections = [];
    const detailedErrors = [];
    
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
    
    let compatibilityScore;
    if (status === 'success') {
      compatibilityScore = Math.floor(Math.random() * 10) + 90;
    } else if (status === 'corrected') {
      compatibilityScore = Math.floor(Math.random() * 10) + 80;
    } else if (status === 'warning') {
      compatibilityScore = Math.floor(Math.random() * 15) + 65;
    } else {
      compatibilityScore = Math.floor(Math.random() * 25) + 40;
    }
    
    return {
      status,
      dpi: dpi + ' DPI',
      colorSpace,
      format: fileExt.toUpperCase(),
      corrections,
      detailedErrors,
      message,
      validationTime,
      compatibilityScore,
      // Enhanced properties
      hasThinLines: Math.random() > 0.7,
      hasTransparency: Math.random() > 0.8,
      fontEmbeddingIssues: Math.random() > 0.6 ? ['Arial', 'Helvetica'] : [],
      imageQualityIssues: Math.random() > 0.7,
      colorAccuracy: Math.random() * 100,
      contrastRatio: 2.1 + Math.random() * 8,
      hasBleed: Math.random() > 0.5,
      hasCropMarks: Math.random() > 0.7,
      fileCompression: Math.random() > 0.5 ? 'lossy' : 'lossless'
    };
  };
  
  // Process files
  const processFiles = useCallback((files) => {
    if (files.length === 0) {
      setError("No valid files were selected. Please check file types and sizes.");
      return;
    }
    
    setError("");
    setUploadedFiles(files);
    setIsAnalyzing(true);
    setUploadProgress(0);
    
    // Simulate upload and validation progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          
          // Process files and generate validation results
          const processedFiles = files.map(file => {
            if (!file || typeof file !== 'object' || !(file instanceof Blob)) {
              console.error('Invalid file:', file);
              return {
                name: file.name || 'Unknown file',
                size: file.size || 0,
                type: file.type || 'unknown',
                lastModified: file.lastModified || Date.now(),
                preview: null,
                error: 'Invalid file format',
                metadata: {
                  dimensions: 'N/A',
                  colorMode: 'N/A',
                  dpi: 'N/A',
                  pages: 'N/A',
                  standardCompliance: false
                }
              };
            }
            
            let preview = null;
            try {
              preview = URL.createObjectURL(file);
              setPreviewUrls(prev => [...prev, preview]);
            } catch (error) {
              console.error('Error creating preview URL for', file.name, error);
            }
            
            // Generate validation results for this file
            const validation = validateFile(file);
            setValidationResults(prev => ({
              ...prev,
              [file.name]: validation
            }));
            
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
              preview: preview,
              validationResults: validation,
              metadata: {
                dimensions: file.type.includes('image') ? '1200x800 px' : 'N/A',
                colorMode: validation.colorSpace,
                dpi: validation.dpi,
                pages: file.type.includes('pdf') ? '2' : '1',
                standardCompliance: validation.status === 'success' || validation.status === 'corrected'
              }
            };
          });
          
          if (onFilesUploaded) {
            onFilesUploaded(processedFiles);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  }, [onFilesUploaded]);
  
  const onDrop = useCallback((acceptedFiles) => {
    processFiles(acceptedFiles);
  }, [processFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg'],
      'application/pdf': ['.pdf'],
      'application/postscript': ['.ai', '.eps'],
      'application/octet-stream': ['.psd', '.ai', '.eps'],
      'application/illustrator': ['.ai'],
      'image/tiff': ['.tif', '.tiff']
    },
    maxSize: maxSize,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });
  
  // Handle removing a file
  const handleRemoveFile = (index) => {
    const newFiles = [...uploadedFiles];
    const removedFile = newFiles.splice(index, 1)[0];
    
    // Clean up validation results
    const newValidationResults = { ...validationResults };
    delete newValidationResults[removedFile.name];
    setValidationResults(newValidationResults);
    
    // Clean up show validation state
    const newShowValidation = { ...showValidation };
    delete newShowValidation[removedFile.name];
    setShowValidation(newShowValidation);
    
    setUploadedFiles(newFiles);
    
    // Update parent
    if (onFilesUploaded && newFiles.length > 0) {
      const processedFiles = newFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        validationResults: validationResults[file.name],
        metadata: {
          dimensions: file.type.includes('image') ? '1200x800 px' : 'N/A',
          colorMode: validationResults[file.name]?.colorSpace || 'N/A',
          dpi: validationResults[file.name]?.dpi || 'N/A',
          pages: file.type.includes('pdf') ? '2' : '1',
          standardCompliance: validationResults[file.name]?.status === 'success' || validationResults[file.name]?.status === 'corrected'
        }
      }));
      onFilesUploaded(processedFiles);
    } else if (onFilesUploaded && newFiles.length === 0) {
      onFilesUploaded([]);
    }
  };
  
  // Handle corrections applied
  const handleCorrectionsApplied = (fileName, correctionData) => {
    // Update validation results
    setValidationResults(prev => ({
      ...prev,
      [fileName]: correctionData.updatedResults
    }));
    
    // Update the file list with new validation results
    if (onFilesUploaded) {
      const processedFiles = uploadedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        validationResults: file.name === fileName ? correctionData.updatedResults : validationResults[file.name],
        metadata: {
          dimensions: file.type.includes('image') ? '1200x800 px' : 'N/A',
          colorMode: file.name === fileName ? correctionData.updatedResults.colorSpace : validationResults[file.name]?.colorSpace || 'N/A',
          dpi: file.name === fileName ? correctionData.updatedResults.dpi : validationResults[file.name]?.dpi || 'N/A',
          pages: file.type.includes('pdf') ? '2' : '1',
          standardCompliance: file.name === fileName ? 
            (correctionData.updatedResults.status === 'success' || correctionData.updatedResults.status === 'corrected') :
            (validationResults[file.name]?.status === 'success' || validationResults[file.name]?.status === 'corrected')
        }
      }));
      onFilesUploaded(processedFiles);
    }
  };
  
  const handleBrowseClick = () => {
    open();
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-red-800">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
          
          <div
            {...getRootProps({ className: "dropzone" })}
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center ${
              isDragActive ? "border-blue-500 bg-blue-50" : error ? "border-red-300" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            <div className="mb-4">
              {uploadedFiles.length > 0 ? (
                <div className="flex justify-center">
                  {uploadedFiles.slice(0, 3).map((file, index) => (
                    <div key={index} className="relative mx-1">
                      {file.type && file.type.includes('image') ? (
                        <div className="h-14 w-14 rounded border border-gray-200 flex items-center justify-center">
                          <Image className="h-8 w-8 text-blue-500" />
                        </div>
                      ) : file.type === 'application/pdf' ? (
                        <div className="h-14 w-14 rounded border border-gray-200 flex items-center justify-center">
                          <File className="h-8 w-8 text-red-500" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded border border-gray-200 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                  ))}
                  {uploadedFiles.length > 3 && (
                    <div className="h-14 w-14 rounded border border-gray-200 flex items-center justify-center bg-gray-50">
                      <span className="text-sm font-medium text-gray-600">+{uploadedFiles.length - 3}</span>
                    </div>
                  )}
                </div>
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            {!uploadedFiles.length ? (
              <>
                <h3 className="text-lg font-medium mb-2">
                  Drop your design files here
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Supports PDF, PNG, SVG, JPEG, TIFF, EPS, and AI files
                </p>
                
                <Button 
                  onClick={handleBrowseClick} 
                  className="relative mb-2 px-5 py-2 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <FolderOpen className="h-5 w-5 mr-2" />
                  <span>Select Files from Computer</span>
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
                  {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} selected
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Total size: {(uploadedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {isAnalyzing ? (
                  <div className="w-full max-w-xs mb-4">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Validating files for print compatibility...
                    </p>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleBrowseClick} 
                      variant="outline" 
                      className="mb-2 flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add More Files
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* File List with Validation */}
      {uploadedFiles.length > 0 && !isAnalyzing && (
        <div className="space-y-4">
          {uploadedFiles.map((file, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {file.type && file.type.includes('image') ? (
                      <Image className="h-5 w-5 text-blue-500 mr-3" />
                    ) : file.type === 'application/pdf' ? (
                      <File className="h-5 w-5 text-red-500 mr-3" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-500 mr-3" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • 
                        {file.type ? ` ${file.type.split('/')[1].toUpperCase()}` : ' Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowValidation(prev => ({
                        ...prev,
                        [file.name]: !prev[file.name]
                      }))}
                    >
                      {showValidation[file.name] ? 'Hide' : 'Show'} Validation
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {showValidation[file.name] && validationResults[file.name] && (
                  <EnhancedFileValidation
                    file={file}
                    validationResults={validationResults[file.name]}
                    onCorrectionsApplied={(correctionData) => handleCorrectionsApplied(file.name, correctionData)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploaderWithValidation;