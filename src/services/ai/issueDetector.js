/**
 * Production Issue Detection
 * Identifies potential printing problems in designs before production
 */

import { analyzeDesign } from './designAnalyzer';

/**
 * Detects potential production issues in a design
 * @param {File} designFile - The design file to analyze
 * @returns {Promise<Object>} Detected issues
 */
export const detectProductionIssues = async (designFile) => {
  try {
    // First analyze the design
    const designAnalysis = await analyzeDesign(designFile);
    
    // Run detection algorithms for common issues
    const detectedIssues = {
      resolutionIssues: detectResolutionIssues(designAnalysis),
      colorIssues: detectColorIssues(designAnalysis),
      layoutIssues: detectLayoutIssues(designAnalysis),
      fontIssues: detectFontIssues(designAnalysis)
    };
    
    // Calculate overall risk score
    const riskScore = calculateRiskScore(detectedIssues);
    
    return {
      fileName: designFile.name,
      fileType: designFile.type,
      riskScore,
      riskLevel: getRiskLevel(riskScore),
      issues: flattenIssues(detectedIssues),
      recommendations: generateRecommendations(detectedIssues)
    };
  } catch (error) {
    console.error('Error detecting production issues:', error);
    throw error;
  }
};

/**
 * Detects resolution-related issues
 * @param {Object} designAnalysis - The design analysis results
 * @returns {Array} Resolution issues
 */
const detectResolutionIssues = (designAnalysis) => {
  const issues = [];
  
  // Mock detection - would use real image analysis in production
  if (Math.random() > 0.7) {
    issues.push({
      type: 'resolution',
      severity: 'high',
      description: 'Image resolution below 300 DPI',
      impact: 'May appear pixelated or blurry when printed',
      location: { x: 120, y: 150, width: 400, height: 300 }
    });
  }
  
  if (Math.random() > 0.8) {
    issues.push({
      type: 'resolution',
      severity: 'medium',
      description: 'Small text with low resolution',
      impact: 'Text may be illegible when printed',
      location: { x: 50, y: 200, width: 100, height: 30 }
    });
  }
  
  return issues;
};

/**
 * Detects color-related issues
 * @param {Object} designAnalysis - The design analysis results
 * @returns {Array} Color issues
 */
const detectColorIssues = (designAnalysis) => {
  const issues = [];
  
  // Check for RGB color profile
  if (designAnalysis.analysis.colorProfile === 'RGB') {
    issues.push({
      type: 'color',
      severity: 'high',
      description: 'RGB color profile detected',
      impact: 'Colors may appear different when printed in CMYK',
      location: null // Applies to entire design
    });
  }
  
  // Check for other color issues
  if (Math.random() > 0.6) {
    issues.push({
      type: 'color',
      severity: 'medium',
      description: 'Colors outside printable gamut',
      impact: 'Vibrant colors may appear duller in print',
      location: { x: 30, y: 100, width: 200, height: 150 }
    });
  }
  
  if (Math.random() > 0.7) {
    issues.push({
      type: 'color',
      severity: 'low',
      description: 'High ink density detected',
      impact: 'May cause drying issues or ink bleeding',
      location: { x: 250, y: 300, width: 150, height: 200 }
    });
  }
  
  return issues;
};

/**
 * Detects layout-related issues
 * @param {Object} designAnalysis - The design analysis results
 * @returns {Array} Layout issues
 */
const detectLayoutIssues = (designAnalysis) => {
  const issues = [];
  
  // Mock detection - would use real image analysis in production
  if (Math.random() > 0.6) {
    issues.push({
      type: 'layout',
      severity: 'high',
      description: 'Content too close to trim edge',
      impact: 'Important elements may be cut off',
      location: { x: 0, y: 10, width: 30, height: 500 }
    });
  }
  
  if (Math.random() > 0.7) {
    issues.push({
      type: 'layout',
      severity: 'medium',
      description: 'Inconsistent margins',
      impact: 'Design may appear unbalanced',
      location: null // Applies to entire design
    });
  }
  
  return issues;
};

/**
 * Detects font-related issues
 * @param {Object} designAnalysis - The design analysis results
 * @returns {Array} Font issues
 */
const detectFontIssues = (designAnalysis) => {
  const issues = [];
  
  // Mock detection - would use real font analysis in production
  if (Math.random() > 0.8) {
    issues.push({
      type: 'font',
      severity: 'medium',
      description: 'Fonts not outlined/converted to paths',
      impact: 'Text appearance may change if fonts are substituted',
      location: null // Applies to all text
    });
  }
  
  if (Math.random() > 0.7) {
    issues.push({
      type: 'font',
      severity: 'low',
      description: 'Text size below 6pt',
      impact: 'Very small text may be illegible when printed',
      location: { x: 200, y: 400, width: 100, height: 20 }
    });
  }
  
  return issues;
};

/**
 * Calculates overall risk score based on detected issues
 * @param {Object} detectedIssues - Object containing all detected issues
 * @returns {number} Risk score (0-100)
 */
const calculateRiskScore = (detectedIssues) => {
  // Assign severity weights
  const severityWeights = {
    high: 10,
    medium: 5,
    low: 2
  };
  
  // Calculate score by summing weighted severities
  let totalWeight = 0;
  let totalIssues = 0;
  
  // Flatten all issues and count them
  Object.values(detectedIssues).forEach(issueCategory => {
    issueCategory.forEach(issue => {
      totalWeight += severityWeights[issue.severity] || 0;
      totalIssues++;
    });
  });
  
  // Calculate score (higher = more risky)
  // Scale to 0-100 range
  const maxPossibleScore = 100;
  const score = Math.min(
    Math.round((totalWeight / (totalIssues * 10 || 1)) * 100),
    maxPossibleScore
  );
  
  return score;
};

/**
 * Determines risk level from numerical score
 * @param {number} score - Risk score
 * @returns {string} Risk level description
 */
const getRiskLevel = (score) => {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  if (score >= 10) return 'Low';
  return 'Minimal';
};

/**
 * Flattens issue categories into a single array
 * @param {Object} detectedIssues - Object containing all detected issues
 * @returns {Array} Flattened array of issues
 */
const flattenIssues = (detectedIssues) => {
  return Object.values(detectedIssues).flat();
};

/**
 * Generates recommendations based on detected issues
 * @param {Object} detectedIssues - Object containing all detected issues
 * @returns {Array} Recommendations
 */
const generateRecommendations = (detectedIssues) => {
  const recommendations = [];
  
  // Check for resolution issues
  if (detectedIssues.resolutionIssues.length > 0) {
    recommendations.push({
      type: 'resolution',
      title: 'Improve Image Resolution',
      steps: [
        'Ensure all images are at least 300 DPI for print',
        'Replace low-resolution images with higher quality versions',
        'Avoid scaling images up beyond their original size'
      ]
    });
  }
  
  // Check for color issues
  if (detectedIssues.colorIssues.some(issue => 
    issue.description.includes('RGB color profile')
  )) {
    recommendations.push({
      type: 'color',
      title: 'Convert to CMYK Color Profile',
      steps: [
        'Convert your design to CMYK color profile in your design software',
        'Check colors after conversion and adjust if necessary',
        'Use a color bridge guide to predict how RGB colors will appear in CMYK'
      ]
    });
  }
  
  // Check for layout issues
  if (detectedIssues.layoutIssues.some(issue => 
    issue.description.includes('too close to trim edge')
  )) {
    recommendations.push({
      type: 'layout',
      title: 'Fix Safety Margins',
      steps: [
        'Keep important content at least 1/8" (3mm) from the trim edge',
        'Add bleed of 1/8" (3mm) if content should extend to the edge',
        'Use guides or templates with margin indicators'
      ]
    });
  }
  
  // Check for font issues
  if (detectedIssues.fontIssues.some(issue => 
    issue.description.includes('not outlined')
  )) {
    recommendations.push({
      type: 'font',
      title: 'Convert Fonts to Outlines',
      steps: [
        'Convert all text to outlines/paths in your design software',
        'Keep a backup copy with editable text',
        'Alternatively, ensure all fonts are embedded in the exported file'
      ]
    });
  }
  
  return recommendations;
};

export default {
  detectProductionIssues
};