/**
 * Mock API service for Pressly MVP
 * 
 * This simulates a backend API for saving designs and uploading files.
 * In a production environment, this would be replaced with actual API calls.
 * 
 * Extended for ZUO-Pressly Integration with consumer endpoints
 */

import { validateFile, storeFileLocally } from '../utils/fileStorage';
import { 
  getConsumerProducers, 
  createConsumerOrder, 
  getConsumerOrders 
} from './consumerApi';
import { getCurrentUser } from './auth/auth';
import { INTERFACE_TYPES } from '../models/userExtensions';

// In-memory storage for uploaded files
const uploadedFiles = {};

// Mock database for designs
let designs = [];

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Upload a file and return a file URL
 * @param {File} file - The file to upload
 * @returns {Promise} - Promise with the file URL
 */
export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    // Validate the file first
    const validation = validateFile(file);
    if (!validation.valid) {
      reject(new Error(validation.message));
      return;
    }
    
    // Simulate network delay
    setTimeout(async () => {
      try {
        // Store the file locally (in a real app, this would upload to a server)
        const fileData = await storeFileLocally(file);
        
        // Store file metadata in our mock storage
        uploadedFiles[fileData.id] = {
          id: fileData.id,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          url: fileData.url
        };
        
        resolve(fileData);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

/**
 * Create a new design
 * @param {Object} designData - The design data
 * @returns {Promise} - Promise with the created design
 */
export const createDesign = (designData) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        const id = generateId();
        const newDesign = {
          id,
          ...designData,
          status: 'Draft',
          created_at: new Date().toISOString()
        };
        
        // Save to our mock database
        designs = [newDesign, ...designs];
        
        resolve(newDesign);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Get all designs
 * @returns {Promise} - Promise with all designs
 */
export const getDesigns = () => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve([...designs]);
    }, 300);
  });
};

/**
 * Get a design by ID
 * @param {string} id - The design ID
 * @returns {Promise} - Promise with the design
 */
export const getDesignById = (id) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const design = designs.find(d => d.id === id);
      if (design) {
        resolve(design);
      } else {
        reject(new Error('Design not found'));
      }
    }, 300);
  });
};

/**
 * Get producers based on user interface preference
 * @param {Object} filters - Filter options
 * @returns {Promise} - Promise with producers list
 */
export const getProducersForInterface = async (filters = {}) => {
  const user = getCurrentUser();
  const interfaceType = filters.interface_type || user?.interface_preference || INTERFACE_TYPES.ZUO_CONSUMER;
  
  if (interfaceType === INTERFACE_TYPES.ZUO_CONSUMER) {
    // Return simplified consumer producers
    return getConsumerProducers(filters);
  }
  
  // Return full producer data for professional interface
  const { getAllProducers } = await import('./producers');
  return getAllProducers(filters);
};

/**
 * Create order based on interface type
 * @param {Object} orderData - Order data
 * @returns {Promise} - Promise with created order
 */
export const createOrder = async (orderData) => {
  const user = getCurrentUser();
  const interfaceSource = orderData.interface_source || 
    (user?.interface_preference === INTERFACE_TYPES.ZUO_CONSUMER ? 'zuo' : 'pressly');
  
  if (interfaceSource === 'zuo') {
    // Use consumer order flow
    return createConsumerOrder(orderData);
  }
  
  // Use professional order flow (existing implementation)
  return createProfessionalOrder(orderData);
};

/**
 * Get user orders based on interface
 * @returns {Promise} - Promise with orders list
 */
export const getUserOrders = async () => {
  const user = getCurrentUser();
  
  if (user?.interface_preference === INTERFACE_TYPES.ZUO_CONSUMER) {
    return getConsumerOrders();
  }
  
  // Return professional orders (existing implementation)
  return getProfessionalOrders(user.id);
};

// Mock implementation of professional order functions
const createProfessionalOrder = async (orderData) => {
  // Existing order creation logic
  const order = {
    id: generateId(),
    ...orderData,
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  
  // Store order
  const orders = JSON.parse(localStorage.getItem('pressly_orders') || '[]');
  orders.push(order);
  localStorage.setItem('pressly_orders', JSON.stringify(orders));
  
  return order;
};

const getProfessionalOrders = async (userId) => {
  // Get all orders from localStorage
  const allOrders = JSON.parse(localStorage.getItem('pressly_orders') || '[]');
  
  // Filter user's orders
  return allOrders.filter(order => order.user_id === userId);
};

export default {
  uploadFile,
  createDesign,
  getDesigns,
  getDesignById,
  getProducersForInterface,
  createOrder,
  getUserOrders
};
