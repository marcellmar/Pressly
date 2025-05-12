/**
 * Utility functions for working with Unsplash images
 */

import { getReliableImageUrl } from './imageUtils';

/**
 * Generate a consistent URL for Unsplash images
 * @param {string} category - The category for the image (e.g. 'printing', 'design')
 * @param {string|number} seed - A unique identifier to make the URL consistent across renders
 * @param {number} width - Desired width of the image
 * @param {number} height - Desired height of the image
 * @returns {string} - Unsplash URL 
 */
export const getUnsplashUrl = (category, seed, width = 600, height = 400) => {
  return getReliableImageUrl('general', `${category}-${seed}`, { width, height });
};

/**
 * Generate a URL for profile images
 * @param {string|number} seed - A unique identifier
 * @param {number} size - Square size of the image
 * @returns {string} - Unsplash URL for profile image
 */
export const getProfileImageUrl = (seed, size = 300) => {
  return getReliableImageUrl('designer', seed, { width: size, height: size });
};

/**
 * Generate design/artwork image URLs
 * @param {string|number} seed - A unique identifier
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} - Unsplash URL for design/artwork
 */
export const getDesignImageUrl = (seed, width = 600, height = 400) => {
  return getReliableImageUrl('design', seed, { width, height });
};

/**
 * Generate printer/production image URLs
 * @param {string|number} seed - A unique identifier
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} - Unsplash URL for printer/production facility
 */
export const getPrinterImageUrl = (seed, width = 600, height = 400) => {
  return getReliableImageUrl('producer', seed, { width, height });
};

/**
 * Generate garment/apparel image URLs
 * @param {string|number} seed - A unique identifier
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} - Unsplash URL for garment/apparel
 */
export const getGarmentImageUrl = (seed, width = 600, height = 400) => {
  return getReliableImageUrl('design', `garment-${seed}`, { width, height });
};

/**
 * Generate eco-friendly/sustainable image URLs
 * @param {string|number} seed - A unique identifier
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} - Unsplash URL for eco-friendly/sustainable themes
 */
export const getEcoFriendlyImageUrl = (seed, width = 600, height = 400) => {
  return getReliableImageUrl('producer', `eco-${seed}`, { width, height });
};
