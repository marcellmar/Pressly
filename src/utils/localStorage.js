/**
 * Utility functions for managing data in local storage
 */

// Storage keys
export const STORAGE_KEYS = {
  DESIGNS: 'pressly_designs',
  PORTFOLIO: 'pressly_portfolio',
  PORTFOLIO_ITEMS: 'pressly_portfolio_items',
  USER_SETTINGS: 'pressly_user_settings',
};

/**
 * Get data from local storage
 * @param {string} key - Storage key
 * @returns {any} - Parsed data or null if not found
 */
export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Save data to local storage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 * @returns {boolean} - Success status
 */
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Remove data from local storage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all Pressly data from local storage
 * @returns {boolean} - Success status
 */
export const clearPresslyStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing Pressly data from localStorage:', error);
    return false;
  }
};

// Specific functions for designs

/**
 * Get all designs from local storage
 * @returns {Array} - Array of designs or empty array if none found
 */
export const getDesigns = () => {
  return getFromStorage(STORAGE_KEYS.DESIGNS) || [];
};

/**
 * Save designs to local storage
 * @param {Array} designs - Array of designs
 * @returns {boolean} - Success status
 */
export const saveDesigns = (designs) => {
  return saveToStorage(STORAGE_KEYS.DESIGNS, designs);
};

/**
 * Add or update a design in local storage
 * @param {Object} design - Design object
 * @returns {Object} - Updated design with ID if new
 */
export const saveDesign = (design) => {
  const designs = getDesigns();
  
  if (!design.id) {
    // New design - generate ID
    design.id = `d-${Date.now()}`;
    design.createdAt = new Date().toISOString();
  }
  
  design.updatedAt = new Date().toISOString();
  
  // Find and update existing design or add new one
  const existingIndex = designs.findIndex(d => d.id === design.id);
  
  if (existingIndex >= 0) {
    designs[existingIndex] = design;
  } else {
    designs.push(design);
  }
  
  saveDesigns(designs);
  return design;
};

/**
 * Get a design by ID
 * @param {string} id - Design ID
 * @returns {Object|null} - Design object or null if not found
 */
export const getDesignById = (id) => {
  const designs = getDesigns();
  return designs.find(design => design.id === id) || null;
};

/**
 * Delete a design by ID
 * @param {string} id - Design ID
 * @returns {boolean} - Success status
 */
export const deleteDesign = (id) => {
  const designs = getDesigns();
  const updatedDesigns = designs.filter(design => design.id !== id);
  
  if (updatedDesigns.length === designs.length) {
    // No design was removed
    return false;
  }
  
  return saveDesigns(updatedDesigns);
};

// Portfolio functions

/**
 * Get portfolio from local storage
 * @returns {Object|null} - Portfolio object or null if not found
 */
export const getPortfolio = () => {
  return getFromStorage(STORAGE_KEYS.PORTFOLIO) || null;
};

/**
 * Save portfolio to local storage
 * @param {Object} portfolio - Portfolio object
 * @returns {boolean} - Success status
 */
export const savePortfolio = (portfolio) => {
  if (!portfolio.id) {
    portfolio.id = `p-${Date.now()}`;
    portfolio.createdAt = new Date().toISOString();
  }
  
  portfolio.updatedAt = new Date().toISOString();
  return saveToStorage(STORAGE_KEYS.PORTFOLIO, portfolio);
};

/**
 * Get portfolio items from local storage
 * @returns {Array} - Array of portfolio items or empty array if none found
 */
export const getPortfolioItems = () => {
  return getFromStorage(STORAGE_KEYS.PORTFOLIO_ITEMS) || [];
};

/**
 * Save portfolio items to local storage
 * @param {Array} items - Array of portfolio items
 * @returns {boolean} - Success status
 */
export const savePortfolioItems = (items) => {
  return saveToStorage(STORAGE_KEYS.PORTFOLIO_ITEMS, items);
};
