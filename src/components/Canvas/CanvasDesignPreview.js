import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/pressly-theme.css';

/**
 * Canvas-based design preview component
 * Provides interactive preview with zoom, pan, and basic manipulation capabilities
 */
const CanvasDesignPreview = ({ 
  designData, 
  width = 800, 
  height = 600,
  initialZoom = 1.0,
  allowZoom = true,
  allowPan = true,
  allowRotate = false,
  onRender = null,
  backgroundColor = '#f9f9f9',
  showGrid = false,
  gridSize = 20,
  gridColor = 'rgba(0, 0, 0, 0.1)'
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [designImage, setDesignImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set initial canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas with background color
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reset state
    setZoom(initialZoom);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  }, [width, height, backgroundColor, initialZoom]);
  
  // Load design data when it changes
  useEffect(() => {
    if (!designData) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const loadDesign = async () => {
      try {
        let img;
        
        if (typeof designData === 'string') {
          // If designData is a URL or data URL
          img = new Image();
          img.crossOrigin = 'anonymous';
          
          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = designData;
          });
        } else if (designData instanceof File) {
          // If designData is a File object
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(designData);
          });
          
          img = new Image();
          
          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = dataUrl;
          });
        } else if (designData.fileData) {
          // If designData is an object with ArrayBuffer data
          const blob = new Blob([designData.fileData], { type: designData.type });
          const dataUrl = URL.createObjectURL(blob);
          
          img = new Image();
          
          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = dataUrl;
          });
        } else if (designData.thumbnail) {
          // If designData has a thumbnail property
          img = new Image();
          
          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load thumbnail'));
            img.src = designData.thumbnail;
          });
        } else if (designData.preview) {
          // If designData has a preview property
          img = new Image();
          
          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load preview'));
            img.src = designData.preview;
          });
        } else {
          // Create a more detailed error message with better styling
          console.warn('Unsupported design data format:', designData);
          
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          
          // Draw gradient background
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, '#f8d7da');
          gradient.addColorStop(1, '#f5c6cb');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw border
          ctx.strokeStyle = '#721c24';
          ctx.lineWidth = 2;
          ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
          
          // Add icon
          ctx.beginPath();
          ctx.arc(canvas.width/2, 70, 30, 0, Math.PI * 2);
          ctx.fillStyle = '#721c24';
          ctx.fill();
          
          // Add exclamation mark
          ctx.fillStyle = 'white';
          ctx.font = 'bold 40px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('!', canvas.width/2, 83);
          
          // Add error message
          ctx.fillStyle = '#721c24';
          ctx.font = 'bold 18px Arial';
          ctx.fillText('Unsupported File Format', canvas.width/2, 150);
          
          // Add details
          ctx.font = '14px Arial';
          ctx.fillText('This file type cannot be displayed in the preview.', canvas.width/2, 180);
          ctx.fillText('Please try a different file format', canvas.width/2, 205);
          ctx.font = '12px Arial';
          ctx.fillText('Supported formats: JPEG, PNG, SVG, PDF', canvas.width/2, 240);
          
          // Convert to image
          img = new Image();
          img.src = canvas.toDataURL();
          await new Promise(resolve => {
            img.onload = resolve;
          });
        }
        
        setDesignImage(img);
        setIsLoading(false);
        
        // Render initial view
        renderCanvas(img);
      } catch (err) {
        console.error('Error loading design:', err);
        setError(err.message || 'Failed to load design');
        setIsLoading(false);
      }
    };
    
    loadDesign();
  }, [designData]);
  
  // Render the canvas whenever view parameters change
  useEffect(() => {
    if (designImage) {
      renderCanvas(designImage);
    }
  }, [zoom, pan, rotation, showGrid, gridSize, gridColor]);
  
  /**
   * Render the canvas with current view parameters
   * @param {Image} img - The design image to render
   */
  const renderCanvas = (img) => {
    if (!canvasRef.current || !img) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx);
    }
    
    // Calculate center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Save current state
    ctx.save();
    
    // Move to center, apply transformations, then draw
    ctx.translate(centerX + pan.x, centerY + pan.y);
    ctx.scale(zoom, zoom);
    ctx.rotate(rotation * Math.PI / 180);
    
    // Draw image centered
    const imgWidth = img.width;
    const imgHeight = img.height;
    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    
    // Restore state
    ctx.restore();
    
    // Call onRender callback if provided
    if (onRender) {
      onRender(canvas);
    }
  };
  
  /**
   * Draw a grid on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  const drawGrid = (ctx) => {
    const { width, height } = ctx.canvas;
    
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    
    // Draw horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    
    ctx.stroke();
  };
  
  /**
   * Handle mouse down event to start dragging
   * @param {MouseEvent} e - The mouse event
   */
  const handleMouseDown = (e) => {
    if (!allowPan) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setStartDragPos({ x, y });
  };
  
  /**
   * Handle mouse move event for panning
   * @param {MouseEvent} e - The mouse event
   */
  const handleMouseMove = (e) => {
    if (!isDragging || !allowPan) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPan(prevPan => ({
      x: prevPan.x + (x - startDragPos.x),
      y: prevPan.y + (y - startDragPos.y)
    }));
    
    setStartDragPos({ x, y });
  };
  
  /**
   * Handle mouse up event to stop dragging
   */
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  /**
   * Handle mouse wheel event for zooming
   * @param {WheelEvent} e - The wheel event
   */
  const handleWheel = (e) => {
    if (!allowZoom) return;
    
    e.preventDefault();
    
    // Determine zoom direction and amount
    const delta = -Math.sign(e.deltaY) * 0.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
    
    setZoom(newZoom);
  };
  
  /**
   * Rotate the design by the specified degrees
   * @param {number} degrees - The degrees to rotate (positive is clockwise)
   */
  const handleRotate = (degrees) => {
    if (!allowRotate) return;
    
    setRotation(prevRotation => prevRotation + degrees);
  };
  
  /**
   * Reset view to initial state
   */
  const resetView = () => {
    setZoom(initialZoom);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };
  
  /**
   * Export the current canvas view as an image
   * @param {string} format - The image format: 'png', 'jpeg', or 'webp'
   * @param {number} quality - The image quality (0-1) for formats that support it
   * @returns {string} - The data URL of the exported image
   */
  const exportImage = (format = 'png', quality = 0.9) => {
    if (!canvasRef.current) return null;
    
    let mimeType;
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'png':
      default:
        mimeType = 'image/png';
        break;
    }
    
    return canvasRef.current.toDataURL(mimeType, quality);
  };
  
  // Expose methods to parent component through a ref
  React.useImperativeHandle(
    containerRef,
    () => ({
      zoomIn: () => setZoom(prevZoom => Math.min(5, prevZoom + 0.1)),
      zoomOut: () => setZoom(prevZoom => Math.max(0.1, prevZoom - 0.1)),
      setZoom: (newZoom) => setZoom(Math.max(0.1, Math.min(5, newZoom))),
      resetView,
      rotateLeft: () => handleRotate(-90),
      rotateRight: () => handleRotate(90),
      exportImage,
      getCanvas: () => canvasRef.current
    })
  );
  
  return (
    <div 
      ref={containerRef} 
      className="canvas-design-preview"
      style={{ 
        width, 
        height, 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor,
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}
    >
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10
          }}
        >
          <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
        </div>
      )}
      
      {error && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: 'var(--error)',
            padding: '1rem',
            textAlign: 'center',
            zIndex: 10
          }}
        >
          <div>
            <p>Error loading design</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ 
          display: 'block',
          cursor: isDragging ? 'grabbing' : (allowPan ? 'grab' : 'default')
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {allowZoom && (
        <div 
          className="zoom-controls"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            gap: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '5px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <button 
            onClick={() => setZoom(prevZoom => Math.max(0.1, prevZoom - 0.1))}
            className="btn btn-sm"
            style={{ backgroundColor: 'var(--white)', color: 'var(--gray-dark)' }}
            aria-label="Zoom out"
          >
            −
          </button>
          <span 
            style={{ 
              padding: '0 8px', 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '0.8rem',
              color: 'var(--gray-dark)'
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button 
            onClick={() => setZoom(prevZoom => Math.min(5, prevZoom + 0.1))}
            className="btn btn-sm"
            style={{ backgroundColor: 'var(--white)', color: 'var(--gray-dark)' }}
            aria-label="Zoom in"
          >
            +
          </button>
          <button 
            onClick={resetView}
            className="btn btn-sm"
            style={{ backgroundColor: 'var(--white)', color: 'var(--gray-dark)' }}
            aria-label="Reset view"
          >
            ↺
          </button>
        </div>
      )}
      
      {allowRotate && (
        <div 
          className="rotation-controls"
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            gap: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '5px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <button 
            onClick={() => handleRotate(-90)}
            className="btn btn-sm"
            style={{ backgroundColor: 'var(--white)', color: 'var(--gray-dark)' }}
            aria-label="Rotate left"
          >
            ↺
          </button>
          <button 
            onClick={() => handleRotate(90)}
            className="btn btn-sm"
            style={{ backgroundColor: 'var(--white)', color: 'var(--gray-dark)' }}
            aria-label="Rotate right"
          >
            ↻
          </button>
        </div>
      )}
    </div>
  );
};

CanvasDesignPreview.propTypes = {
  designData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(File),
    PropTypes.object
  ]).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  initialZoom: PropTypes.number,
  allowZoom: PropTypes.bool,
  allowPan: PropTypes.bool,
  allowRotate: PropTypes.bool,
  onRender: PropTypes.func,
  backgroundColor: PropTypes.string,
  showGrid: PropTypes.bool,
  gridSize: PropTypes.number,
  gridColor: PropTypes.string
};

export default CanvasDesignPreview;