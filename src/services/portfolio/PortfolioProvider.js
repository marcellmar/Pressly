import React, { createContext, useContext } from 'react';
import usePortfolio from '../../hooks/usePortfolio';

// Create context
const PortfolioContext = createContext(null);

/**
 * Provider component for portfolio management
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const PortfolioProvider = ({ children }) => {
  const portfolioData = usePortfolio();

  return (
    <PortfolioContext.Provider value={portfolioData}>
      {children}
    </PortfolioContext.Provider>
  );
};

/**
 * Hook to use portfolio context
 * @returns {Object} - Portfolio context value
 */
export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  
  if (!context) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider');
  }
  
  return context;
};
