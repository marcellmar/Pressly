import React from 'react';
import { AuthProvider } from '../../services/auth/AuthContext';
import { DesignProvider } from '../../services/designs/DesignProvider';
import { PortfolioProvider } from '../../services/portfolio/PortfolioProvider';

/**
 * Main application layout with all providers
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Application layout
 */
const AppLayout = ({ children }) => {
  return (
    <AuthProvider>
      <DesignProvider>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </DesignProvider>
    </AuthProvider>
  );
};

export default AppLayout;