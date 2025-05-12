import React, { createContext, useContext } from 'react';
import useDesigns from '../../hooks/useDesigns';

// Create context
const DesignContext = createContext(null);

/**
 * Provider component for design management
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const DesignProvider = ({ children }) => {
  const designsData = useDesigns();

  return (
    <DesignContext.Provider value={designsData}>
      {children}
    </DesignContext.Provider>
  );
};

/**
 * Hook to use design context
 * @returns {Object} - Design context value
 */
export const useDesignContext = () => {
  const context = useContext(DesignContext);
  
  if (!context) {
    throw new Error('useDesignContext must be used within a DesignProvider');
  }
  
  return context;
};
