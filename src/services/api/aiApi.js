/**
 * API Integration for AI Design Optimization Services
 * 
 * This module provides an interface to the AI services for design optimization,
 * allowing them to be called from anywhere in the application.
 * 
 * In a production environment, these would call actual API endpoints.
 * For now, they call the local AI service implementations.
 */

import aiServices from '../ai';

/**
 * Analyze a design for optimization opportunities
 * @param {File} designFile - The design file to analyze
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeDesign = async (designFile) => {
  try {
    return await aiServices.analyzeDesign(designFile);
  } catch (error) {
    console.error('Error in AI design analysis:', error);
    throw error;
  }
};

/**
 * Optimize a design for production
 * @param {File} designFile - The design file to optimize
 * @returns {Promise<Object>} - Optimization results
 */
export const optimizeDesign = async (designFile) => {
  try {
    return await aiServices.optimizeForProduction(designFile);
  } catch (error) {
    console.error('Error in AI design optimization:', error);
    throw error;
  }
};

/**
 * Get material recommendations for a design
 * @param {File} designFile - The design file
 * @param {string} productType - Type of product (e.g., 'tshirt', 'poster')
 * @returns {Promise<Object>} - Material recommendations
 */
export const getRecommendedMaterials = async (designFile, productType = 'tshirt') => {
  try {
    return await aiServices.recommendMaterials(designFile, productType);
  } catch (error) {
    console.error('Error getting material recommendations:', error);
    throw error;
  }
};

/**
 * Detect potential production issues in a design
 * @param {File} designFile - The design file to analyze
 * @returns {Promise<Object>} - Detected issues
 */
export const detectIssues = async (designFile) => {
  try {
    return await aiServices.detectProductionIssues(designFile);
  } catch (error) {
    console.error('Error detecting production issues:', error);
    throw error;
  }
};

/**
 * Estimate production costs for a design
 * @param {File} designFile - The design file
 * @param {Object} productionParams - Production parameters
 * @returns {Promise<Object>} - Cost estimates
 */
export const estimateCosts = async (designFile, productionParams) => {
  try {
    return await aiServices.estimateProductionCosts(designFile, productionParams);
  } catch (error) {
    console.error('Error estimating production costs:', error);
    throw error;
  }
};

/**
 * Run a complete AI analysis on a design
 * @param {File} designFile - The design file
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - Comprehensive analysis results
 */
export const runCompleteAnalysis = async (designFile, options = {}) => {
  try {
    const [
      designAnalysis,
      productionOptimization,
      materialRecommendations,
      qualityIssues,
      costEstimates
    ] = await Promise.all([
      aiServices.analyzeDesign(designFile),
      aiServices.optimizeForProduction(designFile),
      aiServices.recommendMaterials(designFile, options.productType || 'tshirt'),
      aiServices.detectProductionIssues(designFile),
      aiServices.estimateProductionCosts(designFile, {
        productType: options.productType || 'tshirt',
        material: options.material || 'standard',
        quantity: options.quantity || 100
      })
    ]);
    
    return {
      designAnalysis,
      productionOptimization,
      materialRecommendations,
      qualityIssues,
      costEstimates,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in complete AI analysis:', error);
    throw error;
  }
};

export default {
  analyzeDesign,
  optimizeDesign,
  getRecommendedMaterials,
  detectIssues,
  estimateCosts,
  runCompleteAnalysis
};