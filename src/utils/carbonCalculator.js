/**
 * Carbon Calculator Utilities
 * 
 * Provides functions to calculate the environmental impact of
 * different printing and shipping options in the Pressly network
 */

/**
 * Baseline carbon emissions for different printing and shipping methods
 * Note: These are estimated values for comparison purposes
 */
const EMISSIONS = {
  // Printing methods (kg CO2e per item)
  printing: {
    digital: 0.5,          // Digital printing (average per item)
    offset: 1.2,           // Offset printing (average per item)
    screen: 0.8,           // Screen printing (average per item)
    dtg: 0.3,              // Direct to garment printing (per garment)
    large_format: 2.0      // Large format printing (per square meter)
  },
  
  // Transportation methods (kg CO2e per km)
  transport: {
    car: 0.120,            // Average passenger car (per km)
    van: 0.170,            // Small delivery van (per km)
    truck: 0.300,          // Small delivery truck (per km)
    bike: 0.0,             // Bicycle/e-bike delivery (per km)
    foot: 0.0              // On foot delivery (per km)
  },
  
  // Shipping distances (kg CO2e per package)
  shipping: {
    local: 0.5,            // Local shipping (<50km)
    regional: 2.0,         // Regional shipping (50-500km)
    national: 5.0,         // National shipping (500-2000km)
    international: 15.0    // International shipping (>2000km)
  },
  
  // Materials (additional kg CO2e per item)
  materials: {
    recycled_paper: 0.1,   // Recycled paper (per item)
    virgin_paper: 0.3,     // Virgin paper (per item)
    organic_cotton: 0.5,   // Organic cotton (per garment)
    synthetic: 1.2         // Synthetic materials (per garment)
  }
};

/**
 * Calculate carbon emissions for a printing job
 * 
 * @param {Object} options - Calculation options
 * @param {string} options.printMethod - Printing method used
 * @param {number} options.quantity - Number of items printed
 * @param {string} options.material - Material type
 * @param {number} options.distance - Distance in km
 * @param {string} options.transportMethod - Transport method
 * @returns {Object} - Carbon emissions data
 */
export const calculatePrintingEmissions = (options = {}) => {
  // Default options
  const defaults = {
    printMethod: 'digital',
    quantity: 1,
    material: 'recycled_paper',
    distance: 10,
    transportMethod: 'car'
  };
  
  // Merge defaults with provided options
  const settings = { ...defaults, ...options };
  
  // Calculate printing emissions
  let printEmissions = 0;
  if (EMISSIONS.printing[settings.printMethod]) {
    printEmissions = EMISSIONS.printing[settings.printMethod] * settings.quantity;
  }
  
  // Add material emissions
  let materialEmissions = 0;
  if (EMISSIONS.materials[settings.material]) {
    materialEmissions = EMISSIONS.materials[settings.material] * settings.quantity;
  }
  
  // Calculate transport emissions
  let transportEmissions = 0;
  if (EMISSIONS.transport[settings.transportMethod]) {
    transportEmissions = EMISSIONS.transport[settings.transportMethod] * settings.distance;
  }
  
  // Total emissions
  const totalEmissions = printEmissions + materialEmissions + transportEmissions;
  
  // Compare with traditional centralized production model
  // Typical model: Mass production + national shipping
  const traditionalEmissions = calculateTraditionalProductionEmissions(settings.quantity);
  
  // Calculate savings
  const emissionsSaved = traditionalEmissions - totalEmissions;
  const savingsPercentage = (emissionsSaved / traditionalEmissions) * 100;
  
  return {
    printing: printEmissions,
    material: materialEmissions,
    transport: transportEmissions,
    total: totalEmissions,
    traditional: traditionalEmissions,
    saved: emissionsSaved,
    savingsPercentage: savingsPercentage,
    equivalent: calculateTreeEquivalent(emissionsSaved)
  };
};

/**
 * Calculate emissions from traditional centralized production
 * 
 * @param {number} quantity - Number of items
 * @returns {number} - Carbon emissions in kg CO2e
 */
export const calculateTraditionalProductionEmissions = (quantity = 1) => {
  // Traditional model: Offset printing + national shipping
  const printEmissions = EMISSIONS.printing.offset * quantity;
  const materialEmissions = EMISSIONS.materials.virgin_paper * quantity;
  const shippingEmissions = EMISSIONS.shipping.national;
  
  return printEmissions + materialEmissions + shippingEmissions;
};

/**
 * Calculate number of trees needed to offset emissions
 * based on average annual carbon sequestration of trees
 * 
 * @param {number} emissions - Carbon emissions in kg CO2e
 * @returns {number} - Number of trees
 */
export const calculateTreeEquivalent = (emissions) => {
  // Average tree absorbs about 25 kg CO2 per year
  const kgPerTreePerYear = 25;
  
  return emissions / kgPerTreePerYear;
};

/**
 * Calculate carbon footprint reduction from local production network
 * 
 * @param {number} distance - Distance in km to local producer
 * @param {number} quantity - Number of items
 * @returns {Object} - Footprint reduction data
 */
export const calculateNetworkBenefits = (distance, quantity = 1) => {
  // Calculate emissions for local production
  const localEmissions = calculatePrintingEmissions({
    distance: distance,
    quantity: quantity,
    printMethod: 'digital',
    material: 'recycled_paper',
    transportMethod: 'car'
  });
  
  // Calculate emissions for traditional production
  const traditionalEmissions = calculateTraditionalProductionEmissions(quantity);
  
  // Calculate savings
  const emissionsSaved = traditionalEmissions - localEmissions.total;
  const savingsPercentage = (emissionsSaved / traditionalEmissions) * 100;
  
  // Calculate other environmental benefits
  
  // Water savings (liters) - based on reduced paper and transportation
  const waterSaved = quantity * 10; // Estimated 10 liters per item
  
  // Waste reduction (kg) - based on reduced packaging and wastage
  const wasteReduced = quantity * 0.2; // Estimated 0.2 kg per item
  
  // Energy savings (kWh) - based on reduced production and transport
  const energySaved = quantity * 1.5; // Estimated 1.5 kWh per item
  
  return {
    carbonEmissionsSaved: emissionsSaved,
    savingsPercentage: savingsPercentage,
    waterSaved: waterSaved,
    wasteReduced: wasteReduced,
    energySaved: energySaved,
    treeEquivalent: calculateTreeEquivalent(emissionsSaved)
  };
};

/**
 * Format carbon emissions for display
 * 
 * @param {number} emissions - Carbon emissions in kg CO2e
 * @returns {string} - Formatted emissions string
 */
export const formatEmissions = (emissions) => {
  if (typeof emissions !== 'number') {
    return 'N/A';
  }
  
  // Convert to tons if over 1000 kg
  if (emissions >= 1000) {
    return `${(emissions / 1000).toFixed(2)} tons CO2e`;
  }
  
  // Format based on size
  if (emissions < 1) {
    return `${Math.round(emissions * 1000)} g CO2e`;
  }
  
  return `${emissions.toFixed(2)} kg CO2e`;
};

export default {
  calculatePrintingEmissions,
  calculateTraditionalProductionEmissions,
  calculateTreeEquivalent,
  calculateNetworkBenefits,
  formatEmissions,
  EMISSIONS
};