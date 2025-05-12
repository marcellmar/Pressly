import { useState, useEffect, useCallback } from 'react';
import { 
  getPortfolio, 
  savePortfolio as savePortfolioToStorage,
  getPortfolioItems,
  savePortfolioItems as savePortfolioItemsToStorage,
  getDesignById
} from '../utils/localStorage';

/**
 * Custom hook for managing portfolio with local storage integration
 * @returns {Object} - Methods and state for managing portfolio
 */
const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Load portfolio and items from local storage on mount
  useEffect(() => {
    try {
      const storedPortfolio = getPortfolio();
      const storedItems = getPortfolioItems();
      
      setPortfolio(storedPortfolio);
      setPortfolioItems(storedItems);
      setLoading(false);
    } catch (err) {
      console.error('Error loading portfolio from local storage:', err);
      setError('Failed to load portfolio');
      setLoading(false);
    }
  }, []);

  // Clear error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create or update portfolio
  const createPortfolio = useCallback(async (portfolioData) => {
    try {
      const newPortfolio = {
        ...portfolioData,
        id: `portfolio-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const success = savePortfolioToStorage(newPortfolio);
      
      if (success) {
        setPortfolio(newPortfolio);
      }
      
      return newPortfolio;
    } catch (err) {
      console.error('Error creating portfolio:', err);
      setError('Failed to create portfolio');
      throw err;
    }
  }, []);

  // Update portfolio
  const updatePortfolio = useCallback(async (portfolioData) => {
    try {
      if (!portfolio) {
        throw new Error('No portfolio exists to update');
      }
      
      const updatedPortfolio = {
        ...portfolio,
        ...portfolioData,
        updatedAt: new Date().toISOString()
      };
      
      const success = savePortfolioToStorage(updatedPortfolio);
      
      if (success) {
        setPortfolio(updatedPortfolio);
      }
      
      return updatedPortfolio;
    } catch (err) {
      console.error('Error updating portfolio:', err);
      setError('Failed to update portfolio');
      throw err;
    }
  }, [portfolio]);

  // Add design to portfolio
  const addDesignToPortfolio = useCallback(async (designId, displaySettings = {}) => {
    try {
      const design = getDesignById(designId);
      
      if (!design) {
        throw new Error(`Design with ID ${designId} not found`);
      }
      
      if (!portfolio) {
        throw new Error('No portfolio exists');
      }
      
      const newItem = {
        id: `portfolio-item-${Date.now()}`,
        portfolioId: portfolio.id,
        designId: designId,
        design: design, // Include design data for easy access
        displaySettings: displaySettings,
        displayOrder: portfolioItems.length, // Add at the end
        createdAt: new Date().toISOString()
      };
      
      const updatedItems = [...portfolioItems, newItem];
      const success = savePortfolioItemsToStorage(updatedItems);
      
      if (success) {
        setPortfolioItems(updatedItems);
      }
      
      return newItem;
    } catch (err) {
      console.error('Error adding design to portfolio:', err);
      setError('Failed to add design to portfolio');
      throw err;
    }
  }, [portfolio, portfolioItems]);

  // Remove design from portfolio
  const removeDesignFromPortfolio = useCallback(async (portfolioItemId) => {
    try {
      const updatedItems = portfolioItems.filter(item => item.id !== portfolioItemId);
      
      // Reorder remaining items
      updatedItems.forEach((item, index) => {
        item.displayOrder = index;
      });
      
      const success = savePortfolioItemsToStorage(updatedItems);
      
      if (success) {
        setPortfolioItems(updatedItems);
      }
      
      return success;
    } catch (err) {
      console.error('Error removing design from portfolio:', err);
      setError('Failed to remove design from portfolio');
      throw err;
    }
  }, [portfolioItems]);

  // Update portfolio item
  const updatePortfolioItem = useCallback(async (itemId, updateData) => {
    try {
      const itemIndex = portfolioItems.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        throw new Error(`Portfolio item with ID ${itemId} not found`);
      }
      
      const updatedItems = [...portfolioItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      const success = savePortfolioItemsToStorage(updatedItems);
      
      if (success) {
        setPortfolioItems(updatedItems);
      }
      
      return updatedItems[itemIndex];
    } catch (err) {
      console.error('Error updating portfolio item:', err);
      setError('Failed to update portfolio item');
      throw err;
    }
  }, [portfolioItems]);

  // Reorder portfolio items
  const reorderPortfolioItems = useCallback(async (itemIds) => {
    try {
      // Create a map of items by ID for quick lookup
      const itemsMap = portfolioItems.reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {});
      
      // Create new array with updated order
      const updatedItems = itemIds.map((id, index) => {
        const item = itemsMap[id];
        if (!item) {
          throw new Error(`Portfolio item with ID ${id} not found`);
        }
        
        return {
          ...item,
          displayOrder: index
        };
      });
      
      const success = savePortfolioItemsToStorage(updatedItems);
      
      if (success) {
        setPortfolioItems(updatedItems);
      }
      
      return updatedItems;
    } catch (err) {
      console.error('Error reordering portfolio items:', err);
      setError('Failed to reorder portfolio items');
      throw err;
    }
  }, [portfolioItems]);

  // Generate analytics data for the portfolio
  const fetchPortfolioStats = useCallback(async () => {
    try {
      // For the MVP, we'll generate mock analytics data
      // In a real app, this would call an API
      const mockStats = {
        views: Math.floor(Math.random() * 500) + 100,
        uniqueVisitors: Math.floor(Math.random() * 200) + 50,
        conversionRate: Math.floor(Math.random() * 10) + 1,
        topReferrers: [
          { source: 'Direct', count: Math.floor(Math.random() * 100) + 20 },
          { source: 'Google', count: Math.floor(Math.random() * 80) + 10 },
          { source: 'Instagram', count: Math.floor(Math.random() * 50) + 5 },
          { source: 'Behance', count: Math.floor(Math.random() * 30) + 5 }
        ]
      };
      
      setStats(mockStats);
      return mockStats;
    } catch (err) {
      console.error('Error fetching portfolio stats:', err);
      setError('Failed to fetch portfolio statistics');
      throw err;
    }
  }, []);

  return {
    portfolio,
    portfolioItems,
    loading,
    error,
    clearError,
    stats,
    createPortfolio,
    updatePortfolio,
    addDesignToPortfolio,
    removeDesignFromPortfolio,
    updatePortfolioItem,
    reorderPortfolioItems,
    fetchPortfolioStats
  };
};

export default usePortfolio;