import React, { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';

// Set the PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileAnalysis = ({ files }) => {
  const [analyzedFiles, setAnalyzedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (files && files.length > 0) {
      analyzeFiles(files);
    }
  }, [files]);

  const analyzeFiles = async (filesToAnalyze) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const analyzed = [];
    
    for (let i = 0; i < filesToAnalyze.length; i++) {
      const file = filesToAnalyze[i];
      
      // Update progress
      setAnalysisProgress(Math.round((i / filesToAnalyze.length) * 100));
      
      // Enhanced analysis for different file types
      let enhancedMetadata = {};
      
      if (file.type === 'application/pdf') {
        enhancedMetadata = await analyzePdf(file);
      } else if (file.type.startsWith('image/')) {
        enhancedMetadata = await analyzeImage(file);
      } else {
        enhancedMetadata = getDefaultMetadata(file);
      }
      
      // Get basic print problems
      const basicProblems = detectPrintProblems(enhancedMetadata);
      
      // Get advanced print issues
      const advancedIssues = detectAdvancedPrintIssues(file, enhancedMetadata);
      
      // Combine with existing file data
      analyzed.push({
        ...file,
        enhancedMetadata,
        printProblems: basicProblems,
        advancedPrintIssues: advancedIssues
      });
    }
    
    setAnalyzedFiles(analyzed);
    setIsAnalyzing(false);
    setAnalysisProgress(100);
  };
  
  // Enhanced PDF analysis that checks for print issues
  const analyzePdfForPrinting = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      // Get all pages for thorough analysis (limit to first 5 for performance)
      const numPages = pdf.numPages;
      let printIssues = [];
      let hasTransparency = false;
      let hasThinLines = false;
      let fontEmbeddingIssues = [];
      
      for (let i = 1; i <= Math.min(numPages, 5); i++) {
        const page = await pdf.getPage(i);
        const operatorList = await page.getOperatorList();
        
        // Check for transparency
        if (operatorList.fnArray.includes(pdfjs.OPS.setFillAlpha) || 
            operatorList.fnArray.includes(pdfjs.OPS.setStrokeAlpha)) {
          hasTransparency = true;
        }
        
        // Check for thin lines
        const viewport = page.getViewport({ scale: 1.0 });
        // Basic threshold for stroke width operators
        let hasFoundThinLine = false;
        for (let j = 0; j < operatorList.fnArray.length; j++) {
          if (operatorList.fnArray[j] === pdfjs.OPS.setLineWidth) {
            const argIndex = operatorList.argsArray[j][0];
            if (argIndex < 0.25) { // Lines thinner than 0.25pt may cause issues
              hasFoundThinLine = true;
              break;
            }
          }
        }
        
        if (hasFoundThinLine) {
          hasThinLines = true;
        }
        
        // Font embedding check
        const textContent = await page.getTextContent();
        if (textContent.styles) {
          Object.keys(textContent.styles).forEach(fontKey => {
            const font = textContent.styles[fontKey];
            if (font && !font.embedded) {
              fontEmbeddingIssues.push(font.fontFamily || 'Unknown font');
            }
          });
        }
      }
      
      // Calculate a print readiness score
      let printReadinessScore = 100;
      if (hasTransparency) {
        printIssues.push({
          type: 'transparency',
          severity: 'medium',
          message: 'PDF contains transparency which may cause issues during printing',
          suggestion: 'Flatten transparency before printing'
        });
        printReadinessScore -= 20;
      }
      
      if (hasThinLines) {
        printIssues.push({
          type: 'thinLines',
          severity: 'medium',
          message: 'PDF contains very thin lines that may disappear when printed',
          suggestion: 'Increase line weights to at least 0.25pt'
        });
        printReadinessScore -= 15;
      }
      
      if (fontEmbeddingIssues.length > 0) {
        printIssues.push({
          type: 'fonts',
          severity: 'high',
          message: 'Some fonts are not embedded in the PDF',
          suggestion: 'Embed all fonts to ensure consistent appearance'
        });
        printReadinessScore -= fontEmbeddingIssues.length * 10;
      }
      
      return {
        hasTransparency,
        hasThinLines,
        fontEmbeddingIssues: [...new Set(fontEmbeddingIssues)],
        printIssues,
        printReadinessScore: Math.max(0, printReadinessScore)
      };
    } catch (error) {
      console.error('Advanced PDF analysis error:', error);
      return { error: 'Could not perform advanced analysis' };
    }
  };
  
  const analyzePdf = async (file) => {
    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      // Get the first page for analysis
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Get metadata
      const metadata = await pdf.getMetadata();
      
      // Check for fonts and images (simplified)
      const operatorList = await page.getOperatorList();
      const hasImages = operatorList.fnArray.some(fn => 
        fn === pdfjs.OPS.paintImageXObject || 
        fn === pdfjs.OPS.paintJpegXObject
      );
      
      // Color analysis (simplified - actual implementation would be more complex)
      const colorSpace = metadata.info?.ColorSpace || 'Unknown';
      const isRGB = colorSpace.includes('RGB');
      const isCMYK = colorSpace.includes('CMYK');
      
      // Get page dimensions in points (72 points = 1 inch)
      const width = viewport.width;
      const height = viewport.height;
      
      // Chicago-specific print size check (standard letter/tabloid/legal sizes)
      const isStandardSize = isChicagoStandardSize(width, height);
      
      // Run the enhanced print analysis
      const printAnalysis = await analyzePdfForPrinting(file);
      
      return {
        pages: pdf.numPages,
        dimensions: `${Math.round(width)} × ${Math.round(height)} pts`,
        dimensionsInches: `${(width/72).toFixed(2)} × ${(height/72).toFixed(2)} in`,
        colorMode: isCMYK ? 'CMYK' : (isRGB ? 'RGB' : 'Unknown'),
        dpi: estimatePdfDpi(width, height),
        hasImages,
        isStandardSize,
        standardCompliance: isCMYK && hasImages && isStandardSize && !printAnalysis.hasTransparency,
        creator: metadata.info?.Creator || 'Unknown',
        creationDate: metadata.info?.CreationDate || 'Unknown',
        printAnalysis: printAnalysis
      };
    } catch (error) {
      console.error('Error analyzing PDF:', error);
      return getDefaultMetadata(file);
    }
  };
  
  const analyzeImage = async (file) => {
    return new Promise((resolve) => {
      // Check if file is valid
      if (!file || typeof file !== 'object' || !(file instanceof Blob)) {
        console.error('Invalid file provided to analyzeImage:', file);
        return resolve(getDefaultMetadata(file));
      }
      
      const img = new Image();
      let objectUrl = null;
      
      try {
        objectUrl = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating object URL:', error);
        return resolve(getDefaultMetadata(file));
      }
      
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        
        // Estimate DPI (simplified)
        const estimatedDpi = estimateImageDpi(width, height);
        
        // Color analysis (simplified - in a real app would use canvas to analyze pixels)
        const isHighRes = estimatedDpi >= 300;
        const isStandardSize = isChicagoStandardSize(width * 72 / estimatedDpi, height * 72 / estimatedDpi);
        
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        
        resolve({
          dimensions: `${width} × ${height} px`,
          dimensionsInches: `${(width/estimatedDpi).toFixed(2)} × ${(height/estimatedDpi).toFixed(2)} in`,
          colorMode: file.type === 'image/png' ? 'RGB' : (file.type === 'image/cmyk' ? 'CMYK' : 'RGB'),
          dpi: `${estimatedDpi} DPI (estimated)`,
          pages: 1,
          hasAlpha: file.type === 'image/png', // PNG supports alpha
          isStandardSize,
          standardCompliance: isHighRes && isStandardSize,
        });
      };
      
      img.onerror = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        resolve(getDefaultMetadata(file));
      };
      
      img.src = objectUrl;
    });
  };
  
  const getDefaultMetadata = (file) => {
    return {
      dimensions: 'N/A',
      dimensionsInches: 'N/A',
      colorMode: 'N/A',
      dpi: 'N/A',
      pages: 1,
      standardCompliance: false,
    };
  };
  
  // Chicago-specific print size check
  const isChicagoStandardSize = (width, height) => {
    // Standard sizes in points (72 points = 1 inch)
    const standardSizes = [
      [612, 792],   // Letter (8.5 × 11 in)
      [792, 612],   // Letter landscape
      [612, 1008],  // Legal (8.5 × 14 in)
      [1008, 612],  // Legal landscape
      [792, 1224],  // Tabloid (11 × 17 in)
      [1224, 792],  // Tabloid landscape
      [612, 936],   // Chicago standard marketing (8.5 × 13 in)
      [936, 612]    // Chicago standard marketing landscape
    ];
    
    // Check if dimensions match a standard size, with some tolerance
    const tolerance = 10; // points
    return standardSizes.some(([w, h]) => 
      Math.abs(width - w) <= tolerance && Math.abs(height - h) <= tolerance
    );
  };
  
  // Estimate PDF DPI
  const estimatePdfDpi = (width, height) => {
    // For PDFs, we estimate based on page size and assume standard DPI values
    const area = width * height;
    
    if (area > 1000000) return '300 DPI (estimated)';
    if (area > 500000) return '200 DPI (estimated)';
    return '150 DPI (estimated)';
  };
  
  // Estimate image DPI
  const estimateImageDpi = (width, height) => {
    // Simplified estimation assuming standard sizes
    const area = width * height;
    
    if (area > 8000000) return 300;
    if (area > 3000000) return 200;
    if (area > 1000000) return 150;
    return 72;
  };
  
  // Advanced Print Issue Detection
  const detectAdvancedPrintIssues = (file, metadata) => {
    const issues = [];
    
    // Check file type-specific issues
    if (file.type.includes('image')) {
      // Check image resolution for print
      const dimensions = metadata.dimensions?.match(/(\d+) × (\d+)/);
      if (dimensions) {
        const [_, width, height] = dimensions;
        const pixels = width * height;
        
        // For common print sizes, check if resolution is sufficient
        if (pixels < 1000000) { // Less than ~1MP
          issues.push({
            type: 'resolution',
            severity: 'high',
            message: 'Image resolution is too low for quality printing above 3x5 inches',
            recommendation: 'Use higher resolution images (minimum 300 DPI at print size)'
          });
        }
      }
      
      // Check for common problematic color modes
      if (metadata.colorMode === 'RGB' && file.name.toLowerCase().includes('cmyk')) {
        issues.push({
          type: 'colorMismatch',
          severity: 'medium',
          message: 'Filename suggests CMYK but file is actually RGB',
          recommendation: 'Verify color space requirements with your print provider'
        });
      }
    } else if (file.type === 'application/pdf' && metadata.printAnalysis) {
      // Add any PDF-specific issues from the advanced analysis
      if (metadata.printAnalysis.printIssues) {
        issues.push(...metadata.printAnalysis.printIssues);
      }
    }
    
    // File size issues
    if (file.size > 100 * 1024 * 1024) { // 100MB
      issues.push({
        type: 'fileSize',
        severity: 'medium',
        message: 'File is very large which may cause processing delays',
        recommendation: 'Consider optimizing file size if possible'
      });
    }
    
    return issues;
  };

  // Detect print problems
  const detectPrintProblems = (metadata) => {
    const problems = [];
    
    // Check color mode
    if (metadata.colorMode === 'RGB') {
      problems.push({
        type: 'color',
        severity: 'warning',
        message: 'RGB color mode detected. CMYK is recommended for professional printing.',
        fixable: true
      });
    }
    
    // Check resolution
    if (metadata.dpi && metadata.dpi.includes('DPI')) {
      const dpiValue = parseInt(metadata.dpi);
      if (dpiValue < 300) {
        problems.push({
          type: 'resolution',
          severity: 'warning',
          message: `Low resolution (${metadata.dpi}). 300 DPI or higher is recommended for quality printing.`,
          fixable: false
        });
      }
    }
    
    // Check for standard size
    if (!metadata.isStandardSize) {
      problems.push({
        type: 'dimensions',
        severity: 'info',
        message: 'Non-standard dimensions may require custom handling by the printer.',
        fixable: false
      });
    }
    
    return problems;
  };
  
  // Chicago-specific print recommendations
  const getChicagoPrintRecommendations = (file) => {
    if (!file.enhancedMetadata) return [];
    
    const recommendations = [];
    
    // Add Chicago-specific recommendations
    if (file.enhancedMetadata.colorMode === 'RGB') {
      recommendations.push('Chicago print shops typically prefer CMYK color space for consistent color reproduction.');
    }
    
    // Check file size for Chicago print shop capabilities
    if (file.size > 100 * 1024 * 1024) { // 100MB
      recommendations.push('Large file sizes may cause processing delays at some Chicago print locations. Consider file optimization.');
    }
    
    return recommendations;
  };

  if (!files || files.length === 0) return null;
  
  // Use analyzed files if available, otherwise use original files
  const displayFiles = analyzedFiles.length > 0 ? analyzedFiles : files;

  return (
    <div className="card">
      <h3 className="card-title">
        File Analysis 
        {isAnalyzing && (
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px', overflow: 'hidden', marginRight: '0.5rem' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${analysisProgress}%`, 
                    backgroundColor: 'var(--primary)',
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
              <span>{analysisProgress}%</span>
            </div>
          </div>
        )}
      </h3>
      
      {displayFiles.map((file, index) => {
        const metadata = file.enhancedMetadata || file.metadata || {};
        const problems = file.printProblems || [];
        const recommendations = getChicagoPrintRecommendations(file);
        
        return (
          <div 
            key={index} 
            style={{ 
              marginBottom: index < displayFiles.length - 1 ? '1.5rem' : 0,
              padding: index > 0 ? '1.5rem 0 0 0' : 0,
              borderTop: index > 0 ? '1px solid #eee' : 'none'
            }}
          >
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <div style={{ marginRight: '1rem', width: '100px', height: '100px', overflow: 'hidden', borderRadius: '5px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {file.type && file.type.includes('image') ? (
                  <img src={file.preview} alt={file.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : file.type === 'application/pdf' ? (
                  <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: '#dc3545' }}></i>
                ) : (
                  <i className="fas fa-file-alt" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '0.5rem' }}>{file.name}</h4>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type ? file.type.split('/')[1].toUpperCase() : 'Unknown'}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Technical Specifications</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {metadata.dimensions !== 'N/A' && (
                  <div>
                    <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Dimensions:</span>
                    <span>{metadata.dimensions}</span>
                  </div>
                )}
                {metadata.dimensionsInches && (
                  <div>
                    <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Size (inches):</span>
                    <span>{metadata.dimensionsInches}</span>
                  </div>
                )}
                {metadata.colorMode !== 'N/A' && (
                  <div>
                    <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Color Mode:</span>
                    <span>{metadata.colorMode}</span>
                  </div>
                )}
                {metadata.dpi !== 'N/A' && (
                  <div>
                    <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Resolution:</span>
                    <span>{metadata.dpi}</span>
                  </div>
                )}
                <div>
                  <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Pages:</span>
                  <span>{metadata.pages || 1}</span>
                </div>
                {metadata.creator && (
                  <div>
                    <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Creator:</span>
                    <span>{metadata.creator}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h5 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Chicago Print Readiness</h5>
              
              {problems.length === 0 && (!file.advancedPrintIssues || file.advancedPrintIssues.length === 0) ? (
                <div style={{ padding: '0.75rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
                  <span>This file meets Chicago print production standards</span>
                </div>
              ) : (
                <div>
                  <div style={{ padding: '0.75rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '5px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
                    <span>This file may require adjustments for optimal printing in Chicago</span>
                  </div>
                  
                  <div style={{ fontSize: '0.9rem' }}>
                    <p style={{ marginBottom: '0.5rem' }}>Potential issues:</p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                      {problems.map((problem, i) => (
                        <li key={`basic-${i}`}>
                          {problem.message}
                          {problem.fixable && (
                            <button className="btn btn-sm" style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                              Fix
                            </button>
                          )}
                        </li>
                      ))}
                      
                      {file.advancedPrintIssues && file.advancedPrintIssues.map((issue, i) => (
                        <li key={`advanced-${i}`} style={{
                          padding: '0.5rem',
                          margin: '0.5rem 0',
                          backgroundColor: issue.severity === 'high' ? '#ffeaec' : 
                                          issue.severity === 'medium' ? '#fff9e6' : '#e6f7ff',
                          borderRadius: '4px'
                        }}>
                          <div style={{ fontWeight: 'bold', color: 
                            issue.severity === 'high' ? '#dc3545' : 
                            issue.severity === 'medium' ? '#ffc107' : '#17a2b8' 
                          }}>
                            {issue.message}
                          </div>
                          {issue.recommendation && (
                            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                              Recommendation: {issue.recommendation}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {recommendations.length > 0 && (
                    <div style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                      <p style={{ marginBottom: '0.5rem' }}>Chicago-specific recommendations:</p>
                      <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                        {recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button className="btn" style={{ marginTop: '0.5rem' }}>
                    Auto-Fix Issues
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileAnalysis;