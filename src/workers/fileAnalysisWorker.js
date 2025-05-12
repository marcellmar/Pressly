/* File Analysis Worker
 * This web worker performs intensive file analysis operations off the main thread
 * to prevent UI freezing during complex calculations.
 */

self.onmessage = function(e) {
  const { file, fileType, fileData } = e.data;
  
  // Analyze file based on type
  let results;
  
  try {
    if (fileType.includes('image')) {
      results = analyzeImageFile(file, fileData);
    } else if (fileType.includes('pdf')) {
      results = analyzePdfFile(file, fileData);
    } else {
      results = analyzeGenericFile(file, fileData);
    }
    
    // Add print readiness score
    results.printReadiness = calculatePrintReadiness(results);
    
    // Return results to main thread
    self.postMessage({
      success: true,
      results: results
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message || 'Unknown error during file analysis'
    });
  }
};

function analyzeImageFile(file, data) {
  // Parse basic file properties
  const fileInfo = {
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    type: file.type
  };
  
  // If we have image data, analyze pixels
  if (data && data.width && data.height) {
    return {
      ...fileInfo,
      dimensions: {
        width: data.width,
        height: data.height,
        aspectRatio: (data.width / data.height).toFixed(2)
      },
      resolution: {
        totalPixels: data.width * data.height,
        megapixels: (data.width * data.height / 1000000).toFixed(2),
        estimatedDpi: estimateImageDpi(data.width, data.height)
      },
      printCapabilities: {
        maxSize: calculateMaxPrintSize(data.width, data.height),
        recommendedSize: calculateRecommendedPrintSize(data.width, data.height)
      },
      fileAnalysis: {
        fileSize: formatFileSize(file.size),
        compressionRatio: estimateCompressionRatio(file.size, data.width, data.height)
      }
    };
  }
  
  // If no image data is provided, return basic info
  return {
    ...fileInfo,
    dimensions: 'Unknown',
    printCapabilities: 'Unknown'
  };
}

function analyzePdfFile(file, data) {
  // Basic PDF analysis without actual PDF data
  const fileInfo = {
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    type: file.type
  };
  
  return {
    ...fileInfo,
    fileAnalysis: {
      fileSize: formatFileSize(file.size),
      estimatedPageCount: estimatePdfPageCount(file.size)
    },
    printReadiness: {
      isPrintReady: file.size > 10000, // Assume very small PDFs might have issues
      potentialIssues: detectPotentialPdfIssues(file)
    }
  };
}

function analyzeGenericFile(file) {
  // Generic file analysis for any file type
  return {
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    type: file.type,
    fileAnalysis: {
      fileSize: formatFileSize(file.size),
      fileExtension: getFileExtension(file.name),
      isCompressed: isCompressedFile(file.name),
    }
  };
}

// Helper functions
function estimateImageDpi(width, height) {
  // Simplified DPI estimation based on image dimensions
  const area = width * height;
  
  if (area > 20000000) return 300; // Very high res
  if (area > 8000000) return 240;
  if (area > 3000000) return 150;
  if (area > 1000000) return 96;
  return 72; // Low res
}

function calculateMaxPrintSize(width, height) {
  // Calculate max print size at 150 DPI (minimum acceptable quality)
  const widthInches = width / 150;
  const heightInches = height / 150;
  
  return {
    width: widthInches.toFixed(1),
    height: heightInches.toFixed(1),
    description: `${widthInches.toFixed(1)}″ × ${heightInches.toFixed(1)}″ at 150 DPI`
  };
}

function calculateRecommendedPrintSize(width, height) {
  // Calculate recommended print size at 300 DPI (good quality)
  const widthInches = width / 300;
  const heightInches = height / 300;
  
  return {
    width: widthInches.toFixed(1),
    height: heightInches.toFixed(1),
    description: `${widthInches.toFixed(1)}″ × ${heightInches.toFixed(1)}″ at 300 DPI`
  };
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

function estimateCompressionRatio(fileSize, width, height) {
  // Estimate compression ratio compared to raw bitmap
  const rawSize = width * height * 3; // 3 bytes per pixel (RGB)
  const ratio = rawSize / fileSize;
  
  return {
    ratio: ratio.toFixed(1),
    efficiency: ratio > 10 ? 'High' : ratio > 5 ? 'Medium' : 'Low'
  };
}

function estimatePdfPageCount(fileSize) {
  // Rough estimate based on file size
  // Average PDF page is about 100KB
  return Math.max(1, Math.round(fileSize / (100 * 1024)));
}

function detectPotentialPdfIssues(file) {
  const issues = [];
  
  // File size checks
  if (file.size > 10 * 1024 * 1024) {
    issues.push({
      type: 'size',
      severity: 'medium',
      message: 'Large PDF file may cause processing delays',
      recommendation: 'Consider optimizing the PDF size if possible'
    });
  } else if (file.size < 10000) {
    issues.push({
      type: 'size',
      severity: 'medium',
      message: 'Very small PDF file may be incomplete or corrupted',
      recommendation: 'Verify the PDF content is complete'
    });
  }
  
  // Filename checks
  if (file.name.toLowerCase().includes('scan')) {
    issues.push({
      type: 'scan',
      severity: 'low',
      message: 'Scanned PDF detected',
      recommendation: 'Ensure text is properly recognized for best print quality'
    });
  }
  
  return issues;
}

function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

function isCompressedFile(filename) {
  const compressedExtensions = ['zip', 'rar', 'gz', '7z', 'tar', 'bz2'];
  const ext = getFileExtension(filename);
  return compressedExtensions.includes(ext);
}

function calculatePrintReadiness(results) {
  let score = 100;
  const issues = [];
  
  // For images
  if (results.resolution) {
    const megapixels = parseFloat(results.resolution.megapixels);
    
    if (megapixels < 1) {
      score -= 30;
      issues.push({
        type: 'resolution',
        severity: 'high',
        message: 'Low resolution - may appear pixelated when printed larger than 4×6″',
        recommendation: 'Use a higher resolution image for better print quality'
      });
    } else if (megapixels < 3) {
      score -= 15;
      issues.push({
        type: 'resolution',
        severity: 'medium',
        message: 'Medium resolution - suitable for small to medium prints',
        recommendation: 'Consider using a higher resolution for large prints'
      });
    }
    
    // Check aspect ratio for standard print sizes
    const aspectRatio = parseFloat(results.dimensions.aspectRatio);
    const standardRatios = [
      { ratio: 1.5, name: '6×4' },     // 3:2
      { ratio: 1.4, name: '7×5' },     // 7:5
      { ratio: 1.25, name: '10×8' },   // 5:4
      { ratio: 1.33, name: 'Letter' }, // 11×8.5
      { ratio: 1, name: 'Square' }     // 1:1
    ];
    
    let matchesStandard = false;
    for (const std of standardRatios) {
      if (Math.abs(aspectRatio - std.ratio) < 0.1 || Math.abs(1/aspectRatio - std.ratio) < 0.1) {
        matchesStandard = true;
        break;
      }
    }
    
    if (!matchesStandard) {
      score -= 10;
      issues.push({
        type: 'aspectRatio',
        severity: 'low',
        message: 'Non-standard aspect ratio - may require cropping for standard print sizes',
        recommendation: 'Consider cropping to a standard aspect ratio before printing'
      });
    }
  }
  
  // For PDFs
  if (results.printReadiness && results.printReadiness.potentialIssues) {
    issues.push(...results.printReadiness.potentialIssues);
    score -= results.printReadiness.potentialIssues.length * 5;
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    rating: score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Poor',
    issues
  };
}