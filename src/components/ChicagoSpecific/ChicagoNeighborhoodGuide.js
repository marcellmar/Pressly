import React, { useState } from 'react';

/**
 * ChicagoNeighborhoodGuide Component
 * 
 * Provides Chicago-specific information about different neighborhoods
 * and their printing industry characteristics to help users make informed
 * decisions when selecting print producers.
 */
const ChicagoNeighborhoodGuide = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  
  // Chicago neighborhood data with printing industry insights
  const neighborhoods = [
    {
      id: 'loop',
      name: 'The Loop',
      description: 'Chicago\'s central business district is home to numerous high-volume commercial printers specializing in business services.',
      printingSpecialties: ['Business cards', 'Brochures', 'Corporate reports', 'Presentation materials'],
      printerDensity: 'High',
      priceRange: '$$$',
      turnaroundSpeed: 'Fast, same-day services available',
      sustainabilityFocus: 'Medium',
      bestFor: 'Corporate projects, rush jobs, high-volume business materials'
    },
    {
      id: 'west-loop',
      name: 'West Loop',
      description: 'This vibrant area has evolved from its industrial roots to become a creative hub with design-focused printing services.',
      printingSpecialties: ['Art prints', 'Restaurant menus', 'Specialty packaging', 'Creative marketing materials'],
      printerDensity: 'Medium-High',
      priceRange: '$$$-$$$$',
      turnaroundSpeed: 'Medium to fast',
      sustainabilityFocus: 'High',
      bestFor: 'Restaurant industry, creative agencies, art galleries'
    },
    {
      id: 'river-north',
      name: 'River North',
      description: 'Known for its gallery district, River North printers often specialize in high-quality art reproduction and creative services.',
      printingSpecialties: ['Fine art prints', 'Gallery catalogs', 'Photography', 'Large format displays'],
      printerDensity: 'Medium',
      priceRange: '$$$$',
      turnaroundSpeed: 'Medium',
      sustainabilityFocus: 'Medium',
      bestFor: 'Art prints, high-end materials, gallery exhibitions'
    },
    {
      id: 'pilsen',
      name: 'Pilsen',
      description: 'This creative neighborhood has a strong tradition of independent printers and specialty services with a focus on community and cultural projects.',
      printingSpecialties: ['Screen printing', 'Cultural materials', 'Posters', 'Community event materials'],
      printerDensity: 'Medium',
      priceRange: '$$',
      turnaroundSpeed: 'Variable',
      sustainabilityFocus: 'Medium-High',
      bestFor: 'Cultural events, community organizations, screen printing, independent artists'
    },
    {
      id: 'andersonville',
      name: 'Andersonville',
      description: 'This neighborhood is known for eco-friendly and community-oriented printing businesses.',
      printingSpecialties: ['Sustainable printing', 'Local business materials', 'Eco-friendly packaging'],
      printerDensity: 'Low-Medium',
      priceRange: '$$$',
      turnaroundSpeed: 'Medium',
      sustainabilityFocus: 'Very High',
      bestFor: 'Eco-conscious projects, sustainable materials, local businesses'
    },
    {
      id: 'printers-row',
      name: 'Printers Row',
      description: 'Historically Chicago\'s printing district, this area still maintains some specialty print shops with traditional techniques.',
      printingSpecialties: ['Book printing', 'Letterpress', 'Traditional techniques', 'Specialty binding'],
      printerDensity: 'Low-Medium',
      priceRange: '$$$-$$$$',
      turnaroundSpeed: 'Slower (craft focus)',
      sustainabilityFocus: 'Medium',
      bestFor: 'Books, letterpress, specialized traditional printing methods'
    },
    {
      id: 'logan-square',
      name: 'Logan Square',
      description: 'This trendy neighborhood has newer, tech-savvy print shops serving the creative community.',
      printingSpecialties: ['Creative marketing materials', 'Small-batch printing', 'Apparel', 'Stickers and merch'],
      printerDensity: 'Medium',
      priceRange: '$$-$$$',
      turnaroundSpeed: 'Medium-Fast',
      sustainabilityFocus: 'High',
      bestFor: 'Creative startups, small businesses, apparel printing'
    },
    {
      id: 'south-loop',
      name: 'South Loop',
      description: 'Convenient location for universities and downtown businesses with technical and educational printing specialists.',
      printingSpecialties: ['Educational materials', 'Technical documents', 'Academic printing', 'Signage'],
      printerDensity: 'Medium',
      priceRange: '$$-$$$',
      turnaroundSpeed: 'Fast',
      sustainabilityFocus: 'Medium',
      bestFor: 'Educational institutions, technical documentation, academic materials'
    }
  ];

  return (
    <div className="card">
      <h3 className="card-title">Chicago Neighborhood Printing Guide</h3>
      <p>Find the right print producer based on Chicago's unique neighborhood specialties and characteristics.</p>
      
      <div style={{ marginTop: '1.5rem' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
          {neighborhoods.map(hood => (
            <div 
              key={hood.id}
              className={`neighborhood-card ${selectedNeighborhood === hood.id ? 'active' : ''}`}
              style={{ 
                padding: '0.75rem', 
                borderRadius: '5px',
                backgroundColor: selectedNeighborhood === hood.id ? 'var(--primary)' : '#f8f9fa',
                color: selectedNeighborhood === hood.id ? 'white' : 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setSelectedNeighborhood(hood.id === selectedNeighborhood ? null : hood.id)}
            >
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{hood.name}</h4>
              <div style={{ fontSize: '0.8rem' }}>
                <div>Price: {hood.priceRange}</div>
                <div>Density: {hood.printerDensity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedNeighborhood && (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          {neighborhoods.filter(n => n.id === selectedNeighborhood).map(hood => (
            <div key={hood.id}>
              <h3 style={{ marginBottom: '1rem' }}>{hood.name}</h3>
              <p style={{ marginBottom: '1rem' }}>{hood.description}</p>
              
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Printing Specialties</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {hood.printingSpecialties.map((specialty, index) => (
                    <span 
                      key={index}
                      style={{ 
                        backgroundColor: 'var(--primary)', 
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Price Range</h4>
                  <p>{hood.priceRange}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Turnaround Speed</h4>
                  <p>{hood.turnaroundSpeed}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Sustainability Focus</h4>
                  <p>{hood.sustainabilityFocus}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Printer Density</h4>
                  <p>{hood.printerDensity}</p>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Best For</h4>
                <p>{hood.bestFor}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChicagoNeighborhoodGuide;