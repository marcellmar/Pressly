/**
 * Design AI Service
 * Wrapper for AI design optimization functions
 */

import aiServices from './ai';

// Main analysis function
export const analyzeDesignWithAI = async (designFile, options = {}) => {
  try {
    // Run basic design analysis
    const analysis = await aiServices.analyzeDesign(designFile);
    
    // Add additional analysis if requested
    if (options.includeProduction) {
      const productionOpt = await aiServices.optimizeForProduction(designFile);
      analysis.productionOptimization = productionOpt;
    }
    
    if (options.includeMaterials) {
      const materials = await aiServices.recommendMaterials(designFile, options.productType);
      analysis.materialRecommendations = materials;
    }
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing design:', error);
    // Return a basic result on error
    return {
      designComplexity: 'medium',
      printReadiness: 75,
      colorAnalysis: { mode: 'RGB', colors: [] },
      recommendations: ['Unable to perform full analysis']
    };
  }
};

// Optimization function
export const optimizeDesignForProduction = async (designFile) => {
  try {
    return await aiServices.optimizeForProduction(designFile);
  } catch (error) {
    console.error('Error optimizing design:', error);
    return {
      optimizations: [],
      estimatedImprovement: 0
    };
  }
};

// Additional helper functions for SmartMatch Studio
export const getOptimizationSuggestions = async (file, analysisResults) => {
  const suggestions = {
    automatic: [],
    manual: [],
    cost: {
      current: 0,
      optimized: 0,
      savings: 0
    }
  };

  // Generate suggestions based on analysis
  if (analysisResults?.overall?.score < 90) {
    suggestions.automatic.push({
      type: 'resolution',
      description: 'Automatically upscale images to 300 DPI',
      impact: 'high',
      icon: '🖼️',
      automated: true
    });
    
    suggestions.automatic.push({
      type: 'color',
      description: 'Convert RGB to CMYK for print',
      impact: 'critical',
      icon: '🎨',
      automated: true
    });

    suggestions.automatic.push({
      type: 'bleed',
      description: 'Add 0.125" bleed to all edges',
      impact: 'high',
      icon: '📐',
      automated: true
    });
  }

  // Manual optimization suggestions
  suggestions.manual.push({
    type: 'layout',
    description: 'Adjust margins to reduce paper waste by 15%',
    impact: 'medium',
    icon: '📐',
    savingsPercent: 15
  });

  suggestions.manual.push({
    type: 'material',
    description: 'Switch to recycled paper stock',
    impact: 'high',
    icon: '♻️',
    environmental: true
  });

  return suggestions;
};

export default {
  analyzeDesignWithAI,
  optimizeDesignForProduction,
  getOptimizationSuggestions
};