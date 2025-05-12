import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Enhanced CMYK color analysis using Canvas API
const analyzeColorDistribution = (imageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  ctx.drawImage(imageElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Initialize CMYK color counters
  let cmykDistribution = {
    cyan: 0,
    magenta: 0,
    yellow: 0,
    black: 0,
    outOfGamut: 0,
    total: 0
  };
  
  // Sample pixels (every 10th pixel for performance)
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert RGB to CMYK
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    
    // Check which channel is dominant
    const cProcess = (c - k) / (1 - k) || 0;
    const mProcess = (m - k) / (1 - k) || 0;
    const yProcess = (y - k) / (1 - k) || 0;
    
    // Count dominant colors
    if (k > 0.7) cmykDistribution.black++;
    else if (cProcess > 0.6) cmykDistribution.cyan++;
    else if (mProcess > 0.6) cmykDistribution.magenta++;
    else if (yProcess > 0.6) cmykDistribution.yellow++;
    
    // Check for out-of-gamut colors (difficult to reproduce in CMYK)
    if (r > 240 && g < 50 && b > 240) cmykDistribution.outOfGamut++;
    
    cmykDistribution.total++;
  }
  
  // Convert to percentages
  Object.keys(cmykDistribution).forEach(key => {
    if (key !== 'total') {
      cmykDistribution[key] = (cmykDistribution[key] / cmykDistribution.total) * 100;
    }
  });
  
  return cmykDistribution;
};

/**
 * TensorFlowDesignAnalyzer Component
 * 
 * Uses TensorFlow.js to analyze uploaded design files for:
 * - Content recognition (objects, themes, colors)
 * - Print quality assessment
 * - Optimal print settings recommendations
 * - Chicago-specific printing recommendations
 */
const TensorFlowDesignAnalyzer = ({ files, onAnalysisComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({});
  
  // References to TensorFlow models
  const mobilenetModel = useRef(null);
  const objectDetectionModel = useRef(null);
  
  // Canvas reference for image processing
  const canvasRef = useRef(null);
  
  // Load TensorFlow models on component mount
  useEffect(() => {
    async function loadModels() {
      try {
        setIsLoading(true);
        setLoadingMessage('Loading design analysis models...');
        
        // Load MobileNet for image classification
        setLoadingProgress(10);
        setLoadingMessage('Loading image classification model...');
        mobilenetModel.current = await mobilenet.load();
        
        // Load COCO-SSD for object detection
        setLoadingProgress(50);
        setLoadingMessage('Loading object detection model...');
        objectDetectionModel.current = await cocoSsd.load();
        
        setLoadingProgress(100);
        setModelLoaded(true);
        setIsLoading(false);
        setLoadingMessage('Models loaded successfully!');
      } catch (error) {
        console.error('Error loading TensorFlow models:', error);
        setIsLoading(false);
        setLoadingMessage('Error loading models. Using fallback analysis.');
      }
    }
    
    loadModels();
    
    // Cleanup
    return () => {
      // Dispose of models if needed
      if (mobilenetModel.current) {
        // Clean up if needed
      }
    };
  }, []);
  
  // Analyze files when they are uploaded and models are loaded
  useEffect(() => {
    if (files && files.length > 0 && modelLoaded) {
      analyzeFiles(files);
    }
  }, [files, modelLoaded]);
  
  // Main analysis function
  const analyzeFiles = async (filesToAnalyze) => {
    setIsLoading(true);
    setLoadingMessage('Analyzing design files...');
    setLoadingProgress(0);
    
    const results = {};
    let progress = 0;
    
    for (let i = 0; i < filesToAnalyze.length; i++) {
      const file = filesToAnalyze[i];
      const fileName = file.name;
      
      setLoadingMessage(`Analyzing ${fileName}...`);
      progress = Math.round((i / filesToAnalyze.length) * 100);
      setLoadingProgress(progress);
      
      // Only analyze image files
      if (file.type.startsWith('image/')) {
        try {
          const imageResults = await analyzeImage(file);
          results[fileName] = imageResults;
        } catch (error) {
          console.error(`Error analyzing ${fileName}:`, error);
          results[fileName] = {
            error: 'Analysis failed',
            recommendations: getFallbackRecommendations(file)
          };
        }
      } else if (file.type === 'application/pdf') {
        // For PDFs, we'll provide general recommendations based on file size and name
        results[fileName] = {
          fileType: 'PDF',
          recommendations: getPdfRecommendations(file)
        };
      } else {
        // For other file types
        results[fileName] = {
          fileType: file.type,
          recommendations: getFallbackRecommendations(file)
        };
      }
    }
    
    setAnalysisResults(results);
    setIsLoading(false);
    
    // Pass results to parent component
    if (onAnalysisComplete) {
      onAnalysisComplete(results);
    }
  };
  
  // Analyze with Web Worker for background processing
  const analyzeWithWorker = (imageData) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker('/src/workers/imageAnalysisWorker.js');
      
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
      
      worker.onerror = (error) => {
        console.error('Worker error:', error);
        reject(error);
        worker.terminate();
      };
      
      worker.postMessage({
        imageData: imageData.data,
        width: imageData.width,
        height: imageData.height
      });
    });
  };
  
  // Analyze a single image using TensorFlow models
  const analyzeImage = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the file is valid
        if (!file || typeof file !== 'object' || !(file instanceof Blob)) {
          console.error('Invalid file provided to analyzeImage:', file);
          return reject(new Error('Invalid file format'));
        }
      
        // Create an image element for TensorFlow
        const img = new Image();
        let objectUrl = null;
        
        try {
          objectUrl = URL.createObjectURL(file);
        } catch (error) {
          console.error('Error creating object URL:', error);
          return reject(new Error('Could not create image URL'));
        }
      
        img.onload = async () => {
          try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Get image data for color analysis
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const colorProfile = analyzeColors(imageData);
            
            // Get enhanced CMYK color distribution
            const cmykProfile = analyzeColorDistribution(img);
            
            // Run intensive analysis in web worker
            let workerResults = {};
            try {
              workerResults = await analyzeWithWorker(imageData);
              console.log('Web worker analysis results:', workerResults);
            } catch (error) {
              console.error('Web worker analysis failed:', error);
              // Continue with other analyses even if worker fails
            }
            
            // Classify image content with MobileNet
            const classification = await mobilenetModel.current.classify(img);
            
            // Detect objects with COCO-SSD
            const detections = await objectDetectionModel.current.detect(img);
            
            // Analyze image quality
            const qualityAssessment = assessImageQuality(img, imageData);
            
            // Generate print recommendations
            const printRecommendations = generatePrintRecommendations(
              classification,
              detections,
              colorProfile,
              qualityAssessment,
              { width: img.width, height: img.height }
            );
            
            // Generate Chicago-specific recommendations
            const chicagoRecommendations = generateChicagoRecommendations(
              classification,
              detections,
              colorProfile,
              { width: img.width, height: img.height }
            );
            
            // Cleanup URL
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
            }
            
            resolve({
              fileType: 'Image',
              dimensions: {
                width: img.width,
                height: img.height,
                aspectRatio: (img.width / img.height).toFixed(2)
              },
              classification: classification,
              detectedObjects: detections,
              colorProfile: colorProfile,
              cmykProfile: cmykProfile,
              advancedAnalysis: workerResults,
              qualityAssessment: qualityAssessment,
              recommendations: printRecommendations,
              chicagoRecommendations: chicagoRecommendations,
              printReadiness: workerResults.printReadiness || qualityAssessment
            });
          } catch (error) {
            console.error('Error during image analysis:', error);
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
            }
            reject(error);
          }
        };
        
        img.onerror = () => {
          console.error('Error loading image');
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
          reject(new Error('Failed to load image'));
        };
        
        img.src = objectUrl;
      } catch (error) {
        console.error('Unexpected error in analyzeImage:', error);
        reject(error);
      }
    });
  };
  
  // Analyze colors in an image
  const analyzeColors = (imageData) => {
    const data = imageData.data;
    let totalPixels = data.length / 4;
    
    // Color bins
    let colors = {
      red: 0,
      green: 0,
      blue: 0,
      yellow: 0,
      cyan: 0,
      magenta: 0,
      black: 0,
      white: 0,
      gray: 0
    };
    
    // Color classification thresholds
    const threshold = 80;
    const blackThreshold = 30;
    const whiteThreshold = 220;
    const grayTolerance = 30;
    
    // Analyze only a sample of pixels for performance
    const sampleRate = Math.max(1, Math.floor(totalPixels / 10000));
    
    for (let i = 0; i < data.length; i += 4 * sampleRate) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check for black, white, gray
      if (r < blackThreshold && g < blackThreshold && b < blackThreshold) {
        colors.black++;
      } else if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
        colors.white++;
      } else if (Math.abs(r - g) < grayTolerance && Math.abs(g - b) < grayTolerance && Math.abs(r - b) < grayTolerance) {
        colors.gray++;
      } else {
        // Check for primary and secondary colors
        if (r > threshold && g < threshold && b < threshold) colors.red++;
        if (r < threshold && g > threshold && b < threshold) colors.green++;
        if (r < threshold && g < threshold && b > threshold) colors.blue++;
        if (r > threshold && g > threshold && b < threshold) colors.yellow++;
        if (r < threshold && g > threshold && b > threshold) colors.cyan++;
        if (r > threshold && g < threshold && b > threshold) colors.magenta++;
      }
    }
    
    // Convert to percentages
    const sampledPixels = totalPixels / sampleRate;
    Object.keys(colors).forEach(color => {
      colors[color] = (colors[color] / sampledPixels) * 100;
    });
    
    // Determine dominant colors (top 3)
    const sortedColors = Object.entries(colors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .filter(color => color[1] > 5); // Only include colors that make up more than 5%
    
    // Determine if image is predominantly CMYK-friendly
    const cmykFriendly = (colors.cyan + colors.magenta + colors.yellow + colors.black) > 
                         (colors.red + colors.green + colors.blue);
    
    // Determine if image has high contrast
    const highContrast = (colors.black + colors.white) > 50;
    
    return {
      colorDistribution: colors,
      dominantColors: sortedColors,
      cmykFriendly: cmykFriendly,
      highContrast: highContrast
    };
  };
  
  // Assess image quality for printing
  const assessImageQuality = (img, imageData) => {
    const width = img.width;
    const height = img.height;
    const data = imageData.data;
    
    // Calculate DPI based on image dimensions
    // This is an estimation since we don't know the intended print size
    let estimatedDpi = 'Unknown';
    let dpiQuality = 'Unknown';
    
    if (width > 2000 || height > 2000) {
      estimatedDpi = 'High (300+ DPI at 8×10")';
      dpiQuality = 'Excellent';
    } else if (width > 1500 || height > 1500) {
      estimatedDpi = 'Good (200-300 DPI at 8×10")';
      dpiQuality = 'Good';
    } else if (width > 1000 || height > 1000) {
      estimatedDpi = 'Adequate (150-200 DPI at 8×10")';
      dpiQuality = 'Fair';
    } else {
      estimatedDpi = 'Low (below 150 DPI at 8×10")';
      dpiQuality = 'Poor';
    }
    
    // Check for standard print sizes
    const aspectRatio = width / height;
    const standardSizes = [
      { name: '4×6"', ratio: 6/4 },
      { name: '5×7"', ratio: 7/5 },
      { name: '8×10"', ratio: 10/8 },
      { name: '11×14"', ratio: 14/11 },
      { name: '16×20"', ratio: 20/16 },
      { name: 'Letter', ratio: 11/8.5 },
      { name: 'Legal', ratio: 14/8.5 },
      { name: 'Tabloid', ratio: 17/11 }
    ];
    
    let closestStandardSize = 'Non-standard';
    let ratioDistance = Number.MAX_VALUE;
    
    standardSizes.forEach(size => {
      const distance = Math.abs(aspectRatio - size.ratio);
      if (distance < ratioDistance) {
        ratioDistance = distance;
        closestStandardSize = size.name;
      }
    });
    
    // Check if the ratio is very close to a standard size
    const isStandardSize = ratioDistance < 0.05;
    
    return {
      estimatedDpi,
      dpiQuality,
      dimensions: `${width}×${height} pixels`,
      aspectRatio: aspectRatio.toFixed(2),
      closestStandardSize,
      isStandardSize,
      recommendedMaxPrintSize: getRecommendedPrintSize(width, height)
    };
  };
  
  // Generate print recommendations based on analysis
  const generatePrintRecommendations = (classification, detections, colorProfile, qualityAssessment, dimensions) => {
    const recommendations = [];
    
    // Recommendations based on image size and quality
    if (qualityAssessment.dpiQuality === 'Poor') {
      recommendations.push({
        type: 'quality',
        severity: 'high',
        message: 'Image resolution is too low for quality printing. Consider using a higher resolution image.',
        suggestion: 'For best quality, use images with at least 300 DPI at the intended print size.'
      });
    } else if (qualityAssessment.dpiQuality === 'Fair') {
      recommendations.push({
        type: 'quality',
        severity: 'medium',
        message: 'Image resolution may be insufficient for larger prints.',
        suggestion: `Best suited for prints smaller than ${qualityAssessment.recommendedMaxPrintSize}.`
      });
    }
    
    // Recommendations based on color profile
    if (!colorProfile.cmykFriendly) {
      recommendations.push({
        type: 'color',
        severity: 'medium',
        message: 'Image uses colors that may not reproduce well in CMYK printing.',
        suggestion: 'Consider converting to CMYK color space and adjusting colors for print.'
      });
    }
    
    if (colorProfile.highContrast) {
      recommendations.push({
        type: 'color',
        severity: 'low',
        message: 'Image has high contrast which prints well but may lose detail in shadows.',
        suggestion: 'Consider adding more midtones if detailed shadows are important.'
      });
    }
    
    // Recommendations based on content (from classification)
    if (classification && classification.length > 0) {
      // Check for types of content that might benefit from specific paper or finish
      const contentType = classification[0].className.toLowerCase();
      
      if (contentType.includes('food') || contentType.includes('product')) {
        recommendations.push({
          type: 'content',
          severity: 'low',
          message: 'Food or product imagery detected.',
          suggestion: 'Consider glossy or semi-gloss finish to enhance color vibrancy.'
        });
      } else if (contentType.includes('text') || contentType.includes('document')) {
        recommendations.push({
          type: 'content',
          severity: 'low',
          message: 'Text or document content detected.',
          suggestion: 'Consider matte paper for better readability and reduced glare.'
        });
      } else if (contentType.includes('landscape') || contentType.includes('nature')) {
        recommendations.push({
          type: 'content',
          severity: 'low',
          message: 'Landscape or nature imagery detected.',
          suggestion: 'Consider satin or pearl finish for natural reproduction of outdoor scenes.'
        });
      }
    }
    
    // Recommendations based on detected objects
    if (detections && detections.length > 0) {
      // If many objects are detected, it might be a complex image
      if (detections.length > 5) {
        recommendations.push({
          type: 'content',
          severity: 'low',
          message: 'Complex image with multiple elements detected.',
          suggestion: 'Consider higher resolution printing to preserve detail.'
        });
      }
      
      // Check for people in the image
      const hasPeople = detections.some(d => d.class === 'person');
      if (hasPeople) {
        recommendations.push({
          type: 'content',
          severity: 'low',
          message: 'People detected in the image.',
          suggestion: 'For portraits, consider luster or pearl finish for flattering skin tones.'
        });
      }
    }
    
    // Standard size recommendations
    if (!qualityAssessment.isStandardSize) {
      recommendations.push({
        type: 'size',
        severity: 'medium',
        message: `Non-standard aspect ratio (${qualityAssessment.aspectRatio}). Closest standard size: ${qualityAssessment.closestStandardSize}.`,
        suggestion: 'Consider cropping to a standard print size to avoid unexpected cropping or white borders.'
      });
    }
    
    return recommendations;
  };
  
  // Generate Chicago-specific recommendations
  const generateChicagoRecommendations = (classification, detections, colorProfile, dimensions) => {
    const recommendations = [];
    
    // Chicago has specific preferences for color reproduction in its climate
    if (!colorProfile.cmykFriendly) {
      recommendations.push(
        'Chicago print shops typically prefer CMYK color space for consistent reproduction, especially for designs that will be displayed outdoors.'
      );
    }
    
    // Check for content that might benefit from specific Chicago print shops
    if (classification && classification.length > 0) {
      const contentType = classification[0].className.toLowerCase();
      
      if (contentType.includes('food') || contentType.includes('restaurant')) {
        recommendations.push(
          'West Loop and Fulton Market printers specialize in food and restaurant materials with vibrant color reproduction.'
        );
      } else if (contentType.includes('art') || contentType.includes('painting')) {
        recommendations.push(
          'River North and Pilsen print shops specialize in gallery-quality art reproduction.'
        );
      } else if (contentType.includes('architecture') || contentType.includes('building')) {
        recommendations.push(
          'The Loop printers have expertise in architectural printing with fine detail reproduction.'
        );
      }
    }
    
    // Check image size for Chicago weather consideration
    if (colorProfile.highContrast) {
      recommendations.push(
        'High contrast images maintain visibility in Chicago\'s variable lighting conditions, especially for outdoor display.'
      );
    }
    
    // Add a general Chicago recommendation
    recommendations.push(
      'Chicago\'s humidity can affect paper over time. Consider lamination or special coatings for materials that will be displayed outdoors.'
    );
    
    return recommendations;
  };
  
  // Determine recommended maximum print size based on resolution
  const getRecommendedPrintSize = (width, height) => {
    // Calculate based on 150 DPI minimum for acceptable quality
    const maxWidth = Math.round((width / 150) * 10) / 10;
    const maxHeight = Math.round((height / 150) * 10) / 10;
    
    return `${maxWidth}″ × ${maxHeight}″`;
  };
  
  // Get fallback recommendations for non-image files
  const getFallbackRecommendations = (file) => {
    // Basic recommendations based on file type
    const fileType = file.type.split('/')[1]?.toUpperCase() || 'Unknown';
    
    return [
      {
        type: 'general',
        severity: 'low',
        message: `${fileType} file detected. AI-powered analysis not available for this file type.`,
        suggestion: 'For best results, upload JPG, PNG, or PDF files for printing.'
      }
    ];
  };
  
  // Get PDF recommendations
  const getPdfRecommendations = (file) => {
    const fileSizeMB = file.size / (1024 * 1024);
    const recommendations = [];
    
    if (fileSizeMB < 1) {
      recommendations.push({
        type: 'quality',
        severity: 'medium',
        message: 'PDF file size is small, which may indicate low-resolution images or simple content.',
        suggestion: 'Check embedded images for sufficient resolution before printing.'
      });
    } else if (fileSizeMB > 50) {
      recommendations.push({
        type: 'quality',
        severity: 'low',
        message: 'Large PDF file detected. This may contain high-resolution images or complex elements.',
        suggestion: 'Consider optimizing for printing to reduce processing time.'
      });
    }
    
    // Add Chicago-specific recommendation
    recommendations.push({
      type: 'chicago',
      severity: 'low',
      message: 'For Chicago printing, ensure fonts are embedded and colors are CMYK.',
      suggestion: 'Local print shops in The Loop specialize in high-quality PDF printing for business documents.'
    });
    
    return recommendations;
  };

  return (
    <div className="card">
      <h3 className="card-title">AI-Powered Design Analysis</h3>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
          </div>
          <p>{loadingMessage}</p>
          <div style={{ width: '100%', backgroundColor: '#e9ecef', height: '8px', borderRadius: '4px', margin: '1rem 0', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${loadingProgress}%`, 
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease' 
              }}
            ></div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Our AI is analyzing your design files to provide optimal print recommendations
          </p>
        </div>
      ) : Object.keys(analysisResults).length > 0 ? (
        <div>
          <p style={{ marginBottom: '1.5rem' }}>
            Our AI has analyzed your design files and generated Chicago-optimized print recommendations:
          </p>
          
          {Object.entries(analysisResults).map(([fileName, analysis], index) => (
            <div 
              key={fileName}
              style={{
                marginBottom: index < Object.keys(analysisResults).length - 1 ? '2rem' : 0,
                padding: index > 0 ? '1.5rem 0 0 0' : 0,
                borderTop: index > 0 ? '1px solid #eee' : 'none'
              }}
            >
              <h4 style={{ marginBottom: '0.75rem' }}>{fileName}</h4>
              
              {analysis.fileType === 'Image' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Image Analysis</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Dimensions:</strong>
                        <span>{analysis.dimensions.width} × {analysis.dimensions.height} px</span>
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Closest Standard Size:</strong>
                        <span>{analysis.qualityAssessment.closestStandardSize}</span>
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Estimated Resolution:</strong>
                        <span>{analysis.qualityAssessment.estimatedDpi}</span>
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Resolution Quality:</strong>
                        <span style={{ 
                          color: analysis.qualityAssessment.dpiQuality === 'Excellent' ? '#28a745' : 
                                 analysis.qualityAssessment.dpiQuality === 'Good' ? '#17a2b8' : 
                                 analysis.qualityAssessment.dpiQuality === 'Fair' ? '#ffc107' : '#dc3545'
                        }}>
                          {analysis.qualityAssessment.dpiQuality}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Content Analysis</h5>
                    
                    {analysis.classification && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Detected Content:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {analysis.classification.slice(0, 3).map((item, i) => (
                            <span 
                              key={i}
                              style={{ 
                                backgroundColor: 'var(--light)', 
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              {item.className} 
                              <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#666' }}>
                                ({Math.round(item.probability * 100)}%)
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {analysis.detectedObjects && analysis.detectedObjects.length > 0 && (
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Detected Objects:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {analysis.detectedObjects.slice(0, 5).map((item, i) => (
                            <span 
                              key={i}
                              style={{ 
                                backgroundColor: 'var(--light)', 
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              {item.class}
                              <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: '#666' }}>
                                ({Math.round(item.score * 100)}%)
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Color Analysis</h5>
                    
                    {analysis.colorProfile && (
                      <>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Dominant Colors:</strong>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {analysis.colorProfile.dominantColors.map(([color, percentage], i) => (
                              <div 
                                key={i}
                                style={{ 
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '20px',
                                  fontSize: '0.9rem',
                                  backgroundColor: getColorForName(color),
                                  color: ['white', 'black', 'yellow'].includes(color) ? '#333' : 'white'
                                }}
                              >
                                {color} ({Math.round(percentage)}%)
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span style={{ 
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            backgroundColor: analysis.colorProfile.cmykFriendly ? '#d4edda' : '#fff3cd',
                            color: analysis.colorProfile.cmykFriendly ? '#155724' : '#856404',
                            display: 'inline-block'
                          }}>
                            {analysis.colorProfile.cmykFriendly ? 
                              'CMYK-Friendly Colors' : 
                              'RGB Colors (may need conversion for print)'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Print Recommendations</h5>
                
                {analysis.recommendations && analysis.recommendations.length > 0 ? (
                  <div>
                    {analysis.recommendations.map((recommendation, i) => (
                      <div 
                        key={i}
                        style={{ 
                          padding: '0.75rem', 
                          backgroundColor: recommendation.severity === 'high' ? '#f8d7da' : 
                                          recommendation.severity === 'medium' ? '#fff3cd' : '#d1ecf1',
                          color: recommendation.severity === 'high' ? '#721c24' : 
                                 recommendation.severity === 'medium' ? '#856404' : '#0c5460',
                          borderRadius: '5px',
                          marginBottom: i < analysis.recommendations.length - 1 ? '0.5rem' : 0
                        }}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{recommendation.message}</div>
                        <div>{recommendation.suggestion}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No specific recommendations found for this file.</p>
                )}
              </div>
              
              {analysis.chicagoRecommendations && (
                <div>
                  <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Chicago-Specific Recommendations</h5>
                  
                  {analysis.chicagoRecommendations.length > 0 ? (
                    <div style={{ 
                      padding: '0.75rem', 
                      backgroundColor: '#e9f7fe', 
                      borderRadius: '5px',
                      borderLeft: '4px solid var(--primary)'
                    }}>
                      <ul style={{ 
                        paddingLeft: '1.5rem', 
                        marginBottom: 0,
                        marginTop: 0
                      }}>
                        {analysis.chicagoRecommendations.map((recommendation, i) => (
                          <li key={i}>{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No Chicago-specific recommendations for this file.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <p>Upload your design files to get AI-powered print recommendations</p>
        </div>
      )}
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

// Helper function to convert color names to actual colors for visualization
const getColorForName = (colorName) => {
  const colorMap = {
    red: '#dc3545',
    green: '#28a745',
    blue: '#007bff',
    yellow: '#ffc107',
    cyan: '#17a2b8',
    magenta: '#e83e8c',
    black: '#343a40',
    white: '#f8f9fa',
    gray: '#6c757d'
  };
  
  return colorMap[colorName] || '#6c757d';
};

export default TensorFlowDesignAnalyzer;