import { useState, useEffect, useCallback } from 'react';
import { 
  getDesigns, 
  saveDesign, 
  deleteDesign, 
  saveDesigns as saveDesignsToStorage 
} from '../utils/localStorage';

/**
 * Custom hook for managing designs with local storage integration
 * @returns {Object} - Methods and state for managing designs
 */
const useDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load designs from local storage on mount
  useEffect(() => {
    try {
      const storedDesigns = getDesigns();
      setDesigns(storedDesigns);
      setLoading(false);
    } catch (err) {
      console.error('Error loading designs from local storage:', err);
      setError('Failed to load designs');
      setLoading(false);
    }
  }, []);

  // Clear error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create or update a design
  const createOrUpdateDesign = useCallback(async (designData) => {
    try {
      const updatedDesign = saveDesign(designData);
      
      // Update state
      setDesigns(prevDesigns => {
        const existingIndex = prevDesigns.findIndex(d => d.id === updatedDesign.id);
        
        if (existingIndex >= 0) {
          // Update existing design
          const updatedDesigns = [...prevDesigns];
          updatedDesigns[existingIndex] = updatedDesign;
          return updatedDesigns;
        } else {
          // Add new design
          return [...prevDesigns, updatedDesign];
        }
      });
      
      return updatedDesign;
    } catch (err) {
      console.error('Error creating/updating design:', err);
      setError('Failed to save design');
      throw err;
    }
  }, []);

  // Remove a design
  const removeDesign = useCallback(async (designId) => {
    try {
      const success = deleteDesign(designId);
      
      if (success) {
        // Update state
        setDesigns(prevDesigns => prevDesigns.filter(d => d.id !== designId));
      }
      
      return success;
    } catch (err) {
      console.error('Error removing design:', err);
      setError('Failed to remove design');
      throw err;
    }
  }, []);

  // Get a design by ID
  const getDesignById = useCallback((designId) => {
    return designs.find(design => design.id === designId) || null;
  }, [designs]);

  // Update multiple designs
  const saveDesigns = useCallback(async (updatedDesigns) => {
    try {
      const success = saveDesignsToStorage(updatedDesigns);
      
      if (success) {
        setDesigns(updatedDesigns);
      }
      
      return success;
    } catch (err) {
      console.error('Error saving designs:', err);
      setError('Failed to save designs');
      throw err;
    }
  }, []);

  // Filter designs by criteria
  const filterDesigns = useCallback((criteria) => {
    if (!criteria) return designs;
    
    return designs.filter(design => {
      // Filter by search query
      if (criteria.searchQuery) {
        const query = criteria.searchQuery.toLowerCase();
        const matchesTitle = design.title?.toLowerCase().includes(query);
        const matchesDescription = design.description?.toLowerCase().includes(query);
        const matchesTags = design.tags?.some(tag => tag.toLowerCase().includes(query));
        
        if (!(matchesTitle || matchesDescription || matchesTags)) {
          return false;
        }
      }
      
      // Filter by date range
      if (criteria.dateFrom || criteria.dateTo) {
        const designDate = new Date(design.createdAt);
        
        if (criteria.dateFrom && designDate < new Date(criteria.dateFrom)) {
          return false;
        }
        
        if (criteria.dateTo && designDate > new Date(criteria.dateTo)) {
          return false;
        }
      }
      
      // Filter by tags
      if (criteria.tags && criteria.tags.length > 0) {
        if (!design.tags || !criteria.tags.some(tag => design.tags.includes(tag))) {
          return false;
        }
      }
      
      return true;
    });
  }, [designs]);

  return {
    designs,
    loading,
    error,
    clearError,
    createOrUpdateDesign,
    removeDesign,
    getDesignById,
    saveDesigns,
    filterDesigns
  };
};

export default useDesigns;