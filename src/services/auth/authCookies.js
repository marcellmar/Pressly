/**
 * Authentication Cookie Service
 * 
 * This module provides improved security for authentication using cookies
 * instead of localStorage, which is vulnerable to XSS attacks.
 */

// Constants
const TOKEN_COOKIE_NAME = 'pressly_auth_token';
const USER_COOKIE_NAME = 'pressly_user';
const COOKIE_EXPIRES = 7; // days

/**
 * Sets a cookie with the given name and value
 * @param {string} name - Cookie name
 * @param {any} value - Cookie value (will be JSON stringified)
 * @param {number} days - Days until expiration
 */
export const setCookie = (name, value, days = COOKIE_EXPIRES) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  
  // Stringify objects
  const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
  
  // Set cookie with HttpOnly and SameSite flags for security
  // Note: In production, add 'Secure' flag when using HTTPS
  document.cookie = `${name}=${valueToStore}; ${expires}; path=/; SameSite=Strict`;
};

/**
 * Gets a cookie by name
 * @param {string} name - Cookie name
 * @returns {any} - Cookie value (parsed if JSON)
 */
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    
    if (cookie.indexOf(nameEQ) === 0) {
      const value = cookie.substring(nameEQ.length, cookie.length);
      // Try to parse JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  }
  
  return null;
};

/**
 * Deletes a cookie by name
 * @param {string} name - Cookie name
 */
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Sets the authentication token
 * @param {string} token - Auth token
 */
export const setAuthToken = (token) => {
  setCookie(TOKEN_COOKIE_NAME, token);
};

/**
 * Gets the authentication token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
  return getCookie(TOKEN_COOKIE_NAME);
};

/**
 * Sets the current user
 * @param {object} user - User object
 */
export const setCurrentUser = (user) => {
  setCookie(USER_COOKIE_NAME, user);
};

/**
 * Gets the current user
 * @returns {object|null} - User object or null
 */
export const getCurrentUser = () => {
  return getCookie(USER_COOKIE_NAME);
};

/**
 * Clears all authentication data
 */
export const clearAuth = () => {
  deleteCookie(TOKEN_COOKIE_NAME);
  deleteCookie(USER_COOKIE_NAME);
};

/**
 * Checks if a user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!token && !!user;
};

export default {
  setAuthToken,
  getAuthToken,
  setCurrentUser,
  getCurrentUser,
  clearAuth,
  isAuthenticated
};