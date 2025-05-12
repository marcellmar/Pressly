/**
 * IndexedDB Service
 * 
 * Provides a robust API for working with IndexedDB storage in the Pressly application.
 * This service handles database creation, versioning, and CRUD operations for different
 * object stores (designs, settings, portfolio, etc).
 */

const DB_NAME = 'pressly-db';
const DB_VERSION = 1;

// Object store names
const STORES = {
  DESIGNS: 'designs',
  SETTINGS: 'settings',
  PORTFOLIO: 'portfolio',
  SEARCH_CACHE: 'searchCache',
  FORM_DRAFTS: 'formDrafts'
};

// Store indexes
const INDEXES = {
  DESIGNS: {
    BY_DATE: 'updatedAt',
    BY_NAME: 'name',
    BY_TYPE: 'fileType'
  },
  PORTFOLIO: {
    BY_DATE: 'createdAt',
    BY_CATEGORY: 'category'
  },
  SEARCH_CACHE: {
    BY_QUERY: 'query',
    BY_DATE: 'timestamp'
  }
};

/**
 * Initialize the database connection and create object stores if needed
 * @returns {Promise<IDBDatabase>} - The database connection
 */
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      
      // Handle connection errors
      db.onerror = (event) => {
        console.error('Database error:', event.target.error);
      };
      
      resolve(db);
    };

    // Handle database upgrades (version changes)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.DESIGNS)) {
        const designStore = db.createObjectStore(STORES.DESIGNS, { keyPath: 'id' });
        designStore.createIndex(INDEXES.DESIGNS.BY_DATE, 'updatedAt');
        designStore.createIndex(INDEXES.DESIGNS.BY_NAME, 'name');
        designStore.createIndex(INDEXES.DESIGNS.BY_TYPE, 'fileType');
      }
      
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
      
      if (!db.objectStoreNames.contains(STORES.PORTFOLIO)) {
        const portfolioStore = db.createObjectStore(STORES.PORTFOLIO, { keyPath: 'id' });
        portfolioStore.createIndex(INDEXES.PORTFOLIO.BY_DATE, 'createdAt');
        portfolioStore.createIndex(INDEXES.PORTFOLIO.BY_CATEGORY, 'category');
      }
      
      if (!db.objectStoreNames.contains(STORES.SEARCH_CACHE)) {
        const searchStore = db.createObjectStore(STORES.SEARCH_CACHE, { keyPath: 'id', autoIncrement: true });
        searchStore.createIndex(INDEXES.SEARCH_CACHE.BY_QUERY, 'query');
        searchStore.createIndex(INDEXES.SEARCH_CACHE.BY_DATE, 'timestamp');
      }
      
      if (!db.objectStoreNames.contains(STORES.FORM_DRAFTS)) {
        db.createObjectStore(STORES.FORM_DRAFTS, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Execute a database operation with proper transaction handling
 * @param {string} storeName - Name of the object store to access
 * @param {string} mode - Transaction mode ('readonly' or 'readwrite')
 * @param {Function} operation - Function that receives the store and performs operations
 * @returns {Promise<any>} - Promise that resolves with the operation result
 */
const executeTransaction = async (storeName, mode, operation) => {
  try {
    const db = await initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      
      transaction.oncomplete = () => {
        db.close();
      };
      
      transaction.onerror = (event) => {
        console.error(`Transaction error on ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
      
      // Execute the operation and pass the store
      try {
        const request = operation(store);
        
        if (request && request.onsuccess !== undefined) {
          request.onsuccess = (event) => resolve(event.target.result);
          request.onerror = (event) => reject(event.target.error);
        } else {
          // If the operation doesn't return a request with onsuccess
          resolve(request);
        }
      } catch (err) {
        reject(err);
      }
    });
  } catch (err) {
    console.error('Database operation failed:', err);
    throw err;
  }
};

/**
 * Add or update an item in the specified store
 * @param {string} storeName - Name of the object store
 * @param {Object} item - The item to store
 * @returns {Promise<any>} - Promise that resolves with the operation result
 */
const put = async (storeName, item) => {
  return executeTransaction(storeName, 'readwrite', (store) => {
    return store.put(item);
  });
};

/**
 * Get an item by its key from the specified store
 * @param {string} storeName - Name of the object store
 * @param {string|number} key - The item key to retrieve
 * @returns {Promise<any>} - Promise that resolves with the retrieved item
 */
const get = async (storeName, key) => {
  return executeTransaction(storeName, 'readonly', (store) => {
    return store.get(key);
  });
};

/**
 * Get all items from the specified store
 * @param {string} storeName - Name of the object store
 * @returns {Promise<Array>} - Promise that resolves with all items in the store
 */
const getAll = async (storeName) => {
  return executeTransaction(storeName, 'readonly', (store) => {
    return store.getAll();
  });
};

/**
 * Delete an item by its key from the specified store
 * @param {string} storeName - Name of the object store
 * @param {string|number} key - The key of the item to delete
 * @returns {Promise<void>} - Promise that resolves when the item is deleted
 */
const remove = async (storeName, key) => {
  return executeTransaction(storeName, 'readwrite', (store) => {
    return store.delete(key);
  });
};

/**
 * Clear all data from the specified store
 * @param {string} storeName - Name of the object store to clear
 * @returns {Promise<void>} - Promise that resolves when the store is cleared
 */
const clear = async (storeName) => {
  return executeTransaction(storeName, 'readwrite', (store) => {
    return store.clear();
  });
};

/**
 * Get items using an index
 * @param {string} storeName - Name of the object store
 * @param {string} indexName - Name of the index to use
 * @param {any} value - The value to match in the index
 * @returns {Promise<Array>} - Promise that resolves with matching items
 */
const getByIndex = async (storeName, indexName, value) => {
  return executeTransaction(storeName, 'readonly', (store) => {
    const index = store.index(indexName);
    return index.getAll(value);
  });
};

/**
 * Get items using an index with a range query
 * @param {string} storeName - Name of the object store
 * @param {string} indexName - Name of the index to use
 * @param {IDBKeyRange} range - The range to query (use IDBKeyRange.* to create)
 * @returns {Promise<Array>} - Promise that resolves with matching items
 */
const getByRange = async (storeName, indexName, range) => {
  return executeTransaction(storeName, 'readonly', (store) => {
    const index = store.index(indexName);
    return index.getAll(range);
  });
};

// Specialized methods for common operations

/**
 * Save a design to IndexedDB
 * @param {Object} design - The design object to save
 * @returns {Promise<any>} - Promise that resolves with the operation result
 */
const saveDesign = async (design) => {
  // Ensure the design has an ID and timestamps
  const designToSave = {
    ...design,
    id: design.id || crypto.randomUUID(),
    createdAt: design.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return put(STORES.DESIGNS, designToSave);
};

/**
 * Get a design by ID
 * @param {string} designId - The ID of the design to retrieve
 * @returns {Promise<Object>} - Promise that resolves with the design
 */
const getDesign = async (designId) => {
  return get(STORES.DESIGNS, designId);
};

/**
 * Get all designs
 * @returns {Promise<Array>} - Promise that resolves with all designs
 */
const getAllDesigns = async () => {
  return getAll(STORES.DESIGNS);
};

/**
 * Delete a design by ID
 * @param {string} designId - The ID of the design to delete
 * @returns {Promise<void>} - Promise that resolves when the design is deleted
 */
const deleteDesign = async (designId) => {
  return remove(STORES.DESIGNS, designId);
};

/**
 * Get designs by file type
 * @param {string} fileType - The file type to filter by
 * @returns {Promise<Array>} - Promise that resolves with matching designs
 */
const getDesignsByType = async (fileType) => {
  return getByIndex(STORES.DESIGNS, INDEXES.DESIGNS.BY_TYPE, fileType);
};

/**
 * Save user settings
 * @param {string} key - The settings key
 * @param {Object} value - The settings value
 * @returns {Promise<any>} - Promise that resolves with the operation result
 */
const saveSettings = async (key, value) => {
  return put(STORES.SETTINGS, { key, value });
};

/**
 * Get user settings by key
 * @param {string} key - The settings key to retrieve
 * @returns {Promise<Object>} - Promise that resolves with the settings value
 */
const getSettings = async (key) => {
  const result = await get(STORES.SETTINGS, key);
  return result ? result.value : null;
};

/**
 * Save portfolio item
 * @param {Object} item - The portfolio item to save
 * @returns {Promise<any>} - Promise that resolves with the operation result
 */
const savePortfolioItem = async (item) => {
  // Ensure the item has an ID and timestamps
  const itemToSave = {
    ...item,
    id: item.id || crypto.randomUUID(),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return put(STORES.PORTFOLIO, itemToSave);
};

/**
 * Get all portfolio items
 * @returns {Promise<Array>} - Promise that resolves with all portfolio items
 */
const getAllPortfolioItems = async () => {
  return getAll(STORES.PORTFOLIO);
};

/**
 * Get portfolio items by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} - Promise that resolves with matching portfolio items
 */
const getPortfolioByCategory = async (category) => {
  return getByIndex(STORES.PORTFOLIO, INDEXES.PORTFOLIO.BY_CATEGORY, category);
};

/**
 * Save a search result to cache
 * @param {string} query - The search query
 * @param {Array} results - The search results
 * @returns {Promise<any>} - Promise that resolves with the operation result
 */
const cacheSearchResults = async (query, results) => {
  const timestamp = new Date().toISOString();
  return put(STORES.SEARCH_CACHE, { query, results, timestamp });
};

/**
 * Get cached search results by query
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Promise that resolves with cached results
 */
const getCachedSearchResults = async (query) => {
  return getByIndex(STORES.SEARCH_CACHE, INDEXES.SEARCH_CACHE.BY_QUERY, query);
};

/**
 * Save a form draft
 * @param {string} formId - Identifier for the form (e.g., 'design-upload')
 * @param {Object} formData - The form data to save
 * @returns {Promise<any>} - Promise that resolves with the operation result
 */
const saveFormDraft = async (formId, formData) => {
  const timestamp = new Date().toISOString();
  return put(STORES.FORM_DRAFTS, { id: formId, data: formData, updatedAt: timestamp });
};

/**
 * Get a form draft
 * @param {string} formId - Identifier for the form
 * @returns {Promise<Object>} - Promise that resolves with the form draft
 */
const getFormDraft = async (formId) => {
  const result = await get(STORES.FORM_DRAFTS, formId);
  return result ? result.data : null;
};

// Export all functionality
const IndexedDBService = {
  // Constants
  STORES,
  INDEXES,
  
  // Core operations
  put,
  get,
  getAll,
  remove,
  clear,
  getByIndex,
  getByRange,
  
  // Design operations
  saveDesign,
  getDesign,
  getAllDesigns,
  deleteDesign,
  getDesignsByType,
  
  // Settings operations
  saveSettings,
  getSettings,
  
  // Portfolio operations
  savePortfolioItem,
  getAllPortfolioItems,
  getPortfolioByCategory,
  
  // Search cache operations
  cacheSearchResults,
  getCachedSearchResults,
  
  // Form draft operations
  saveFormDraft,
  getFormDraft
};

export default IndexedDBService;