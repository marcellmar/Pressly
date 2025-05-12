import React, { useState } from 'react';

/**
 * ChicagoMaterialsGuide Component
 * 
 * Provides Chicago-specific information about print materials,
 * their availability, and best practices for the local climate
 * and printing industry.
 */
const ChicagoMaterialsGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState('paper');
  
  // Material categories
  const categories = [
    { id: 'paper', name: 'Paper & Cardstock' },
    { id: 'largeformat', name: 'Large Format' },
    { id: 'fabrics', name: 'Fabrics & Apparel' },
    { id: 'specialty', name: 'Specialty Materials' },
    { id: 'eco', name: 'Eco-Friendly Options' }
  ];
  
  // Chicago-specific material information
  const materials = {
    paper: [
      {
        name: 'Premium Coated Paper',
        description: 'High-quality coated paper ideal for Chicago\'s commercial printing needs. Popular among Loop and River North businesses.',
        availability: 'High - Readily available across Chicago',
        localSuppliers: 'XpressPrint Supplies (West Loop), Chicago Paper Co. (Near North)',
        weatherConsiderations: 'Performs well in Chicago\'s variable humidity conditions',
        popularUses: 'Business cards, brochures, marketing materials',
        costRange: '$$-$$$',
        sustainabilityRating: 'Medium',
        chicagoTip: 'Loop-area printers offer bulk discounts on premium papers for corporate clients'
      },
      {
        name: 'Recycled Matte Stock',
        description: 'Environmentally friendly option with growing popularity in Chicago\'s eco-conscious neighborhoods.',
        availability: 'Medium-High - Available at most Chicago print shops',
        localSuppliers: 'GreenPrint (Andersonville), EcoMade Materials (Logan Square)',
        weatherConsiderations: 'May require special handling during Chicago\'s humid summers',
        popularUses: 'Local business marketing, community flyers, arts programs',
        costRange: '$$-$$$',
        sustainabilityRating: 'Very High',
        chicagoTip: 'Andersonville and Logan Square printers specialize in recycled stock with local fiber sources'
      },
      {
        name: 'Premium Cover Stock',
        description: 'Heavy, durable cardstock used for high-end applications and luxury marketing materials.',
        availability: 'Medium - Common at commercial printers in downtown Chicago',
        localSuppliers: 'Gold Coast Paper, Magnificent Mile Print Supply',
        weatherConsiderations: 'Resistant to Chicago\'s seasonal humidity variations',
        popularUses: 'Business cards, presentation folders, luxury packaging',
        costRange: '$$$-$$$$',
        sustainabilityRating: 'Low-Medium',
        chicagoTip: 'River North printers often stock specialty finishes for artistic and luxury applications'
      }
    ],
    largeformat: [
      {
        name: 'Outdoor Vinyl',
        description: 'Weather-resistant vinyl specifically rated for Chicago\'s extreme seasonal variations.',
        availability: 'High - Common at large format printers citywide',
        localSuppliers: 'Chicago Sign Supply (West Side), MidwestVinyl (South Loop)',
        weatherConsiderations: 'Designed to withstand Chicago winters and summer heat',
        popularUses: 'Outdoor signage, event banners, storefront displays',
        costRange: '$$-$$$',
        sustainabilityRating: 'Low',
        chicagoTip: 'Look for "Chicago-rated" vinyl that can handle temperature extremes from -20°F to 100°F'
      },
      {
        name: 'Indoor Display Film',
        description: 'High-quality film for indoor displays and exhibitions, popular for Chicago\'s numerous galleries and trade shows.',
        availability: 'Medium-High - Available at specialized large format printers',
        localSuppliers: 'Exhibition Graphics (River North), GalleryPrint (Pilsen)',
        weatherConsiderations: 'Designed for climate-controlled environments',
        popularUses: 'Gallery exhibitions, trade show displays, museum signage',
        costRange: '$$$',
        sustainabilityRating: 'Medium',
        chicagoTip: 'River North and South Loop printers specialize in gallery-quality large format printing'
      },
      {
        name: 'Chicago-Tough Canvas',
        description: 'Reinforced canvas material popular for outdoor art installations throughout Chicago neighborhoods.',
        availability: 'Medium - Available at specialized printers',
        localSuppliers: 'Urban Art Supplies (Wicker Park), City Canvas (Pilsen)',
        weatherConsiderations: 'Reinforced to withstand Chicago\'s wind and weather fluctuations',
        popularUses: 'Public art, outdoor installations, murals, festival backdrops',
        costRange: '$$$$',
        sustainabilityRating: 'Medium-High',
        chicagoTip: 'Local artists prefer this material for Millennium Park and lakefront installations'
      }
    ],
    fabrics: [
      {
        name: 'Performance Polyester',
        description: 'Durable polyester fabric ideal for Chicago\'s active lifestyle and sports communities.',
        availability: 'Medium-High - Available at garment printers citywide',
        localSuppliers: 'SportsFabric Chicago (West Loop), Team Print Supplies (North Side)',
        weatherConsiderations: 'Quick-drying for Chicago\'s variable weather conditions',
        popularUses: 'Athletic wear, team uniforms, outdoor event apparel',
        costRange: '$$-$$$',
        sustainabilityRating: 'Low',
        chicagoTip: 'Popular for Chicago marathon, sports teams, and summer festival merchandise'
      },
      {
        name: 'Organic Cotton Blend',
        description: 'Eco-friendly cotton option popular in Chicago\'s progressive neighborhoods.',
        availability: 'Medium - Growing availability at specialty printers',
        localSuppliers: 'GreenThread (Andersonville), EcoTextile (Logan Square)',
        weatherConsiderations: 'Breathable for Chicago summers, may shrink if not pre-treated',
        popularUses: 'Local business merchandise, community organizations, band merch',
        costRange: '$$$',
        sustainabilityRating: 'Very High',
        chicagoTip: 'Preferred by Wicker Park and Logan Square businesses for branded merchandise'
      },
      {
        name: 'Chicago Canvas',
        description: 'Heavy-duty canvas popular for tote bags and durable merchandise throughout the city.',
        availability: 'High - Available at most garment printers',
        localSuppliers: 'City Textile (West Loop), Urban Fabric Supply (Pilsen)',
        weatherConsiderations: 'Weather-resistant and durable year-round',
        popularUses: 'Tote bags, heavy-duty merchandise, festival gear',
        costRange: '$$',
        sustainabilityRating: 'Medium',
        chicagoTip: 'Look for Chicago-sourced canvas from local suppliers for authentic city merchandise'
      }
    ],
    specialty: [
      {
        name: 'Metallic Finish Paper',
        description: 'Premium paper with metallic coating, popular for high-end River North and Gold Coast clients.',
        availability: 'Medium - Available at premium print shops',
        localSuppliers: 'Luxury Print Supplies (River North), Premium Papers (Loop)',
        weatherConsiderations: 'Sensitive to humidity, requires climate-controlled storage',
        popularUses: 'Luxury invitations, high-end business cards, promotional materials',
        costRange: '$$$$',
        sustainabilityRating: 'Low',
        chicagoTip: 'Used by Chicago\'s luxury hotels and high-end restaurants for branded materials'
      },
      {
        name: 'Clear Acrylic',
        description: 'Modern transparent material popular for Chicago\'s contemporary business district and art scene.',
        availability: 'Medium - Available at specialized printers',
        localSuppliers: 'ModernMaterials (River North), ClearPrint Supplies (West Loop)',
        weatherConsiderations: 'May become brittle in extreme Chicago cold, store appropriately',
        popularUses: 'Modern signage, art installations, high-end display materials',
        costRange: '$$$$',
        sustainabilityRating: 'Low',
        chicagoTip: 'River North galleries and Michigan Avenue retailers prefer this material'
      },
      {
        name: 'Lakeshore Linen Blend',
        description: 'Specialty paper with linen texture, named after Chicago\'s iconic shoreline.',
        availability: 'Low-Medium - Available at high-end print shops',
        localSuppliers: 'Chicago Paper Artisans (Gold Coast), Heritage Papers (Loop)',
        weatherConsiderations: 'Handles Chicago humidity well with proper storage',
        popularUses: 'Wedding invitations, high-end stationery, luxury business materials',
        costRange: '$$$$',
        sustainabilityRating: 'Medium',
        chicagoTip: 'The specialty blend was developed specifically for Chicago\'s climate conditions'
      }
    ],
    eco: [
      {
        name: 'Chicago Recycled',
        description: 'Locally sourced recycled paper from Chicago\'s recycling programs, minimizing carbon footprint.',
        availability: 'Medium - Growing availability throughout the city',
        localSuppliers: 'Green City Suppliers (Andersonville), ChiEco Materials (Logan Square)',
        weatherConsiderations: 'Performs well in local conditions, may vary by batch',
        popularUses: 'Community materials, eco-conscious businesses, local event promotion',
        costRange: '$$',
        sustainabilityRating: 'Excellent',
        chicagoTip: 'Supported by Chicago\'s sustainability initiatives with special pricing for local businesses'
      },
      {
        name: 'Prairie Grass Paper',
        description: 'Innovative paper made from native Illinois prairie grasses, supporting local ecosystem restoration.',
        availability: 'Low - Available at select eco-conscious printers',
        localSuppliers: 'Illinois Conservation Press (North Side), Prairie Print Partners (Oak Park)',
        weatherConsiderations: 'Naturally adapted to local climate conditions',
        popularUses: 'Environmental organizations, nature centers, conservation materials',
        costRange: '$$$',
        sustainabilityRating: 'Excellent',
        chicagoTip: 'Used by Chicago Park District and conservation organizations for educational materials'
      },
      {
        name: 'Algae-Blend Stock',
        description: 'Revolutionary paper partially made from Lake Michigan algae, supporting lake cleanup efforts.',
        availability: 'Very Low - Specialty item at eco-focused printers',
        localSuppliers: 'Great Lakes Print Collective (Rogers Park), EcoInnovation Hub (Hyde Park)',
        weatherConsiderations: 'Highly resistant to humidity due to algae content',
        popularUses: 'Environmental campaigns, lakefront event materials, conservation education',
        costRange: '$$$$',
        sustainabilityRating: 'Excellent',
        chicagoTip: 'A portion of each purchase supports Lake Michigan conservation efforts'
      }
    ]
  };

  return (
    <div className="card">
      <h3 className="card-title">Chicago Print Materials Guide</h3>
      <p>Find the right materials for your printing project based on Chicago's climate, local availability, and neighborhood specialties.</p>
      
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {categories.map(category => (
            <button 
              key={category.id}
              className={`btn ${selectedCategory === category.id ? '' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div>
          {materials[selectedCategory].map((material, index) => (
            <div 
              key={index}
              style={{ 
                marginBottom: index < materials[selectedCategory].length - 1 ? '1.5rem' : 0,
                padding: index > 0 ? '1.5rem 0 0 0' : 0,
                borderTop: index > 0 ? '1px solid #eee' : 'none'
              }}
            >
              <h4 style={{ marginBottom: '0.5rem' }}>{material.name}</h4>
              <p style={{ marginBottom: '1rem' }}>{material.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Availability in Chicago:</strong>
                  <span>{material.availability}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Local Suppliers:</strong>
                  <span>{material.localSuppliers}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Cost Range:</strong>
                  <span>{material.costRange}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Sustainability Rating:</strong>
                  <span>{material.sustainabilityRating}</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Chicago Weather Considerations:</strong>
                <p>{material.weatherConsiderations}</p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Popular Uses:</strong>
                <p>{material.popularUses}</p>
              </div>
              
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#e9f7fe', 
                borderRadius: '5px',
                borderLeft: '4px solid var(--primary)'
              }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Chicago Insider Tip:</strong>
                <p style={{ margin: 0 }}>{material.chicagoTip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChicagoMaterialsGuide;