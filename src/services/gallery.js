/**
 * Gallery Service
 * 
 * This file provides services for working with gallery data.
 * It uses mock data for the MVP and would be replaced with actual API calls in production.
 */

import { getEcoFriendlyImageUrl, getPrinterImageUrl } from '../utils/unsplashUtils';

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock gallery items
const mockGalleryItems = [
  {
    id: generateId(),
    title: "Corporate Brochure Series",
    description: "Tri-fold brochures for a financial services firm",
    producerId: "1",
    producerName: "Rowboat Creative",
    designerId: "user123",
    designerName: "Alex Morgan",
    productionDetails: "Printed on 100lb matte paper with water-based inks",
    materials: ["100lb Matte Paper", "Water-based Inks"],
    methods: ["Digital Printing", "Die Cutting"],
    images: [
      getPrinterImageUrl('brochure-1', 800, 600),
      getPrinterImageUrl('brochure-2', 800, 600)
    ],
    featured: true,
    sustainabilityScore: 85,
    dateCreated: "2025-03-15T14:30:00Z",
    status: "approved",
    tags: ["Corporate", "Brochure", "Financial", "Print"]
  },
  {
    id: generateId(),
    title: "Organic Cotton T-Shirt Collection",
    description: "Custom designed t-shirts for local art festival",
    producerId: "5",
    producerName: "Eco Friendly Printer",
    designerId: "user456",
    designerName: "Jamie Wilson",
    productionDetails: "Screen printed using sustainable processes on 100% organic cotton",
    materials: ["Organic Cotton", "Water-based Inks"],
    methods: ["Screen Printing"],
    images: [
      getEcoFriendlyImageUrl('tshirt-1', 800, 600),
      getEcoFriendlyImageUrl('tshirt-2', 800, 600)
    ],
    featured: true,
    sustainabilityScore: 95,
    dateCreated: "2025-03-10T09:15:00Z",
    status: "approved",
    tags: ["Apparel", "Organic", "Screen Printing", "Festival"]
  },
  {
    id: generateId(),
    title: "Event Promotional Banner",
    description: "Large format banner for community music event",
    producerId: "4",
    producerName: "Chicago Signs and Screen Printing",
    designerId: "user789",
    designerName: "Taylor Reed",
    productionDetails: "Printed on recyclable vinyl with UV-resistant inks",
    materials: ["Recyclable Vinyl", "UV-resistant Inks"],
    methods: ["Large Format Printing"],
    images: [
      getPrinterImageUrl('banner-1', 800, 600)
    ],
    featured: false,
    sustainabilityScore: 70,
    dateCreated: "2025-02-28T11:45:00Z",
    status: "approved",
    tags: ["Banner", "Event", "Large Format", "Outdoor"]
  },
  {
    id: generateId(),
    title: "Custom Business Cards",
    description: "Minimalist design business cards for tech startup",
    producerId: "3",
    producerName: "Minuteman Press",
    designerId: "user321",
    designerName: "Sam Johnson",
    productionDetails: "Printed on recycled cardstock with embossed logo",
    materials: ["Recycled Cardstock"],
    methods: ["Digital Printing", "Embossing"],
    images: [
      getPrinterImageUrl('business-card-1', 800, 600),
      getPrinterImageUrl('business-card-2', 800, 600)
    ],
    featured: true,
    sustainabilityScore: 80,
    dateCreated: "2025-03-05T16:20:00Z",
    status: "approved",
    tags: ["Business Cards", "Minimalist", "Corporate", "Embossing"]
  },
  {
    id: generateId(),
    title: "Eco-Friendly Shopping Bags",
    description: "Custom printed reusable shopping bags for organic market",
    producerId: "2",
    producerName: "Sharprint",
    designerId: "user654",
    designerName: "Jordan Smith",
    productionDetails: "Screen printed on organic canvas with eco-friendly inks",
    materials: ["Organic Canvas", "Eco-friendly Inks"],
    methods: ["Screen Printing"],
    images: [
      getEcoFriendlyImageUrl('bag-1', 800, 600),
      getEcoFriendlyImageUrl('bag-2', 800, 600)
    ],
    featured: true,
    sustainabilityScore: 98,
    dateCreated: "2025-03-02T13:10:00Z",
    status: "approved",
    tags: ["Bags", "Eco-friendly", "Retail", "Organic"]
  },
  {
    id: generateId(),
    title: "Limited Edition Art Prints",
    description: "Series of fine art prints for gallery exhibition",
    producerId: "5",
    producerName: "Eco Friendly Printer",
    designerId: "user987",
    designerName: "Riley Martinez",
    productionDetails: "Giclee prints on acid-free archival paper",
    materials: ["Acid-free Paper", "Archival Inks"],
    methods: ["Giclee Printing"],
    images: [
      getPrinterImageUrl('art-print-1', 800, 600),
      getPrinterImageUrl('art-print-2', 800, 600)
    ],
    featured: false,
    sustainabilityScore: 90,
    dateCreated: "2025-02-20T10:00:00Z",
    status: "approved",
    tags: ["Art", "Fine Art", "Limited Edition", "Giclee"]
  }
];

// Mock gallery collections
const mockGalleryCollections = [
  {
    id: generateId(),
    name: "Sustainable Printing",
    description: "Eco-friendly printing projects showcasing sustainable materials and methods",
    featuredImageId: mockGalleryItems[1].images[0],
    items: [
      mockGalleryItems[1].id, 
      mockGalleryItems[4].id
    ]
  },
  {
    id: generateId(),
    name: "Corporate Identity",
    description: "Professional printing projects for business and corporate clients",
    featuredImageId: mockGalleryItems[0].images[0],
    items: [
      mockGalleryItems[0].id, 
      mockGalleryItems[3].id
    ]
  },
  {
    id: generateId(),
    name: "Creative Showcase",
    description: "Artistic and creative printing projects",
    featuredImageId: mockGalleryItems[5].images[0],
    items: [
      mockGalleryItems[2].id, 
      mockGalleryItems[5].id
    ]
  }
];

/**
 * Get all gallery items
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} List of gallery items
 */
export const getAllGalleryItems = (filters = {}) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      let filteredItems = [...mockGalleryItems];
      
      // Apply filters if provided
      if (filters.producerId) {
        filteredItems = filteredItems.filter(item => item.producerId === filters.producerId);
      }
      
      if (filters.featured === true) {
        filteredItems = filteredItems.filter(item => item.featured === true);
      }
      
      if (filters.materials && filters.materials.length > 0) {
        filteredItems = filteredItems.filter(item => 
          filters.materials.some(material => item.materials.includes(material))
        );
      }
      
      if (filters.methods && filters.methods.length > 0) {
        filteredItems = filteredItems.filter(item => 
          filters.methods.some(method => item.methods.includes(method))
        );
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredItems = filteredItems.filter(item => 
          filters.tags.some(tag => item.tags.includes(tag))
        );
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          item.producerName.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      resolve(filteredItems);
    }, 300);
  });
};

/**
 * Get a gallery item by ID
 * @param {string} itemId - The gallery item's unique ID
 * @returns {Promise<Object>} Gallery item details
 */
export const getGalleryItemById = (itemId) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const item = mockGalleryItems.find(i => i.id === itemId);
      if (item) {
        resolve(item);
      } else {
        reject(new Error('Gallery item not found'));
      }
    }, 300);
  });
};

/**
 * Get all gallery collections
 * @returns {Promise<Array>} List of gallery collections
 */
export const getAllGalleryCollections = () => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve([...mockGalleryCollections]);
    }, 300);
  });
};

/**
 * Get a gallery collection by ID
 * @param {string} collectionId - The collection's unique ID
 * @returns {Promise<Object>} Collection details with resolved items
 */
export const getGalleryCollectionById = (collectionId) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const collection = mockGalleryCollections.find(c => c.id === collectionId);
      if (collection) {
        // Resolve item references
        const resolvedItems = collection.items.map(itemId => 
          mockGalleryItems.find(item => item.id === itemId)
        ).filter(Boolean);
        
        resolve({
          ...collection,
          items: resolvedItems
        });
      } else {
        reject(new Error('Gallery collection not found'));
      }
    }, 300);
  });
};

/**
 * Create a new gallery item
 * @param {Object} itemData - Gallery item data
 * @returns {Promise<Object>} Created gallery item
 */
export const createGalleryItem = (itemData) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const newItem = {
        id: generateId(),
        ...itemData,
        dateCreated: new Date().toISOString(),
        status: 'pending'
      };
      
      // In a real app, this would add to the database
      mockGalleryItems.push(newItem);
      
      resolve(newItem);
    }, 500);
  });
};

/**
 * Update an existing gallery item
 * @param {string} itemId - The gallery item's unique ID
 * @param {Object} itemData - Updated gallery item data
 * @returns {Promise<Object>} Updated gallery item
 */
export const updateGalleryItem = (itemId, itemData) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const index = mockGalleryItems.findIndex(i => i.id === itemId);
      if (index !== -1) {
        const updatedItem = {
          ...mockGalleryItems[index],
          ...itemData
        };
        
        // In a real app, this would update the database
        mockGalleryItems[index] = updatedItem;
        
        resolve(updatedItem);
      } else {
        reject(new Error('Gallery item not found'));
      }
    }, 500);
  });
};

/**
 * Delete a gallery item
 * @param {string} itemId - The gallery item's unique ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteGalleryItem = (itemId) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const index = mockGalleryItems.findIndex(i => i.id === itemId);
      if (index !== -1) {
        // In a real app, this would delete from the database
        mockGalleryItems.splice(index, 1);
        
        resolve({
          success: true,
          message: 'Gallery item deleted successfully'
        });
      } else {
        reject(new Error('Gallery item not found'));
      }
    }, 500);
  });
};

/**
 * Get related producers based on design parameters
 * @param {Object} designParams - Design parameters for matching
 * @returns {Promise<Array>} List of related producers with example gallery items
 */
export const getRelatedProducers = (designParams = {}) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would use the design parameters to find matching producers
      // For the MVP, we'll just return some examples
      const relatedProducers = [
        {
          producerId: "1",
          producerName: "Rowboat Creative",
          matchScore: 95,
          galleryExamples: [mockGalleryItems[0]]
        },
        {
          producerId: "5",
          producerName: "Eco Friendly Printer",
          matchScore: 88,
          galleryExamples: [mockGalleryItems[1], mockGalleryItems[5]]
        }
      ];
      
      resolve(relatedProducers);
    }, 300);
  });
};

/**
 * Get featured gallery items
 * @param {number} limit - Maximum number of items to return
 * @returns {Promise<Array>} List of featured gallery items
 */
export const getFeaturedGalleryItems = (limit = 6) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const featuredItems = mockGalleryItems
        .filter(item => item.featured)
        .slice(0, limit);
      
      resolve(featuredItems);
    }, 300);
  });
};

export default {
  getAllGalleryItems,
  getGalleryItemById,
  getAllGalleryCollections,
  getGalleryCollectionById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getRelatedProducers,
  getFeaturedGalleryItems
};
