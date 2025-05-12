/* Image Analysis Worker
 * This web worker performs intensive image analysis operations off the main thread
 * to prevent UI freezing during complex calculations.
 */

self.onmessage = function(e) {
  const { imageData, width, height } = e.data;
  
  // Perform computationally intensive analysis
  const results = analyzeImageData(imageData, width, height);
  
  self.postMessage(results);
};

function analyzeImageData(data, width, height) {
  // Color analysis
  const colorDistribution = getColorDistribution(data);
  
  // Edge detection for graphics quality
  const edges = detectEdges(data, width, height);
  
  // Resolution analysis
  const resolutionQuality = analyzeResolution(width, height);
  
  return {
    colorDistribution,
    edges,
    resolutionQuality,
    printReadiness: calculatePrintReadiness(colorDistribution, edges, width, height)
  };
}

function getColorDistribution(data) {
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
}

function detectEdges(data, width, height) {
  // A simple Sobel edge detection algorithm
  const grayscale = new Uint8Array(width * height);
  
  // Convert to grayscale
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    grayscale[j] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
  }
  
  // Apply Sobel operators
  const edges = new Uint8Array(width * height);
  const threshold = 50; // Edge detection threshold
  let edgeCount = 0;
  let totalPixels = 0;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      
      // Apply horizontal Sobel
      const gx = 
        -1 * grayscale[idx - width - 1] +
        -2 * grayscale[idx - 1] +
        -1 * grayscale[idx + width - 1] +
        1 * grayscale[idx - width + 1] +
        2 * grayscale[idx + 1] +
        1 * grayscale[idx + width + 1];
      
      // Apply vertical Sobel
      const gy = 
        -1 * grayscale[idx - width - 1] +
        -2 * grayscale[idx - width] +
        -1 * grayscale[idx - width + 1] +
        1 * grayscale[idx + width - 1] +
        2 * grayscale[idx + width] +
        1 * grayscale[idx + width + 1];
      
      // Calculate gradient magnitude
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      
      // Apply threshold
      if (magnitude > threshold) {
        edges[idx] = 255;
        edgeCount++;
      } else {
        edges[idx] = 0;
      }
      
      totalPixels++;
    }
  }
  
  return {
    edgePercentage: (edgeCount / totalPixels) * 100,
    sharpnessScore: Math.min(100, (edgeCount / totalPixels) * 500) // Scale to 0-100
  };
}

function analyzeResolution(width, height) {
  const pixelCount = width * height;
  
  // Define thresholds for print quality
  const excellent = 20000000; // 20MP
  const good = 8000000;      // 8MP
  const adequate = 2000000;  // 2MP
  const poor = 500000;       // 0.5MP
  
  let quality = 'Unknown';
  let score = 0;
  
  if (pixelCount >= excellent) {
    quality = 'Excellent';
    score = 100;
  } else if (pixelCount >= good) {
    quality = 'Good';
    score = 80;
  } else if (pixelCount >= adequate) {
    quality = 'Adequate';
    score = 60;
  } else if (pixelCount >= poor) {
    quality = 'Poor';
    score = 30;
  } else {
    quality = 'Very Poor';
    score = 10;
  }
  
  return {
    pixelCount,
    quality,
    score,
    recommendedMaxPrintSize: calculateMaxPrintSize(width, height)
  };
}

function calculateMaxPrintSize(width, height) {
  // Calculate based on 300 DPI for quality printing
  const widthInches = width / 300;
  const heightInches = height / 300;
  
  return {
    width: widthInches.toFixed(1),
    height: heightInches.toFixed(1),
    description: `${widthInches.toFixed(1)}″ × ${heightInches.toFixed(1)}″ at 300 DPI`
  };
}

function calculatePrintReadiness(colorDistribution, edges, width, height) {
  let score = 100;
  const issues = [];
  
  // Check image resolution
  const pixelCount = width * height;
  if (pixelCount < 2000000) {
    score -= 30;
    issues.push("Low resolution - may appear pixelated when printed larger than 4×6″");
  } else if (pixelCount < 8000000) {
    score -= 10;
    issues.push("Medium resolution - suitable for small to medium prints");
  }
  
  // Check color gamut issues
  if (colorDistribution.outOfGamut > 10) {
    score -= 20;
    issues.push("Contains out-of-gamut colors - may not reproduce accurately in print");
  }
  
  // Check edge sharpness
  if (edges.sharpnessScore < 30) {
    score -= 15;
    issues.push("Low edge definition - may appear blurry when printed");
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    recommendation: getRecommendationFromScore(score)
  };
}

function getRecommendationFromScore(score) {
  if (score >= 90) {
    return "Excellent for printing - no adjustments needed";
  } else if (score >= 70) {
    return "Good for printing - minor adjustments recommended";
  } else if (score >= 50) {
    return "Acceptable for printing - consider improvements";
  } else {
    return "Not recommended for quality printing - significant improvements needed";
  }
}
