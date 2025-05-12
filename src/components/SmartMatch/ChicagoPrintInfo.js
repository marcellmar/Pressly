import React, { useState } from 'react';
import { ChicagoNeighborhoodGuide, ChicagoMaterialsGuide } from '../ChicagoSpecific';

const ChicagoPrintInfo = () => {
  const [activeTab, setActiveTab] = useState('history');
  
  return (
    <div className="card">
      <h3 className="card-title">Chicago Print Industry Insights</h3>
      
      <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'history' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'history' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'history' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'districts' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'districts' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'districts' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('districts')}
        >
          Print Districts
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'services' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'services' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'services' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'sustainability' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'sustainability' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'sustainability' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('sustainability')}
        >
          Sustainability
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'neighborhoods' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'neighborhoods' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'neighborhoods' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('neighborhoods')}
        >
          Neighborhoods
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'materials' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'materials' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'materials' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
      </div>
      
      <div style={{ padding: '0.5rem' }}>
        {activeTab === 'history' && (
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Chicago's Rich Printing Heritage</h4>
            <p style={{ marginBottom: '1rem' }}>
              Chicago has been a major center for printing in the United States dating back to the 19th century. The city became a hub for printing and publishing following the Great Chicago Fire of 1871, which created opportunities for rebuilding and modernization.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              In the early 20th century, Chicago was home to major printing companies like R.R. Donnelley & Sons, which was founded in 1864 and grew to become one of the largest printing companies in the world. The company printed notable publications including the Yellow Pages, Encyclopaedia Britannica, and Time magazine.
            </p>
            <p>
              Today, Chicago's printing industry continues to thrive with a mix of large commercial printers and small specialty shops, adapting to digital technology while maintaining traditional craftsmanship in areas like letterpress and fine art printing.
            </p>
          </div>
        )}
        
        {activeTab === 'districts' && (
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Chicago's Print Districts</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem' }}>Printer's Row (South Loop)</h5>
              <p>
                Historically known as Chicago's printing hub, Printer's Row (located in the South Loop) was once home to many of the city's major printing facilities. Today, while most of the large printing operations have moved, the area preserves its history with converted loft buildings and hosts the annual Printer's Row Lit Fest.
              </p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem' }}>The Loop</h5>
              <p>
                Chicago's downtown business district maintains a significant concentration of commercial print shops serving the financial, legal, and corporate sectors with quick-turnaround digital printing, presentation materials, and business documents.
              </p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem' }}>West Town & Bucktown</h5>
              <p>
                These neighborhoods have developed a thriving community of specialty printers, including letterpress studios, screen printers, and art print makers, often working closely with Chicago's artist and design communities.
              </p>
            </div>
            
            <div>
              <h5 style={{ marginBottom: '0.5rem' }}>Industrial Corridors</h5>
              <p>
                Larger commercial printing operations are often found in Chicago's industrial corridors including areas along the Chicago River and near O'Hare, where they have access to transportation infrastructure and larger facilities for offset and large format production.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'services' && (
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Chicago Print Services</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h5 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-print" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                  Commercial Printing
                </h5>
                <p style={{ fontSize: '0.9rem' }}>
                  Full-service offset and digital printing for marketing materials, catalogs, direct mail, and business collateral.
                </p>
              </div>
              
              <div>
                <h5 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-expand" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                  Large Format
                </h5>
                <p style={{ fontSize: '0.9rem' }}>
                  Signage, banners, posters, displays, and exhibition graphics for indoor and outdoor use.
                </p>
              </div>
              
              <div>
                <h5 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-tshirt" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                  Specialty Printing
                </h5>
                <p style={{ fontSize: '0.9rem' }}>
                  Screen printing, letterpress, and embossing for textiles, fine art, and specialty projects.
                </p>
              </div>
              
              <div>
                <h5 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-box" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                  Packaging
                </h5>
                <p style={{ fontSize: '0.9rem' }}>
                  Custom packaging, labels, boxes, and product packaging solutions for businesses of all sizes.
                </p>
              </div>
              
              <div>
                <h5 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-book" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                  Book Production
                </h5>
                <p style={{ fontSize: '0.9rem' }}>
                  Book printing and binding services for publishers, self-publishers, and local authors.
                </p>
              </div>
              
              <div>
                <h5 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-palette" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                  Fine Art
                </h5>
                <p style={{ fontSize: '0.9rem' }}>
                  Giclee prints, art reproductions, and gallery-quality printing for artists and photographers.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'sustainability' && (
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Sustainable Printing in Chicago</h4>
            
            <p style={{ marginBottom: '1rem' }}>
              Chicago's printing industry has increasingly embraced sustainable practices in response to environmental concerns and customer demand for eco-friendly options.
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Green Certifications</h5>
              <p style={{ fontSize: '0.9rem' }}>
                Many Chicago printers have obtained certifications like Forest Stewardship Council (FSC), Sustainable Forestry Initiative (SFI), and Sustainable Green Printing Partnership (SGP) to validate their environmental commitments.
              </p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Eco-Friendly Materials</h5>
              <p style={{ fontSize: '0.9rem' }}>
                Local print producers offer a range of environmentally friendly options including recycled papers, papers made from alternative fibers (bamboo, cotton, hemp), and papers processed without chlorine bleaching.
              </p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Vegetable-Based Inks</h5>
              <p style={{ fontSize: '0.9rem' }}>
                Many Chicago printers have shifted from petroleum-based to vegetable-based inks (typically soy), which produce vibrant colors while being more environmentally friendly and easier to remove during recycling.
              </p>
            </div>
            
            <div>
              <h5 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Waste Reduction</h5>
              <p style={{ fontSize: '0.9rem' }}>
                Progressive print shops in Chicago implement comprehensive waste reduction strategies, including recycling programs for paper waste, aluminum printing plates, and solvents, as well as optimizing print runs to minimize excess.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'neighborhoods' && (
          <ChicagoNeighborhoodGuide />
        )}
        
        {activeTab === 'materials' && (
          <ChicagoMaterialsGuide />
        )}
      </div>
    </div>
  );
};

export default ChicagoPrintInfo;