/**
 * Search Service for Pressly MVP
 * 
 * This service handles search functionality across the platform.
 * It searches through designs, producers, and other content.
 */

// Mock data for search results
import { getDesigns } from './api';

/**
 * Perform a global search across multiple content types
 * @param {string} query - The search query
 * @param {Object} options - Search options (filters, etc.)
 * @returns {Promise} - Promise with search results
 */
export const globalSearch = async (query, options = {}) => {
  if (!query || query.trim() === '') {
    return {
      designs: [],
      producers: [],
      total: 0
    };
  }

  // Normalize query for case-insensitive search
  const normalizedQuery = query.toLowerCase().trim();
  
  try {
    // Get all designs from API service
    const designs = await getDesigns();
    
    // Filter designs based on query
    const matchedDesigns = designs.filter(design => {
      return (
        design.title?.toLowerCase().includes(normalizedQuery) ||
        design.description?.toLowerCase().includes(normalizedQuery) ||
        design.designer?.toLowerCase().includes(normalizedQuery)
      );
    });

    // Get producers (mock data for now)
    const producers = [
      {
        id: 1,
        name: 'LuckyPrints Chicago',
        location: 'Wicker Park',
        description: 'Sustainable full-service print shop',
        sustainabilityScore: 85,
        services: ['Digital Printing', 'Offset Printing', 'Large Format']
      },
      {
        id: 2, 
        name: 'Rowboat Creative',
        location: 'West Town',
        description: 'Custom apparel and merchandise studio',
        sustainabilityScore: 90,
        services: ['Screen Printing', 'DTG Printing', 'Embroidery']
      },
      {
        id: 3,
        name: 'Eco Prints Chicago',
        location: 'Logan Square',
        description: 'Zero-waste printing studio',
        sustainabilityScore: 98,
        services: ['Eco-Friendly Printing', 'Recycled Materials', 'Business Cards']
      },
      {
        id: 4,
        name: 'Digital Press Masters',
        location: 'The Loop',
        description: 'High-volume digital printing services',
        sustainabilityScore: 72,
        services: ['Digital Printing', 'Binding', 'Business Cards', 'Brochures']
      },
      {
        id: 5,
        name: 'Specialty Textiles',
        location: 'Pilsen',
        description: 'Custom fabric printing for apparel and home decor',
        sustainabilityScore: 88,
        services: ['Fabric Printing', 'DTG Printing', 'Cut & Sew']
      }
    ];

    // Filter producers based on query
    const matchedProducers = producers.filter(producer => {
      return (
        producer.name?.toLowerCase().includes(normalizedQuery) ||
        producer.description?.toLowerCase().includes(normalizedQuery) ||
        producer.location?.toLowerCase().includes(normalizedQuery) ||
        producer.services?.some(service => service.toLowerCase().includes(normalizedQuery))
      );
    });

    // Apply filters if provided
    let filteredDesigns = matchedDesigns;
    let filteredProducers = matchedProducers;

    if (options.category && options.category !== 'All') {
      // Filter designs by category
      filteredDesigns = filteredDesigns.filter(design => {
        return design.category === options.category || 
               design.tags?.includes(options.category);
      });

      // Filter producers by services
      filteredProducers = filteredProducers.filter(producer => {
        return producer.services?.includes(options.category);
      });
    }

    return {
      designs: filteredDesigns,
      producers: filteredProducers,
      total: filteredDesigns.length + filteredProducers.length
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

/**
 * Search for designs
 * @param {string} query - The search query
 * @param {Object} filters - Search filters
 * @returns {Promise} - Promise with design search results
 */
export const searchDesigns = async (query, filters = {}) => {
  const results = await globalSearch(query, filters);
  return results.designs;
};

/**
 * Search for producers
 * @param {string} query - The search query
 * @param {Object} filters - Search filters
 * @returns {Promise} - Promise with producer search results
 */
export const searchProducers = async (query, filters = {}) => {
  const results = await globalSearch(query, filters);
  return results.producers;
};

export default {
  globalSearch,
  searchDesigns,
  searchProducers
};
