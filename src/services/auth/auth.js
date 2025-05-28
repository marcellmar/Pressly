/**
 * Authentication Service for Pressly MVP
 * 
 * This service handles user registration, login, and session management.
 * In a production environment, this would interact with a backend API.
 * 
 * Extended for ZUO-Pressly Integration with dual-platform support
 */

import { 
  extendUserWithZuoFields, 
  updateUserProgress,
  INTERFACE_TYPES,
  ZUO_LEVELS 
} from '../../models/userExtensions';

// Constants
const LOCAL_STORAGE_TOKEN_KEY = 'pressly_auth_token';
const LOCAL_STORAGE_USER_KEY = 'pressly_current_user';
const SESSION_EXPIRY_KEY = 'pressly_session_expires';
const SESSION_EXPIRY_LENGTH = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Save the user database to localStorage
 * This simulates a database in a real application
 */
const saveUsers = () => {
  localStorage.setItem('pressly_users', JSON.stringify(users));
};

// Mock user database (this would be on the server in a real app)
let users = JSON.parse(localStorage.getItem('pressly_users') || '[]');

// Function to initialize demo users
const initializeDemoUsers = () => {
  users = [
    {
      id: 'designer-123',
      email: 'designer@pressly.com',
      password: 'password123',
      fullName: 'Design Creator',
      phone: '555-123-4567',
      role: 'designer',
      businessName: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      // ZUO Integration fields
      interface_preference: INTERFACE_TYPES.PRESSLY_PROFESSIONAL,
      zuo_level: ZUO_LEVELS.BASIC_CONSUMER,
      consumer_orders_count: 0,
      producer_mode_eligible: false,
      last_interface_used: 'pressly'
    },
    {
      id: 'producer-456',
      email: 'producer@pressly.com',
      password: 'password123',
      fullName: 'Print Producer',
      phone: '555-987-6543',
      role: 'producer',
      businessName: 'Quality Print Services',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      // ZUO Integration fields
      interface_preference: INTERFACE_TYPES.PRESSLY_PROFESSIONAL,
      zuo_level: ZUO_LEVELS.PRODUCER_ELIGIBLE,
      consumer_orders_count: 15,
      producer_mode_eligible: true,
      last_interface_used: 'pressly'
    },
    {
      id: 'admin-789',
      email: 'admin@pressly.com',
      password: 'password123',
      fullName: 'Admin User',
      phone: '555-789-1234',
      role: 'admin',
      businessName: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      // ZUO Integration fields
      interface_preference: INTERFACE_TYPES.PRESSLY_PROFESSIONAL,
      zuo_level: ZUO_LEVELS.PRODUCER_ELIGIBLE,
      consumer_orders_count: 0,
      producer_mode_eligible: true,
      last_interface_used: 'pressly'
    },
    // New consumer test user
    {
      id: 'consumer-101',
      email: 'consumer@zuo.com',
      password: 'password123',
      fullName: 'New Consumer',
      phone: '555-000-1111',
      role: 'consumer',
      businessName: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      // ZUO Integration fields
      interface_preference: INTERFACE_TYPES.ZUO_CONSUMER,
      zuo_level: ZUO_LEVELS.BASIC_CONSUMER,
      consumer_orders_count: 0,
      producer_mode_eligible: false,
      last_interface_used: 'zuo',
      simplified_onboarding: true
    },
    // Power user test account
    {
      id: 'power-user-202',
      email: 'power@zuo.com',
      password: 'password123',
      fullName: 'Power User',
      phone: '555-000-2222',
      role: 'consumer',
      businessName: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      // ZUO Integration fields
      interface_preference: INTERFACE_TYPES.ZUO_CONSUMER,
      zuo_level: ZUO_LEVELS.POWER_USER,
      consumer_orders_count: 7,
      producer_mode_eligible: false,
      last_interface_used: 'zuo',
      simplified_onboarding: false
    }
  ];
  saveUsers();
};

// Initialize demo users if they don't exist
if (users.length === 0) {
  initializeDemoUsers();
}

// Ensure demo accounts always exist
const ensureDemoAccounts = () => {
  const demoEmails = ['designer@pressly.com', 'producer@pressly.com'];
  const missingDemos = demoEmails.filter(email => !users.find(u => u.email === email));
  
  if (missingDemos.length > 0) {
    // Re-initialize all demo users if any are missing
    initializeDemoUsers();
  }
};

// Check demo accounts on every load
ensureDemoAccounts();

/**
 * Generate a unique ID
 * @returns {string} - A unique ID
 */
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Generate a JWT-like token (for demo purposes)
 * @param {string} userId - The user ID
 * @returns {string} - A mock JWT token
 */
const generateToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    name: getUserById(userId).email,
    iat: Date.now(),
    exp: Date.now() + SESSION_EXPIRY_LENGTH
  }));
  const signature = btoa(Math.random().toString(36).substring(2));
  
  return `${header}.${payload}.${signature}`;
};

/**
 * Get a user by ID
 * @param {string} id - The user ID
 * @returns {Object|null} - The user object or null if not found
 */
const getUserById = (id) => {
  return users.find(user => user.id === id) || null;
};

/**
 * Get a user by email
 * @param {string} email - The user email
 * @returns {Object|null} - The user object or null if not found
 */
const getUserByEmail = (email) => {
  // Reload users from localStorage to ensure we have the latest data
  users = JSON.parse(localStorage.getItem('pressly_users') || '[]');
  
  // Ensure demo accounts exist
  if (users.length === 0) {
    initializeDemoUsers();
    users = JSON.parse(localStorage.getItem('pressly_users') || '[]');
  }
  
  return users.find(user => user.email === email) || null;
};

/**
 * Save authentication session with expiry time
 * @param {string} token - The auth token
 * @param {Object} user - The user object to save
 */
const saveAuthSession = (token, user) => {
  // Set token and user in localStorage
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  
  // Set session expiry timestamp
  const expiryTime = Date.now() + SESSION_EXPIRY_LENGTH;
  localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with the registered user data (without password)
 */
export const registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      try {
        // Check if email already exists
        if (getUserByEmail(userData.email)) {
          reject(new Error('Email already registered'));
          return;
        }
        
        // Determine role based on whether businessName is provided
        let role = userData.role;
        if (!role) {
          // Default new users to consumer role unless they have a business name
          role = userData.businessName ? 'producer' : 'consumer';
        }
        
        // Determine interface based on role
        const interfacePreference = role === 'consumer' ? 
          INTERFACE_TYPES.ZUO_CONSUMER : 
          INTERFACE_TYPES.PRESSLY_PROFESSIONAL;
        
        // Create new user object with ZUO fields
        const baseUser = {
          id: generateId(),
          email: userData.email,
          password: userData.password, // In a real app, this would be hashed
          fullName: userData.fullName,
          phone: userData.phone || null,
          role: role, // Ensure role is set correctly
          businessName: userData.businessName || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          // ZUO Integration fields
          interface_preference: interfacePreference,
          zuo_level: ZUO_LEVELS.BASIC_CONSUMER,
          consumer_orders_count: 0,
          producer_mode_eligible: false,
          last_interface_used: interfacePreference === INTERFACE_TYPES.ZUO_CONSUMER ? 'zuo' : 'pressly',
          simplified_onboarding: role === 'consumer'
        };
        
        // Extend with full ZUO fields
        const newUser = extendUserWithZuoFields(baseUser);
        
        // Add to "database"
        users.push(newUser);
        saveUsers();
        
        // Generate token
        const token = generateToken(newUser.id);
        
        // Create user object without password and extend with ZUO fields
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        
        // Save authentication session
        saveAuthSession(token, userWithoutPassword);
        
        // Return user data without password
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with the logged in user data (without password)
 */
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      try {
        // Ensure demo accounts exist before login attempt
        ensureDemoAccounts();
        
        // Log login attempt
        console.log('Login attempt for:', email);
        
        // Find user
        const user = getUserByEmail(email);
        
        // Log user found status
        console.log('User found:', !!user);
        
        // Check if user exists and password matches
        if (!user || user.password !== password) {
          console.log('Login failed - user not found or password mismatch');
          reject(new Error('Invalid email or password'));
          return;
        }
        
        // Handle missing role - default to 'consumer' if not specified
        if (!user.role) {
          user.role = 'consumer';
        }
        
        // Extend user with ZUO fields if they don't exist
        let extendedUser = user;
        if (!user.interface_preference) {
          extendedUser = extendUserWithZuoFields(user);
          
          // Update user in "database"
          const userIndex = users.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            users[userIndex] = extendedUser;
            saveUsers();
          }
        }
        
        // Update last interface used
        extendedUser.last_interface_used = extendedUser.interface_preference === INTERFACE_TYPES.ZUO_CONSUMER ? 'zuo' : 'pressly';
        
        // Generate token
        const token = generateToken(extendedUser.id);
        
        // Create user object without password
        const userWithoutPassword = { ...extendedUser };
        delete userWithoutPassword.password;
        
        // Save authentication session
        saveAuthSession(token, userWithoutPassword);
        
        // Return user data without password
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Logout the current user
 * @returns {Promise} - Promise that resolves when logout is complete
 */
export const logoutUser = () => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Clear localStorage items
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      
      resolve();
    }, 300);
  });
};

/**
 * Check if the authentication session is still valid
 * @returns {boolean} - Whether the session is still valid
 */
export const isSessionValid = () => {
  const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!expiryTime) return false;
  
  return Date.now() < parseInt(expiryTime, 10);
};

/**
 * Get the current authenticated user
 * @returns {Object|null} - The current user or null if not authenticated
 */
export const getCurrentUser = () => {
  // Check if session is still valid
  if (!isSessionValid()) {
    // Clear expired session
    logoutUser();
    return null;
  }
  
  // Get user from localStorage
  const userJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Check if a user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
  // Check if session is valid
  if (!isSessionValid()) {
    return false;
  }
  
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const user = getCurrentUser();
  
  return !!token && !!user;
};

/**
 * Update current user's profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} - Promise with the updated user data
 */
export const updateUser = (userData) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      try {
        // Get current user
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
          reject(new Error('Not authenticated'));
          return;
        }
        
        // Find user in "database"
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }
        
        // Update user data (keeping password and id)
        const updatedUser = {
          ...users[userIndex],
          ...userData,
          id: users[userIndex].id, // Ensure ID doesn't change
          password: users[userIndex].password, // Keep original password
          updated_at: new Date().toISOString()
        };
        
        // Update in "database"
        users[userIndex] = updatedUser;
        saveUsers();
        
        // Create updated user without password
        const userWithoutPassword = { ...updatedUser };
        delete userWithoutPassword.password;
        
        // Update in localStorage
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userWithoutPassword));
        
        // Reset session expiry (extends the session)
        const expiryTime = Date.now() + SESSION_EXPIRY_LENGTH;
        localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
        
        // Return updated user data without password
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Refresh the current authentication session
 * @returns {Promise<boolean>} - Promise that resolves to true if session was refreshed, false otherwise
 */
export const refreshSession = () => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const currentUser = getCurrentUser();
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      
      if (!currentUser || !token) {
        resolve(false);
        return;
      }
      
      // Reset session expiry (extends the session)
      const expiryTime = Date.now() + SESSION_EXPIRY_LENGTH;
      localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
      
      resolve(true);
    }, 200);
  });
};

/**
 * Increment user's consumer order count and update their ZUO level
 * @param {string} userId - The user ID
 * @returns {Promise} - Promise with the updated user data
 */
export const incrementUserOrders = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Find user in "database"
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }
        
        // Update user progress
        const updatedUser = updateUserProgress(users[userIndex]);
        
        // Update in "database"
        users[userIndex] = updatedUser;
        saveUsers();
        
        // Create user object without password
        const userWithoutPassword = { ...updatedUser };
        delete userWithoutPassword.password;
        
        // Update in localStorage if it's the current user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userWithoutPassword));
        }
        
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

/**
 * Switch user interface preference
 * @param {string} interfaceType - The interface to switch to
 * @returns {Promise} - Promise with the updated user data
 */
export const switchInterface = (interfaceType) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
          reject(new Error('Not authenticated'));
          return;
        }
        
        // Find user in "database"
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }
        
        // Update interface preference
        users[userIndex].interface_preference = interfaceType;
        users[userIndex].last_interface_used = interfaceType === INTERFACE_TYPES.ZUO_CONSUMER ? 'zuo' : 'pressly';
        users[userIndex].updated_at = new Date().toISOString();
        
        saveUsers();
        
        // Create user object without password
        const userWithoutPassword = { ...users[userIndex] };
        delete userWithoutPassword.password;
        
        // Update in localStorage
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userWithoutPassword));
        
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Create a named export object
const authService = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  updateUser,
  refreshSession,
  isSessionValid,
  incrementUserOrders,
  switchInterface
};

export default authService;

// Debug utilities for development
if (typeof window !== 'undefined') {
  window.debugAuth = {
    listUsers: () => {
      const currentUsers = JSON.parse(localStorage.getItem('pressly_users') || '[]');
      console.table(currentUsers.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      }));
      return currentUsers.length;
    },
    resetDemoAccounts: () => {
      localStorage.removeItem('pressly_users');
      localStorage.removeItem('pressly_auth_token');
      localStorage.removeItem('pressly_current_user');
      localStorage.removeItem('pressly_session_expires');
      console.log('Demo accounts reset. Reloading...');
      window.location.reload();
    },
    getCurrentSession: () => {
      const token = localStorage.getItem('pressly_auth_token');
      const user = localStorage.getItem('pressly_current_user');
      const expires = localStorage.getItem('pressly_session_expires');
      console.log('Current session:', {
        hasToken: !!token,
        user: user ? JSON.parse(user) : null,
        expires: expires ? new Date(parseInt(expires)) : null,
        isValid: isSessionValid()
      });
    }
  };
  console.log('Debug auth utilities available at window.debugAuth');
}