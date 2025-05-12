/**
 * PDFAnalysisService.js
 * 
 * A service for analyzing PDF files, extracting metadata, and determining
 * printing requirements for the Pressly platform.
 * 
 * This service uses PDF.js to extract information about PDF documents,
 * including:
 * - Basic metadata (title, author, creation date)
 * - Page count and sizes
 * - Font information
 * - Color usage analysis
 * - Image resolution check
 * - Print specifications (bleed, trim, etc.)
 */

import * as pdfjs from 'pdfjs-dist';

// Worker initialization is now handled in PDFWorker.js

/**
 * Analyzes a PDF file and extracts metadata
 * 
 * @param {File|Blob} pdfFile - The PDF file to analyze
 * @returns {Promise<Object>} PDF metadata and analysis results
 */
export const analyzePDF = async (pdfFile) => {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await readFileAsArrayBuffer(pdfFile);
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Basic document metadata
    const metadata = await extractMetadata(pdf);
    
    // Page analysis
    const pageInfo = await analyzePages(pdf);
    
    // Font usage analysis
    const fontInfo = await analyzeFonts(pdf);
    
    // Color usage analysis
    const colorInfo = await analyzeColorUsage(pdf);
    
    // Image analysis
    const imageInfo = await analyzeImages(pdf);
    
    // Print specifications
    const printSpecs = analyzePrintSpecifications(metadata, pageInfo);
    
    // Quality assessment
    const qualityIssues = assessQuality(pageInfo, fontInfo, imageInfo);
    
    // Printing requirements
    const printingRequirements = determinePrintingRequirements(pageInfo, colorInfo, imageInfo);
    
    // Combine all analysis results
    return {
      filename: pdfFile.name,
      fileSize: pdfFile.size,
      metadata,
      pageInfo,
      fontInfo,
      colorInfo,
      imageInfo,
      printSpecs,
      qualityIssues,
      printingRequirements,
      standardCompliance: qualityIssues.length === 0, // true if no issues found
      analysisTimestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('PDF analysis failed:', error);
    throw new Error(`PDF analysis failed: ${error.message}`);
  }
};

/**
 * Read a file as ArrayBuffer
 * 
 * @param {File|Blob} file - The file to read
 * @returns {Promise<ArrayBuffer>} File contents as ArrayBuffer
 */
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extract metadata from a PDF document
 * 
 * @param {PDFDocumentProxy} pdf - The PDF.js document
 * @returns {Promise<Object>} Extracted metadata
 */
const extractMetadata = async (pdf) => {
  try {
    // Get the metadata from the PDF
    const metadata = await pdf.getMetadata();
    
    return {
      title: metadata.info?.Title || null,
      author: metadata.info?.Author || null,
      creator: metadata.info?.Creator || null,
      producer: metadata.info?.Producer || null,
      creationDate: metadata.info?.CreationDate 
        ? formatPDFDate(metadata.info.CreationDate)
        : null,
      modificationDate: metadata.info?.ModDate 
        ? formatPDFDate(metadata.info.ModDate)
        : null,
      pageCount: pdf.numPages,
      isEncrypted: !!metadata.info?.IsEncrypted,
      pdfVersion: metadata.info?.PDFVersion || pdf.pdfInfo?.PDFFormatVersion || null,
    };
  } catch (error) {
    console.warn('Failed to extract PDF metadata:', error);
    return {
      title: null,
      author: null,
      creator: null,
      producer: null,
      creationDate: null,
      modificationDate: null,
      pageCount: pdf.numPages,
      isEncrypted: false,
      pdfVersion: null,
    };
  }
};

/**
 * Format a PDF date string into ISO format
 * 
 * @param {string} pdfDate - PDF date string (typically D:YYYYMMDDHHMMSS+HH'MM')
 * @returns {string} ISO date string
 */
const formatPDFDate = (pdfDate) => {
  if (!pdfDate || typeof pdfDate !== 'string') return null;
  
  try {
    // D:YYYYMMDDHHMMSSz format
    if (pdfDate.startsWith('D:')) {
      const year = pdfDate.substring(2, 6);
      const month = pdfDate.substring(6, 8);
      const day = pdfDate.substring(8, 10);
      const hour = pdfDate.substring(10, 12) || '00';
      const minute = pdfDate.substring(12, 14) || '00';
      const second = pdfDate.substring(14, 16) || '00';
      
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    } 
    // Try parsing as is
    return new Date(pdfDate).toISOString();
  } catch (error) {
    console.warn('Failed to parse PDF date:', pdfDate);
    return null;
  }
};

/**
 * Analyze pages in a PDF document
 * 
 * @param {PDFDocumentProxy} pdf - The PDF.js document
 * @returns {Promise<Object>} Page analysis results
 */
const analyzePages = async (pdf) => {
  const pageInfo = {
    count: pdf.numPages,
    sizes: [],
    dimensions: {},
    rotation: [],
    bleedDetected: false,
  };
  
  try {
    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Get size in points (PDF internal units, 1/72 inch)
      const width = viewport.width;
      const height = viewport.height;
      
      // Convert to mm (1 point = 0.352778 mm)
      const widthMm = Math.round(width * 0.352778 * 100) / 100;
      const heightMm = Math.round(height * 0.352778 * 100) / 100;
      
      // Common paper sizes in mm (width × height)
      const commonSizes = {
        'A4': [210, 297],
        'A3': [297, 420],
        'Letter': [215.9, 279.4],
        'Legal': [215.9, 355.6],
        'Tabloid': [279.4, 431.8],
      };
      
      // Try to identify common paper size
      let detectedSize = 'Custom';
      for (const [name, dimensions] of Object.entries(commonSizes)) {
        // Check both portrait and landscape orientations with some tolerance
        const tolerance = 1; // 1mm tolerance
        if ((Math.abs(widthMm - dimensions[0]) <= tolerance && 
             Math.abs(heightMm - dimensions[1]) <= tolerance) ||
            (Math.abs(widthMm - dimensions[1]) <= tolerance && 
             Math.abs(heightMm - dimensions[0]) <= tolerance)) {
          detectedSize = name;
          break;
        }
      }
      
      // Store page information
      pageInfo.sizes.push({
        page: i,
        widthPt: width,
        heightPt: height,
        widthMm,
        heightMm,
        detectedSize,
        orientation: width > height ? 'landscape' : 'portrait'
      });
      
      // Store rotation
      pageInfo.rotation.push({
        page: i,
        rotation: page.rotate || 0,
      });
    }
    
    // Calculate dimensions summary
    const uniqueSizes = new Set(pageInfo.sizes.map(size => 
      `${size.widthMm}x${size.heightMm}`
    ));
    
    pageInfo.dimensions = {
      consistent: uniqueSizes.size === 1,
      uniqueCount: uniqueSizes.size,
      uniqueSizes: Array.from(uniqueSizes),
    };
    
    return pageInfo;
  } catch (error) {
    console.warn('Failed to analyze PDF pages:', error);
    return pageInfo;
  }
};

/**
 * Analyze fonts used in a PDF document
 * 
 * @param {PDFDocumentProxy} pdf - The PDF.js document
 * @returns {Promise<Object>} Font usage analysis
 */
const analyzeFonts = async (pdf) => {
  const fontInfo = {
    embedded: [],
    missing: [],
    summary: {}
  };
  
  try {
    // For each page, extract font info
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const operatorList = await page.getOperatorList();
      
      // Get font data from the operator list
      if (operatorList && operatorList.fnArray && operatorList.fnArray.length > 0) {
        // Font analysis is complex and requires access to internal PDF.js structures
        // This is a simplified approach
        for (const fontId in page.commonObjs.objs) {
          if (fontId.startsWith('g_')) {
            const fontObj = page.commonObjs.objs[fontId];
            if (fontObj && fontObj.data) {
              const isEmbedded = fontObj.data.composite === false || fontObj.data.embedded === true;
              const fontName = fontObj.data.name || fontObj.data.fontName || fontId;
              
              // Store in appropriate array
              const fontData = {
                page: i,
                name: fontName,
                type: fontObj.data.type || 'Unknown',
                subtype: fontObj.data.subtype || 'Unknown',
                encoding: fontObj.data.encoding || 'Unknown',
              };
              
              if (isEmbedded) {
                fontInfo.embedded.push(fontData);
              } else {
                fontInfo.missing.push(fontData);
              }
              
              // Add to summary
              if (!fontInfo.summary[fontName]) {
                fontInfo.summary[fontName] = {
                  name: fontName,
                  isEmbedded,
                  pages: [i],
                };
              } else {
                if (!fontInfo.summary[fontName].pages.includes(i)) {
                  fontInfo.summary[fontName].pages.push(i);
                }
              }
            }
          }
        }
      }
    }
    
    // Calculate overall font statistics
    fontInfo.stats = {
      uniqueFonts: Object.keys(fontInfo.summary).length,
      embeddedCount: fontInfo.embedded.length,
      missingCount: fontInfo.missing.length,
      allFontsEmbedded: fontInfo.missing.length === 0,
    };
    
    return fontInfo;
  } catch (error) {
    console.warn('Failed to analyze PDF fonts:', error);
    return {
      embedded: [],
      missing: [],
      summary: {},
      stats: {
        uniqueFonts: 0,
        embeddedCount: 0,
        missingCount: 0,
        allFontsEmbedded: true,
      }
    };
  }
};

/**
 * Analyze color usage in a PDF document
 * 
 * @param {PDFDocumentProxy} pdf - The PDF.js document
 * @returns {Promise<Object>} Color usage analysis
 */
const analyzeColorUsage = async (pdf) => {
  const colorInfo = {
    colorModel: 'Unknown',
    hasCMYK: false,
    hasRGB: false,
    hasSpot: false,
    hasTransparency: false,
  };
  
  try {
    // Sample pages to determine color model (first, last, and middle page)
    const pagesToSample = [
      1, 
      pdf.numPages,
      Math.floor(pdf.numPages / 2),
    ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    for (const pageNum of pagesToSample) {
      const page = await pdf.getPage(pageNum);
      
      // Check color spaces in resources
      if (page.resources) {
        // Check for color spaces
        const colorSpaces = page.resources.getIdsWithType('ColorSpace');
        
        if (colorSpaces && colorSpaces.length > 0) {
          for (const csId of colorSpaces) {
            const colorSpace = page.resources.get(csId);
            
            if (colorSpace) {
              const csName = colorSpace.name;
              
              if (csName.includes('CMYK')) {
                colorInfo.hasCMYK = true;
              } else if (csName.includes('RGB')) {
                colorInfo.hasRGB = true;
              } else if (csName.includes('Separation')) {
                colorInfo.hasSpot = true;
              }
            }
          }
        }
        
        // Check for patterns (may indicate transparency)
        const patterns = page.resources.getIdsWithType('Pattern');
        if (patterns && patterns.length > 0) {
          colorInfo.hasTransparency = true;
        }
        
        // Check for ExtGState (may indicate transparency)
        const extGStates = page.resources.getIdsWithType('ExtGState');
        if (extGStates && extGStates.length > 0) {
          colorInfo.hasTransparency = true;
        }
      }
    }
    
    // Determine predominant color model
    if (colorInfo.hasCMYK && !colorInfo.hasRGB) {
      colorInfo.colorModel = 'CMYK';
    } else if (colorInfo.hasRGB && !colorInfo.hasCMYK) {
      colorInfo.colorModel = 'RGB';
    } else if (colorInfo.hasCMYK && colorInfo.hasRGB) {
      colorInfo.colorModel = 'Mixed (RGB+CMYK)';
    } else {
      colorInfo.colorModel = 'Grayscale/Unknown';
    }
    
    // Determine printing implications
    colorInfo.printingImplications = {
      requiresColorPrinting: colorInfo.hasCMYK || colorInfo.hasRGB,
      requiresProfessionalPrinting: colorInfo.hasCMYK || colorInfo.hasSpot,
      mayHaveColorShiftIssues: colorInfo.colorModel === 'Mixed (RGB+CMYK)',
      needsTransparencyFlattening: colorInfo.hasTransparency,
    };
    
    return colorInfo;
  } catch (error) {
    console.warn('Failed to analyze PDF color usage:', error);
    return {
      colorModel: 'Unknown',
      hasCMYK: false,
      hasRGB: false,
      hasSpot: false,
      hasTransparency: false,
      printingImplications: {
        requiresColorPrinting: false,
        requiresProfessionalPrinting: false,
        mayHaveColorShiftIssues: false,
        needsTransparencyFlattening: false,
      }
    };
  }
};

/**
 * Analyze images in a PDF document
 * 
 * @param {PDFDocumentProxy} pdf - The PDF.js document
 * @returns {Promise<Object>} Image analysis results
 */
const analyzeImages = async (pdf) => {
  const imageInfo = {
    count: 0,
    highestDPI: 0,
    lowestDPI: Infinity,
    hasLowResImages: false,
    pages: [],
  };
  
  try {
    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const pageImages = [];
      
      // Get operatorList to check for images
      const operatorList = await page.getOperatorList();
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Check for images in the page
      if (operatorList.fnArray && operatorList.fnArray.length > 0) {
        let imgCount = 0;
        
        // Parse through all operations to find images
        for (let j = 0; j < operatorList.fnArray.length; j++) {
          // Check if this is a "paintImageXObject" operator
          const fnId = operatorList.fnArray[j];
          if (fnId === pdfjs.OPS.paintImageXObject) {
            const imageId = operatorList.argsArray[j][0]; // Get the image ID
            imgCount++;
            
            // Try to get image properties from resources
            if (page.objs && page.objs.get(imageId)) {
              const img = page.objs.get(imageId);
              
              if (img) {
                // Calculate DPI based on image dimensions and viewport
                const widthPts = img.width / img.xscale;
                const heightPts = img.height / img.yscale;
                
                // Convert to inches (1 pt = 1/72 inch)
                const widthInches = widthPts / 72;
                const heightInches = heightPts / 72;
                
                // Calculate DPI
                const dpiX = img.width / widthInches;
                const dpiY = img.height / heightInches;
                const dpi = Math.min(dpiX, dpiY); // Use the lower value
                
                pageImages.push({
                  id: imageId,
                  width: img.width,
                  height: img.height,
                  bitsPerComponent: img.bpc || 8,
                  colorSpace: img.colorSpace?.name || 'Unknown',
                  dpi: Math.round(dpi),
                  isLowRes: dpi < 300, // Common threshold for print quality
                });
                
                // Update overall stats
                imageInfo.highestDPI = Math.max(imageInfo.highestDPI, dpi);
                imageInfo.lowestDPI = Math.min(imageInfo.lowestDPI, dpi);
                
                if (dpi < 300) {
                  imageInfo.hasLowResImages = true;
                }
              }
            }
          }
        }
        
        if (imgCount > 0) {
          imageInfo.count += imgCount;
          imageInfo.pages.push({
            page: i,
            imageCount: imgCount,
            images: pageImages,
          });
        }
      }
    }
    
    // If no images found, reset lowestDPI
    if (imageInfo.lowestDPI === Infinity) {
      imageInfo.lowestDPI = 0;
    }
    
    // Calculate image quality statistics
    imageInfo.stats = {
      totalImages: imageInfo.count,
      averageDPI: imageInfo.count > 0 
        ? Math.round((imageInfo.highestDPI + imageInfo.lowestDPI) / 2) 
        : 0,
      suitableForPrinting: !imageInfo.hasLowResImages || imageInfo.lowestDPI >= 200,
      recommendedPrintMethod: imageInfo.lowestDPI >= 300 
        ? 'High quality offset printing' 
        : imageInfo.lowestDPI >= 200 
          ? 'Digital printing' 
          : 'Screen display only',
    };
    
    return imageInfo;
  } catch (error) {
    console.warn('Failed to analyze PDF images:', error);
    return {
      count: 0,
      highestDPI: 0,
      lowestDPI: 0,
      hasLowResImages: false,
      pages: [],
      stats: {
        totalImages: 0,
        averageDPI: 0,
        suitableForPrinting: true,
        recommendedPrintMethod: 'Digital printing',
      }
    };
  }
};

/**
 * Analyze print specifications from metadata and page info
 * 
 * @param {Object} metadata - PDF metadata
 * @param {Object} pageInfo - Page analysis results
 * @returns {Object} Print specifications
 */
const analyzePrintSpecifications = (metadata, pageInfo) => {
  // Initialize print specifications
  const printSpecs = {
    hasBleed: false,
    hasCropMarks: false,
    hasRegistrationMarks: false,
    hasTrimBox: false,
    isPressSready: false,
    standardSize: true,
    recommendedPaperSize: 'Unknown',
  };
  
  try {
    // Check if all pages have the same size
    if (pageInfo.dimensions.consistent) {
      // Get the first page size
      const firstPage = pageInfo.sizes[0];
      
      // Determine standard or custom size
      if (firstPage.detectedSize !== 'Custom') {
        printSpecs.recommendedPaperSize = firstPage.detectedSize;
      } else {
        printSpecs.standardSize = false;
        printSpecs.recommendedPaperSize = 'Custom';
      }
      
      // For now, we'll use basic heuristics to detect bleed, etc.
      // This would be more accurate with access to PDF boxes (TrimBox, BleedBox, etc.)
      // which requires more detailed parsing of the PDF structures
      
      // Check for likely bleed based on dimensions
      // Most standard sizes are in whole mm numbers
      // If dimensions have fractional mm, it might indicate bleed
      const hasFractionalDimensions = pageInfo.sizes.some(size => 
        Math.round(size.widthMm) !== size.widthMm || 
        Math.round(size.heightMm) !== size.heightMm
      );
      
      // Check for non-standard size that's slightly larger than standard
      // which may indicate bleed
      const isSlightlyLargerThanStandard = pageInfo.sizes.some(size => {
        // Common bleed is 3mm
        const bleedTolerance = 3.5; // Use 3.5mm to allow for rounding
        
        // Check if size is slightly larger than standard sizes
        for (const stdSize of [
          [210, 297], // A4
          [297, 420], // A3
          [215.9, 279.4], // Letter
          [215.9, 355.6], // Legal
          [279.4, 431.8], // Tabloid
        ]) {
          // Check both orientations
          if ((Math.abs(size.widthMm - (stdSize[0] + bleedTolerance)) <= 1 && 
               Math.abs(size.heightMm - (stdSize[1] + bleedTolerance)) <= 1) ||
              (Math.abs(size.widthMm - (stdSize[1] + bleedTolerance)) <= 1 && 
               Math.abs(size.heightMm - (stdSize[0] + bleedTolerance)) <= 1)) {
            return true;
          }
        }
        return false;
      });
      
      printSpecs.hasBleed = hasFractionalDimensions || isSlightlyLargerThanStandard;
      
      // Set press-ready flag based on multiple factors
      printSpecs.isPressSready = 
        printSpecs.hasBleed && 
        !pageInfo.rotation.some(page => page.rotation !== 0) && // No rotated pages
        metadata.creator?.includes('Adobe InDesign') || // Created in professional software
        metadata.creator?.includes('Affinity') ||
        metadata.creator?.includes('QuarkXPress');
    } else {
      // Pages have inconsistent sizes
      printSpecs.standardSize = false;
      printSpecs.recommendedPaperSize = 'Multiple sizes - custom printing required';
    }
    
    return printSpecs;
  } catch (error) {
    console.warn('Failed to analyze print specifications:', error);
    return printSpecs;
  }
};

/**
 * Assess quality issues in the PDF
 * 
 * @param {Object} pageInfo - Page analysis results
 * @param {Object} fontInfo - Font analysis results
 * @param {Object} imageInfo - Image analysis results
 * @returns {Array} Array of quality issues
 */
const assessQuality = (pageInfo, fontInfo, imageInfo) => {
  const issues = [];
  
  // Page issues
  if (!pageInfo.dimensions.consistent) {
    issues.push({
      type: 'PAGE_SIZE',
      severity: 'high',
      message: 'Inconsistent page sizes detected',
      details: `${pageInfo.dimensions.uniqueCount} different page sizes found`,
    });
  }
  
  if (pageInfo.rotation.some(page => page.rotation !== 0)) {
    issues.push({
      type: 'PAGE_ROTATION',
      severity: 'medium',
      message: 'Rotated pages detected',
      details: 'Some pages have non-standard rotation values',
    });
  }
  
  // Font issues
  if (!fontInfo.stats.allFontsEmbedded && fontInfo.missing.length > 0) {
    issues.push({
      type: 'MISSING_FONTS',
      severity: 'high',
      message: 'Non-embedded fonts detected',
      details: `${fontInfo.missing.length} font references without embedded font data`,
    });
  }
  
  // Image issues
  if (imageInfo.hasLowResImages) {
    issues.push({
      type: 'LOW_RES_IMAGES',
      severity: 'high',
      message: 'Low resolution images detected',
      details: `Lowest image resolution is ${Math.round(imageInfo.lowestDPI)} DPI, which is below the recommended 300 DPI for printing`,
    });
  }
  
  return issues;
};

/**
 * Determine printing requirements based on PDF analysis
 * 
 * @param {Object} pageInfo - Page analysis results
 * @param {Object} colorInfo - Color analysis results
 * @param {Object} imageInfo - Image analysis results
 * @returns {Object} Printing requirements
 */
const determinePrintingRequirements = (pageInfo, colorInfo, imageInfo) => {
  const requirements = {
    paperSize: 'Standard',
    paperType: 'Standard',
    printingMethod: 'Digital',
    colorMode: 'Color',
    finishingOptions: [],
    productionComplexity: 'Low',
  };
  
  // Determine paper size
  if (!pageInfo.dimensions.consistent) {
    requirements.paperSize = 'Custom - Multiple Sizes';
    requirements.productionComplexity = 'High';
  } else if (pageInfo.sizes[0].detectedSize === 'Custom') {
    requirements.paperSize = 'Custom';
    requirements.productionComplexity = 'Medium';
  } else {
    requirements.paperSize = pageInfo.sizes[0].detectedSize;
  }
  
  // Determine printing method based on color model and image quality
  if (colorInfo.hasCMYK || colorInfo.hasSpot) {
    // CMYK or spot colors typically require offset printing for best results
    requirements.printingMethod = 'Offset';
    requirements.productionComplexity = Math.max(
      requirements.productionComplexity === 'Low' ? 1 : 
      requirements.productionComplexity === 'Medium' ? 2 : 3,
      2 // At least Medium complexity
    );
  } else if (imageInfo.lowestDPI < 200) {
    // Low-res images indicate screen-only content
    requirements.printingMethod = 'Digital - Low Quality';
  } else if (imageInfo.lowestDPI >= 300) {
    // High-res images can benefit from higher quality printing
    requirements.printingMethod = 'High-Quality Digital';
  }
  
  // Determine color mode
  if (colorInfo.colorModel === 'CMYK' || colorInfo.colorModel === 'Mixed (RGB+CMYK)') {
    requirements.colorMode = 'CMYK';
  } else if (colorInfo.colorModel === 'RGB') {
    requirements.colorMode = 'RGB to CMYK conversion required';
  } else {
    requirements.colorMode = 'Grayscale/B&W';
  }
  
  // Determine paper type based on content
  if (colorInfo.hasCMYK && imageInfo.count > 0) {
    requirements.paperType = 'Coated - High Quality';
  } else if (colorInfo.hasRGB && imageInfo.count > 0) {
    requirements.paperType = 'Coated - Standard';
  }
  
  // Add complexity for special color considerations
  if (colorInfo.hasSpot) {
    requirements.finishingOptions.push('Spot Color Processing');
    requirements.productionComplexity = 'High';
  }
  
  if (colorInfo.hasTransparency) {
    requirements.finishingOptions.push('Transparency Flattening');
    requirements.productionComplexity = Math.max(
      requirements.productionComplexity === 'Low' ? 1 : 
      requirements.productionComplexity === 'Medium' ? 2 : 3,
      2 // At least Medium complexity
    );
  }
  
  // Convert production complexity back to string
  requirements.productionComplexity = [
    'Low', 'Medium', 'High'
  ][Math.min(
    requirements.productionComplexity === 'Low' ? 0 : 
    requirements.productionComplexity === 'Medium' ? 1 : 2,
    2
  )];
  
  return requirements;
};

/**
 * Generate a summary of the PDF analysis
 * 
 * @param {Object} analysis - The complete PDF analysis
 * @returns {Object} Simplified summary for display
 */
export const generatePDFSummary = (analysis) => {
  if (!analysis) return null;
  
  return {
    filename: analysis.filename,
    fileSize: formatFileSize(analysis.fileSize),
    pageCount: analysis.metadata.pageCount,
    dimensions: analysis.pageInfo.dimensions.uniqueSizes[0] || 'Unknown',
    colorModel: analysis.colorInfo.colorModel,
    hasImages: analysis.imageInfo.count > 0,
    imageCount: analysis.imageInfo.count,
    lowestImageResolution: `${Math.round(analysis.imageInfo.lowestDPI)} DPI`,
    printReady: analysis.qualityIssues.length === 0,
    issueCount: analysis.qualityIssues.length,
    recommendedPrinting: analysis.printingRequirements.printingMethod,
    recommendedPaperType: analysis.printingRequirements.paperType,
    productionComplexity: analysis.printingRequirements.productionComplexity,
  };
};

/**
 * Format file size in bytes to a human-readable string
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0 Bytes';
  
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

// Export service functions
export default {
  analyzePDF,
  generatePDFSummary,
};
