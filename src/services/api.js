/**
 * Mock API service for Pressly MVP
 * 
 * This simulates a backend API for saving designs and uploading files.
 * In a production environment, this would be replaced with actual API calls.
 */

import { validateFile, storeFileLocally } from '../utils/fileStorage';

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

export default {
  uploadFile,
  createDesign,
  getDesigns,
  getDesignById
};
