/**
 * Materials Recommendation Engine
 * Cross-references design properties with materials database
 * to suggest the best materials for production
 */

import { analyzeDesign } from './designAnalyzer';

// Mock materials database - this would be fetched from an API in production
const MATERIALS_DATABASE = [
  {
    id: 'cotton-standard',
    name: 'Standard Cotton',
    type: 'apparel',
    properties: {
      weight: 'medium',
      finish: 'standard',
      sustainability: 70,
      cost: 'low',
      printQuality: 75,
      colorRetention: 'good',
      durability: 'high'
    },
    bestFor: ['t-shirts', 'tote bags', 'general apparel']
  },
  {
    id: 'cotton-premium',
    name: 'Premium Ringspun Cotton',
    type: 'apparel',
    properties: {
      weight: 'medium-heavy',
      finish: 'soft',
      sustainability: 65,
      cost: 'medium',
      printQuality: 85,
      colorRetention: 'excellent',
      durability: 'high'
    },
    bestFor: ['high-quality apparel', 'retail merchandise']
  },
  {
    id: 'recycled-poly',
    name: 'Recycled Polyester',
    type: 'apparel',
    properties: {
      weight: 'light-medium',
      finish: 'smooth',
      sustainability: 90,
      cost: 'medium',
      printQuality: 80,
      colorRetention: 'good',
      durability: 'medium-high'
    },
    bestFor: ['athletic wear', 'eco-friendly apparel']
  },
  {
    id: 'canvas-natural',
    name: 'Natural Canvas',
    type: 'tote',
    properties: {
      weight: 'heavy',
      finish: 'textured',
      sustainability: 85,
      cost: 'low-medium',
      printQuality: 90,
      colorRetention: 'excellent',
      durability: 'very high'
    },
    bestFor: ['tote bags', 'heavy-duty items']
  },
  {
    id: 'coated-paper',
    name: 'Coated Paper',
    type: 'paper',
    properties: {
      weight: 'medium',
      finish: 'glossy',
      sustainability: 60,
      cost: 'low',
      printQuality: 95,
      colorRetention: 'excellent',
      durability: 'low'
    },
    bestFor: ['flyers', 'brochures', 'high-color designs']
  }
];

/**
 * Recommends materials based on design analysis
 * @param {File} designFile - The design file to analyze
 * @param {string} productType - The type of product (e.g., 't-shirt', 'tote')
 * @param {Object} preferences - Optional user preferences for ranking
 * @returns {Promise<Object>} Material recommendations
 */
export const recommendMaterials = async (designFile, productType, preferences = {}) => {
  try {
    // First analyze the design
    const designAnalysis = await analyzeDesign(designFile);
    
    // Filter materials by product type
    const filteredMaterials = filterMaterialsByProductType(productType);
    
    // Score and rank materials based on design analysis and preferences
    const scoredMaterials = scoreAndRankMaterials(
      filteredMaterials, 
      designAnalysis, 
      preferences
    );
    
    return {
      designDetails: {
        fileName: designFile.name,
        complexity: designAnalysis.analysis.designComplexity,
        colorProfile: designAnalysis.analysis.colorProfile
      },
      recommendations: scoredMaterials,
      sustainabilityImpact: calculateSustainabilityImpact(scoredMaterials[0])
    };
  } catch (error) {
    console.error('Error recommending materials:', error);
    throw error;
  }
};

/**
 * Filters materials database by product type
 * @param {string} productType - The type of product
 * @returns {Array} Filtered materials
 */
const filterMaterialsByProductType = (productType) => {
  // Map generic product types to material types
  const typeMap = {
    'tshirt': 'apparel',
    't-shirt': 'apparel',
    'hoodie': 'apparel',
    'sweatshirt': 'apparel',
    'tote': 'tote',
    'bag': 'tote',
    'poster': 'paper',
    'flyer': 'paper',
    'brochure': 'paper'
  };
  
  const materialType = typeMap[productType.toLowerCase()] || productType;
  
  // Filter materials that are suitable for this product type
  return MATERIALS_DATABASE.filter(material => {
    // Match by type
    if (material.type === materialType) return true;
    
    // Check "bestFor" array
    if (material.bestFor.some(item => 
      item.toLowerCase().includes(productType.toLowerCase())
    )) return true;
    
    return false;
  });
};

/**
 * Scores and ranks materials based on design and preferences
 * @param {Array} materials - Filtered materials
 * @param {Object} designAnalysis - Design analysis results
 * @param {Object} preferences - User preferences
 * @returns {Array} Scored and ranked materials
 */
const scoreAndRankMaterials = (materials, designAnalysis, preferences) => {
  // Define default weights for scoring
  const weights = {
    printQuality: 0.4,
    sustainability: 0.2,
    cost: 0.2,
    durability: 0.2,
    ...preferences // Override with user preferences
  };
  
  // Score each material
  const scoredMaterials = materials.map(material => {
    // Calculate scores for each criteria
    const printQualityScore = 
      (material.properties.printQuality / 100) * weights.printQuality;
    
    const sustainabilityScore = 
      (material.properties.sustainability / 100) * weights.sustainability;
    
    // Map cost to numeric value (lower is better)
    const costMap = { 'low': 0.9, 'low-medium': 0.7, 'medium': 0.5, 'high': 0.3 };
    const costScore = 
      (costMap[material.properties.cost] || 0.5) * weights.cost;
    
    // Map durability to numeric value
    const durabilityMap = { 
      'low': 0.3, 'medium': 0.5, 'medium-high': 0.7, 
      'high': 0.8, 'very high': 1.0 
    };
    const durabilityScore = 
      (durabilityMap[material.properties.durability] || 0.5) * weights.durability;
    
    // Calculate total score
    const totalScore = 
      printQualityScore + sustainabilityScore + costScore + durabilityScore;
    
    return {
      ...material,
      score: parseFloat(totalScore.toFixed(2)),
      matchDetails: {
        printQuality: printQualityScore.toFixed(2),
        sustainability: sustainabilityScore.toFixed(2),
        cost: costScore.toFixed(2),
        durability: durabilityScore.toFixed(2)
      }
    };
  });
  
  // Sort by total score descending
  return scoredMaterials.sort((a, b) => b.score - a.score);
};

/**
 * Calculates sustainability impact of a material choice
 * @param {Object} material - The recommended material
 * @returns {Object} Sustainability metrics
 */
const calculateSustainabilityImpact = (material) => {
  if (!material) return null;
  
  // Calculate sustainability metrics
  const waterSavings = material.properties.sustainability * 0.5; // gallons per unit
  const carbonReduction = material.properties.sustainability * 0.2; // kg CO2 per unit
  
  return {
    waterSavings: `${waterSavings.toFixed(1)} gallons per unit`,
    carbonReduction: `${carbonReduction.toFixed(1)} kg CO2 per unit`,
    sustainabilityScore: material.properties.sustainability,
    sustainabilityRating: getSustainabilityRating(material.properties.sustainability)
  };
};

/**
 * Gets a qualitative sustainability rating
 * @param {number} score - Numerical sustainability score
 * @returns {string} Qualitative rating
 */
const getSustainabilityRating = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
};

export default {
  recommendMaterials
};