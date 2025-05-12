/**
 * AI Services Index
 * Exports all AI-powered design optimization services
 */

import designAnalyzer from './designAnalyzer';
import productionOptimizer from './productionOptimizer';
import materialsRecommender from './materialsRecommender';
import issueDetector from './issueDetector';
import costEstimator from './costEstimator';

export {
  designAnalyzer,
  productionOptimizer,
  materialsRecommender,
  issueDetector,
  costEstimator
};

export default {
  analyzeDesign: designAnalyzer.analyzeDesign,
  optimizeForProduction: productionOptimizer.optimizeForProduction,
  recommendMaterials: materialsRecommender.recommendMaterials,
  detectProductionIssues: issueDetector.detectProductionIssues,
  estimateProductionCosts: costEstimator.estimateProductionCosts
};