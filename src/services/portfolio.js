// Portfolio service for Pressly
// Handles API requests for portfolio management

import api from './api';

// Fetch portfolio by designer ID
export const fetchPortfolioByDesignerId = async (designerId) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // const response = await api.get(`/portfolios/${designerId}`);
    // return response.data;
    
    // Mock return data
    return {
      id: 'p-' + Math.random().toString(36).substring(2, 10),
      designerId: designerId,
      title: 'My Design Portfolio',
      description: 'A showcase of my best design work',
      themeSettings: {
        primaryColor: '#3a6ea5',
        secondaryColor: '#ff6b6b',
        fontFamily: 'Segoe UI',
        layout: 'grid'
      },
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [] // No portfolio items by default
    };
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

// Create a new portfolio
export const createPortfolio = async (portfolioData) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // const response = await api.post('/portfolios', portfolioData);
    // return response.data;
    
    // Mock return data
    return {
      id: 'p-' + Math.random().toString(36).substring(2, 10),
      ...portfolioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }
};

// Update an existing portfolio
export const updatePortfolio = async (portfolioId, portfolioData) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // const response = await api.put(`/portfolios/${portfolioId}`, portfolioData);
    // return response.data;
    
    // Mock return data
    return {
      id: portfolioId,
      ...portfolioData,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }
};

// Add a design to portfolio
export const addDesignToPortfolio = async (portfolioId, designId, displaySettings = {}) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // const response = await api.post(`/portfolios/${portfolioId}/items`, {
    //   designId,
    //   displaySettings
    // });
    // return response.data;
    
    // Mock return data
    return {
      id: 'pi-' + Math.random().toString(36).substring(2, 10),
      portfolioId,
      designId,
      displayOrder: 0, // Default to first item
      displaySettings,
      addedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding design to portfolio:', error);
    throw error;
  }
};

// Remove a design from portfolio
export const removeDesignFromPortfolio = async (portfolioId, portfolioItemId) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // await api.delete(`/portfolios/${portfolioId}/items/${portfolioItemId}`);
    
    // Return a success status
    return { success: true };
  } catch (error) {
    console.error('Error removing design from portfolio:', error);
    throw error;
  }
};

// Reorder portfolio items
export const reorderPortfolioItems = async (portfolioId, orderedItemIds) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // const response = await api.put(`/portfolios/${portfolioId}/items/reorder`, {
    //   orderedItemIds
    // });
    // return response.data;
    
    // Mock return data
    return { success: true };
  } catch (error) {
    console.error('Error reordering portfolio items:', error);
    throw error;
  }
};

// Get public portfolio by URL slug
export const getPublicPortfolio = async (portfolioSlug) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // const response = await api.get(`/public/portfolios/${portfolioSlug}`);
    // return response.data;
    
    // Mock return data with sample portfolio items
    return {
      id: 'p-sample1',
      designerId: 'd-sample1',
      title: 'Creative Design Portfolio',
      description: 'A showcase of my best design work across various media and clients',
      designer: {
        id: 'd-sample1',
        fullName: 'Alex Johnson',
        brandName: 'AJ Designs',
        bio: 'Passionate graphic designer with over 5 years of experience creating vibrant and meaningful visual identities.',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        email: 'contact@ajdesigns.com',
      },
      themeSettings: {
        primaryColor: '#3a6ea5',
        secondaryColor: '#ff6b6b',
        fontFamily: 'Segoe UI',
        layout: 'grid'
      },
      isPublic: true,
      slug: portfolioSlug,
      items: [
        {
          id: 'pi-1',
          portfolioId: 'p-sample1',
          designId: 'd-1',
          displayOrder: 0,
          displaySettings: {
            isFeatured: true,
            caption: 'Brand identity for local coffee shop'
          },
          design: {
            id: 'd-1',
            title: 'Brew & Bean Brand Identity',
            description: 'Complete brand package including logo, business cards, and packaging design',
            imageUrl: 'https://images.unsplash.com/photo-1581318569634-76bfabd10d9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            tags: ['branding', 'logo', 'packaging'],
            createdAt: '2023-11-10T18:25:43.511Z'
          }
        },
        {
          id: 'pi-2',
          portfolioId: 'p-sample1',
          designId: 'd-2',
          displayOrder: 1,
          displaySettings: {
            isFeatured: true,
            caption: 'Music festival poster design'
          },
          design: {
            id: 'd-2',
            title: 'Harmonic Convergence Festival',
            description: 'Poster design for annual music festival featuring electronic and indie artists',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            tags: ['poster', 'event', 'music'],
            createdAt: '2023-12-05T14:30:22.300Z'
          }
        },
        {
          id: 'pi-3',
          portfolioId: 'p-sample1',
          designId: 'd-3',
          displayOrder: 2,
          displaySettings: {
            caption: 'Tech startup website redesign'
          },
          design: {
            id: 'd-3',
            title: 'Quantum Tech Website',
            description: 'Complete website redesign for AI startup focusing on user experience and modern aesthetics',
            imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            tags: ['web', 'UI/UX', 'tech'],
            createdAt: '2024-01-18T09:12:37.814Z'
          }
        }
      ],
      testimonials: [
        {
          id: 't-1',
          portfolioId: 'p-sample1',
          clientId: 'c-1',
          clientName: 'Sarah Matthews',
          clientTitle: 'Marketing Director at Brew & Bean',
          content: 'Alex delivered exceptional branding work that perfectly captured our vision. The new identity has significantly increased our customer engagement.',
          rating: 5,
          isVerified: true,
          projectTitle: 'Brew & Bean Brand Identity',
          createdAt: '2023-11-25T11:32:18.300Z'
        },
        {
          id: 't-2',
          portfolioId: 'p-sample1',
          clientId: 'c-2',
          clientName: 'Michael Torres',
          clientTitle: 'Event Coordinator',
          content: 'The poster design exceeded our expectations and received countless compliments from festival attendees. We saw a 40% increase in ticket sales compared to previous years.',
          rating: 5,
          isVerified: true,
          projectTitle: 'Harmonic Convergence Festival',
          createdAt: '2023-12-18T16:45:10.724Z'
        }
      ],
      createdAt: '2023-10-01T10:20:30.000Z',
      updatedAt: '2024-01-20T14:15:22.000Z'
    };
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    throw error;
  }
};

// Add a testimonial to portfolio
export const addTestimonial = async (portfolioId, testimonialData) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // const response = await api.post(`/portfolios/${portfolioId}/testimonials`, testimonialData);
    // return response.data;
    
    // Mock return data
    return {
      id: 't-' + Math.random().toString(36).substring(2, 10),
      portfolioId,
      ...testimonialData,
      isVerified: false, // Pending verification by default
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
};

// Get portfolio statistics
export const getPortfolioStats = async (portfolioId) => {
  try {
    // In a production environment, this would make an API call
    // For now, we're simulating the backend response
    
    // Mock API call:
    // const response = await api.get(`/portfolios/${portfolioId}/stats`);
    // return response.data;
    
    // Mock return data
    return {
      views: Math.floor(Math.random() * 500) + 100,
      uniqueVisitors: Math.floor(Math.random() * 200) + 50,
      averageTimeOnPage: Math.floor(Math.random() * 120) + 30, // seconds
      conversionRate: (Math.random() * 10 + 2).toFixed(1), // percentage
      topReferrers: [
        { source: 'Direct', count: Math.floor(Math.random() * 100) + 20 },
        { source: 'Social Media', count: Math.floor(Math.random() * 80) + 10 },
        { source: 'Search Engines', count: Math.floor(Math.random() * 50) + 5 }
      ],
      mostViewedItems: [
        { itemId: 'pi-1', views: Math.floor(Math.random() * 200) + 50 },
        { itemId: 'pi-2', views: Math.floor(Math.random() * 150) + 30 },
      ],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching portfolio stats:', error);
    throw error;
  }
};

export default {
  fetchPortfolioByDesignerId,
  createPortfolio,
  updatePortfolio,
  addDesignToPortfolio,
  removeDesignFromPortfolio,
  reorderPortfolioItems,
  getPublicPortfolio,
  addTestimonial,
  getPortfolioStats
};
