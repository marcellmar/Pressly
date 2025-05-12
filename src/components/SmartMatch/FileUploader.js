import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Upload, File, Image, CheckCircle, RefreshCw, AlertCircle, FileText, FolderOpen } from "lucide-react";

const FileUploader = ({ onFilesUploaded, onFileUploadError, maxSize = 52428800 }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");
  const fileInputRef = useRef(null);
  
  // Cleanup preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      // Revoke all object URLs to avoid memory leaks
      previewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // Handle paste from clipboard (e.g., screenshots)
  const handlePaste = useCallback((e) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const clipboardFiles = Array.from(e.clipboardData.files);
      
      // Process clipboard files same as dropped files
      processFiles(clipboardFiles);
    }
  }, []);
  
  // Add a paste event listener to the document
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);
  
  // Process files (used by both drop and paste handlers)
  const processFiles = useCallback((files) => {
    if (files.length === 0) {
      setError("No valid files were selected. Please check file types and sizes.");
      return;
    }
    
    setError(""); // Clear any previous errors
    setUploadedFiles(files);
    
    // Simulate file analysis and processing
    setIsAnalyzing(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          
          // Process the files and pass them to parent component
          const processedFiles = files.map(file => {
            // Make sure the file is valid before creating object URL
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
              // Add to our list of URLs to revoke later
              setPreviewUrls(prev => [...prev, preview]);
            } catch (error) {
              console.error('Error creating preview URL for', file.name, error);
            }
            
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
              preview: preview,
              // Extract metadata (simulated for the MVP)
              metadata: {
                dimensions: file.type.includes('image') ? '1200x800 px' : 'N/A',
                colorMode: file.type.includes('image') ? 'CMYK' : 'N/A',
                dpi: file.type.includes('image') ? '300 DPI' : 'N/A',
                pages: file.type.includes('pdf') ? '2' : '1',
                standardCompliance: Math.random() > 0.3 // 70% chance of compliance
              }
            };
          });
          
          // Pass processed files to parent
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
      'application/octet-stream': ['.psd', '.ai', '.eps'], // Add more common file types that might have this generic MIME type
      'application/illustrator': ['.ai'],
      'image/tiff': ['.tif', '.tiff']
    },
    maxSize: maxSize, // 50MB default, can be overridden via props
    multiple: true,
    noClick: true, // We'll handle clicks with our own button for better styling control
    noKeyboard: true, // Disable keyboard interaction for consistency
  });

  // Handle URL input submission
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    
    if (!urlInput || !urlInput.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    
    setError(""); // Clear any previous errors
    setIsAnalyzing(true);
    setUploadProgress(0);
    
    // Simulate URL processing with progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          
          // Create mock file from URL
          const fileName = urlInput.split('/').pop() || 'downloaded-file.pdf';
          const mockFile = {
            name: fileName,
            size: Math.floor(Math.random() * 10000000) + 1000000, // Random size between 1-10MB
            type: fileName.endsWith('.pdf') ? 'application/pdf' : 
                  fileName.endsWith('.png') ? 'image/png' : 
                  fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 
                  'application/octet-stream',
            lastModified: Date.now(),
            preview: null,
            source: 'url',
            url: urlInput,
            metadata: {
              dimensions: fileName.includes('.pdf') ? 'A4 (210x297 mm)' : '1200x800 px',
              colorMode: Math.random() > 0.5 ? 'CMYK' : 'RGB',
              dpi: '300 DPI',
              pages: fileName.includes('.pdf') ? Math.floor(Math.random() * 10) + 1 : '1',
              standardCompliance: Math.random() > 0.3 // 70% chance of compliance
            }
          };
          
          setUploadedFiles([mockFile]);
          
          // Pass processed file to parent
          if (onFilesUploaded) {
            onFilesUploaded([mockFile]);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Handle "Browse Files" button click
  const handleBrowseClick = () => {
    open(); // This opens the file dialog using dropzone's open method
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-red-800">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex border-b space-x-6">
            <button
              onClick={() => setUploadMethod("file")}
              className={`pb-2 px-1 ${uploadMethod === "file" 
                ? "border-b-2 border-primary font-medium text-primary" 
                : "text-gray-500 hover:text-gray-700"}`}
            >
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </span>
            </button>
            <button
              onClick={() => setUploadMethod("url")}
              className={`pb-2 px-1 ${uploadMethod === "url" 
                ? "border-b-2 border-primary font-medium text-primary" 
                : "text-gray-500 hover:text-gray-700"}`}
            >
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                File URL
              </span>
            </button>
          </div>
        </div>
        
        {uploadMethod === "file" ? (
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
                  {uploadedFiles.map((file, index) => (
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
                      <span className="absolute -bottom-5 left-0 right-0 text-xs truncate">{file.name.length > 10 ? `${file.name.substring(0, 7)}...` : file.name}</span>
                    </div>
                  ))}
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
                
                {/* Primary Upload Button - More Prominent */}
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
                      Change Files
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="border rounded-lg p-6">
            <form onSubmit={handleUrlSubmit}>
              <div className="mb-4">
                <label htmlFor="fileUrl" className="block text-sm font-medium mb-1">File URL</label>
                <div className="flex">
                  <input
                    id="fileUrl"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/design.pdf"
                    className="flex-1 border rounded-l-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Button type="submit" className="rounded-l-none">
                    {isAnalyzing ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Import</>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL of a PDF, PNG, SVG, or JPG file
                </p>
              </div>
              
              {isAnalyzing && (
                <div className="w-full mb-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Downloading and validating file...
                  </p>
                </div>
              )}
              
              {uploadedFiles.length > 0 && uploadMethod === "url" && !isAnalyzing && (
                <div className="mt-4 flex items-center p-3 bg-green-50 border border-green-100 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="font-medium text-green-800">File imported successfully</p>
                    <p className="text-sm text-green-700">{uploadedFiles[0].name}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
        
        {/* File Preview Section for both upload methods */}
        {uploadedFiles.length > 0 && !isAnalyzing && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 border border-gray-200 rounded-md"
                >
                  {file.type && file.type.includes('image') ? (
                    <Image className="h-5 w-5 text-blue-500 mr-3" />
                  ) : file.type === 'application/pdf' ? (
                    <File className="h-5 w-5 text-red-500 mr-3" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-500 mr-3" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • 
                      {file.type ? ` ${file.type.split('/')[1].toUpperCase()}` : ' Unknown'}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Benefits Section */}
        {uploadedFiles.length > 0 && !isAnalyzing && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Pressly's File Validation Benefits</h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-blue-700">
              <li>Automatically verifies optimal resolution (300 DPI), color spaces (CMYK), and format compatibility</li>
              <li>Auto-corrects common issues to avoid costly reprints and production delays</li>
              <li>Provides detailed feedback to improve future file preparation</li>
              <li>Streamlines production workflow with standardized file formats</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;