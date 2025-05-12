import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/pressly-theme.css';

/**
 * Canvas-based image editor with more advanced manipulation capabilities
 */
const CanvasImageEditor = ({
  imageData,
  width = 800,
  height = 600,
  onSave = null,
  backgroundColor = '#f9f9f9',
  toolbarPosition = 'bottom', // 'top', 'bottom', 'left', 'right'
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [filters, setFilters] = useState({
    grayscale: 0,
    sepia: 0,
    blur: 0,
    invert: false
  });
  const [activeTool, setActiveTool] = useState('move'); // 'move', 'crop', 'draw', 'text', 'filter'
  const [cropRect, setCropRect] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [drawColor, setDrawColor] = useState('#FF0000');
  const [drawSize, setDrawSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [addingText, setAddingText] = useState(false);
  const [textItems, setTextItems] = useState([]);

  // Load image when component mounts
  useEffect(() => {
    if (!imageData) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const loadImage = async () => {
      try {
        let img;

        if (typeof imageData === 'string') {
          // If imageData is a URL or data URL
          img = new Image();
          img.crossOrigin = 'anonymous';

          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageData;
          });
        } else if (imageData instanceof File) {
          // If imageData is a File object
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageData);
          });

          img = new Image();

          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = dataUrl;
          });
        } else if (imageData.fileData) {
          // If imageData is an object with ArrayBuffer data
          const blob = new Blob([imageData.fileData], { type: imageData.type });
          const dataUrl = URL.createObjectURL(blob);

          img = new Image();

          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = dataUrl;
          });
        } else if (imageData.thumbnail) {
          // If imageData has a thumbnail property
          img = new Image();

          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load thumbnail'));
            img.src = imageData.thumbnail;
          });
        } else {
          throw new Error('Unsupported image data format');
        }

        setImage(img);
        setIsLoading(false);

        // Capture initial state for undo
        saveHistoryState();

        // Set initial crop rect
        setCropRect({
          x: 0,
          y: 0,
          width: img.width,
          height: img.height
        });

        // Render initial view
        renderCanvas(img);
      } catch (err) {
        console.error('Error loading image:', err);
        setError(err.message || 'Failed to load image');
        setIsLoading(false);
      }
    };

    loadImage();
  }, [imageData]);

  // Render canvas whenever view parameters change
  useEffect(() => {
    if (image) {
      renderCanvas(image);
    }
  }, [
    zoom, 
    pan, 
    rotation, 
    brightness, 
    contrast, 
    saturation, 
    filters, 
    cropRect,
    isCropping, 
    cropStart, 
    cropEnd, 
    drawPoints,
    textItems
  ]);

  /**
   * Save current state to history for undo/redo
   */
  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = {
      imageData: canvas.toDataURL(),
      zoom,
      pan,
      rotation,
      brightness,
      contrast,
      saturation,
      filters,
      cropRect,
      drawPoints: [...drawPoints],
      textItems: [...textItems]
    };

    setUndoStack(prevStack => [...prevStack, state]);
    setRedoStack([]);
  };

  /**
   * Undo the last action
   */
  const handleUndo = () => {
    if (undoStack.length <= 1) return;

    const newStack = [...undoStack];
    const redoState = newStack.pop();
    const prevState = newStack[newStack.length - 1];

    setRedoStack(prevRedoStack => [...prevRedoStack, redoState]);
    setUndoStack(newStack);

    // Apply the previous state
    setZoom(prevState.zoom);
    setPan(prevState.pan);
    setRotation(prevState.rotation);
    setBrightness(prevState.brightness);
    setContrast(prevState.contrast);
    setSaturation(prevState.saturation);
    setFilters(prevState.filters);
    setCropRect(prevState.cropRect);
    setDrawPoints(prevState.drawPoints);
    setTextItems(prevState.textItems);

    // Reload the image
    if (prevState.imageData) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        renderCanvas(img);
      };
      img.src = prevState.imageData;
    }
  };

  /**
   * Redo the last undone action
   */
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const newRedoStack = [...redoStack];
    const redoState = newRedoStack.pop();

    setUndoStack(prevStack => [...prevStack, redoState]);
    setRedoStack(newRedoStack);

    // Apply the redo state
    setZoom(redoState.zoom);
    setPan(redoState.pan);
    setRotation(redoState.rotation);
    setBrightness(redoState.brightness);
    setContrast(redoState.contrast);
    setSaturation(redoState.saturation);
    setFilters(redoState.filters);
    setCropRect(redoState.cropRect);
    setDrawPoints(redoState.drawPoints);
    setTextItems(redoState.textItems);

    // Reload the image
    if (redoState.imageData) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        renderCanvas(img);
      };
      img.src = redoState.imageData;
    }
  };

  /**
   * Render the canvas with current state
   * @param {Image} img - The image to render
   */
  const renderCanvas = (img) => {
    if (!canvasRef.current || !img) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions (may need adjustment if image is rotated)
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Save context state
    ctx.save();

    // Move to center, apply transformations
    ctx.translate(centerX + pan.x, centerY + pan.y);
    ctx.scale(zoom, zoom);
    ctx.rotate(rotation * Math.PI / 180);

    // Apply image adjustments using a secondary canvas
    const adjustmentCanvas = document.createElement('canvas');
    const imgWidth = img.width;
    const imgHeight = img.height;
    adjustmentCanvas.width = imgWidth;
    adjustmentCanvas.height = imgHeight;

    const adjCtx = adjustmentCanvas.getContext('2d');
    adjCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

    // Apply filters and adjustments
    let imageData = adjCtx.getImageData(0, 0, imgWidth, imgHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      const brightnessValue = (brightness - 100) * 2.55;
      data[i] = Math.min(255, Math.max(0, data[i] + brightnessValue));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightnessValue));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightnessValue));

      // Apply contrast
      const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128));

      // Apply grayscale
      if (filters.grayscale > 0) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const grayscaleAmount = filters.grayscale / 100;
        data[i] = data[i] * (1 - grayscaleAmount) + avg * grayscaleAmount;
        data[i + 1] = data[i + 1] * (1 - grayscaleAmount) + avg * grayscaleAmount;
        data[i + 2] = data[i + 2] * (1 - grayscaleAmount) + avg * grayscaleAmount;
      }

      // Apply sepia
      if (filters.sepia > 0) {
        const sepiaAmount = filters.sepia / 100;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const sepiaR = (r * 0.393 + g * 0.769 + b * 0.189);
        const sepiaG = (r * 0.349 + g * 0.686 + b * 0.168);
        const sepiaB = (r * 0.272 + g * 0.534 + b * 0.131);
        data[i] = r * (1 - sepiaAmount) + sepiaR * sepiaAmount;
        data[i + 1] = g * (1 - sepiaAmount) + sepiaG * sepiaAmount;
        data[i + 2] = b * (1 - sepiaAmount) + sepiaB * sepiaAmount;
      }

      // Apply invert
      if (filters.invert) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }

      // Apply saturation
      if (saturation !== 100) {
        const saturationValue = saturation / 100;
        const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
        data[i] = Math.min(255, Math.max(0, gray + saturationValue * (data[i] - gray)));
        data[i + 1] = Math.min(255, Math.max(0, gray + saturationValue * (data[i + 1] - gray)));
        data[i + 2] = Math.min(255, Math.max(0, gray + saturationValue * (data[i + 2] - gray)));
      }
    }

    adjCtx.putImageData(imageData, 0, 0);

    // Apply blur if needed (using CSS filter)
    if (filters.blur > 0) {
      adjCtx.filter = `blur(${filters.blur}px)`;
      adjCtx.drawImage(adjustmentCanvas, 0, 0);
      adjCtx.filter = 'none';
    }

    // Draw the adjusted image
    ctx.drawImage(adjustmentCanvas, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

    // Draw crop rectangle if in crop mode
    if (activeTool === 'crop' && !isCropping) {
      const cropX = cropRect.x - imgWidth / 2;
      const cropY = cropRect.y - imgHeight / 2;
      
      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(-imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      
      // Clear the crop area
      ctx.clearRect(cropX, cropY, cropRect.width, cropRect.height);
      
      // Draw crop border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2 / zoom;
      ctx.strokeRect(cropX, cropY, cropRect.width, cropRect.height);
      
      // Draw corner handles
      const handleSize = 8 / zoom;
      ctx.fillStyle = 'white';
      
      // Top-left
      ctx.fillRect(cropX - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
      // Top-right
      ctx.fillRect(cropX + cropRect.width - handleSize/2, cropY - handleSize/2, handleSize, handleSize);
      // Bottom-left
      ctx.fillRect(cropX - handleSize/2, cropY + cropRect.height - handleSize/2, handleSize, handleSize);
      // Bottom-right
      ctx.fillRect(cropX + cropRect.width - handleSize/2, cropY + cropRect.height - handleSize/2, handleSize, handleSize);
    }
    
    // Draw active crop rectangle when user is selecting
    if (isCropping) {
      const x = Math.min(cropStart.x, cropEnd.x) - imgWidth / 2;
      const y = Math.min(cropStart.y, cropEnd.y) - imgHeight / 2;
      const width = Math.abs(cropEnd.x - cropStart.x);
      const height = Math.abs(cropEnd.y - cropStart.y);
      
      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(-imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      
      // Clear the crop area
      ctx.clearRect(x, y, width, height);
      
      // Draw border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2 / zoom;
      ctx.strokeRect(x, y, width, height);
    }
    
    // Draw lines if in draw mode
    if (drawPoints.length > 0) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      drawPoints.forEach(segment => {
        if (segment.points.length < 2) return;
        
        ctx.beginPath();
        ctx.strokeStyle = segment.color;
        ctx.lineWidth = segment.size / zoom;
        
        ctx.moveTo(segment.points[0].x - imgWidth / 2, segment.points[0].y - imgHeight / 2);
        
        for (let i = 1; i < segment.points.length; i++) {
          ctx.lineTo(segment.points[i].x - imgWidth / 2, segment.points[i].y - imgHeight / 2);
        }
        
        ctx.stroke();
      });
    }
    
    // Draw text items
    if (textItems.length > 0) {
      textItems.forEach(item => {
        ctx.font = `${item.fontSize / zoom}px ${item.fontFamily}`;
        ctx.fillStyle = item.color;
        ctx.fillText(item.text, item.x - imgWidth / 2, item.y - imgHeight / 2);
      });
    }
    
    // Restore context
    ctx.restore();
  };

  /**
   * Handle mouse down events based on active tool
   * @param {MouseEvent} e - The mouse event
   */
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert screen coordinates to image coordinates
    const imgCoords = screenToImageCoords(x, y);
    
    if (activeTool === 'move') {
      setIsDragging(true);
      setStartDragPos({ x, y });
    } else if (activeTool === 'crop') {
      setIsCropping(true);
      setCropStart(imgCoords);
      setCropEnd(imgCoords);
    } else if (activeTool === 'draw') {
      setIsDrawing(true);
      setDrawPoints(prev => [
        ...prev, 
        {
          color: drawColor,
          size: drawSize,
          points: [imgCoords]
        }
      ]);
    } else if (activeTool === 'text') {
      if (!addingText) {
        setTextPosition(imgCoords);
        setAddingText(true);
      }
    }
  };

  /**
   * Handle mouse move events based on active tool
   * @param {MouseEvent} e - The mouse event
   */
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert screen coordinates to image coordinates
    const imgCoords = screenToImageCoords(x, y);
    
    if (activeTool === 'move' && isDragging) {
      setPan(prevPan => ({
        x: prevPan.x + (x - startDragPos.x),
        y: prevPan.y + (y - startDragPos.y)
      }));
      
      setStartDragPos({ x, y });
    } else if (activeTool === 'crop' && isCropping) {
      setCropEnd(imgCoords);
    } else if (activeTool === 'draw' && isDrawing) {
      setDrawPoints(prev => {
        const last = [...prev];
        const currentSegment = last[last.length - 1];
        currentSegment.points.push(imgCoords);
        return last;
      });
    }
  };

  /**
   * Handle mouse up events based on active tool
   */
  const handleMouseUp = () => {
    if (activeTool === 'move') {
      setIsDragging(false);
    } else if (activeTool === 'crop' && isCropping) {
      const x = Math.min(cropStart.x, cropEnd.x);
      const y = Math.min(cropStart.y, cropEnd.y);
      const width = Math.abs(cropEnd.x - cropStart.x);
      const height = Math.abs(cropEnd.y - cropStart.y);
      
      setCropRect({ x, y, width, height });
      setIsCropping(false);
      saveHistoryState();
    } else if (activeTool === 'draw' && isDrawing) {
      setIsDrawing(false);
      saveHistoryState();
    }
  };

  /**
   * Convert screen coordinates to image coordinates
   * @param {number} screenX - X coordinate on screen
   * @param {number} screenY - Y coordinate on screen
   * @returns {Object} - Coordinates relative to the image
   */
  const screenToImageCoords = (screenX, screenY) => {
    if (!image) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Adjust for pan and zoom
    const adjustedX = (screenX - centerX - pan.x) / zoom;
    const adjustedY = (screenY - centerY - pan.y) / zoom;
    
    // Adjust for rotation
    const radians = rotation * Math.PI / 180;
    const rotX = adjustedX * Math.cos(-radians) - adjustedY * Math.sin(-radians);
    const rotY = adjustedX * Math.sin(-radians) + adjustedY * Math.cos(-radians);
    
    // Convert to image coordinates
    const imgX = rotX + image.width / 2;
    const imgY = rotY + image.height / 2;
    
    return { x: imgX, y: imgY };
  };

  /**
   * Apply crop to the image
   */
  const applyCrop = () => {
    if (!image || !cropRect) return;
    
    const { x, y, width, height } = cropRect;
    
    if (width <= 0 || height <= 0) return;
    
    // Create a temporary canvas to hold the cropped image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(
      image,
      x, y, width, height,
      0, 0, width, height
    );
    
    // Create a new image from the cropped canvas
    const newImg = new Image();
    newImg.onload = () => {
      setImage(newImg);
      
      // Reset crop rect and other values
      setCropRect({
        x: 0,
        y: 0,
        width: newImg.width,
        height: newImg.height
      });
      
      setPan({ x: 0, y: 0 });
      setZoom(1.0);
      setRotation(0);
      
      saveHistoryState();
      
      setActiveTool('move');
    };
    newImg.src = tempCanvas.toDataURL();
  };

  /**
   * Apply text to the image
   */
  const applyText = () => {
    if (!addingText || !textInput.trim()) {
      setAddingText(false);
      return;
    }
    
    setTextItems(prev => [
      ...prev,
      {
        text: textInput,
        x: textPosition.x,
        y: textPosition.y,
        color: textColor,
        fontSize: fontSize,
        fontFamily: fontFamily
      }
    ]);
    
    setTextInput('');
    setAddingText(false);
    saveHistoryState();
  };

  /**
   * Export the current image state
   * @param {string} format - The export format ('png', 'jpeg', or 'webp')
   * @param {number} quality - The export quality (0-1)
   * @returns {string} - Data URL of the exported image
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

  /**
   * Save the current image
   */
  const handleSave = () => {
    if (!canvasRef.current) return;
    
    const dataUrl = exportImage();
    
    if (onSave) {
      onSave(dataUrl);
    }
  };

  /**
   * Reset all image adjustments
   */
  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setFilters({
      grayscale: 0,
      sepia: 0,
      blur: 0,
      invert: false
    });
    saveHistoryState();
  };
  
  // Render toolbar based on position
  const renderToolbar = () => {
    const toolbar = (
      <div 
        className="canvas-editor-toolbar"
        style={{
          display: 'flex',
          gap: '10px',
          padding: '10px',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          flexDirection: toolbarPosition === 'left' || toolbarPosition === 'right' ? 'column' : 'row',
          flexWrap: toolbarPosition === 'left' || toolbarPosition === 'right' ? 'nowrap' : 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div className="tool-section">
          <button 
            className={`btn btn-sm ${activeTool === 'move' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTool('move')}
            title="Move Tool"
          >
            ↔
          </button>
          <button 
            className={`btn btn-sm ${activeTool === 'crop' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTool('crop')}
            title="Crop Tool"
          >
            ⊡
          </button>
          {activeTool === 'crop' && (
            <button 
              className="btn btn-sm btn-primary"
              onClick={applyCrop}
              title="Apply Crop"
            >
              ✓
            </button>
          )}
          <button 
            className={`btn btn-sm ${activeTool === 'draw' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTool('draw')}
            title="Draw Tool"
          >
            ✎
          </button>
          {activeTool === 'draw' && (
            <>
              <input 
                type="color" 
                value={drawColor} 
                onChange={e => setDrawColor(e.target.value)}
                style={{ width: '24px', height: '24px' }}
                title="Draw Color"
              />
              <select 
                value={drawSize} 
                onChange={e => setDrawSize(Number(e.target.value))}
                className="input"
                style={{ width: '40px', height: '28px', padding: '2px' }}
                title="Brush Size"
              >
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </>
          )}
          <button 
            className={`btn btn-sm ${activeTool === 'text' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTool('text')}
            title="Text Tool"
          >
            T
          </button>
          {activeTool === 'text' && addingText && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '10px',
                width: '200px'
              }}
            >
              <input 
                type="text" 
                value={textInput} 
                onChange={e => setTextInput(e.target.value)}
                placeholder="Enter text"
                className="input"
              />
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px' }}>Color:</label>
                <input 
                  type="color" 
                  value={textColor} 
                  onChange={e => setTextColor(e.target.value)}
                  style={{ width: '24px', height: '24px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px' }}>Size:</label>
                <input 
                  type="range" 
                  min="10" 
                  max="72" 
                  value={fontSize} 
                  onChange={e => setFontSize(Number(e.target.value))}
                />
                <span style={{ fontSize: '12px' }}>{fontSize}px</span>
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px' }}>Font:</label>
                <select 
                  value={fontFamily} 
                  onChange={e => setFontFamily(e.target.value)}
                  className="input"
                  style={{ fontSize: '12px' }}
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Impact">Impact</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={() => setAddingText(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-sm btn-primary" 
                  onClick={applyText}
                >
                  Add
                </button>
              </div>
            </div>
          )}
          <button 
            className={`btn btn-sm ${activeTool === 'filter' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTool('filter')}
            title="Filters"
          >
            ⚙
          </button>
        </div>
        
        <div className="history-section">
          <button 
            className="btn btn-sm btn-outline" 
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
            title="Undo"
          >
            ↩
          </button>
          <button 
            className="btn btn-sm btn-outline" 
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo"
          >
            ↪
          </button>
        </div>
        
        <button 
          className="btn btn-sm btn-primary"
          onClick={handleSave}
          title="Save"
        >
          Save
        </button>
      </div>
    );
    
    // Filter controls when filter tool is active
    const filterControls = activeTool === 'filter' && (
      <div 
        className="filter-controls"
        style={{
          padding: '10px',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginTop: toolbarPosition === 'top' ? '10px' : 0,
          marginBottom: toolbarPosition === 'bottom' ? '10px' : 0,
          marginLeft: toolbarPosition === 'left' ? '10px' : 0,
          marginRight: toolbarPosition === 'right' ? '10px' : 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: toolbarPosition === 'left' || toolbarPosition === 'right' ? '150px' : '100%',
          maxWidth: '300px'
        }}
      >
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Brightness</span>
            <span>{brightness}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="200" 
            value={brightness} 
            onChange={e => setBrightness(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Contrast</span>
            <span>{contrast}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="200" 
            value={contrast} 
            onChange={e => setContrast(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Saturation</span>
            <span>{saturation}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="200" 
            value={saturation} 
            onChange={e => setSaturation(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Grayscale</span>
            <span>{filters.grayscale}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={filters.grayscale} 
            onChange={e => setFilters(prev => ({ ...prev, grayscale: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Sepia</span>
            <span>{filters.sepia}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={filters.sepia} 
            onChange={e => setFilters(prev => ({ ...prev, sepia: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span>Blur</span>
            <span>{filters.blur}px</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5"
            value={filters.blur} 
            onChange={e => setFilters(prev => ({ ...prev, blur: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="checkbox" 
            id="invert" 
            checked={filters.invert} 
            onChange={e => setFilters(prev => ({ ...prev, invert: e.target.checked }))}
          />
          <label htmlFor="invert" style={{ fontSize: '12px' }}>Invert Colors</label>
        </div>
        
        <button 
          className="btn btn-sm btn-outline" 
          onClick={resetAdjustments}
          style={{ marginTop: '5px' }}
        >
          Reset Adjustments
        </button>
      </div>
    );
    
    if (toolbarPosition === 'top') {
      return (
        <div style={{ width: '100%' }}>
          {toolbar}
          {filterControls}
        </div>
      );
    } else if (toolbarPosition === 'bottom') {
      return (
        <div style={{ width: '100%' }}>
          {filterControls}
          {toolbar}
        </div>
      );
    } else if (toolbarPosition === 'left') {
      return (
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {toolbar}
            {filterControls}
          </div>
        </div>
      );
    } else if (toolbarPosition === 'right') {
      return (
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {toolbar}
            {filterControls}
          </div>
        </div>
      );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="canvas-image-editor"
      style={{ 
        width: width,
        display: 'flex',
        flexDirection: ['left', 'right'].includes(toolbarPosition) ? 'row' : 'column',
        gap: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: 'var(--radius-lg)',
        padding: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {['top', 'left'].includes(toolbarPosition) && renderToolbar()}
      
      <div 
        className="canvas-container"
        style={{ 
          position: 'relative',
          flexGrow: 1,
          height: ['left', 'right'].includes(toolbarPosition) ? height : 'auto',
          width: ['left', 'right'].includes(toolbarPosition) ? 'auto' : width,
          backgroundColor,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
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
              <p>Error loading image</p>
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
            cursor: isDragging ? 'grabbing' : 
                    activeTool === 'move' ? 'grab' : 
                    activeTool === 'crop' ? 'crosshair' : 
                    activeTool === 'draw' ? 'crosshair' : 
                    activeTool === 'text' ? 'text' : 
                    'default'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      
      {['bottom', 'right'].includes(toolbarPosition) && renderToolbar()}
    </div>
  );
};

CanvasImageEditor.propTypes = {
  imageData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(File),
    PropTypes.object
  ]).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  onSave: PropTypes.func,
  backgroundColor: PropTypes.string,
  toolbarPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

export default CanvasImageEditor;