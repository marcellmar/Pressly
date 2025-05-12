/**
 * Utility functions for integrating AI design optimization into Pressly
 */

import aiServices from '../services/ai';

/**
 * Analyzes a design file using AI and returns optimization suggestions
 * @param {File} designFile - The design file to analyze
 * @param {Object} options - Additional options for the analysis
 * @returns {Promise<Object>} AI analysis results
 */
export const analyzeDesignWithAI = async (designFile, options = {}) => {
  try {
    // Extract options
    const { 
      productType = 'tshirt', 
      quantity = 100, 
      material = 'standard',
      quickAnalysis = false
    } = options;
    
    // For quick analysis, just return the basic design analysis
    if (quickAnalysis) {
      return await aiServices.analyzeDesign(designFile);
    }
    
    // Run all analyses in parallel for comprehensive results
    const [
      designAnalysis,
      productionOptimization,
      materialRecommendations,
      qualityIssues,
      costEstimates
    ] = await Promise.all([
      aiServices.analyzeDesign(designFile),
      aiServices.optimizeForProduction(designFile),
      aiServices.recommendMaterials(designFile, productType),
      aiServices.detectProductionIssues(designFile),
      aiServices.estimateProductionCosts(designFile, {
        productType,
        material,
        quantity
      })
    ]);
    
    // Return comprehensive results
    return {
      designAnalysis,
      productionOptimization,
      materialRecommendations,
      qualityIssues,
      costEstimates,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing design with AI:', error);
    throw error;
  }
};

/**
 * Generates suggested improvements for a design
 * @param {Object} analysisResults - Results from AI analysis
 * @returns {Array} Prioritized list of improvement suggestions
 */
export const generateImprovementSuggestions = (analysisResults) => {
  if (!analysisResults) return [];
  
  const suggestions = [];
  
  // Extract issues from quality check
  if (analysisResults.qualityIssues && analysisResults.qualityIssues.issues) {
    analysisResults.qualityIssues.issues.forEach(issue => {
      suggestions.push({
        type: 'quality',
        title: issue.description,
        description: issue.impact,
        severity: issue.severity,
        priority: getSeverityPriority(issue.severity)
      });
    });
  }
  
  // Extract recommendations from production optimization
  if (analysisResults.productionOptimization && analysisResults.productionOptimization.recommendations) {
    const { recommendations } = analysisResults.productionOptimization;
    
    Object.keys(recommendations).forEach(category => {
      recommendations[category].forEach(rec => {
        suggestions.push({
          type: 'optimization',
          title: rec.issue || rec.description,
          description: rec.recommendation || rec.impact,
          severity: rec.severity,
          priority: getSeverityPriority(rec.severity)
        });
      });
    });
  }
  
  // Add material recommendations if available
  if (analysisResults.materialRecommendations && 
      analysisResults.materialRecommendations.recommendations && 
      analysisResults.materialRecommendations.recommendations.length > 0) {
    const bestMaterial = analysisResults.materialRecommendations.recommendations[0];
    
    suggestions.push({
      type: 'material',
      title: `Recommended Material: ${bestMaterial.name}`,
      description: `Best for: ${bestMaterial.bestFor ? bestMaterial.bestFor.join(', ') : 'This product type'}`,
      severity: 'low',
      priority: 3,
      material: bestMaterial
    });
  }
  
  // Cost savings opportunities
  if (analysisResults.costEstimates && analysisResults.costEstimates.savingsOpportunities) {
    analysisResults.costEstimates.savingsOpportunities.forEach(opportunity => {
      suggestions.push({
        type: 'cost',
        title: opportunity.opportunity,
        description: opportunity.description,
        severity: 'medium',
        priority: 2,
        savings: opportunity.estimatedSavings
      });
    });
  }
  
  // Sort by priority (highest first)
  return suggestions.sort((a, b) => a.priority - b.priority);
};

/**
 * Calculates a priority score based on issue severity
 * @param {string} severity - The severity level
 * @returns {number} Priority score (lower = higher priority)
 */
const getSeverityPriority = (severity) => {
  switch (severity) {
    case 'high':
      return 1;
    case 'medium':
      return 2;
    case 'low':
      return 3;
    default:
      return 4;
  }
};

/**
 * Calculates an overall design quality score
 * @param {Object} analysisResults - Results from AI analysis
 * @returns {Object} Quality scores and metrics
 */
export const calculateDesignQualityScore = (analysisResults) => {
  if (!analysisResults) return { overall: 0, breakdown: {} };
  
  // Initialize scores
  let printabilityScore = 0;
  let optimizationScore = 0;
  let issueScore = 0;
  let materialScore = 0;
  
  // Calculate printability score (30% weight)
  if (analysisResults.designAnalysis && analysisResults.designAnalysis.analysis) {
    printabilityScore = (analysisResults.designAnalysis.analysis.printability || 0) * 0.3;
  }
  
  // Calculate optimization score (25% weight)
  if (analysisResults.productionOptimization) {
    optimizationScore = (analysisResults.productionOptimization.efficiencyScore || 0) * 0.25;
  }
  
  // Calculate issues score (25% weight)
  if (analysisResults.qualityIssues) {
    // Invert the risk score (higher is better)
    issueScore = (100 - (analysisResults.qualityIssues.riskScore || 0)) * 0.25;
  }
  
  // Calculate material score (20% weight)
  if (analysisResults.materialRecommendations && 
      analysisResults.materialRecommendations.recommendations && 
      analysisResults.materialRecommendations.recommendations.length > 0) {
    const bestMaterial = analysisResults.materialRecommendations.recommendations[0];
    materialScore = (bestMaterial.score || 0) * 100 * 0.2;
  }
  
  // Calculate overall score
  const overall = Math.round(printabilityScore + optimizationScore + issueScore + materialScore);
  
  return {
    overall,
    breakdown: {
      printability: Math.round(printabilityScore / 0.3), // Convert back to 0-100 scale
      optimization: Math.round(optimizationScore / 0.25),
      issues: Math.round(issueScore / 0.25),
      material: Math.round(materialScore / 0.2)
    }
  };
};

export default {
  analyzeDesignWithAI,
  generateImprovementSuggestions,
  calculateDesignQualityScore
};