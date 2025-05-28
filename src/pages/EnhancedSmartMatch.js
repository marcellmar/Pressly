/**
 * Enhanced Smart Match Page
 * Combines SmartMatch with AI analysis capabilities
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import ProducerCard from '../components/ProducerCard';
import { getAllProducers } from '../services/producers';
import { extractProjectRequirements, findEcoLeanMatches } from '../services/ecoLeanMatch/ecoLeanMatchAlgorithm';

const EnhancedSmartMatch = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [projectData, setProjectData] = useState(null);
  const [producers, setProducers] = useState([]);
  const [filteredProducers, setFilteredProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducers, setSelectedProducers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [matchingMethod, setMatchingMethod] = useState('smart'); // 'smart' or 'ai'
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    maxDistance: 50,
    priceRange: 'all',
    rating: 0,
    capabilities: [],
    certifications: [],
    ecoFriendly: false,
    minimumSustainabilityScore: 0
  });

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error getting location:", error);
          // Default to Chicago
          setUserLocation({
            lat: 41.8781,
            lng: -87.6298
          });
        }
      );
    } else {
      // Default to Chicago
      setUserLocation({
        lat: 41.8781,
        lng: -87.6298
      });
    }
  }, []);

  useEffect(() => {
    // Get project data from Create page
    const storedData = sessionStorage.getItem('projectData');
    if (storedData) {
      setProjectData(JSON.parse(storedData));
    } else {
      // If no project data, redirect to create page
      navigate('/create');
      return;
    }

    // Load producers
    loadProducers();
  }, [navigate]);

  const loadProducers = async () => {
    setLoading(true);
    try {
      const allProducers = await getAllProducers();
      setProducers(allProducers);
      
      // Apply matching based on project data
      const matched = matchingMethod === 'ai' 
        ? applyAIMatching(allProducers)
        : applySmartMatching(allProducers);
      setFilteredProducers(matched);
    } catch (error) {
      console.error('Failed to load producers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySmartMatching = (producersList) => {
    if (!projectData) return producersList;

    // Original smart matching algorithm
    return producersList
      .map(producer => {
        let score = 0;
        
        // Match by category/capabilities
        if (producer.capabilities?.includes(projectData.category)) {
          score += 30;
        }
        
        // Match by quantity capabilities
        const quantity = parseInt(projectData.quantity);
        if (quantity < 500 && producer.specialties?.includes('small-batch')) {
          score += 20;
        } else if (quantity > 5000 && producer.specialties?.includes('high-volume')) {
          score += 20;
        }
        
        // Match by deadline
        if (projectData.deadline) {
          const daysUntilDeadline = Math.ceil((new Date(projectData.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          if (daysUntilDeadline < 7 && producer.rushAvailable) {
            score += 15;
          }
        }
        
        // Match by materials
        if (projectData.materials?.length > 0) {
          const matchedMaterials = producer.materials?.filter(m => projectData.materials.includes(m)) || [];
          score += matchedMaterials.length * 10;
        }
        
        // Match by finishes
        if (projectData.finishes?.length > 0) {
          const matchedFinishes = producer.finishes?.filter(f => projectData.finishes.includes(f)) || [];
          score += matchedFinishes.length * 5;
        }
        
        // Eco-friendly bonus
        if (producer.certifications?.includes('eco-friendly')) {
          score += 10;
        }
        
        // Rating bonus
        score += producer.rating * 5;
        
        return { ...producer, matchScore: score };
      })
      .filter(p => p.matchScore > 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);
  };

  const applyAIMatching = (producersList) => {
    if (!projectData || !userLocation) return producersList;

    // Convert project data to requirements format for AI algorithm
    const requirements = extractProjectRequirements(
      projectData.files || [],
      {
        ...filters,
        location: userLocation,
        quantity: projectData.quantity,
        deadline: projectData.deadline,
        category: projectData.category,
        materials: projectData.materials,
        finishes: projectData.finishes
      }
    );

    // Use EcoLeanMatch AI algorithm
    const matches = findEcoLeanMatches(requirements, producersList);
    
    // Transform matches to include matchScore for consistency
    return matches.map(match => ({
      ...match,
      matchScore: match.score || 0,
      aiDetails: match.details || {},
      carbonSavings: match.details?.environmentalImpact?.carbonSavings || 0,
      ecoRating: match.details?.environmentalImpact?.ecoRating || 'standard'
    }));
  };

  const handleProducerSelect = (producer) => {
    setSelectedProducers(prev => {
      const isSelected = prev.some(p => p.id === producer.id);
      if (isSelected) {
        return prev.filter(p => p.id !== producer.id);
      } else {
        return [...prev, producer];
      }
    });
  };

  const handleRequestQuotes = () => {
    if (selectedProducers.length === 0) {
      alert('Please select at least one printer to request quotes');
      return;
    }

    // Store selected producers and project data
    sessionStorage.setItem('quoteRequest', JSON.stringify({
      projectData,
      selectedProducers,
      matchingMethod,
      requestedAt: new Date().toISOString()
    }));

    // Navigate to quote request page
    navigate('/orders');
  };

  const applyFilters = () => {
    let filtered = [...producers];
    
    // Apply filters
    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }
    
    if (filters.priceRange !== 'all') {
      // Price range filtering logic
    }
    
    if (filters.capabilities.length > 0) {
      filtered = filtered.filter(p => 
        filters.capabilities.some(cap => p.capabilities?.includes(cap))
      );
    }
    
    if (filters.certifications.length > 0) {
      filtered = filtered.filter(p => 
        filters.certifications.some(cert => p.certifications?.includes(cert))
      );
    }

    if (filters.ecoFriendly) {
      filtered = filtered.filter(p => p.sustainabilityScore >= 80);
    }

    if (filters.minimumSustainabilityScore > 0) {
      filtered = filtered.filter(p => p.sustainabilityScore >= filters.minimumSustainabilityScore);
    }
    
    // Re-apply matching algorithm
    const matched = matchingMethod === 'ai' 
      ? applyAIMatching(filtered)
      : applySmartMatching(filtered);
    setFilteredProducers(matched);
  };

  const switchMatchingMethod = (method) => {
    setMatchingMethod(method);
    const matched = method === 'ai' 
      ? applyAIMatching(producers)
      : applySmartMatching(producers);
    setFilteredProducers(matched);
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
          <p>Finding the best printers for your project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-smart-match" style={{ 
      background: 'var(--bg-secondary)',
      minHeight: 'calc(100vh - 48px)',
      paddingTop: '48px',
      paddingBottom: '96px'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ marginBottom: '16px' }}>Smart Match Results</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            We found {filteredProducers.length} printers that match your project requirements
          </p>
        </div>

        {/* Project Summary */}
        {projectData && (
          <div className="card" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ marginBottom: '8px' }}>{projectData.title}</h3>
                <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <span>📦 Quantity: {projectData.quantity}</span>
                  <span>📅 Deadline: {new Date(projectData.deadline).toLocaleDateString()}</span>
                  <span>📄 {projectData.files?.length || 0} files</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/create')}
                className="btn btn-secondary"
              >
                Edit Project
              </button>
            </div>
          </div>
        )}

        {/* Matching Method Toggle */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: '8px' }}>Matching Algorithm</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {matchingMethod === 'ai' 
                  ? 'AI-powered matching with eco-optimization and waste reduction'
                  : 'Smart matching based on capabilities and requirements'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => switchMatchingMethod('smart')}
                className={`btn ${matchingMethod === 'smart' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Smart Match
              </button>
              <button
                onClick={() => switchMatchingMethod('ai')}
                className={`btn ${matchingMethod === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
              >
                AI Match ✨
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
            style={{ marginBottom: '16px' }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'} 
            <span style={{ marginLeft: '8px' }}>{showFilters ? '↑' : '↓'}</span>
          </button>

          {showFilters && (
            <div className="card">
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                    style={{ width: '100%' }}
                  >
                    <option value="0">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.8">4.8+ Stars</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Distance
                  </label>
                  <select
                    value={filters.maxDistance}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                    style={{ width: '100%' }}
                  >
                    <option value="10">Within 10 miles</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                    <option value="100">Within 100 miles</option>
                  </select>
                </div>

                {matchingMethod === 'ai' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Sustainability Score
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minimumSustainabilityScore}
                      onChange={(e) => setFilters(prev => ({ ...prev, minimumSustainabilityScore: parseInt(e.target.value) }))}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      Min: {filters.minimumSustainabilityScore}
                    </span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Certifications
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['eco-friendly', 'iso-certified', 'minority-owned'].map(cert => (
                      <button
                        key={cert}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            certifications: prev.certifications.includes(cert)
                              ? prev.certifications.filter(c => c !== cert)
                              : [...prev.certifications, cert]
                          }));
                        }}
                        className={`btn btn-sm ${filters.certifications.includes(cert) ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button onClick={applyFilters} className="btn btn-primary">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Count */}
        {selectedProducers.length > 0 && (
          <div style={{ 
            position: 'sticky',
            top: '64px',
            background: 'var(--text-primary)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}>
            <span style={{ fontWeight: 600 }}>
              {selectedProducers.length} printer{selectedProducers.length > 1 ? 's' : ''} selected
            </span>
            <button 
              onClick={handleRequestQuotes}
              className="btn"
              style={{ 
                background: 'white',
                color: 'var(--text-primary)'
              }}
            >
              Request Quotes →
            </button>
          </div>
        )}

        {/* Results Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducers.map(producer => (
            <div 
              key={producer.id}
              onClick={() => handleProducerSelect(producer)}
              style={{ 
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Selection indicator */}
              {selectedProducers.some(p => p.id === producer.id) && (
                <div style={{ 
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'var(--text-primary)',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}>
                  ✓
                </div>
              )}
              
              {/* Match score badge */}
              {producer.matchScore && (
                <div style={{ 
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: matchingMethod === 'ai' ? 'var(--accent-purple)' : 'var(--accent-green)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  zIndex: 1
                }}>
                  {Math.round(producer.matchScore)}% Match
                </div>
              )}

              {/* AI-specific badges */}
              {matchingMethod === 'ai' && producer.carbonSavings > 0 && (
                <div style={{ 
                  position: 'absolute',
                  top: '48px',
                  left: '16px',
                  background: 'var(--accent-green)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 500,
                  zIndex: 1
                }}>
                  🌱 -{producer.carbonSavings}kg CO₂
                </div>
              )}
              
              <ProducerCard 
                producer={producer} 
                isSelected={selectedProducers.some(p => p.id === producer.id)}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducers.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No matches found</h3>
            <p className="empty-state-description">
              Try adjusting your filters or project requirements
            </p>
            <button onClick={() => navigate('/create')} className="btn btn-primary">
              Edit Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSmartMatch;