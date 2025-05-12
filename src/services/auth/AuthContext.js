import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  isAuthenticated as checkAuth,
  updateUser
} from './auth';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from local storage on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Clear any error messages
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      const newUser = await registerUser(userData);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  // Log in a user
  const login = async (email, password) => {
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  // Log out the current user
  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!currentUser) {
        setError('No user is logged in');
        throw new Error('No user is logged in');
      }
      
      const updatedUser = await updateUser(updates);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Profile update failed. Please try again.');
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    clearError,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
