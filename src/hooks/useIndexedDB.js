import { useState, useCallback, useEffect } from 'react';
import IndexedDBService from '../services/storage/indexedDBService';

/**
 * Custom hook for working with IndexedDB in React components.
 * Provides state management and methods for common database operations.
 * 
 * @param {string} storeName - The object store to interact with
 * @returns {Object} - Object containing state and methods for database operations
 */
const useIndexedDB = (storeName) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Verify that the store name is valid
  useEffect(() => {
    if (!Object.values(IndexedDBService.STORES).includes(storeName)) {
      console.warn(`Store "${storeName}" is not a recognized IndexedDB store name.`);
    }
  }, [storeName]);

  /**
   * Load all items from the store
   */
  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await IndexedDBService.getAll(storeName);
      setData(result);
      return result;
    } catch (err) {
      console.error(`Error loading data from ${storeName}:`, err);
      setError(err.message || 'Failed to load data');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [storeName]);

  /**
   * Load a single item by key
   * @param {string|number} key - The key of the item to load
   */
  const loadItem = useCallback(async (key) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await IndexedDBService.get(storeName, key);
      setData(result);
      return result;
    } catch (err) {
      console.error(`Error loading item from ${storeName}:`, err);
      setError(err.message || 'Failed to load item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [storeName]);

  /**
   * Save an item to the store
   * @param {Object} item - The item to save
   */
  const saveItem = useCallback(async (item) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await IndexedDBService.put(storeName, item);
      await loadAll(); // Refresh data after save
      return result;
    } catch (err) {
      console.error(`Error saving item to ${storeName}:`, err);
      setError(err.message || 'Failed to save item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [storeName, loadAll]);

  /**
   * Delete an item from the store by key
   * @param {string|number} key - The key of the item to delete
   */
  const deleteItem = useCallback(async (key) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await IndexedDBService.remove(storeName, key);
      await loadAll(); // Refresh data after delete
      return true;
    } catch (err) {
      console.error(`Error deleting item from ${storeName}:`, err);
      setError(err.message || 'Failed to delete item');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [storeName, loadAll]);

  /**
   * Load items using an index
   * @param {string} indexName - The name of the index to query
   * @param {any} value - The value to search for
   */
  const loadByIndex = useCallback(async (indexName, value) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await IndexedDBService.getByIndex(storeName, indexName, value);
      setData(result);
      return result;
    } catch (err) {
      console.error(`Error loading items by index from ${storeName}:`, err);
      setError(err.message || 'Failed to load items by index');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [storeName]);

  /**
   * Clear all data from the store
   */
  const clearStore = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await IndexedDBService.clear(storeName);
      setData([]);
      return true;
    } catch (err) {
      console.error(`Error clearing store ${storeName}:`, err);
      setError(err.message || 'Failed to clear store');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [storeName]);

  return {
    data,
    isLoading,
    error,
    loadAll,
    loadItem,
    saveItem,
    deleteItem,
    loadByIndex,
    clearStore
  };
};

export default useIndexedDB;