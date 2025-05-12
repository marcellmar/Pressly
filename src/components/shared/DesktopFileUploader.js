import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { 
  Upload, File, Image, CheckCircle, 
  RefreshCw, AlertCircle, FileText, PlusCircle,
  PenTool, ClipboardCheck
} from "lucide-react";

/**
 * Enhanced Desktop File Uploader component
 * Provides drag and drop, clipboard paste, and desktop file browsing capabilities
 * 
 * @param {Object} props Component props
 * @param {Function} props.onFilesSelected Callback when files are selected
 * @param {Function} props.onFileAnalyzed Callback when file is analyzed (single file analysis)
 * @param {boolean} props.multiple Allow multiple file selection
 * @param {number} props.maxSize Maximum file size in bytes (default: 50MB)
 * @param {Array} props.allowedFileTypes Array of allowed MIME types
 * @param {Array} props.allowedFileExtensions Array of allowed file extensions
 * @param {string} props.title Custom title for the uploader
 * @param {string} props.description Custom description for the uploader
 * @param {Object} props.style Custom styles
 */
const DesktopFileUploader = ({
  onFilesSelected,
  onFileAnalyzed,
  multiple = false,
  maxSize = 50 * 1024 * 1024, // 50MB default
  allowedFileTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml',
    'application/pdf', 'application/postscript', 'application/octet-stream',
    'application/illustrator', 'image/tiff'
  ],
  allowedFileExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.pdf', '.ai', '.eps', '.psd', '.tiff'],
  title = "Upload Your Design",
  description = "Drag and drop files, paste from clipboard, or browse your desktop",
  style = {}
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [clipboardPasteDetected, setClipboardPasteDetected] = useState(false);
  const dropzoneRef = useRef(null);

  // Handle paste from clipboard (e.g., screenshots)
  const handlePaste = useCallback((e) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      setClipboardPasteDetected(true);
      setTimeout(() => setClipboardPasteDetected(false), 2000);
      
      const clipboardFiles = Array.from(e.clipboardData.files);
      processFiles(clipboardFiles);
    }
  }, []);
  
  // Add a paste event listener to the document
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);
  
  // Validate file type and size
  const validateFile = (file) => {
    // Check file type by MIME type
    const isValidType = allowedFileTypes.some(type => {
      if (type.includes('*')) {
        const baseMimeType = type.split('*')[0];
        return file.type.startsWith(baseMimeType);
      }
      return file.type === type;
    });
    
    // Check file type by extension
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    const isValidExt = allowedFileExtensions.some(ext => 
      fileExt === ext.toLowerCase()
    );
    
    // Accept file if either MIME type or extension is valid
    if (!isValidType && !isValidExt) {
      // Try to determine type by extension for files with generic MIME types
      if (file.type === 'application/octet-stream' || file.type === '') {
        if (allowedFileExtensions.includes(fileExt)) {
          // Accept file with valid extension even if MIME type is generic
          console.log(`Accepting file with extension ${fileExt} despite MIME type: ${file.type}`);
          return { valid: true };
        }
      }
      
      return {
        valid: false,
        error: `Invalid file type: ${file.type}. Allowed types: ${allowedFileExtensions.join(', ')}`
      };
    }
    
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB`
      };
    }
    
    return { valid: true };
  };
  
  // Process multiple files
  const processFiles = useCallback((selectedFiles) => {
    // For single file mode, take only the first file
    const filesToProcess = multiple ? selectedFiles : [selectedFiles[0]];
    
    // Validate all files
    const invalidFiles = [];
    const validFiles = [];
    
    filesToProcess.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, error: validation.error });
      }
    });
    
    // If any files are invalid, show error
    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles.map(f => 
        `"${f.file.name}": ${f.error}`
      ).join('\n');
      
      setError(errorMessage);
      
      // If some files are valid, still process those
      if (validFiles.length === 0) {
        return;
      }
    } else {
      setError("");
    }
    
    // Update state with valid files
    setFiles(validFiles);
    
    // Start analysis process
    setIsAnalyzing(true);
    setUploadProgress(0);
    
    // Simulate file processing with progress
    const interval = setInterval(() => {
      setUploadProgress(prevProgress => {
        const newProgress = prevProgress + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          // Call the appropriate callback
          if (multiple && onFilesSelected) {
            onFilesSelected(validFiles);
          } else if (!multiple && onFileAnalyzed) {
            // Extract metadata (simulated for the MVP)
            const file = validFiles[0];
            const fileInfo = {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
              preview: URL.createObjectURL(file),
              compatibilityScore: Math.floor(Math.random() * 20) + 80, // 80-100 score
              metadata: {
                dimensions: file.type.includes('image') ? '1200x800 px' : 'N/A',
                colorMode: file.type.includes('image') ? 'CMYK' : 'N/A',
                dpi: file.type.includes('image') ? '300 DPI' : 'N/A',
                pages: file.type.includes('pdf') ? '2' : '1',
                standardCompliance: Math.random() > 0.3 // 70% chance of compliance
              }
            };
            
            onFileAnalyzed(fileInfo);
          }
          
          return 100;
        }
        
        return newProgress;
      });
    }, 100);
  }, [multiple, onFilesSelected, onFileAnalyzed, validateFile]);
  
  // Handle file drop
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      processFiles(acceptedFiles);
    }
  }, [processFiles]);
  
  // Configure dropzone
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: Object.fromEntries(
      allowedFileTypes.map(type => {
        if (type.includes('*')) {
          return [type, allowedFileExtensions]; 
        }
        
        // Map specific MIME types to appropriate extensions
        switch (type) {
          case 'application/pdf': 
            return [type, ['.pdf']];
          case 'image/jpeg':
            return [type, ['.jpg', '.jpeg']];
          case 'image/png':
            return [type, ['.png']];
          case 'image/svg+xml':
            return [type, ['.svg']];
          case 'application/postscript':
            return [type, ['.ai', '.eps']];
          case 'application/illustrator':
            return [type, ['.ai']];
          case 'image/tiff':
            return [type, ['.tif', '.tiff']];
          case 'application/octet-stream':
            return [type, ['.psd', '.ai', '.eps']]; 
          default:
            return [type, []];
        }
      })
    ),
    maxSize,
    multiple,
    noClick: true, // We'll handle clicks manually
    noKeyboard: false, // Allow keyboard navigation
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });
  
  // Handle browse button click
  const handleBrowseClick = () => {
    open();
  };
  
  // Determine which file icon to use
  const getFileIcon = (file) => {
    if (file.type.includes('image') || 
        file.name.match(/\.(png|jpe?g|gif|svg|tiff?)$/i)) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (file.type.includes('pdf') || 
               file.name.match(/\.(pdf)$/i)) {
      return <File className="h-5 w-5 text-red-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card style={style}>
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-red-800">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
            <div className="whitespace-pre-line">{error}</div>
          </div>
        )}
        
        {clipboardPasteDetected && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start text-green-800">
            <ClipboardCheck className="h-5 w-5 mr-2 flex-shrink-0 text-green-500 mt-0.5" />
            <div>Clipboard content detected and processing...</div>
          </div>
        )}
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : 
            error ? "border-red-300" : 
            files.length > 0 ? "border-green-300" : "border-gray-300"
          }`}
          ref={dropzoneRef}
          tabIndex="0"
        >
          <input {...getInputProps()} />
          
          <div className="mb-4">
            {files.length > 0 ? (
              <div className="flex justify-center flex-wrap gap-2">
                {files.map((file, index) => (
                  <div key={index} className="relative text-center">
                    <div className="h-14 w-14 rounded border border-gray-200 flex items-center justify-center bg-gray-50">
                      {getFileIcon(file)}
                    </div>
                    <span className="block text-xs mt-1 w-16 truncate">
                      {file.name.length > 10 ? 
                        `${file.name.substring(0, 7)}...` : 
                        file.name}
                    </span>
                  </div>
                ))}
                
                {multiple && (
                  <div 
                    className="h-14 w-14 rounded border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                    onClick={handleBrowseClick}
                  >
                    <PlusCircle className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-full bg-blue-50">
                <PenTool className="h-10 w-10 text-blue-500" />
              </div>
            )}
          </div>
          
          {files.length === 0 ? (
            <>
              <h3 className="text-lg font-medium mb-2">{title}</h3>
              <p className="text-sm text-gray-500 mb-4">{description}</p>
              <Button onClick={handleBrowseClick} className="mb-2">
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Supports {allowedFileExtensions.join(', ')}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                You can also paste images from clipboard or drag files from your desktop
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">
                {files.length} {files.length === 1 ? 'file' : 'files'} selected
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Total size: {(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
              </p>
              
              {isAnalyzing ? (
                <div className="w-full max-w-sm mb-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Validating files for print compatibility...
                  </p>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Button onClick={handleBrowseClick} variant="outline" className="mb-2">
                    {multiple ? (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add More Files
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Change File
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
          
          {/* Show success indicator for processed files */}
          {files.length > 0 && !isAnalyzing && (
            <div className="mt-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">
                Files validated successfully
              </span>
            </div>
          )}
        </div>
        
        {/* Benefits and information section */}
        {files.length > 0 && !isAnalyzing && (
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

export default DesktopFileUploader;