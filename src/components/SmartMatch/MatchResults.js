import React, { useState } from 'react';

/**
 * MatchResults component
 * 
 * Displays the results of the smart matching algorithm with 
 * detailed information about each match and interactive sorting options.
 */
const MatchResults = ({ matches, onContactProducer }) => {
  const [showDesignerProfile, setShowDesignerProfile] = useState(false);
  const [sortBy, setSortBy] = useState('score'); // 'score', 'price', 'distance', 'rating'
  const [expandedMatch, setExpandedMatch] = useState(null);
  
  if (!matches || matches.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}>
          <i className="fas fa-search"></i>
        </div>
        <h3>No Matches Found</h3>
        <p>Try adjusting your filters or location to find more producers.</p>
      </div>
    );
  }

  // Sort the matches based on selected criteria
  const sortedMatches = [...matches].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        // Extract min price from price range strings like "$100-150"
        const aPrice = parseInt(a.estimatedPrice.replace('$', '').split('-')[0]);
        const bPrice = parseInt(b.estimatedPrice.replace('$', '').split('-')[0]);
        return aPrice - bPrice;
      case 'distance':
        return a.producer.distance - b.producer.distance;
      case 'rating':
        return b.producer.rating - a.producer.rating;
      case 'score':
      default:
        return b.matchScore - a.matchScore;
    }
  });

  // Toggle expanded view for a match
  const toggleMatchExpand = (matchId) => {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
    } else {
      setExpandedMatch(matchId);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>Smart Match Results</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid #ddd' 
            }}
          >
            <option value="score">Best Match</option>
            <option value="price">Lowest Price</option>
            <option value="distance">Closest</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>
      
      <p style={{ marginBottom: '1.5rem' }}>
        Found {matches.length} producers that match your project requirements.
      </p>
      
      {sortedMatches.map((match, index) => (
        <div 
          key={match.producer.id}
          style={{
            padding: '1.5rem',
            border: index === 0 && sortBy === 'score' ? '2px solid var(--primary)' : '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '1rem',
            backgroundColor: index === 0 && sortBy === 'score' ? 'rgba(58, 110, 165, 0.05)' : 'white',
            position: 'relative'
          }}
        >
          {index === 0 && sortBy === 'score' && (
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '20px', 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold' 
            }}>
              BEST MATCH
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>{match.producer.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#666' }}>
                <span style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                  <i className="fas fa-star" style={{ color: '#ffc107', marginRight: '0.25rem' }}></i>
                  {match.producer.rating}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: '0.25rem' }}></i>
                  {match.producer.distance} km
                </span>
                <span>
                  {match.producer.location?.city || 'Local Area'}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                <i className="fas fa-map-marked-alt" style={{ marginRight: '0.25rem' }}></i>
                {match.producer.address || match.producer.location?.address}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                color: 'var(--primary)', 
                marginBottom: '0.25rem', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: getScoreColor(match.matchScore),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginRight: '0.5rem'
                }}>
                  {match.matchScore}
                </div>
                <span>Match Score</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {match.producer.capabilities.join(' • ')}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Estimated Price</div>
              <div style={{ fontWeight: 'bold' }}>{match.estimatedPrice}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Turnaround Time</div>
              <div style={{ fontWeight: 'bold' }}>{match.turnaround}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Specialties</div>
              <div>{match.producer.specialties?.join(', ') || 'General Printing'}</div>
            </div>
          </div>
          
          <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            <strong>Match Analysis:</strong> {match.notes}
          </div>
          
          {expandedMatch === match.producer.id && (
            <div style={{ 
              marginTop: '1.5rem', 
              marginBottom: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '5px' 
            }}>
              <h5 style={{ marginBottom: '1rem' }}>Detailed Match Analysis</h5>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                <div>
                  <h6 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Capability Match</h6>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        height: '8px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '4px', 
                        overflow: 'hidden' 
                      }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${match.scores?.capabilities * 100 || 0}%`, 
                            backgroundColor: 'var(--primary)',
                          }}
                        ></div>
                      </div>
                    </div>
                    <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
                      {Math.round((match.scores?.capabilities || 0) * 100)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    {getCapabilityDescription(match.scores?.capabilities || 0)}
                  </p>
                </div>
                
                <div>
                  <h6 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Location</h6>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        height: '8px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '4px', 
                        overflow: 'hidden' 
                      }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${match.scores?.proximity * 100 || 0}%`, 
                            backgroundColor: 'var(--primary)',
                          }}
                        ></div>
                      </div>
                    </div>
                    <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
                      {Math.round((match.scores?.proximity || 0) * 100)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    {getProximityDescription(match.producer.distance)}
                  </p>
                </div>
                
                <div>
                  <h6 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Quality Rating</h6>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        height: '8px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '4px', 
                        overflow: 'hidden' 
                      }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${match.scores?.quality * 100 || 0}%`, 
                            backgroundColor: 'var(--primary)',
                          }}
                        ></div>
                      </div>
                    </div>
                    <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
                      {Math.round((match.scores?.quality || 0) * 100)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    {getQualityDescription(match.producer.rating)}
                  </p>
                </div>
                
                <div>
                  <h6 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Availability</h6>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        height: '8px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '4px', 
                        overflow: 'hidden' 
                      }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${match.scores?.availability * 100 || 0}%`, 
                            backgroundColor: 'var(--primary)',
                          }}
                        ></div>
                      </div>
                    </div>
                    <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
                      {Math.round((match.scores?.availability || 0) * 100)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    {getAvailabilityDescription(match.scores?.availability || 0)}
                  </p>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                <h6 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Producer Portfolio</h6>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem' }}>
                  {/* Simulated portfolio images */}
                  {Array(4).fill().map((_, i) => (
                    <div 
                      key={i}
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        flex: '0 0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="fas fa-image" style={{ color: '#adb5bd', fontSize: '2rem' }}></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button 
            className="btn"
            onClick={() => onContactProducer && onContactProducer(match.producer)}
            >
            Connect
            </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDesignerProfile(true)}
              >
                View Designer Profile
              </button>
            <button 
              className="btn btn-outline"
              onClick={() => toggleMatchExpand(match.producer.id)}
            >
              {expandedMatch === match.producer.id ? 'Hide Details' : 'View Details'}
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-location-arrow" style={{ marginRight: '0.5rem' }}></i>
              Get Directions
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
              Save Match
            </button>
          </div>
        </div>
      ))}

      {/* Designer Profile Modal */}
      {showDesignerProfile && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowDesignerProfile(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-times"></i>
            </button>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ flex: '0 0 200px' }}>
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Designer Profile" 
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
                />
                <h3>Sarah Johnson</h3>
                <p style={{ color: '#666' }}>Graphic Designer</p>
                <div style={{ marginTop: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <i className="fas fa-star" style={{ color: '#ffc107', marginRight: '0.5rem' }}></i> 4.9 (32 reviews)
                  </span>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '300px' }}>
                <h2 style={{ marginBottom: '1rem' }}>Designer Profile</h2>
                <p style={{ marginBottom: '1.5rem' }}>I'm a graphic designer with 8 years of experience specializing in print design, branding, and packaging. I focus on creating functional designs that communicate effectively while maintaining aesthetic appeal.</p>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem' }}>Location</h3>
                  <p><i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i> Chicago, IL</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem' }}>Specialties</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Branding', 'Packaging', 'Print Design', 'Typography', 'Logo Design'].map((specialty, index) => (
                      <span key={index} style={{
                        backgroundColor: 'var(--light)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                      }}>{specialty}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem' }}>Portfolio Highlights</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {Array(6).fill().map((_, i) => (
                      <div key={i} style={{ 
                        aspectRatio: '1', 
                        backgroundColor: i % 2 === 0 ? '#f8f9fa' : '#e9ecef',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        <i className="fas fa-image" style={{ fontSize: '2rem', color: '#adb5bd' }}></i>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => setShowDesignerProfile(false)} 
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for score color coding
const getScoreColor = (score) => {
  if (score >= 90) return '#28a745'; // Green
  if (score >= 70) return '#17a2b8'; // Blue
  if (score >= 50) return '#ffc107'; // Yellow
  return '#dc3545'; // Red
};

// Helper descriptions for match factors
const getCapabilityDescription = (score) => {
  if (score >= 0.9) return 'Perfect match for your technical requirements';
  if (score >= 0.7) return 'Strong technical match for most requirements';
  if (score >= 0.5) return 'Adequate technical capabilities for your project';
  return 'Limited match for your technical requirements';
};

const getProximityDescription = (distance) => {
  if (distance <= 5) return 'Very close to your location';
  if (distance <= 15) return 'Convenient distance from your location';
  if (distance <= 30) return 'Moderate distance from your location';
  return 'Distant from your location';
};

const getQualityDescription = (rating) => {
  if (rating >= 4.8) return 'Exceptional quality rating';
  if (rating >= 4.5) return 'Excellent quality rating';
  if (rating >= 4.0) return 'Very good quality rating';
  return 'Good quality rating';
};

const getAvailabilityDescription = (score) => {
  if (score >= 0.8) return 'Immediately available for your project';
  if (score >= 0.6) return 'Good availability for your timeline';
  if (score >= 0.4) return 'Limited availability, may affect timeline';
  return 'Currently busy, potential delays';
};

export default MatchResults;