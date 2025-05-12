import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../auth/AuthContext';

// Create the Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentUser, updateUserProfile } = useAuth();
  
  // Get the initial theme from localStorage or use default 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    
    // Check if theme exists in localStorage
    if (savedTheme) return savedTheme;
    
    // Check for user preference in settings
    if (currentUser?.settings?.appSettings?.theme) {
      return currentUser.settings.appSettings.theme;
    }
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light theme
    return 'light';
  });

  // Update body class when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update user settings if logged in
    if (currentUser && currentUser.settings) {
      const updatedUser = {
        ...currentUser,
        settings: {
          ...currentUser.settings,
          appSettings: {
            ...currentUser.settings.appSettings,
            theme: theme
          }
        }
      };
      
      // Only update if theme has changed
      if (currentUser.settings?.appSettings?.theme !== theme) {
        updateUserProfile(updatedUser).catch(err => 
          console.error('Failed to update theme in user settings', err)
        );
      }
    }
  }, [theme, currentUser, updateUserProfile]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  // Set a specific theme
  const setThemeMode = (mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      if (mode === 'system') {
        const systemPreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
        setTheme(systemPreference);
      } else {
        setTheme(mode);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;