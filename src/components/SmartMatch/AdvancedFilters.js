import React, { useState } from 'react';

/**
 * AdvancedFilters component
 * 
 * Provides granular control over the smart matching process through
 * detailed filtering options for project requirements and producer capabilities.
 */
const AdvancedFilters = ({ onFiltersChange }) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [productType, setProductType] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [qualityLevel, setQualityLevel] = useState('standard');
  const [sustainabilityFocus, setSustainabilityFocus] = useState(false);
  const [specialFinishing, setSpecialFinishing] = useState([]);
  
  // Available capability options
  const capabilityOptions = [
    'Digital Printing',
    'Offset Printing',
    'Large Format',
    'Die Cutting',
    'Embossing',
    'Foil Stamping',
    'Letterpress',
    'Screen Printing',
    'Variable Data',
    'Binding & Finishing'
  ];
  
  // Available product types
  const productTypes = [
    'Business Cards',
    'Brochures',
    'Flyers',
    'Posters',
    'Banners',
    'Labels',
    'Packaging',
    'Books',
    'Catalogs',
    'Custom Apparel',
    'Promotional Items',
    'Trade Show Materials',
    'Stationery',
    'Signage',
    'Other'
  ];
  
  // Available finishing options
  const finishingOptions = [
    'UV Coating',
    'Aqueous Coating',
    'Matte Lamination',
    'Gloss Lamination',
    'Soft Touch Lamination',
    'Spot UV',
    'Embossing',
    'Debossing',
    'Foil Stamping',
    'Die Cutting'
  ];

  // Toggle visibility of filters
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Handle capability selection
  const handleCapabilityToggle = (capability) => {
    if (selectedCapabilities.includes(capability)) {
      setSelectedCapabilities(
        selectedCapabilities.filter(cap => cap !== capability)
      );
    } else {
      setSelectedCapabilities([...selectedCapabilities, capability]);
    }
  };
  
  // Handle finishing option selection
  const handleFinishingToggle = (option) => {
    if (specialFinishing.includes(option)) {
      setSpecialFinishing(
        specialFinishing.filter(item => item !== option)
      );
    } else {
      setSpecialFinishing([...specialFinishing, option]);
    }
  };

  // Update parent component when filters change
  const applyFilters = () => {
    const filters = {
      productType,
      urgency,
      priceRange,
      capabilities: selectedCapabilities,
      qualityLevel,
      sustainabilityFocus,
      specialFinishing
    };
    
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  // Reset all filters to default values
  const resetFilters = () => {
    setProductType('');
    setUrgency('normal');
    setPriceRange([0, 1000]);
    setSelectedCapabilities([]);
    setQualityLevel('standard');
    setSustainabilityFocus(false);
    setSpecialFinishing([]);
    
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="card-title" style={{ margin: 0 }}>Match Preferences</h3>
        <button 
          className="btn btn-outline btn-sm"
          onClick={toggleFilters}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <i className={`fas fa-${filtersVisible ? 'minus' : 'plus'}-circle`} style={{ marginRight: '0.5rem' }}></i>
          {filtersVisible ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>
      
      {/* Basic Preferences (always visible) */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="product-type" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Product Type
          </label>
          <select 
            id="product-type"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All Product Types</option>
            {productTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Urgency
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="radio" 
                name="urgency"
                value="rush"
                checked={urgency === 'rush'}
                onChange={() => setUrgency('rush')}
                style={{ marginRight: '0.5rem' }}
              />
              Rush
            </label>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="radio" 
                name="urgency"
                value="normal"
                checked={urgency === 'normal'}
                onChange={() => setUrgency('normal')}
                style={{ marginRight: '0.5rem' }}
              />
              Normal
            </label>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="radio" 
                name="urgency"
                value="flexible"
                checked={urgency === 'flexible'}
                onChange={() => setUrgency('flexible')}
                style={{ marginRight: '0.5rem' }}
              />
              Flexible
            </label>
          </div>
        </div>
      </div>
      
      {/* Advanced Filters (collapsible) */}
      {filtersVisible && (
        <div style={{ marginTop: '1rem' }}>
          <hr style={{ margin: '1rem 0' }} />
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                style={{ flex: 1 }}
              />
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Required Capabilities
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {capabilityOptions.map((capability, index) => (
                <label 
                  key={index}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    backgroundColor: selectedCapabilities.includes(capability) 
                      ? 'rgba(58, 110, 165, 0.1)' 
                      : 'transparent',
                    border: selectedCapabilities.includes(capability)
                      ? '1px solid var(--primary)'
                      : '1px solid #ddd',
                    cursor: 'pointer'
                  }}
                >
                  <input 
                    type="checkbox"
                    checked={selectedCapabilities.includes(capability)}
                    onChange={() => handleCapabilityToggle(capability)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {capability}
                </label>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Quality Level
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="radio" 
                  name="quality"
                  value="economy"
                  checked={qualityLevel === 'economy'}
                  onChange={() => setQualityLevel('economy')}
                  style={{ marginRight: '0.5rem' }}
                />
                Economy
              </label>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="radio" 
                  name="quality"
                  value="standard"
                  checked={qualityLevel === 'standard'}
                  onChange={() => setQualityLevel('standard')}
                  style={{ marginRight: '0.5rem' }}
                />
                Standard
              </label>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="radio" 
                  name="quality"
                  value="premium"
                  checked={qualityLevel === 'premium'}
                  onChange={() => setQualityLevel('premium')}
                  style={{ marginRight: '0.5rem' }}
                />
                Premium
              </label>
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <input 
                type="checkbox"
                checked={sustainabilityFocus}
                onChange={() => setSustainabilityFocus(!sustainabilityFocus)}
                style={{ marginRight: '0.5rem' }}
              />
              Sustainability Focus
            </label>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0 0 1.5rem' }}>
              Prioritize producers using eco-friendly materials and processes
            </p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Special Finishing Options
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {finishingOptions.map((option, index) => (
                <label 
                  key={index}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    backgroundColor: specialFinishing.includes(option) 
                      ? 'rgba(58, 110, 165, 0.1)' 
                      : 'transparent',
                    border: specialFinishing.includes(option)
                      ? '1px solid var(--primary)'
                      : '1px solid #ddd',
                    cursor: 'pointer'
                  }}
                >
                  <input 
                    type="checkbox"
                    checked={specialFinishing.includes(option)}
                    onChange={() => handleFinishingToggle(option)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button 
          className="btn btn-outline"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
        <button 
          className="btn"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;