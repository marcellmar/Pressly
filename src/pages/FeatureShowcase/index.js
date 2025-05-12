import React, { useState } from 'react';

// Import our new components
import { PrintQualityRating, QualityInsights } from '../../components/QualityRating';
import { ChicagoNeighborhoodGuide, ChicagoMaterialsGuide } from '../../components/ChicagoSpecific';
import { PresslyRewards, ChicagoCommunity } from '../../components/Rewards';

/**
 * FeatureShowcase Page
 * 
 * A demonstration page for our new competitive moat features:
 * 1. Quality Rating System
 * 2. Chicago-specific features
 * 3. Rewards for active participants
 */
const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState('quality-rating');
  
  // Sample order data for the quality rating component
  const sampleOrder = {
    id: '12345',
    producerName: 'PrintMasters Chicago',
    productType: 'Business Cards',
    designId: 'D-001',
    producerId: 'P-001'
  };
  
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <section style={{ marginBottom: '2rem' }}>
        <h1>Feature Showcase</h1>
        <p className="lead">
          Explore Pressly's competitive advantages that create a powerful network-based moat.
        </p>
      </section>
      
      {/* Feature navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <button 
          className={`btn ${activeFeature === 'quality-rating' ? '' : 'btn-outline'}`}
          onClick={() => setActiveFeature('quality-rating')}
        >
          <i className="fas fa-star-half-alt" style={{ marginRight: '0.5rem' }}></i>
          Quality Rating System
        </button>
        <button 
          className={`btn ${activeFeature === 'quality-insights' ? '' : 'btn-outline'}`}
          onClick={() => setActiveFeature('quality-insights')}
        >
          <i className="fas fa-chart-line" style={{ marginRight: '0.5rem' }}></i>
          Quality Insights
        </button>
        <button 
          className={`btn ${activeFeature === 'chicago-guide' ? '' : 'btn-outline'}`}
          onClick={() => setActiveFeature('chicago-guide')}
        >
          <i className="fas fa-map-marked-alt" style={{ marginRight: '0.5rem' }}></i>
          Chicago Neighborhood Guide
        </button>
        <button 
          className={`btn ${activeFeature === 'chicago-materials' ? '' : 'btn-outline'}`}
          onClick={() => setActiveFeature('chicago-materials')}
        >
          <i className="fas fa-scroll" style={{ marginRight: '0.5rem' }}></i>
          Chicago Materials Guide
        </button>
        <button 
          className={`btn ${activeFeature === 'rewards' ? '' : 'btn-outline'}`}
          onClick={() => setActiveFeature('rewards')}
        >
          <i className="fas fa-gift" style={{ marginRight: '0.5rem' }}></i>
          Rewards Program
        </button>
        <button 
          className={`btn ${activeFeature === 'chicago-community' ? '' : 'btn-outline'}`}
          onClick={() => setActiveFeature('chicago-community')}
        >
          <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
          Chicago Community
        </button>
      </div>
      
      {/* Feature components */}
      <div style={{ marginBottom: '3rem' }}>
        {activeFeature === 'quality-rating' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2>Print Quality Rating System</h2>
              <p>
                Our specialized print quality rating system allows designers to provide detailed feedback on technical print attributes, 
                creating a rich dataset of quality metrics that improves matching and sets quality standards across the network.
              </p>
            </div>
            <PrintQualityRating 
              order={sampleOrder} 
              onSaveRating={(data) => console.log('Rating saved:', data)} 
            />
          </div>
        )}
        
        {activeFeature === 'quality-insights' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2>Quality Insights</h2>
              <p>
                Detailed quality analytics provide transparency into producer performance and help both designers and producers
                understand quality trends and improvement opportunities.
              </p>
            </div>
            <QualityInsights 
              producerId="P-001" 
              designerId="D-001" 
            />
          </div>
        )}
        
        {activeFeature === 'chicago-guide' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2>Chicago Neighborhood Print Guide</h2>
              <p>
                Our Chicago-specific guide connects designers with the rich printing heritage and specialized capabilities
                of Chicago's various neighborhoods, creating local density and network effects.
              </p>
            </div>
            <ChicagoNeighborhoodGuide />
          </div>
        )}
        
        {activeFeature === 'chicago-materials' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2>Chicago Print Materials Guide</h2>
              <p>
                Find materials specifically available from Chicago suppliers, with special attention to local climate
                considerations and Chicago-exclusive options.
              </p>
            </div>
            <ChicagoMaterialsGuide />
          </div>
        )}
        
        {activeFeature === 'rewards' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2>Pressly Rewards Program</h2>
              <p>
                Our comprehensive rewards system incentivizes platform activity, quality work, and community participation,
                creating strong network engagement and retention.
              </p>
            </div>
            <PresslyRewards 
              userType="designer" 
              userId="D-001" 
            />
          </div>
        )}
        
        {activeFeature === 'chicago-community' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2>Chicago Print Community</h2>
              <p>
                Exclusive Chicago-specific events, partners, and rewards create strong local network density
                and community engagement that competitors cannot easily replicate.
              </p>
            </div>
            <ChicagoCommunity />
          </div>
        )}
      </div>
      
      {/* Moat explanation section */}
      <section style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '8px',
        marginBottom: '2rem' 
      }}>
        <h2>Our Competitive Moat</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          These features work together to create a powerful, defensible competitive advantage for Pressly:
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-fingerprint" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Quality Data Advantage
            </h3>
            <p>
              Our specialized print quality metrics create a unique dataset that enables precise matching between designers and producers,
              improving over time as more transactions flow through the platform.
            </p>
          </div>
          
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-map-marked-alt" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Geographic Network Density
            </h3>
            <p>
              By focusing intensely on Chicago first, we create critical mass in one market before expanding,
              allowing us to perfect our model and build strong local relationships.
            </p>
          </div>
          
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-cogs" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Quality Standardization System
            </h3>
            <p>
              Our automated file analysis and standardization creates consistent quality across producers,
              addressing a core industry pain point that's difficult for competitors to replicate.
            </p>
          </div>
          
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-users" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Community & Rewards
            </h3>
            <p>
              Our rewards system creates powerful incentives for platform engagement, while community features
              strengthen relationships between designers and producers.
            </p>
          </div>
          
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Network Effects
            </h3>
            <p>
              As more designers and producers join, our platform becomes exponentially more valuable,
              creating a virtuous cycle that's difficult for new entrants to overcome.
            </p>
          </div>
          
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-code" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Technical Barrier to Entry
            </h3>
            <p>
              Our sophisticated matching algorithms, file analysis, and quality metrics create technical barriers
              that would be difficult and time-consuming for competitors to duplicate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureShowcase;
