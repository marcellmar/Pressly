/**
 * EcoLeanMatch Algorithm
 * 
 * This algorithm combines Lean waste reduction principles with Kaizen continuous 
 * improvement methodology and environmental impact analysis to create a 
 * self-optimizing matching system for on-demand printing.
 * 
 * The algorithm's novelty lies in its combined focus on:
 * 1. Lean waste reduction (transport, waiting, defects)
 * 2. Kaizen self-optimization which adapts weights based on real-time producer performance
 * 3. Environmental impact assessment that rewards eco-friendly production
 */

// Initial weights for WasteVector components
const INITIAL_WASTE_WEIGHTS = {
  TRANSPORT: 0.25,    // Distance-related waste
  DEFECT: 0.25,       // Equipment matching to reduce defects
  WAITING: 0.25,      // Availability and turnaround time
  OVERPRODUCTION: 0.05, // Not as relevant for on-demand but future-proofing
  ECO: 0.20           // Environmental impact
};

// Learning rate for Kaizen adjustments
const LEARNING_RATE = 0.05;

// Decay factor for temporal weighting (recent performance matters more)
const TIME_DECAY_FACTOR = 0.1;

// Maximum values for normalization
const MAX_DISTANCE = 50; // miles
const MAX_WAITING_HOURS = 72; // hours
const MAX_ECO_IMPACT = 100; // kg CO2

/**
 * Calculate the EcoLeanMatch score for a producer
 * 
 * @param {Object} project - The design project with requirements
 * @param {Object} producer - The producer with capabilities
 * @param {Object} weights - Current weights for waste vector components
 * @param {Object} options - Additional matching options
 * @returns {Object} Match result with score and details
 */
export const calculateEcoLeanMatchScore = (project, producer, weights = {...INITIAL_WASTE_WEIGHTS}, options = {}) => {
  if (!project || !producer) {
    return { score: 0, details: { error: "Invalid project or producer data" } };
  }

  // Calculate WasteVector components
  const wasteVector = {
    transport: calculateTransportWaste(project, producer),
    defect: calculateDefectWaste(project, producer),
    waiting: calculateWaitingWaste(producer, project),
    overproduction: 1.0, // Always 1.0 for on-demand printing
    eco: calculateEcoScore(producer, project)
  };

  // Calculate total weighted score
  const totalScore = (
    wasteVector.transport * weights.TRANSPORT +
    wasteVector.defect * weights.DEFECT +
    wasteVector.waiting * weights.WAITING +
    wasteVector.overproduction * weights.OVERPRODUCTION +
    wasteVector.eco * weights.ECO
  );

  // Round to nearest integer and constrain to 0-100 range
  const finalScore = Math.min(100, Math.max(0, Math.round(totalScore * 100)));

  // Calculate carbon savings
  const carbonSavings = calculateCarbonSavings(project, producer);

  // Prepare match details
  const matchDetails = {
    wasteVector: wasteVector,
    weights: weights,
    matchNotes: generateMatchNotes(wasteVector, producer, project),
    estimatedPrice: calculateEstimatedPrice(producer, project),
    estimatedTurnaround: estimatedTurnaround(producer, project),
    environmentalImpact: {
      carbonSavings: carbonSavings,
      sustainabilityScore: producer.sustainabilityScore || Math.round(wasteVector.eco * 100),
      ecoRating: getEcoRating(wasteVector.eco)
    }
  };

  return {
    score: finalScore,
    details: matchDetails
  };
};

/**
 * Transport waste is based on distance - shorter distance means less transport waste
 */
const calculateTransportWaste = (project, producer) => {
  if (!project.location || !producer.location) {
    return 0.5; // Default middle score with missing data
  }

  // Calculate distance in miles
  const distance = producer.location.distance || 
    calculateDistance(
      project.location.lat, 
      project.location.lng, 
      producer.location.lat, 
      producer.location.lng
    );

  // Score decreases with distance (1 - normalized distance)
  return Math.max(0, 1 - (distance / MAX_DISTANCE));
};

/**
 * Calculate distance between two points using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
};

/**
 * Defect waste is based on equipment compatibility - better matching means fewer defects
 */
const calculateDefectWaste = (project, producer) => {
  if (!project.requirements || !producer.capabilities) {
    return 0.5; // Default middle score with missing data
  }

  const requiredCapabilities = project.requirements.capabilities || [];
  const producerCapabilities = producer.capabilities || [];
  
  // No requirements means automatic match
  if (requiredCapabilities.length === 0) {
    return 1.0;
  }

  // Count how many requirements are met
  let matchedCount = 0;
  requiredCapabilities.forEach(req => {
    // Check if producer has equivalent capability
    if (producerCapabilities.some(cap => 
      cap.toLowerCase().includes(req.toLowerCase()) ||
      req.toLowerCase().includes(cap.toLowerCase())
    )) {
      matchedCount++;
    }
  });

  // Score is ratio of matched capabilities
  return matchedCount / requiredCapabilities.length;
};

/**
 * Waiting waste is based on producer's availability and turnaround time
 */
const calculateWaitingWaste = (producer, project) => {
  // If we have expected turnaround time in hours
  if (producer.turnaroundHours) {
    return Math.max(0, 1 - (producer.turnaroundHours / MAX_WAITING_HOURS));
  }
  
  // Use availability percentage if provided
  if (typeof producer.availabilityPercent === 'number') {
    return producer.availabilityPercent / 100;
  }
  
  // Or capacity if provided
  if (typeof producer.currentCapacity === 'number' && typeof producer.maxCapacity === 'number') {
    return producer.currentCapacity / producer.maxCapacity;
  }
  
  return 0.5; // Default middle score with missing data
};

/**
 * Calculate EcoScore based on producer's environmental practices and distance
 */
const calculateEcoScore = (producer, project) => {
  let ecoScore = 0.5; // Default middle score
  
  // If producer has a sustainability score, use it (normalized to 0-1)
  if (producer.sustainabilityScore) {
    ecoScore = producer.sustainabilityScore / 100;
  }
  
  // If producer has eco-related capabilities, boost the score
  if (producer.capabilities) {
    const ecoCapabilities = [
      'eco-friendly', 'sustainable', 'organic', 'recycled', 'renewable',
      'green', 'biodegradable', 'low-impact', 'carbon-neutral'
    ];
    
    ecoCapabilities.forEach(ecoCap => {
      if (producer.capabilities.some(cap => cap.toLowerCase().includes(ecoCap))) {
        ecoScore += 0.05; // Boost for each eco capability
      }
    });
  }
  
  // Factor in distance - closer is more eco-friendly (reducing transportation emissions)
  if (project.location && producer.location) {
    const distance = producer.location.distance || 
      calculateDistance(
        project.location.lat, 
        project.location.lng, 
        producer.location.lat, 
        producer.location.lng
      );
    
    // Energy factor based on distance and producer's efficiency
    const energyFactor = producer.energyEfficiency || 1.0; // Higher is better
    const distanceImpact = 1 - ((distance * (2 - energyFactor)) / MAX_DISTANCE);
    
    // Combine base eco score with distance impact
    ecoScore = (ecoScore * 0.7) + (distanceImpact * 0.3);
  }
  
  return Math.min(1, Math.max(0, ecoScore)); // Ensure between 0-1
};

/**
 * Calculate estimated carbon savings compared to traditional methods
 */
const calculateCarbonSavings = (project, producer) => {
  // Default carbon footprint estimates (kg CO2)
  const TRADITIONAL_PRINTING_FOOTPRINT = 5.2; // per order
  const LOCAL_PRINTING_BASE = 2.8; // per order
  
  // Calculate distance factor
  let distanceFactor = 1.0;
  if (project.location && producer.location) {
    const distance = producer.location.distance || 
      calculateDistance(
        project.location.lat, 
        project.location.lng, 
        producer.location.lat, 
        producer.location.lng
      );
    
    // Less distance = less emissions, but with diminishing returns
    distanceFactor = Math.max(0.5, 1 - (distance / (MAX_DISTANCE * 2)));
  }
  
  // Calculate sustainability factor based on producer practices
  let sustainabilityFactor = 1.0;
  if (producer.sustainabilityScore) {
    sustainabilityFactor = 0.5 + (producer.sustainabilityScore / 200); // 0.5-1.0 range
  }
  
  // Calculate total footprint
  const localFootprint = LOCAL_PRINTING_BASE * (2 - distanceFactor) * (2 - sustainabilityFactor);
  
  // Calculate savings
  const savings = TRADITIONAL_PRINTING_FOOTPRINT - localFootprint;
  
  return Math.max(0, parseFloat(savings.toFixed(2))); // kg CO2 saved, minimum 0
};

/**
 * Get eco-friendly rating based on eco score
 */
const getEcoRating = (ecoScore) => {
  if (ecoScore >= 0.9) return 'Exceptional';
  if (ecoScore >= 0.8) return 'Excellent';
  if (ecoScore >= 0.7) return 'Very Good';
  if (ecoScore >= 0.6) return 'Good';
  if (ecoScore >= 0.5) return 'Average';
  if (ecoScore >= 0.4) return 'Fair';
  if (ecoScore >= 0.3) return 'Poor';
  return 'Needs Improvement';
};

/**
 * Calculate estimated price range for the project
 */
const calculateEstimatedPrice = (producer, project) => {
  // This would be a more complex pricing model in a real implementation
  // Based on project specifications, producer rates, etc.
  
  // Simplified implementation
  let basePrice = 100; // Starting price point
  
  // Adjust based on producer price level
  const priceMultiplier = {
    '$': 0.8,
    '$$': 1.0,
    '$$$': 1.3,
    '$$$$': 1.8
  }[producer.priceRange || '$$'];
  
  basePrice *= priceMultiplier;
  
  // Adjust based on project complexity
  const complexityFactor = project.requirements?.complexity || 1;
  basePrice *= complexityFactor;
  
  // Create price range with +/- 20%
  const minPrice = Math.round(basePrice * 0.8);
  const maxPrice = Math.round(basePrice * 1.2);
  
  return `$${minPrice}-${maxPrice}`;
};

/**
 * Estimate turnaround time for the project
 */
const estimatedTurnaround = (producer, project) => {
  if (producer.turnaround) {
    return producer.turnaround;
  }
  
  // Simplified calculation based on production type and current load
  const baseTime = 3; // Base days
  
  // Adjust based on producer's current capacity
  const loadFactor = 1 + (1 - (producer.availabilityPercent || 50) / 100);
  
  // Adjust based on project complexity
  const complexityFactor = project.requirements?.complexity || 1;
  
  const estimatedDays = Math.round(baseTime * loadFactor * complexityFactor);
  
  // Format the response
  if (estimatedDays <= 1) {
    return "1 business day";
  } else if (estimatedDays <= 3) {
    return "2-3 business days";
  } else if (estimatedDays <= 5) {
    return "3-5 business days";
  } else {
    return "5+ business days";
  }
};

/**
 * Generate text notes explaining the match
 */
const generateMatchNotes = (wasteVector, producer, project) => {
  // Identify strongest waste reduction factors
  const vectorEntries = Object.entries(wasteVector);
  vectorEntries.sort((a, b) => b[1] - a[1]);
  
  const topFactors = vectorEntries.slice(0, 2).map(entry => entry[0]);
  
  // Generate appropriate notes
  let notes = [];
  
  if (topFactors.includes('transport')) {
    notes.push(`Reduced transportation waste with local production only ${producer.location?.distance || 'a short'} miles away.`);
  }
  
  if (topFactors.includes('defect')) {
    notes.push("Excellent technical capabilities match reduces risk of defects and reprints.");
  }
  
  if (topFactors.includes('waiting')) {
    notes.push(`Quick ${producer.turnaround || 'turnaround'} minimizes waiting time and gets your product to you faster.`);
  }
  
  if (topFactors.includes('eco')) {
    notes.push(`Environmentally-conscious production saves approximately ${calculateCarbonSavings(project, producer)} kg of CO2 emissions.`);
  }
  
  // Additional project-specific notes
  if (project.requirements?.urgent && producer.turnaround?.includes('Same day')) {
    notes.push("Offers rush service that meets your timeline needs.");
  }
  
  // Return combined notes
  return notes.join(' ');
};

/**
 * Update weights using Kaizen Pulse (time-weighted learning)
 * 
 * @param {Object} currentWeights - Current factor weights
 * @param {Object} feedback - Performance feedback with improvements
 * @param {Number} timeElapsed - Time since last update in days
 * @returns {Object} Updated weights
 */
export const updateWeightsWithKaizen = (currentWeights, feedback, timeElapsed = 0) => {
  // Make a copy of current weights
  const newWeights = { ...currentWeights };
  
  // Calculate temporal decay factor (more recent = more important)
  const decayFactor = Math.exp(-TIME_DECAY_FACTOR * timeElapsed);
  
  // Update weights based on improvements
  Object.keys(newWeights).forEach(key => {
    const deltaKey = key.toLowerCase();
    if (feedback[deltaKey] !== undefined) {
      // Apply Kaizen Pulse formula: W(t) = W(t-1) + α · Δwaste · e^(-βt)
      newWeights[key] += LEARNING_RATE * feedback[deltaKey] * decayFactor;
    }
  });
  
  // Normalize weights to ensure they sum to 1
  const weightSum = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0);
  
  Object.keys(newWeights).forEach(key => {
    newWeights[key] = newWeights[key] / weightSum;
  });
  
  return newWeights;
};

/**
 * Main function to find matches for a project using EcoLeanMatch algorithm
 * 
 * @param {Object} project - The design project with requirements
 * @param {Array} producers - List of available producers
 * @param {Object} options - Additional matching options
 * @returns {Array} Sorted list of matches with scores
 */
export const findEcoLeanMatches = (project, producers, options = {}) => {
  // Get current weights from storage or use defaults
  const storedWeights = localStorage.getItem('ecoLeanMatchWeights');
  const currentWeights = storedWeights ? JSON.parse(storedWeights) : INITIAL_WASTE_WEIGHTS;
  
  // Calculate match scores for all producers
  const matches = producers.map(producer => {
    const matchResult = calculateEcoLeanMatchScore(project, producer, currentWeights, options);
    return {
      producer: producer,
      matchScore: matchResult.score,
      estimatedPrice: matchResult.details.estimatedPrice,
      turnaround: matchResult.details.estimatedTurnaround,
      notes: matchResult.details.matchNotes,
      wasteVector: matchResult.details.wasteVector,
      environmentalImpact: matchResult.details.environmentalImpact
    };
  });
  
  // Sort by match score (highest first)
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Apply minimum threshold if specified
  const threshold = options.minimumScore || 0;
  const filteredMatches = matches.filter(match => match.matchScore >= threshold);
  
  return filteredMatches;
};

/**
 * Extract project requirements from file metadata and user inputs
 * Enhanced to include environmental preferences
 * 
 * @param {Array} files - Uploaded design files with metadata
 * @param {Object} userInputs - Additional requirements specified by user
 * @returns {Object} Structured project requirements
 */
export const extractProjectRequirements = (files, userInputs = {}) => {
  if (!files || files.length === 0) {
    return { capabilities: [] };
  }
  
  // Initialize capabilities array
  const capabilities = new Set();
  
  // Determine required capabilities based on file types
  files.forEach(file => {
    const fileType = file.type?.toLowerCase() || '';
    
    // Add capabilities based on file type
    if (fileType.includes('image')) {
      capabilities.add('Digital Printing');
      
      // Check image attributes
      if (file.metadata?.dimensions) {
        const dimensions = file.metadata.dimensions;
        if (dimensions.includes('x')) {
          const [width, height] = dimensions.split('x').map(d => parseInt(d));
          if (width > 1000 || height > 1000) {
            capabilities.add('Large Format');
          }
        }
      }
      
      if (file.metadata?.colorMode === 'CMYK') {
        capabilities.add('Offset Printing');
      }
    }
    
    if (fileType.includes('pdf')) {
      capabilities.add('Digital Printing');
      
      // Multi-page PDFs
      if (file.metadata?.pages && parseInt(file.metadata.pages) > 1) {
        capabilities.add('Binding');
      }
    }
    
    if (fileType.includes('ai') || fileType.includes('eps')) {
      capabilities.add('Vector Processing');
    }
    
    if (fileType.includes('psd')) {
      capabilities.add('Image Processing');
    }
  });
  
  // Add capabilities from user inputs
  if (userInputs.capabilities && Array.isArray(userInputs.capabilities)) {
    userInputs.capabilities.forEach(cap => capabilities.add(cap));
  }
  
  // Add eco-friendly requirements if specified
  if (userInputs.ecoFriendly) {
    capabilities.add('Eco-Friendly Materials');
  }
  
  // Determine product type
  let productType = userInputs.productType || 'General Print';
  
  // Determine complexity (1.0 = normal, higher = more complex)
  let complexity = 1.0;
  
  // Increase complexity for multiple files
  if (files.length > 3) {
    complexity *= 1.2;
  }
  
  // Increase complexity for files with issues
  const filesWithIssues = files.filter(f => !f.metadata?.standardCompliance);
  if (filesWithIssues.length > 0) {
    complexity *= 1.1;
  }
  
  // User-specified urgency
  const urgent = !!userInputs.urgent;
  
  // Environmental preferences
  const environmentalPreferences = {
    prioritizeSustainability: userInputs.prioritizeSustainability || false,
    useRecycledMaterials: userInputs.useRecycledMaterials || false,
    lowEmissionDelivery: userInputs.lowEmissionDelivery || false,
    carbonOffsetting: userInputs.carbonOffsetting || false
  };
  
  return {
    capabilities: Array.from(capabilities),
    productType,
    complexity,
    urgent,
    location: userInputs.location,
    preferredDistance: userInputs.preferredDistance || 25, // default 25 miles
    environmentalPreferences
  };
};
