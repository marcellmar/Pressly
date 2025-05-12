/**
 * File Storage Utility for Pressly MVP
 * 
 * This module handles file operations including:
 * - File validation
 * - Storage of files using IndexedDB (for larger files)
 * - File type detection and previewing
 */
import IndexedDBService from '../services/storage/indexedDBService';

// Maximum file size in bytes (100MB)
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  // Images
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  
  // Documents
  'application/pdf',
  
  // Design files
  'application/postscript', // .ai
  'image/vnd.adobe.photoshop', // .psd
  'application/eps', // .eps
  'application/x-eps',
  'application/illustrator', // Another MIME for .ai
  'application/x-indesign', // .indd
  'application/x-coreldraw', // .cdr
  'application/x-photoshop' // Another MIME for .psd
];

// File extensions to MIME types mapping (for files where the browser doesn't detect properly)
export const FILE_EXTENSIONS = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'webp': 'image/webp',
  'pdf': 'application/pdf',
  'ai': 'application/postscript',
  'psd': 'image/vnd.adobe.photoshop',
  'eps': 'application/eps',
  'indd': 'application/x-indesign',
  'cdr': 'application/x-coreldraw'
};

// IndexedDB store for file data
const FILE_STORE = IndexedDBService.STORES.DESIGNS;

/**
 * Validate a file against size and type restrictions
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result with status and message
 */
export const validateFile = (file) => {
  // Check if file exists
  if (!file) {
    return { valid: false, message: 'No file provided' };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      message: `File size exceeds maximum allowed size (${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB)`
    };
  }
  
  // Get file extension
  const fileName = file.name || '';
  const fileExtension = fileName.split('.').pop().toLowerCase();
  
  // Check file type from MIME or extension
  const fileType = file.type || FILE_EXTENSIONS[fileExtension];
  if (!fileType || !ALLOWED_FILE_TYPES.includes(fileType)) {
    return { 
      valid: false, 
      message: 'File type not supported. Please upload a supported file type.'
    };
  }
  
  return { valid: true };
};

/**
 * Determine if a file is an image that can be previewed
 * @param {File} file - The file to check
 * @returns {boolean} - Whether the file is a previewable image
 */
export const isPreviewableImage = (file) => {
  if (!file) return false;
  
  const fileType = file.type;
  return fileType.startsWith('image/') && fileType !== 'image/vnd.adobe.photoshop';
};

/**
 * Get a file icon based on file type
 * @param {string} fileType - The MIME type of the file
 * @returns {string} - CSS class for the appropriate icon
 */
export const getFileIcon = (fileType) => {
  if (!fileType) return 'fa-file';
  
  if (fileType.startsWith('image/')) {
    return 'fa-file-image';
  } else if (fileType === 'application/pdf') {
    return 'fa-file-pdf';
  } else if (fileType.includes('photoshop') || fileType.includes('postscript') || 
             fileType.includes('illustrator') || fileType.includes('eps') ||
             fileType.includes('indesign') || fileType.includes('coreldraw')) {
    return 'fa-file-design';
  }
  
  return 'fa-file';
};

/**
 * Convert a File object to an ArrayBuffer
 * @param {File} file - The file to convert
 * @returns {Promise<ArrayBuffer>} - Promise that resolves with the file's ArrayBuffer
 */
const fileToArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generate a thumbnail for image files
 * @param {File} file - The image file
 * @param {number} maxWidth - Maximum thumbnail width
 * @param {number} maxHeight - Maximum thumbnail height
 * @returns {Promise<string>} - Promise that resolves with the thumbnail data URL
 */
export const generateThumbnail = async (file, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    if (!isPreviewableImage(file)) {
      resolve(null);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate thumbnail dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }
        
        // Create canvas and draw the thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to data URL
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnailUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for thumbnail generation'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file for thumbnail generation'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Store a file using IndexedDB
 * @param {File} file - The file to store
 * @param {Object} metadata - Additional metadata for the file
 * @returns {Promise<Object>} - Promise with storage info
 */
export const storeFile = async (file, metadata = {}) => {
  try {
    // Validate the file first
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.message);
    }
    
    // Generate a unique file ID if not provided
    const fileId = metadata.id || crypto.randomUUID();
    
    // Generate thumbnail for previewable images
    let thumbnail = null;
    if (isPreviewableImage(file)) {
      thumbnail = await generateThumbnail(file);
    }
    
    // Convert file to ArrayBuffer for storage
    const fileData = await fileToArrayBuffer(file);
    
    // Prepare the design object for storage
    const design = {
      id: fileId,
      name: file.name,
      fileName: file.name, // For backward compatibility
      type: file.type,
      fileType: file.type, // For backward compatibility
      size: file.size,
      lastModified: file.lastModified,
      createdAt: metadata.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: metadata.description || '',
      tags: metadata.tags || [],
      category: metadata.category || 'uncategorized',
      thumbnail: thumbnail,
      fileData: fileData,
      status: metadata.status || 'draft'
    };
    
    // Store in IndexedDB
    await IndexedDBService.saveDesign(design);
    
    return {
      id: fileId,
      name: file.name,
      url: `indexeddb://${fileId}`,
      thumbnail: thumbnail
    };
  } catch (error) {
    console.error('Error storing file:', error);
    
    // Fall back to legacy localStorage method if IndexedDB fails
    try {
      return await storeFileLocally(file);
    } catch (fallbackError) {
      throw error; // Throw the original error
    }
  }
};

/**
 * Retrieve a file from IndexedDB
 * @param {string} fileId - The ID of the file to retrieve
 * @returns {Promise<Object>} - Promise with the file data and metadata
 */
export const getFile = async (fileId) => {
  try {
    // Try to get the file from IndexedDB
    const design = await IndexedDBService.getDesign(fileId);
    
    if (!design) {
      throw new Error('File not found');
    }
    
    return design;
  } catch (error) {
    console.error('Error retrieving file from IndexedDB:', error);
    
    // Fall back to localStorage if IndexedDB retrieval fails
    try {
      const storedFile = localStorage.getItem(`pressly_file_${fileId}`);
      if (storedFile) {
        return JSON.parse(storedFile);
      } else {
        throw new Error('File not found in any storage');
      }
    } catch (fallbackError) {
      throw error; // Throw the original error
    }
  }
};

/**
 * Get all stored files
 * @returns {Promise<Array>} - Promise with array of file metadata
 */
export const getAllFiles = async () => {
  try {
    // Get all designs from IndexedDB
    const designs = await IndexedDBService.getAllDesigns();
    
    // Transform to expected format, excluding the actual file data
    return designs.map(design => ({
      id: design.id,
      name: design.name,
      type: design.type,
      size: design.size,
      lastModified: design.lastModified,
      createdAt: design.createdAt,
      updatedAt: design.updatedAt,
      thumbnail: design.thumbnail,
      url: `indexeddb://${design.id}`,
      description: design.description,
      tags: design.tags,
      category: design.category,
      status: design.status
    }));
  } catch (error) {
    console.error('Error retrieving files from IndexedDB:', error);
    
    // Fall back to localStorage
    const files = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('pressly_file_')) {
          const fileId = key.replace('pressly_file_', '');
          const fileData = JSON.parse(localStorage.getItem(key));
          files.push({
            ...fileData,
            url: `local://${fileId}`
          });
        }
      }
    } catch (e) {
      console.error('Error retrieving files from localStorage:', e);
    }
    
    return files;
  }
};

/**
 * Delete a file
 * @param {string} fileId - The ID of the file to delete
 * @returns {Promise<boolean>} - Promise that resolves to true if successful
 */
export const deleteFile = async (fileId) => {
  try {
    // Try to delete from IndexedDB
    await IndexedDBService.deleteDesign(fileId);
    
    // Also try to remove from localStorage in case it exists there
    localStorage.removeItem(`pressly_file_${fileId}`);
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Legacy method for backward compatibility
 * @param {File} file - The file to store
 * @returns {Promise<Object>} - Promise with storage info
 */
export const storeFileLocally = (file) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate a unique file ID
      const fileId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // Store just the metadata, not the file content
          localStorage.setItem(`pressly_file_${fileId}`, JSON.stringify({
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          
          resolve({
            id: fileId,
            name: file.name,
            url: `local://${fileId}`
          });
        } catch (error) {
          // localStorage might be full
          console.error('Error storing file metadata:', error);
          resolve({
            id: fileId,
            name: file.name,
            url: `mock://${fileId}`
          });
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Start reading the file
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  validateFile,
  isPreviewableImage,
  getFileIcon,
  storeFile,
  getFile,
  getAllFiles,
  deleteFile,
  generateThumbnail,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES
};
