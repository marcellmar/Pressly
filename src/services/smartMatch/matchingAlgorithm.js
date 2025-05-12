/**
 * Pressly Smart Matching Algorithm
 * 
 * This algorithm matches designers with producers based on:
 * 1. File specifications and requirements
 * 2. Producer capabilities
 * 3. Geographic proximity
 * 4. Production capacity and availability
 * 5. Historical quality and ratings
 * 
 * The algorithm uses weighted scoring across multiple factors
 * to determine the best matches for a given project.
 */

// Weights for different matching factors
const MATCH_WEIGHTS = {
  CAPABILITIES: 0.30,  // 30% - Technical fit
  PROXIMITY: 0.20,     // 20% - Location/distance
  QUALITY: 0.20,       // 20% - Rating and reviews
  AVAILABILITY: 0.15,  // 15% - Current capacity
  PRICE: 0.10,         // 10% - Price competitiveness 
  SPECIALTY: 0.05      // 5% - Special expertise
};

/**
 * Calculate match score between a design project and producer
 * 
 * @param {Object} project - The design project with requirements
 * @param {Object} producer - The producer with capabilities
 * @param {Object} options - Additional matching options
 * @returns {Object} Match result with score and details
 */
export const calculateMatchScore = (project, producer, options = {}) => {
  if (!project || !producer) {
    return { score: 0, details: { error: "Invalid project or producer data" } };
  }

  // Initialize scoring components
  const scores = {
    capabilities: 0,
    proximity: 0,
    quality: 0,
    availability: 0,
    price: 0,
    specialty: 0
  };

  // Calculate capabilities score
  scores.capabilities = calculateCapabilitiesScore(project, producer);
  
  // Calculate proximity score
  scores.proximity = calculateProximityScore(project.location, producer.location);
  
  // Calculate quality score
  scores.quality = calculateQualityScore(producer);
  
  // Calculate availability score
  scores.availability = calculateAvailabilityScore(producer, project);
  
  // Calculate price competitiveness
  scores.price = calculatePriceScore(producer, project);
  
  // Calculate specialty expertise score
  scores.specialty = calculateSpecialtyScore(producer, project);

  // Calculate weighted total score
  const totalScore = (
    scores.capabilities * MATCH_WEIGHTS.CAPABILITIES +
    scores.proximity * MATCH_WEIGHTS.PROXIMITY +
    scores.quality * MATCH_WEIGHTS.QUALITY +
    scores.availability * MATCH_WEIGHTS.AVAILABILITY +
    scores.price * MATCH_WEIGHTS.PRICE +
    scores.specialty * MATCH_WEIGHTS.SPECIALTY
  );

  // Round to nearest integer and constrain to 0-100 range
  const finalScore = Math.min(100, Math.max(0, Math.round(totalScore * 100)));

  // Prepare match details
  const matchDetails = {
    scores: scores,
    weights: MATCH_WEIGHTS,
    matchNotes: generateMatchNotes(scores, producer, project),
    estimatedPrice: calculateEstimatedPrice(producer, project),
    estimatedTurnaround: estimatedTurnaround(producer, project),
  };

  return {
    score: finalScore,
    details: matchDetails
  };
};

/**
 * Calculate capability match score
 * Higher score means producer has all capabilities needed for the project
 */
const calculateCapabilitiesScore = (project, producer) => {
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
    // Using includes for simple matching, but could be more sophisticated
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
 * Calculate proximity score based on distance
 * Closer producers receive higher scores
 */
const calculateProximityScore = (projectLocation, producerLocation) => {
  if (!projectLocation || !producerLocation) {
    return 0.5; // Default middle score with missing data
  }

  // Calculate distance in km (or use provided distance if available)
  const distance = producerLocation.distance || 
    calculateDistance(
      projectLocation.lat, 
      projectLocation.lng, 
      producerLocation.lat, 
      producerLocation.lng
    );

  // Score decreases with distance
  // Perfect score (1.0) for distances under 5km
  // Score of 0 for distances over 50km
  if (distance <= 5) {
    return 1.0;
  } else if (distance >= 50) {
    return 0.0;
  } else {
    // Linear score between 5-50km
    return 1 - ((distance - 5) / 45);
  }
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
 * Calculate quality score based on producer ratings and review count
 */
const calculateQualityScore = (producer) => {
  if (!producer.rating) {
    return 0.5; // Default middle score with missing data
  }

  // Base score from rating (normalized to 0-1 range from 1-5 stars)
  const ratingScore = (producer.rating - 1) / 4;
  
  // Adjust based on number of reviews (more reviews = more confidence)
  const reviewCount = producer.reviewCount || 0;
  const reviewConfidence = Math.min(1, reviewCount / 30); // Max confidence at 30+ reviews
  
  // Weight rating higher as review count increases
  return (ratingScore * 0.8 * reviewConfidence) + (0.5 * (1 - reviewConfidence));
};

/**
 * Calculate availability score based on producer's current capacity
 */
const calculateAvailabilityScore = (producer, project) => {
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
 * Calculate price competitiveness score
 */
const calculatePriceScore = (producer, project) => {
  // Simple implementation based on price range indicators
  if (!producer.priceRange) {
    return 0.5; // Default middle score with missing data
  }
  
  // Score based on price range: $ (cheapest) to $$$$ (most expensive)
  switch (producer.priceRange) {
    case '$': return 1.0;
    case '$$': return 0.75;
    case '$$$': return 0.5;
    case '$$$$': return 0.25;
    default: return 0.5;
  }
};

/**
 * Calculate specialty expertise score
 */
const calculateSpecialtyScore = (producer, project) => {
  if (!project.requirements?.productType || !producer.specialties) {
    return 0.5; // Default middle score with missing data
  }

  const productType = project.requirements.productType;
  const specialties = producer.specialties || [];
  
  // Check if producer specializes in this product type
  for (const specialty of specialties) {
    if (specialty.toLowerCase().includes(productType.toLowerCase()) ||
        productType.toLowerCase().includes(specialty.toLowerCase())) {
      return 1.0;
    }
  }
  
  return 0.3; // No specialty match
};

/**
 * Calculate estimated price range for the project
 */
const calculateEstimatedPrice = (producer, project) => {
  // This would be a more complex pricing model in a real implementation
  // Based on project specifications, producer rates, etc.
  
  // Simplified implementation for demo
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
const generateMatchNotes = (scores, producer, project) => {
  // Identify strongest match factors
  const scoreEntries = Object.entries(scores);
  scoreEntries.sort((a, b) => b[1] - a[1]);
  
  const topFactors = scoreEntries.slice(0, 2).map(entry => entry[0]);
  
  // Generate appropriate notes
  let notes = [];
  
  if (topFactors.includes('capabilities')) {
    notes.push("Technical capabilities are an excellent match for your project requirements.");
  }
  
  if (topFactors.includes('proximity')) {
    notes.push(`Conveniently located ${producer.location?.distance || 'near'} from your location.`);
  }
  
  if (topFactors.includes('quality')) {
    notes.push(`Highly rated producer with strong reviews (${producer.rating} stars).`);
  }
  
  if (topFactors.includes('availability')) {
    notes.push("Currently has good availability to take on your project.");
  }
  
  if (topFactors.includes('price')) {
    notes.push("Offers competitive pricing for your project specifications.");
  }
  
  if (topFactors.includes('specialty')) {
    const specialty = producer.specialties?.[0] || 'this type of project';
    notes.push(`Specializes in ${specialty}.`);
  }
  
  // Additional project-specific notes
  if (project.requirements?.urgent && producer.turnaround?.includes('Same day')) {
    notes.push("Offers rush service that meets your timeline needs.");
  }
  
  // Return combined notes
  return notes.join(' ');
};

/**
 * Main function to find matches for a project
 * 
 * @param {Object} project - The design project with requirements
 * @param {Array} producers - List of available producers
 * @param {Object} options - Additional matching options
 * @returns {Array} Sorted list of matches with scores
 */
export const findMatches = (project, producers, options = {}) => {
  // Calculate match scores for all producers
  const matches = producers.map(producer => {
    const matchResult = calculateMatchScore(project, producer, options);
    return {
      producer: producer,
      matchScore: matchResult.score,
      estimatedPrice: matchResult.details.estimatedPrice,
      turnaround: matchResult.details.estimatedTurnaround,
      notes: matchResult.details.matchNotes,
      scores: matchResult.details.scores
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
  
  return {
    capabilities: Array.from(capabilities),
    productType,
    complexity,
    urgent,
    location: userInputs.location,
    preferredDistance: userInputs.preferredDistance || 25 // default 25km
  };
};
