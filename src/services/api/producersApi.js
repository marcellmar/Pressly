/**
 * Producers API Service
 * 
 * Handles all API requests related to the enhanced producers functionality
 */

import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || '';

// Producer endpoints
const PRODUCERS_ENDPOINT = `${API_URL}/api/producers`;
const PRODUCERS_SEARCH_ENDPOINT = `${API_URL}/api/producers/search`;

/**
 * Get all producers
 * @returns {Promise<Array>} List of producers
 */
export const getAllProducers = async () => {
  try {
    const response = await axios.get(PRODUCERS_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching producers:', error);
    throw error;
  }
};

/**
 * Get a producer by ID
 * @param {string} producerId - The producer's unique ID
 * @returns {Promise<Object>} Producer details
 */
export const getProducerById = async (producerId) => {
  try {
    const response = await axios.get(`${PRODUCERS_ENDPOINT}/${producerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching producer ${producerId}:`, error);
    throw error;
  }
};

/**
 * Search producers with filters
 * @param {Object} filters - Search filters
 * @param {string} filters.query - Search query string
 * @param {Array<string>} filters.capabilities - List of required capabilities
 * @param {string} filters.location - Location filter (e.g., 'all', 'nearby', 'chicago')
 * @returns {Promise<Array>} Filtered list of producers
 */
export const searchProducers = async (filters) => {
  try {
    const response = await axios.post(PRODUCERS_SEARCH_ENDPOINT, filters);
    return response.data;
  } catch (error) {
    console.error('Error searching producers:', error);
    throw error;
  }
};

/**
 * Get producer availability
 * @param {string} producerId - The producer's unique ID
 * @returns {Promise<Object>} Availability data
 */
export const getProducerAvailability = async (producerId) => {
  try {
    // This would be a real endpoint in production
    // For now, we'll mock the response
    return {
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
    };
  } catch (error) {
    console.error(`Error fetching producer availability ${producerId}:`, error);
    throw error;
  }
};

/**
 * Submit a quote request to a producer
 * @param {string} producerId - The producer's unique ID
 * @param {Object} quoteData - Quote request data
 * @returns {Promise<Object>} Quote submission result
 */
export const submitQuoteRequest = async (producerId, quoteData) => {
  try {
    // This would be a real endpoint in production
    // For now, we'll mock the response
    console.log(`Quote request submitted to producer ${producerId}:`, quoteData);
    return {
      success: true,
      quoteId: Math.random().toString(36).substring(2, 15),
      message: 'Quote request submitted successfully'
    };
  } catch (error) {
    console.error(`Error submitting quote request to producer ${producerId}:`, error);
    throw error;
  }
};

/**
 * Get the top recommended producers for a user
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Array>} List of recommended producers
 */
export const getRecommendedProducers = async (userId) => {
  try {
    // This would be a real endpoint in production
    // For now, we'll mock the response
    return [
      {
        id: '1',
        businessName: 'Elite Printing Co.',
        rating: 4.9,
        reviews: 42,
        capabilities: ['DTG Printing', 'Screen Printing', 'Embroidery'],
        availabilityPercent: 75
      },
      {
        id: '2',
        businessName: 'Eco Print Solutions',
        rating: 4.8,
        reviews: 36,
        capabilities: ['Eco-Friendly Printing', 'DTG Printing', 'Recycled Materials'],
        availabilityPercent: 90
      },
      {
        id: '3',
        businessName: 'Fast Track Apparel',
        rating: 4.7,
        reviews: 29,
        capabilities: ['Screen Printing', 'Rush Service', 'Bulk Orders'],
        availabilityPercent: 60
      }
    ];
  } catch (error) {
    console.error(`Error fetching recommended producers for user ${userId}:`, error);
    throw error;
  }
};

export default {
  getAllProducers,
  getProducerById,
  searchProducers,
  getProducerAvailability,
  submitQuoteRequest,
  getRecommendedProducers
};
