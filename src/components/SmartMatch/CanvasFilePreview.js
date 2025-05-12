import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  FileText, 
  FileImage, 
  FileBadge, 
  Layers, 
  Check, 
  AlertTriangle, 
  X, 
  Info, 
  Download,
  Maximize2,
  RotateCw,
  ZoomIn
} from 'lucide-react';
import CanvasDesignPreview from '../Canvas/CanvasDesignPreview';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import IndexedDBService from '../../services/storage/indexedDBService';

/**
 * Canvas-based File Preview Component
 * 
 * Provides an interactive preview for uploaded files with:
 * 1. Canvas-based rendering for zooming, panning, and rotation
 * 2. File metadata display and validation
 * 3. Options to download, save, or remove files
 */
const CanvasFilePreview = ({ 
  files, 
  onRemoveFile, 
  onSaveToIndexedDB = null,
  width = 600,
  height = 400,
  showFileInfo = true,
  showValidation = true,
  showControls = true,
  previewOnly = false
}) => {
  // Refs
  const canvasPreviewRef = useRef(null);
  
  // State
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [validationResults, setValidationResults] = useState({});
  const [savedToStorage, setSavedToStorage] = useState({});
  const [error, setError] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  
  const currentFile = files?.[currentFileIndex];
  
  // Process file for canvas when current file changes
  useEffect(() => {
    if (currentFile) {
      setProcessedFile(processFileForCanvas(currentFile));
    }
  }, [currentFile]);
  
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
  
  // Validate files when component mounts or files change
  useEffect(() => {
    if (files && files.length > 0 && showValidation) {
      validateFiles();
    }
  }, [files, showValidation]);
  
  // Validate file compatibility for printing
  const validateFiles = () => {
    const validationResults = {};
    
    files.forEach((file, index) => {
      const result = {
        isValid: true,
        warnings: [],
        errors: []
      };
      
      // Check file type
      const fileType = file.type || '';
      if (!isValidFileType(fileType)) {
        result.isValid = false;
        result.errors.push(`File type '${fileType}' is not supported for printing`);
      }
      
      // Check file metadata if available
      if (file.metadata) {
        // Check color mode
        if (file.metadata.colorMode && file.metadata.colorMode !== 'CMYK') {
          result.warnings.push(`File is in ${file.metadata.colorMode} mode. CMYK is recommended for printing.`);
        }
        
        // Check resolution
        if (file.metadata.dpi && parseInt(file.metadata.dpi) < 300) {
          result.warnings.push(`Resolution is ${file.metadata.dpi}. 300 DPI or higher is recommended.`);
        }
        
        // Check standard compliance
        if (file.metadata.standardCompliance === false) {
          result.warnings.push('File does not comply with print standards.');
        }
      }
      
      validationResults[index] = result;
    });
    
    setValidationResults(validationResults);
  };
  
  // Check if file type is valid for printing
  const isValidFileType = (fileType) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'application/pdf',
      'application/illustrator',
      'application/postscript',
      'application/vnd.adobe.indesign-idml-package'
    ];
    
    if (!fileType) return false;
    
    return validTypes.some(type => fileType.includes(type));
  };
  
  // Get file type icon based on file type
  const getFileTypeIcon = (file) => {
    if (!file) return <FileText />;
    
    const fileType = file.type || '';
    
    if (fileType.includes('image')) {
      return <FileImage />;
    } else if (fileType.includes('pdf') || fileType.includes('illustrator') || fileType.includes('postscript')) {
      return <FileBadge />;
    } else {
      return <FileText />;
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Save current file to IndexedDB
  const saveFileToStorage = async () => {
    if (!currentFile || !onSaveToIndexedDB) return;
    
    try {
      // Create design object
      const designId = crypto.randomUUID();
      const designData = {
        id: designId,
        name: currentFile.name || 'Untitled Design',
        fileType: currentFile.type || 'application/octet-stream',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preview: currentFile.preview || null,
        metadata: {
          fileSize: currentFile.size,
          ...currentFile.metadata
        }
      };
      
      // Add file data if available
      if (currentFile instanceof File) {
        const fileData = await fileToArrayBuffer(currentFile);
        designData.fileData = fileData;
      } else if (currentFile.fileData) {
        designData.fileData = currentFile.fileData;
      }
      
      // Save to IndexedDB
      await IndexedDBService.saveDesign(designData);
      
      // Update saved status
      setSavedToStorage(prev => ({
        ...prev,
        [currentFileIndex]: true
      }));
      
      // Notify parent component
      if (onSaveToIndexedDB) {
        onSaveToIndexedDB(designId, currentFileIndex);
      }
      
      return designId;
    } catch (err) {
      console.error('Error saving to IndexedDB:', err);
      setError('Failed to save file: ' + err.message);
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
  
  // Create a download link for the current file
  const downloadFile = () => {
    if (!currentFile) return;
    
    if (currentFile instanceof File) {
      // Create download link for File object
      const url = URL.createObjectURL(currentFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (currentFile.preview) {
      // Create download from preview URL
      const link = document.createElement('a');
      link.href = currentFile.preview;
      link.download = currentFile.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Export the current canvas view
  const exportCanvasImage = () => {
    if (canvasPreviewRef.current) {
      const dataUrl = canvasPreviewRef.current.exportImage('png');
      
      // Create a download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${currentFile.name || 'design'}-preview.png`;
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
  
  // Get validation status badge
  const getValidationBadge = (index) => {
    const result = validationResults[index];
    if (!result) return null;
    
    if (!result.isValid) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          Invalid
        </Badge>
      );
    } else if (result.warnings.length > 0) {
      return (
        <Badge variant="warning" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <AlertTriangle className="h-3 w-3" />
          Warnings
        </Badge>
      );
    } else {
      return (
        <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
          <Check className="h-3 w-3" />
          Valid
        </Badge>
      );
    }
  };
  
  // No files to preview
  if (!files || files.length === 0) {
    return (
      <div className="border rounded-lg p-6 bg-muted/30 text-center">
        <div className="flex justify-center mb-4">
          <FileImage className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No Files to Preview</h3>
        <p className="text-sm text-muted-foreground mt-1">Upload files to see a preview</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      {!previewOnly && (
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            {getFileTypeIcon(currentFile)}
            <span className="ml-2 font-medium truncate max-w-[200px]">
              {currentFile?.name || 'Untitled File'}
            </span>
            {showValidation && getValidationBadge(currentFileIndex)}
          </div>
          
          {files.length > 1 && (
            <div className="text-sm text-muted-foreground">
              File {currentFileIndex + 1} of {files.length}
            </div>
          )}
        </div>
      )}
      
      {/* Canvas Preview */}
      <div className="bg-muted/30">
        <CanvasDesignPreview
          ref={canvasPreviewRef}
          designData={processedFile || currentFile}
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
      
      {/* File Metadata */}
      {showFileInfo && !previewOnly && (
        <div className="p-4 border-t bg-muted/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>{' '}
              <span className="font-medium">{currentFile?.type || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span>{' '}
              <span className="font-medium">{formatFileSize(currentFile?.size || 0)}</span>
            </div>
            
            {currentFile?.metadata?.dimensions && (
              <div>
                <span className="text-muted-foreground">Dimensions:</span>{' '}
                <span className="font-medium">{currentFile.metadata.dimensions}</span>
              </div>
            )}
            
            {currentFile?.metadata?.colorMode && (
              <div>
                <span className="text-muted-foreground">Color Mode:</span>{' '}
                <span className="font-medium">{currentFile.metadata.colorMode}</span>
              </div>
            )}
            
            {currentFile?.metadata?.dpi && (
              <div>
                <span className="text-muted-foreground">Resolution:</span>{' '}
                <span className="font-medium">{currentFile.metadata.dpi}</span>
              </div>
            )}
          </div>
          
          {/* Validation Warnings/Errors */}
          {showValidation && validationResults[currentFileIndex] && (
            <div className="mt-4">
              {validationResults[currentFileIndex].errors.length > 0 && (
                <div className="bg-red-50 text-red-800 p-2 rounded-md mb-2">
                  <div className="font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Errors
                  </div>
                  <ul className="list-disc ml-5 text-sm">
                    {validationResults[currentFileIndex].errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationResults[currentFileIndex].warnings.length > 0 && (
                <div className="bg-yellow-50 text-yellow-800 p-2 rounded-md">
                  <div className="font-medium flex items-center">
                    <Info className="h-4 w-4 mr-1" /> Warnings
                  </div>
                  <ul className="list-disc ml-5 text-sm">
                    {validationResults[currentFileIndex].warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationResults[currentFileIndex].isValid && validationResults[currentFileIndex].warnings.length === 0 && (
                <div className="bg-green-50 text-green-800 p-2 rounded-md">
                  <div className="font-medium flex items-center">
                    <Check className="h-4 w-4 mr-1" /> File is Valid
                  </div>
                  <p className="text-sm">This file meets all print-ready requirements.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Actions */}
      {showControls && !previewOnly && (
        <div className="p-4 border-t flex flex-wrap gap-2">
          {/* Navigation Controls for multiple files */}
          {files.length > 1 && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentFileIndex(prev => (prev > 0 ? prev - 1 : prev))}
                disabled={currentFileIndex === 0}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentFileIndex(prev => (prev < files.length - 1 ? prev + 1 : prev))}
                disabled={currentFileIndex === files.length - 1}
              >
                Next
              </Button>
            </>
          )}
          
          {/* Canvas Controls */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetCanvasView}
            title="Reset View"
          >
            <Maximize2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => canvasPreviewRef.current?.rotateRight()}
            title="Rotate"
          >
            <RotateCw className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Rotate</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => canvasPreviewRef.current?.zoomIn()}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Zoom</span>
          </Button>
          
          {/* File Actions */}
          <div className="flex-grow"></div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadFile}
            title="Download Original File"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportCanvasImage}
            title="Export as Image"
          >
            <FileImage className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          {onSaveToIndexedDB && (
            <Button 
              variant={savedToStorage[currentFileIndex] ? "outline" : "default"}
              size="sm"
              onClick={saveFileToStorage}
              disabled={savedToStorage[currentFileIndex]}
              title={savedToStorage[currentFileIndex] ? "Saved to Library" : "Save to Design Library"}
            >
              {savedToStorage[currentFileIndex] ? (
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
          
          {onRemoveFile && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRemoveFile(currentFileIndex)}
              title="Remove File"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

CanvasFilePreview.propTypes = {
  files: PropTypes.array.isRequired,
  onRemoveFile: PropTypes.func,
  onSaveToIndexedDB: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  showFileInfo: PropTypes.bool,
  showValidation: PropTypes.bool,
  showControls: PropTypes.bool,
  previewOnly: PropTypes.bool
};

export default CanvasFilePreview;