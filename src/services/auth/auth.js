/**
 * Authentication Service for Pressly MVP
 * 
 * This service handles user registration, login, and session management.
 * In a production environment, this would interact with a backend API.
 */

// Mock user database (this would be on the server in a real app)
let users = JSON.parse(localStorage.getItem('pressly_users') || '[]');

// Add default test users if none exist
if (users.length === 0) {
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
      is_active: true
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
      is_active: true
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
      is_active: true
    }
  ];
  saveUsers();
}

// Constants
const LOCAL_STORAGE_TOKEN_KEY = 'pressly_auth_token';
const LOCAL_STORAGE_USER_KEY = 'pressly_current_user';

/**
 * Save the user database to localStorage
 * This simulates a database in a real application
 */
const saveUsers = () => {
  localStorage.setItem('pressly_users', JSON.stringify(users));
};

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
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
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
  return users.find(user => user.email === email) || null;
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
          role = userData.businessName ? 'producer' : 'designer';
        }
        
        // Create new user object
        const newUser = {
          id: generateId(),
          email: userData.email,
          password: userData.password, // In a real app, this would be hashed
          fullName: userData.fullName,
          phone: userData.phone || null,
          role: role, // Ensure role is set correctly
          businessName: userData.businessName || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true
        };
        
        // Add to "database"
        users.push(newUser);
        saveUsers();
        
        // Generate token
        const token = generateToken(newUser.id);
        
        // Save session using secure cookies instead of localStorage
        import('./authCookies').then(({ setAuthToken, setCurrentUser }) => {
          // Set auth token
          setAuthToken(token);
          
          // Save current user (without password)
          const userWithoutPassword = { ...newUser };
          delete userWithoutPassword.password;
          setCurrentUser(userWithoutPassword);
        }).catch(err => console.error('Error loading auth cookies module:', err));
        
        // Fallback to localStorage if cookie import fails
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userWithoutPassword));
        
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
        // Find user
        const user = getUserByEmail(email);
        
        // Check if user exists and password matches
        if (!user || user.password !== password) {
          reject(new Error('Invalid email or password'));
          return;
        }
        
        // Handle missing role - default to 'designer' if not specified
        if (!user.role) {
          user.role = 'designer';
          
          // Update user in "database"
          const userIndex = users.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            users[userIndex] = user;
            saveUsers();
          }
        }
        
        // Generate token
        const token = generateToken(user.id);
        
        // Save session using secure cookies instead of localStorage
        import('./authCookies').then(({ setAuthToken, setCurrentUser }) => {
          // Set auth token
          setAuthToken(token);
          
          // Save current user (without password)
          const userWithoutPassword = { ...user };
          delete userWithoutPassword.password;
          setCurrentUser(userWithoutPassword);
        }).catch(err => console.error('Error loading auth cookies module:', err));
        
        // Fallback to localStorage if cookie import fails
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userWithoutPassword));
        
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
      // Clear session from cookies
      import('./authCookies').then(({ clearAuth }) => {
        clearAuth();
      }).catch(err => console.error('Error loading auth cookies module:', err));
      
      // Also clear localStorage for backward compatibility
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      
      resolve();
    }, 300);
  });
};

/**
 * Get the current authenticated user
 * @returns {Object|null} - The current user or null if not authenticated
 */
export const getCurrentUser = () => {
  // Try to get user from cookies first
  let user = null;
  
  try {
    // Use dynamic import for cookies to avoid issues with SSR
    const cookieModule = require('./authCookies');
    user = cookieModule.getCurrentUser();
  } catch (err) {
    // Fallback to localStorage if cookie module is not available
    console.log('Falling back to localStorage for user data');
  }
  
  // If not found in cookies, try localStorage
  if (!user) {
    const userJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    user = userJson ? JSON.parse(userJson) : null;
  }
  
  return user;
};

/**
 * Check if a user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
  // Try to use cookie authentication first
  try {
    const cookieModule = require('./authCookies');
    if (cookieModule.isAuthenticated()) {
      return true;
    }
  } catch (err) {
    // Fallback to localStorage if cookie module is not available
    console.log('Falling back to localStorage for auth check');
  }
  
  // Fallback to localStorage check
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
        
        // Update current user in localStorage (without password)
        const userWithoutPassword = { ...updatedUser };
        delete userWithoutPassword.password;
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userWithoutPassword));
        
        // Return updated user data without password
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  updateUser
};
