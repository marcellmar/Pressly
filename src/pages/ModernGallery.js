/**
 * Modern Gallery Page
 * Clean, minimal design matching the home page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGalleryItems } from '../services/gallery';

const ModernGallery = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: '',
    materials: [],
    methods: [],
    tags: []
  });

  const categories = [
    { value: 'all', label: 'All Projects', icon: '🎨' },
    { value: 'business-cards', label: 'Business Cards', icon: '💼' },
    { value: 'brochures', label: 'Brochures', icon: '📄' },
    { value: 'posters', label: 'Posters', icon: '🖼️' },
    { value: 'packaging', label: 'Packaging', icon: '📦' },
    { value: 'apparel', label: 'Apparel', icon: '👕' },
    { value: 'signage', label: 'Signage', icon: '🏷️' },
    { value: 'eco-friendly', label: 'Eco-Friendly', icon: '🌱' }
  ];

  const materials = [
    'Recycled Paper', 'Premium Paper', 'Cardstock', 'Canvas', 
    'Vinyl', 'Fabric', 'Metal', 'Wood', 'Plastic'
  ];

  const methods = [
    'Digital Printing', 'Screen Printing', 'Offset Printing',
    'Letterpress', 'Embossing', 'Die Cutting', 'Foil Stamping'
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, selectedCategory, filters]);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const data = await getAllGalleryItems();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.tags?.includes(selectedCategory) || 
        item.category === selectedCategory
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Filter by materials
    if (filters.materials.length > 0) {
      filtered = filtered.filter(item =>
        filters.materials.some(material => item.materials?.includes(material))
      );
    }

    // Filter by methods
    if (filters.methods.length > 0) {
      filtered = filtered.filter(item =>
        filters.methods.some(method => item.methods?.includes(method))
      );
    }

    setFilteredItems(filtered);
  };

  const handleItemClick = (item) => {
    navigate(`/gallery/${item.id}`);
  };

  const handleFilterToggle = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 48px)',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-gallery" style={{ 
      background: 'var(--bg-secondary)',
      minHeight: 'calc(100vh - 48px)'
    }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '64px 0',
        background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: '24px'
          }}>
            Design Gallery
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto 48px'
          }}>
            Discover inspiring print projects from our network of professional printers
          </p>

          {/* Search Bar */}
          <div style={{ 
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <input
              type="text"
              placeholder="Search projects..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              style={{ 
                width: '100%',
                padding: '16px 24px',
                fontSize: '16px',
                borderRadius: 'var(--radius-lg)'
              }}
            />
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '96px' }}>
        {/* Category Tabs */}
        <div style={{ 
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '32px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: selectedCategory === cat.value ? 'var(--text-primary)' : 'transparent',
                color: selectedCategory === cat.value ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <span style={{ fontSize: '20px' }}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter Toggle */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            Filter Projects {showFilters ? '↑' : '↓'}
          </button>

          {showFilters && (
            <div className="card" style={{ marginTop: '16px' }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '32px'
              }}>
                {/* Materials Filter */}
                <div>
                  <h4 style={{ marginBottom: '16px' }}>Materials</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {materials.map(material => (
                      <button
                        key={material}
                        onClick={() => handleFilterToggle('materials', material)}
                        className={`btn btn-sm ${filters.materials.includes(material) ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Methods Filter */}
                <div>
                  <h4 style={{ marginBottom: '16px' }}>Printing Methods</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {methods.map(method => (
                      <button
                        key={method}
                        onClick={() => handleFilterToggle('methods', method)}
                        className={`btn btn-sm ${filters.methods.includes(method) ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Showing {filteredItems.length} of {items.length} projects
          </p>
        </div>

        {/* Gallery Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="card"
              style={{ 
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all var(--transition-base)'
              }}
            >
              {/* Image */}
              <div style={{ 
                height: '240px',
                overflow: 'hidden',
                background: 'var(--bg-tertiary)',
                position: 'relative'
              }}>
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform var(--transition-slow)'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                ) : (
                  <div style={{ 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    🖼️
                  </div>
                )}

                {/* Featured Badge */}
                {item.featured && (
                  <div style={{ 
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'var(--accent-yellow)',
                    color: 'var(--text-primary)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ 
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.description}
                </p>

                {/* Meta Info */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-light)'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px'
                  }}>
                    <span>By {item.producerName}</span>
                  </div>
                  {item.ecoFriendly && (
                    <span className="badge badge-success">
                      🌱 Eco-Friendly
                    </span>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div style={{ 
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginTop: '12px'
                  }}>
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        style={{ 
                          padding: '4px 8px',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No projects found</h3>
            <p className="empty-state-description">
              Try adjusting your filters or search terms
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setFilters({
                  searchQuery: '',
                  materials: [],
                  methods: [],
                  tags: []
                });
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernGallery;