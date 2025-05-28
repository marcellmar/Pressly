/**
 * EcoLean Match Service
 * Wrapper for eco-friendly matching algorithm
 */

import { 
  calculateEcoLeanMatchScore,
  findEcoLeanMatches as findBestMatches,
  extractProjectRequirements as extractRequirements,
  updateWeightsWithKaizen 
} from './ecoLeanMatch/ecoLeanMatchAlgorithm';

// Re-export main functions
export const findEcoLeanMatches = async (requirements, producers) => {
  // Ensure we have valid data
  if (!requirements || !producers || producers.length === 0) {
    return [];
  }

  // Use the algorithm to find best matches
  const matches = findBestMatches(requirements, producers);
  
  // Enhance matches with additional data
  return matches.map(match => ({
    ...match.producer,
    matchScore: Math.round(match.matchScore * 100),
    matchDetails: {
      wasteVector: match.wasteVector,
      environmentalImpact: match.environmentalImpact,
      estimatedPrice: match.estimatedPrice,
      turnaround: match.turnaround,
      notes: match.notes
    },
    ecoImpact: match.environmentalImpact || {},
    estimatedCost: match.estimatedPrice || calculateEstimatedCost(requirements, match.producer),
    carbonSavings: match.environmentalImpact?.carbonSavings || 0
  }));
};

export const extractProjectRequirements = (files, projectDetails) => {
  const baseRequirements = extractRequirements(files, projectDetails);
  
  // Enhance with additional project details
  return {
    ...baseRequirements,
    sustainabilityPriority: projectDetails.sustainabilityPriority || 'balanced',
    budget: projectDetails.budget || null,
    materials: projectDetails.materials || [],
    finishes: projectDetails.finishes || []
  };
};

// Helper function to calculate estimated cost
const calculateEstimatedCost = (requirements, producer) => {
  const basePrice = producer.priceLevel || 2; // 1-5 scale
  const quantity = requirements.quantity || 100;
  
  // Simple cost calculation
  const unitPrice = basePrice * 0.25; // Base unit price
  const quantityDiscount = quantity > 1000 ? 0.9 : quantity > 500 ? 0.95 : 1;
  
  return (unitPrice * quantity * quantityDiscount).toFixed(2);
};

export default {
  findEcoLeanMatches,
  extractProjectRequirements
};