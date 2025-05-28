import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';

const EnhancedProtectedRoute = ({ children, requiredRole = null, allowGuest = false }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-secondary)'
      }}>
        <div className="spinner" />
      </div>
    );
  }
  
  // Allow guest access if specified
  if (allowGuest && !isAuthenticated) {
    return children;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check role requirements
  if (requiredRole && currentUser?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and has the required role (if any)
  return children;
};

export default EnhancedProtectedRoute;