/**
 * Producers Service
 * 
 * This file provides services for working with producers data.
 * It uses mock data for the MVP and would be replaced with actual API calls in production.
 */

import { getPrinterImageUrl, getEcoFriendlyImageUrl } from '../utils/unsplashUtils';

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock database for producers
const mockProducers = [
  { 
    id: '1', 
    name: 'Rowboat Creative', 
    businessName: 'Rowboat Creative', 
    rating: 4.9, 
    reviews: 42,
    location: {
      lat: 41.8959, 
      lng: -87.6678,
      city: 'Chicago',
      address: '1709 W Chicago Ave, Chicago, IL 60622',
      neighborhood: 'West Town'
    },
    distance: 3.2,
    capabilities: ['DTG Printing', 'Screen Printing', 'Embroidery', 'Dye Sublimation'],
    specialties: ['Detailed Images', 'Full Color Prints', 'T-Shirts', 'Custom Merch'],
    turnaround: '7-10 business days',
    turnaroundDays: 7,
    priceRange: '$$$',
    priceLevel: 3,
    availabilityPercent: 65,
    sustainable: false,
    sustainabilityScore: 90,
    materialSources: ['Standard Apparel Distributors'],
    website: 'https://rowboatcreative.com/dtg',
    imageUrl: getPrinterImageUrl('rowboat-creative', 400, 300)
  },
  { 
    id: '2', 
    name: 'Sharprint', 
    businessName: 'Sharprint', 
    rating: 4.8, 
    reviews: 36,
    location: {
      lat: 41.9262, 
      lng: -87.7068, 
      city: 'Chicago',
      address: '4200 W Diversey Ave, Chicago, IL 60639',
      neighborhood: 'Hermosa'
    },
    distance: 5.6,
    capabilities: ['Screen Printing', 'Embroidery', 'Digital Printing'],
    specialties: ['Eco-Friendly Clothing', 'Sustainable Apparel', 'Green Printing'],
    turnaround: '5-7 business days',
    turnaroundDays: 5,
    priceRange: '$$$',
    priceLevel: 3,
    availabilityPercent: 60,
    sustainable: true,
    sustainabilityScore: 95,
    materialSources: ['Organic Cotton', 'Recycled Fabrics', 'Sustainable Sources'],
    website: 'https://www.sharprint.com/custom-apparel/eco-friendly-clothing',
    imageUrl: getEcoFriendlyImageUrl('sharprint', 400, 300)
  },
  { 
    id: '3', 
    name: 'Minuteman Press', 
    businessName: 'Minuteman Press', 
    rating: 4.7, 
    reviews: 29,
    location: {
      lat: 41.8895, 
      lng: -87.6352,
      city: 'Chicago',
      address: '227 W Van Buren St #125, Chicago, IL 60607', 
      neighborhood: 'The Loop'
    },
    distance: 6.1,
    capabilities: ['DTG Printing', 'Screen Printing', 'Union Bug Printing'],
    specialties: ['Same Day Service', 'Fast Turnaround', 'Political Printing'],
    turnaround: '1-2 business days',
    turnaroundDays: 1,
    priceRange: '$',
    priceLevel: 1,
    availabilityPercent: 75,
    sustainable: false,
    sustainabilityScore: 60,
    materialSources: ['Standard Suppliers'],
    website: 'https://www.samedayteeshirts.com/',
    imageUrl: getPrinterImageUrl('minuteman-press', 400, 300)
  },
  { 
    id: '4', 
    name: 'Chicago Signs and Screen Printing', 
    businessName: 'Chicago Signs and Screen Printing', 
    rating: 4.8, 
    reviews: 33,
    location: {
      lat: 41.9128, 
      lng: -87.6843,
      city: 'Chicago',
      address: '1383 N Milwaukee Ave, Chicago, IL 60622', 
      neighborhood: 'Wicker Park'
    },
    distance: 4.3,
    capabilities: ['Screen Printing', 'Large Format Printing', 'Signs'],
    specialties: ['Custom Signs', 'Banners', 'T-Shirts', 'Promotional Products'],
    turnaround: '3-5 business days',
    turnaroundDays: 3,
    priceRange: '$$',
    priceLevel: 2,
    availabilityPercent: 40,
    sustainable: false,
    sustainabilityScore: 70,
    materialSources: ['Standard Suppliers'],
    website: 'https://chicagosignsandscreenprinting.com',
    imageUrl: getPrinterImageUrl('chicago-signs', 400, 300)
  },
  { 
    id: '5', 
    name: 'Eco Friendly Printer', 
    businessName: 'Eco Friendly Printer', 
    rating: 4.6, 
    reviews: 18,
    location: {
      lat: 41.9074, 
      lng: -87.6722,
      city: 'Chicago',
      address: '1458 W Chicago Ave, Chicago, IL 60642', 
      neighborhood: 'Noble Square'
    },
    distance: 2.9,
    capabilities: ['DTG Printing', 'Eco-Friendly Printing', 'Organic Materials'],
    specialties: ['Recycled Materials', 'Water-Based Inks', 'Carbon Neutral Printing'],
    turnaround: '7-14 business days',
    turnaroundDays: 7,
    priceRange: '$$$$',
    priceLevel: 4,
    availabilityPercent: 90,
    sustainable: true,
    sustainabilityScore: 98,
    materialSources: ['Organic', 'Recycled', 'Fair Trade'],
    website: 'https://ecofriendlyprinter.com',
    imageUrl: getEcoFriendlyImageUrl('eco-friendly', 400, 300)
  }
];

/**
 * Get all producers
 * @returns {Promise<Array>} List of producers
 */
export const getAllProducers = () => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve([...mockProducers]);
    }, 500);
  });
};

/**
 * Get a producer by ID
 * @param {string} producerId - The producer's unique ID
 * @returns {Promise<Object>} Producer details
 */
export const getProducerById = (producerId) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const producer = mockProducers.find(p => p.id === producerId);
      if (producer) {
        resolve(producer);
      } else {
        reject(new Error('Producer not found'));
      }
    }, 300);
  });
};

/**
 * Search producers with filters
 * @param {Object} filters - Search filters
 * @param {string} filters.searchQuery - Search query string
 * @param {Array<string>} filters.capabilities - List of required capabilities
 * @param {string} filters.location - Location filter (e.g., 'all', 'nearby', 'chicago')
 * @returns {Promise<Array>} Filtered list of producers
 */
export const searchProducers = (filters) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Apply filters
      let filteredProducers = [...mockProducers];
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredProducers = filteredProducers.filter(producer => 
          producer.name.toLowerCase().includes(query) || 
          (producer.description && producer.description.toLowerCase().includes(query))
        );
      }
      
      if (filters.capabilities && filters.capabilities.length > 0) {
        filteredProducers = filteredProducers.filter(producer => 
          filters.capabilities.some(cap => producer.capabilities.includes(cap))
        );
      }
      
      if (filters.location && filters.location !== 'all') {
        if (filters.location === 'nearby') {
          filteredProducers = filteredProducers.filter(producer => producer.distance <= 5);
        } else if (filters.location === 'city') {
          filteredProducers = filteredProducers.filter(producer => 
            producer.location && producer.location.city === 'Chicago'
          );
        }
      }
      
      resolve(filteredProducers);
    }, 300);
  });
};

/**
 * Get producer availability
 * @param {string} producerId - The producer's unique ID
 * @returns {Promise<Object>} Availability data
 */
export const getProducerAvailability = (producerId) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve({
        overall: Math.floor(Math.random() * 100),
        weekly: {
          monday: Math.floor(Math.random() * 100),
          tuesday: Math.floor(Math.random() * 100),
          wednesday: Math.floor(Math.random() * 100),
          thursday: Math.floor(Math.random() * 100),
          friday: Math.floor(Math.random() * 100),
          saturday: Math.floor(Math.random() * 100),
          sunday: Math.floor(Math.random() * 100),
        }
      });
    }, 300);
  });
};

/**
 * Submit a quote request to a producer
 * @param {string} producerId - The producer's unique ID
 * @param {Object} quoteData - Quote request data
 * @returns {Promise<Object>} Quote submission result
 */
export const submitQuoteRequest = (producerId, quoteData) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      console.log(`Quote request submitted to producer ${producerId}:`, quoteData);
      resolve({
        success: true,
        quoteId: generateId(),
        message: 'Quote request submitted successfully'
      });
    }, 1000);
  });
};

/**
 * Get the top recommended producers for a user
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Array>} List of recommended producers
 */
export const getRecommendedProducers = (userId) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(mockProducers.slice(0, 3));
    }, 300);
  });
};

export default {
  getAllProducers,
  getProducerById,
  searchProducers,
  getProducerAvailability,
  submitQuoteRequest,
  getRecommendedProducers
};
