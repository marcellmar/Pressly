/**
 * Pressly Recommendation Engine
 * 
 * This module provides recommendation functionality for both designers and producers,
 * using historical data, current trends, and personalized usage patterns
 * to suggest optimal matches before a specific project is even created.
 */

import { calculateMatchScore } from './matchingAlgorithm';

/**
 * Generate recommended producers for a designer
 * 
 * @param {Object} designer - Designer profile and preferences
 * @param {Array} producers - Available producers in the system
 * @param {Object} options - Recommendation options
 * @returns {Array} Recommended producers with reason
 */
export const getRecommendedProducersForDesigner = (designer, producers, options = {}) => {
  if (!designer || !producers || producers.length === 0) {
    return [];
  }

  // Initialize scoring for each producer
  const producerScores = producers.map(producer => {
    return {
      producer,
      score: 0,
      reasons: []
    };
  });

  // Score based on designer's previous successful collaborations
  if (designer.previousOrders && designer.previousOrders.length > 0) {
    const previousProducerIds = new Set(
      designer.previousOrders
        .filter(order => order.status === 'completed' && order.rating >= 4)
        .map(order => order.producerId)
    );

    producerScores.forEach(item => {
      if (previousProducerIds.has(item.producer.id)) {
        item.score += 3; // Strong boost for previously successful collaborations
        item.reasons.push('previousSuccess');
      }
    });
  }

  // Score based on designer's common product types and producer specialties
  if (designer.commonProductTypes && designer.commonProductTypes.length > 0) {
    producerScores.forEach(item => {
      const specialties = item.producer.specialties || [];
      const matchingSpecialties = specialties.filter(specialty => 
        designer.commonProductTypes.some(type => 
          specialty.toLowerCase().includes(type.toLowerCase()) || 
          type.toLowerCase().includes(specialty.toLowerCase())
        )
      );
      
      if (matchingSpecialties.length > 0) {
        item.score += matchingSpecialties.length;
        item.reasons.push('specialtyMatch');
      }
    });
  }

  // Score based on location proximity
  if (designer.location) {
    producerScores.forEach(item => {
      if (item.producer.location) {
        const distance = calculateDistance(
          designer.location.lat,
          designer.location.lng,
          item.producer.location.lat,
          item.producer.location.lng
        );
        
        // Store the distance for display
        item.producer.distance = Math.round(distance * 10) / 10;
        
        // Score based on distance
        if (distance < 5) {
          item.score += 3; // Very close
          item.reasons.push('veryClose');
        } else if (distance < 15) {
          item.score += 2; // Nearby
          item.reasons.push('nearby');
        } else if (distance < 30) {
          item.score += 1; // Within range
          item.reasons.push('inRange');
        }
      }
    });
  }

  // Score based on producer quality and ratings
  producerScores.forEach(item => {
    if (item.producer.rating >= 4.8) {
      item.score += 3;
      item.reasons.push('topRated');
    } else if (item.producer.rating >= 4.5) {
      item.score += 2;
      item.reasons.push('highlyRated');
    } else if (item.producer.rating >= 4.0) {
      item.score += 1;
      item.reasons.push('wellRated');
    }
  });

  // Score based on current availability
  producerScores.forEach(item => {
    if (item.producer.availabilityPercent >= 70) {
      item.score += 2;
      item.reasons.push('highAvailability');
    } else if (item.producer.availabilityPercent >= 40) {
      item.score += 1;
      item.reasons.push('goodAvailability');
    }
  });

  // Sort by total score (highest first)
  producerScores.sort((a, b) => b.score - a.score);

  // Generate recommendation text for each producer
  const recommendations = producerScores.slice(0, options.limit || 5).map(item => {
    return {
      producer: item.producer,
      recommendationScore: item.score,
      recommendationReason: generateRecommendationReason(item.reasons, item.producer)
    };
  });

  return recommendations;
};

/**
 * Generate recommended designers for a producer
 * 
 * @param {Object} producer - Producer profile and capabilities
 * @param {Array} designers - Available designers in the system
 * @param {Object} options - Recommendation options
 * @returns {Array} Recommended designers with reason
 */
export const getRecommendedDesignersForProducer = (producer, designers, options = {}) => {
  if (!producer || !designers || designers.length === 0) {
    return [];
  }

  // Initialize scoring for each designer
  const designerScores = designers.map(designer => {
    return {
      designer,
      score: 0,
      reasons: []
    };
  });

  // Score based on producer's previous successful collaborations
  if (producer.previousOrders && producer.previousOrders.length > 0) {
    const previousDesignerIds = new Set(
      producer.previousOrders
        .filter(order => order.status === 'completed' && order.rating >= 4)
        .map(order => order.designerId)
    );

    designerScores.forEach(item => {
      if (previousDesignerIds.has(item.designer.id)) {
        item.score += 3; // Strong boost for previously successful collaborations
        item.reasons.push('previousSuccess');
      }
    });
  }

  // Score based on designer's common product types matching producer capabilities
  designerScores.forEach(item => {
    if (item.designer.commonProductTypes && item.designer.commonProductTypes.length > 0) {
      const specialties = producer.specialties || [];
      const matchingProductTypes = item.designer.commonProductTypes.filter(type => 
        specialties.some(specialty => 
          specialty.toLowerCase().includes(type.toLowerCase()) || 
          type.toLowerCase().includes(specialty.toLowerCase())
        )
      );
      
      if (matchingProductTypes.length > 0) {
        item.score += matchingProductTypes.length;
        item.reasons.push('productTypeMatch');
      }
    }
  });

  // Score based on location proximity
  if (producer.location) {
    designerScores.forEach(item => {
      if (item.designer.location) {
        const distance = calculateDistance(
          producer.location.lat,
          producer.location.lng,
          item.designer.location.lat,
          item.designer.location.lng
        );
        
        // Store the distance for display
        item.designer.distance = Math.round(distance * 10) / 10;
        
        // Score based on distance
        if (distance < 5) {
          item.score += 3; // Very close
          item.reasons.push('veryClose');
        } else if (distance < 15) {
          item.score += 2; // Nearby
          item.reasons.push('nearby');
        } else if (distance < 30) {
          item.score += 1; // Within range
          item.reasons.push('inRange');
        }
      }
    });
  }

  // Score based on designer quality and ratings
  designerScores.forEach(item => {
    if (item.designer.rating >= 4.8) {
      item.score += 3;
      item.reasons.push('topRated');
    } else if (item.designer.rating >= 4.5) {
      item.score += 2;
      item.reasons.push('highlyRated');
    } else if (item.designer.rating >= 4.0) {
      item.score += 1;
      item.reasons.push('wellRated');
    }
  });

  // Score based on designer activity level
  designerScores.forEach(item => {
    if (item.designer.activityLevel === 'high') {
      item.score += 2;
      item.reasons.push('veryActive');
    } else if (item.designer.activityLevel === 'medium') {
      item.score += 1;
      item.reasons.push('active');
    }
  });

  // Sort by total score (highest first)
  designerScores.sort((a, b) => b.score - a.score);

  // Generate recommendation text for each designer
  const recommendations = designerScores.slice(0, options.limit || 5).map(item => {
    return {
      designer: item.designer,
      recommendationScore: item.score,
      recommendationReason: generateDesignerRecommendationReason(item.reasons, item.designer)
    };
  });

  return recommendations;
};

/**
 * Calculate distance between two points using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

/**
 * Generate recommendation reason text for producers
 */
const generateRecommendationReason = (reasons, producer) => {
  if (!reasons || reasons.length === 0) {
    return "This producer may be a good match for your projects.";
  }

  // Select primary reason based on priority
  const priorityOrder = [
    'previousSuccess', 
    'specialtyMatch', 
    'veryClose', 
    'topRated',
    'nearby', 
    'highAvailability',
    'highlyRated',
    'inRange',
    'goodAvailability',
    'wellRated'
  ];

  // Find highest priority reason that exists in the reasons list
  let primaryReason = reasons[0];
  for (const reason of priorityOrder) {
    if (reasons.includes(reason)) {
      primaryReason = reason;
      break;
    }
  }

  // Generate tailored message based on primary reason
  switch (primaryReason) {
    case 'previousSuccess':
      return "You've worked successfully with this producer before.";
    case 'specialtyMatch':
      const specialty = producer.specialties?.[0] || "your common project types";
      return `Specializes in ${specialty}.`;
    case 'veryClose':
      return `Very close to your location (${producer.distance}km).`;
    case 'nearby':
      return `Conveniently located near you (${producer.distance}km).`;
    case 'inRange':
      return `Within your area (${producer.distance}km).`;
    case 'topRated':
      return `Top-rated producer (${producer.rating} stars).`;
    case 'highlyRated':
      return `Highly rated by other designers (${producer.rating} stars).`;
    case 'wellRated':
      return `Well-reviewed producer (${producer.rating} stars).`;
    case 'highAvailability':
      return "Currently has high availability for new projects.";
    case 'goodAvailability':
      return "Has good capacity for new projects.";
    default:
      return "Recommended based on your profile and past projects.";
  }
};

/**
 * Generate recommendation reason text for designers
 */
const generateDesignerRecommendationReason = (reasons, designer) => {
  if (!reasons || reasons.length === 0) {
    return "This designer may be looking for your services.";
  }

  // Select primary reason based on priority
  const priorityOrder = [
    'previousSuccess', 
    'productTypeMatch', 
    'veryClose', 
    'veryActive',
    'topRated',
    'nearby', 
    'active',
    'highlyRated',
    'inRange',
    'wellRated'
  ];

  // Find highest priority reason that exists in the reasons list
  let primaryReason = reasons[0];
  for (const reason of priorityOrder) {
    if (reasons.includes(reason)) {
      primaryReason = reason;
      break;
    }
  }

  // Generate tailored message based on primary reason
  switch (primaryReason) {
    case 'previousSuccess':
      return "You've worked successfully with this designer before.";
    case 'productTypeMatch':
      const productType = designer.commonProductTypes?.[0] || "products you specialize in";
      return `Creates ${productType} that match your specialties.`;
    case 'veryClose':
      return `Very close to your location (${designer.distance}km).`;
    case 'nearby':
      return `Conveniently located near you (${designer.distance}km).`;
    case 'inRange':
      return `Within your service area (${designer.distance}km).`;
    case 'topRated':
      return `Top-rated designer (${designer.rating} stars).`;
    case 'highlyRated':
      return `Highly rated designer (${designer.rating} stars).`;
    case 'wellRated':
      return `Well-reviewed designer (${designer.rating} stars).`;
    case 'veryActive':
      return "Very active designer with frequent projects.";
    case 'active':
      return "Regularly creates new projects.";
    default:
      return "Recommended based on your capabilities and location.";
  }
};

/**
 * Get trending product types based on recent orders
 */
export const getTrendingProductTypes = (recentOrders, limit = 5) => {
  if (!recentOrders || recentOrders.length === 0) {
    return [];
  }
  
  // Count occurrences of each product type
  const typeCounts = {};
  recentOrders.forEach(order => {
    const productType = order.productType || "Other";
    typeCounts[productType] = (typeCounts[productType] || 0) + 1;
  });
  
  // Convert to array and sort by count
  const sortedTypes = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
  
  // Return top trending types
  return sortedTypes.slice(0, limit).map(item => item.type);
};

/**
 * Get rising producers based on recent improvement in ratings and order volume
 */
export const getRisingProducers = (producers, recentOrders, limit = 5) => {
  if (!producers || producers.length === 0 || !recentOrders) {
    return [];
  }
  
  // Calculate recent order volume and ratings for each producer
  const producerMetrics = {};
  
  // Initialize with zero counts
  producers.forEach(producer => {
    producerMetrics[producer.id] = {
      producer: producer,
      recentOrderCount: 0,
      averageRating: 0,
      ratingsSamples: 0,
      improvementScore: 0
    };
  });
  
  // Process recent orders
  recentOrders.forEach(order => {
    if (producerMetrics[order.producerId]) {
      producerMetrics[order.producerId].recentOrderCount++;
      
      if (order.rating) {
        producerMetrics[order.producerId].averageRating += order.rating;
        producerMetrics[order.producerId].ratingsSamples++;
      }
    }
  });
  
  // Calculate average ratings and improvement scores
  Object.values(producerMetrics).forEach(metric => {
    if (metric.ratingsSamples > 0) {
      metric.averageRating = metric.averageRating / metric.ratingsSamples;
    }
    
    // Calculate improvement score (combination of volume and quality)
    // Higher score for producers with both good ratings and increasing order volume
    const volumeScore = Math.min(5, metric.recentOrderCount) / 5;
    const ratingScore = (metric.averageRating - 3) / 2; // Normalize 3-5 stars to 0-1
    
    metric.improvementScore = (volumeScore * 0.6) + (ratingScore * 0.4);
  });
  
  // Sort by improvement score and return top producers
  return Object.values(producerMetrics)
    .sort((a, b) => b.improvementScore - a.improvementScore)
    .slice(0, limit)
    .map(metric => metric.producer);
};
