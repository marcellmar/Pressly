/**
 * Cost Estimation Algorithm
 * Calculates production costs based on design complexity metrics
 */

import { analyzeDesign } from './designAnalyzer';

/**
 * Estimates production costs based on design complexity
 * @param {File} designFile - The design file to analyze
 * @param {Object} productionParams - Production parameters
 * @returns {Promise<Object>} Cost estimates
 */
export const estimateProductionCosts = async (designFile, productionParams) => {
  try {
    // First analyze the design
    const designAnalysis = await analyzeDesign(designFile);
    
    // Calculate base costs for the product type
    const baseCosts = calculateBaseCosts(productionParams);
    
    // Calculate complexity costs based on design analysis
    const complexityCosts = calculateComplexityCosts(designAnalysis, productionParams);
    
    // Calculate quantity-based costs and discounts
    const quantityCosts = calculateQuantityCosts(productionParams.quantity, baseCosts);
    
    // Calculate material-specific costs
    const materialCosts = calculateMaterialCosts(
      productionParams.material,
      productionParams.quantity
    );
    
    // Calculate total costs
    const totalCost = calculateTotalCost(
      baseCosts,
      complexityCosts,
      quantityCosts,
      materialCosts
    );
    
    return {
      summary: {
        productType: productionParams.productType,
        material: productionParams.material,
        quantity: productionParams.quantity,
        totalCost,
        unitCost: parseFloat((totalCost / productionParams.quantity).toFixed(2)),
        currency: 'USD'
      },
      breakdown: {
        baseCosts,
        complexityCosts,
        quantityCosts,
        materialCosts
      },
      costFactors: determineCostFactors(designAnalysis, productionParams),
      savingsOpportunities: identifySavingsOpportunities(designAnalysis, productionParams)
    };
  } catch (error) {
    console.error('Error estimating production costs:', error);
    throw error;
  }
};

/**
 * Calculates base costs for a product type
 * @param {Object} productionParams - Production parameters
 * @returns {Object} Base costs
 */
const calculateBaseCosts = (productionParams) => {
  // Base cost lookup table (simplified)
  const baseCostTable = {
    'tshirt': { setup: 25, production: 5 },
    't-shirt': { setup: 25, production: 5 },
    'hoodie': { setup: 35, production: 12 },
    'tote': { setup: 20, production: 3 },
    'poster': { setup: 15, production: 0.5 },
    'flyer': { setup: 10, production: 0.1 },
    'business-card': { setup: 15, production: 0.05 }
  };
  
  // Get base costs for the product type or use default
  const baseCosts = baseCostTable[productionParams.productType.toLowerCase()] || 
    { setup: 20, production: 5 };
  
  return {
    setup: baseCosts.setup,
    production: baseCosts.production
  };
};

/**
 * Calculates costs related to design complexity
 * @param {Object} designAnalysis - Design analysis results
 * @param {Object} productionParams - Production parameters
 * @returns {Object} Complexity costs
 */
const calculateComplexityCosts = (designAnalysis, productionParams) => {
  const { designComplexity = 50, printability = 80 } = designAnalysis.analysis;
  
  // Calculate color complexity factor
  let colorComplexityFactor = 1.0;
  if (designAnalysis.analysis.colorProfile === 'CMYK') {
    // Full color CMYK printing baseline
    colorComplexityFactor = 1.0;
  } else {
    // RGB needs conversion, slight increase
    colorComplexityFactor = 1.05;
  }
  
  // Calculate overall complexity factor
  // Higher complexity = higher cost, lower printability = higher cost
  const complexityFactor = 
    (1 + (designComplexity / 200)) * // 0.75 - 1.25 range
    (1 + ((100 - printability) / 200)) * // 0.75 - 1.25 range
    colorComplexityFactor;
  
  // Apply to setup and production costs
  return {
    setupComplexity: parseFloat((5 * (complexityFactor - 0.9)).toFixed(2)),
    productionComplexity: parseFloat((0.5 * (complexityFactor - 0.9)).toFixed(2)),
    complexityFactor: parseFloat(complexityFactor.toFixed(2))
  };
};

/**
 * Calculates quantity-based costs and discounts
 * @param {number} quantity - Production quantity
 * @param {Object} baseCosts - Base costs
 * @returns {Object} Quantity costs
 */
const calculateQuantityCosts = (quantity, baseCosts) => {
  // Calculate quantity discount
  let discountFactor = 1.0;
  
  if (quantity >= 500) {
    discountFactor = 0.7; // 30% discount for 500+
  } else if (quantity >= 250) {
    discountFactor = 0.8; // 20% discount for 250-499
  } else if (quantity >= 100) {
    discountFactor = 0.9; // 10% discount for 100-249
  } else if (quantity >= 50) {
    discountFactor = 0.95; // 5% discount for 50-99
  }
  
  // Calculate total quantity discount
  const discount = parseFloat(
    ((1 - discountFactor) * baseCosts.production * quantity).toFixed(2)
  );
  
  return {
    quantity,
    discountFactor,
    discount 
  };
};

/**
 * Calculates material-specific costs
 * @param {string} materialType - Type of material
 * @param {number} quantity - Production quantity
 * @returns {Object} Material costs
 */
const calculateMaterialCosts = (materialType, quantity) => {
  // Material cost lookup table (simplified)
  const materialCostTable = {
    'standard': { 
      cost: 0, // No additional cost 
      description: 'Standard material' 
    },
    'premium': { 
      cost: 1, // $1 per unit additional
      description: 'Premium quality material' 
    },
    'organic': { 
      cost: 2, // $2 per unit additional
      description: 'Organic cotton or eco-friendly material' 
    },
    'recycled': { 
      cost: 1.5, // $1.50 per unit additional
      description: 'Recycled material' 
    }
  };
  
  // Get material costs or use default
  const materialCost = materialCostTable[materialType] || 
    materialCostTable['standard'];
  
  // Calculate total material cost
  const totalMaterialCost = materialCost.cost * quantity;
  
  return {
    materialType,
    costPerUnit: materialCost.cost,
    totalCost: totalMaterialCost,
    description: materialCost.description
  };
};

/**
 * Calculates total production cost
 * @param {Object} baseCosts - Base costs
 * @param {Object} complexityCosts - Complexity costs
 * @param {Object} quantityCosts - Quantity costs and discounts
 * @param {Object} materialCosts - Material costs
 * @returns {number} Total cost
 */
const calculateTotalCost = (
  baseCosts,
  complexityCosts,
  quantityCosts,
  materialCosts
) => {
  // Calculate production cost
  const productionCost = (
    (baseCosts.production + complexityCosts.productionComplexity) * 
    quantityCosts.quantity
  );
  
  // Apply quantity discount
  const discountedProductionCost = productionCost * quantityCosts.discountFactor;
  
  // Calculate setup cost with complexity factor
  const setupCost = baseCosts.setup + complexityCosts.setupComplexity;
  
  // Calculate total cost
  const totalCost = 
    setupCost + 
    discountedProductionCost + 
    materialCosts.totalCost;
  
  return parseFloat(totalCost.toFixed(2));
};

/**
 * Determines key factors affecting cost
 * @param {Object} designAnalysis - Design analysis results
 * @param {Object} productionParams - Production parameters
 * @returns {Array} Cost factors
 */
const determineCostFactors = (designAnalysis, productionParams) => {
  const costFactors = [];
  
  // Check design complexity
  if (designAnalysis.analysis.designComplexity > 70) {
    costFactors.push({
      factor: 'Design Complexity',
      impact: 'High',
      description: 'Complex design increases setup and production costs'
    });
  }
  
  // Check color profile
  if (designAnalysis.analysis.colorProfile === 'RGB') {
    costFactors.push({
      factor: 'Color Profile',
      impact: 'Low',
      description: 'RGB profile requires conversion to CMYK for printing'
    });
  }
  
  // Check quantity
  if (productionParams.quantity < 50) {
    costFactors.push({
      factor: 'Low Quantity',
      impact: 'High',
      description: 'Small production run increases per-unit cost'
    });
  }
  
  // Check material
  if (productionParams.material !== 'standard') {
    costFactors.push({
      factor: 'Premium Material',
      impact: 'Medium',
      description: `${productionParams.material} material increases cost but improves quality`
    });
  }
  
  return costFactors;
};

/**
 * Identifies opportunities for cost savings
 * @param {Object} designAnalysis - Design analysis results
 * @param {Object} productionParams - Production parameters
 * @returns {Array} Savings opportunities
 */
const identifySavingsOpportunities = (designAnalysis, productionParams) => {
  const opportunities = [];
  
  // Opportunity: Increase quantity
  if (productionParams.quantity < 100) {
    opportunities.push({
      opportunity: 'Increase Order Quantity',
      description: 'Ordering 100+ units can reduce per-unit cost by 10%',
      estimatedSavings: '10% per unit'
    });
  } else if (productionParams.quantity < 250) {
    opportunities.push({
      opportunity: 'Increase Order Quantity',
      description: 'Ordering, 250+ units can reduce per-unit cost by an additional 10%',
      estimatedSavings: '10% per unit'
    });
  }
  
  // Opportunity: Simplify design
  if (designAnalysis.analysis.designComplexity > 70) {
    opportunities.push({
      opportunity: 'Simplify Design',
      description: 'Reducing design complexity can lower production costs',
      estimatedSavings: '5-15% total'
    });
  }
  
  // Opportunity: Optimize color profile
  if (designAnalysis.analysis.colorProfile === 'RGB') {
    opportunities.push({
      opportunity: 'Optimize Color Profile',
      description: 'Converting to CMYK before uploading reduces processing costs',
      estimatedSavings: '3-5% total'
    });
  }
  
  return opportunities;
};

export default {
  estimateProductionCosts
};