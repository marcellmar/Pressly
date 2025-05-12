import React, { useState } from 'react';

/**
 * ChicagoCommunity Component
 * 
 * A specialized component focused on Chicago-specific community features,
 * events, and local rewards opportunities.
 * 
 * Features:
 * - Chicago print industry events calendar
 * - Local networking opportunities
 * - Chicago-specific rewards and partners
 * - Chicago print community initiatives
 */
const ChicagoCommunity = () => {
  const [activeTab, setActiveTab] = useState('events');
  
  // Sample community data
  const communityData = {
    events: [
      {
        id: 'e1',
        name: 'Chicago Print Week',
        description: 'A week-long celebration of print in Chicago with workshops, demonstrations, and networking events.',
        date: '2023-09-15',
        location: 'Various locations throughout Chicago',
        pointsReward: 100,
        image: 'https://via.placeholder.com/300x150?text=Chicago+Print+Week',
        requiresRegistration: true,
        partners: ['Chicago Printers Guild', 'Design Museum of Chicago']
      },
      {
        id: 'e2',
        name: 'Printer\'s Row Networking Mixer',
        description: 'Monthly networking event for print professionals in the historic Printer\'s Row district.',
        date: '2023-05-05',
        location: 'Printer\'s Row Loft, 731 S. Plymouth Ct.',
        pointsReward: 50,
        image: 'https://via.placeholder.com/300x150?text=Networking+Mixer',
        requiresRegistration: true,
        partners: ['Printer\'s Row Business Association']
      },
      {
        id: 'e3',
        name: 'Chicago Print Shop Tours',
        description: 'Monthly guided tours of various print shops throughout Chicago neighborhoods.',
        date: '2023-05-20',
        location: 'West Town (meeting point provided after registration)',
        pointsReward: 75,
        image: 'https://via.placeholder.com/300x150?text=Print+Shop+Tours',
        requiresRegistration: true,
        partners: ['Chicago Manufacturing Renaissance']
      },
      {
        id: 'e4',
        name: 'Print History Walking Tour',
        description: 'Walking tour of Chicago\'s historic printing districts with insights into the city\'s rich print heritage.',
        date: '2023-06-10',
        location: 'Starts at Harold Washington Library Center',
        pointsReward: 50,
        image: 'https://via.placeholder.com/300x150?text=History+Tour',
        requiresRegistration: true,
        partners: ['Chicago Architecture Center', 'Chicago History Museum']
      },
      {
        id: 'e5',
        name: 'Sustainable Print Workshop',
        description: 'Learn about eco-friendly printing techniques and materials from Chicago\'s leading sustainability experts.',
        date: '2023-06-15',
        location: 'The Plant Chicago, Back of the Yards',
        pointsReward: 75,
        image: 'https://via.placeholder.com/300x150?text=Sustainability+Workshop',
        requiresRegistration: true,
        partners: ['The Plant Chicago', 'Eco Printing Solutions']
      }
    ],
    partners: [
      {
        id: 'p1',
        name: 'Chicago Printers Guild',
        description: 'A professional association of Chicago-area printers focused on preserving craft techniques and promoting print education.',
        benefits: ['Member discounts', 'Workshop access', 'Community resources'],
        location: 'Pilsen',
        website: 'https://example.com/cpg',
        logo: 'https://via.placeholder.com/100?text=CPG'
      },
      {
        id: 'p2',
        name: 'Design Museum of Chicago',
        description: 'Cultural institution dedicated to design history and innovation, with special focus on Chicago\'s print heritage.',
        benefits: ['Event discounts', 'Exhibition previews', 'Members-only events'],
        location: 'The Loop',
        website: 'https://example.com/designmuseum',
        logo: 'https://via.placeholder.com/100?text=Design+Museum'
      },
      {
        id: 'p3',
        name: 'Chicago Manufacturing Renaissance',
        description: 'Organization supporting Chicago\'s manufacturing sectors, including the print industry, through education and advocacy.',
        benefits: ['Industry connections', 'Training programs', 'Business resources'],
        location: 'West Loop',
        website: 'https://example.com/cmr',
        logo: 'https://via.placeholder.com/100?text=CMR'
      },
      {
        id: 'p4',
        name: 'Printer\'s Row Business Association',
        description: 'Community organization representing businesses in Chicago\'s historic printing district.',
        benefits: ['Networking events', 'Local business support', 'Historical preservation'],
        location: 'Printer\'s Row / South Loop',
        website: 'https://example.com/prba',
        logo: 'https://via.placeholder.com/100?text=PRBA'
      },
      {
        id: 'p5',
        name: 'Chicago Print Collective',
        description: 'Artist collective focused on printmaking and community art projects throughout Chicago neighborhoods.',
        benefits: ['Artist collaborations', 'Community workshops', 'Exhibition opportunities'],
        location: 'Logan Square',
        website: 'https://example.com/printcollective',
        logo: 'https://via.placeholder.com/100?text=Print+Collective'
      }
    ],
    initiatives: [
      {
        id: 'i1',
        name: 'Chicago Print Heritage Preservation',
        description: 'Project to document and preserve Chicago\'s rich printing history through oral histories, artifact collection, and digital archives.',
        status: 'Ongoing',
        pointsForParticipation: 100,
        howToParticipate: 'Share print industry artifacts, stories, or volunteer for documentation events.',
        image: 'https://via.placeholder.com/300x150?text=Heritage+Preservation'
      },
      {
        id: 'i2',
        name: 'Chicago Schools Print Education',
        description: 'Program bringing print education to Chicago public schools through demonstrations, workshops, and curriculum materials.',
        status: 'Active School Year',
        pointsForParticipation: 150,
        howToParticipate: 'Volunteer as a print educator or donate materials for school workshops.',
        image: 'https://via.placeholder.com/300x150?text=Print+Education'
      },
      {
        id: 'i3',
        name: 'Neighborhood Print Shop Support',
        description: 'Initiative connecting small Chicago neighborhood print shops with local businesses to boost the local print economy.',
        status: 'Ongoing',
        pointsForParticipation: 75,
        howToParticipate: 'Register your print shop or refer local businesses to participate.',
        image: 'https://via.placeholder.com/300x150?text=Shop+Support'
      },
      {
        id: 'i4',
        name: 'Chicago Print Sustainability Alliance',
        description: 'Collaborative effort to make Chicago\'s print industry more environmentally sustainable through education and resource sharing.',
        status: 'Growing',
        pointsForParticipation: 100,
        howToParticipate: 'Join the alliance, attend sustainability workshops, or implement recommended practices.',
        image: 'https://via.placeholder.com/300x150?text=Sustainability+Alliance'
      }
    ],
    localRewards: [
      {
        id: 'r1',
        name: 'Chicago Print Week VIP Pass',
        description: 'Exclusive access to all Chicago Print Week events, including special receptions and demonstrations.',
        pointCost: 1000,
        partnerProvider: 'Chicago Printers Guild',
        limited: true,
        image: 'https://via.placeholder.com/150?text=VIP+Pass'
      },
      {
        id: 'r2',
        name: 'Printer\'s Row Festival Tickets',
        description: 'Pair of tickets to the annual Printer\'s Row Lit Festival, featuring book and print artists from across the region.',
        pointCost: 750,
        partnerProvider: 'Printer\'s Row Business Association',
        limited: true,
        image: 'https://via.placeholder.com/150?text=Festival+Tickets'
      },
      {
        id: 'r3',
        name: 'Chicago Print History Book',
        description: 'Limited edition book documenting Chicago\'s print history with rare photographs and stories.',
        pointCost: 500,
        partnerProvider: 'Design Museum of Chicago',
        limited: true,
        image: 'https://via.placeholder.com/150?text=History+Book'
      },
      {
        id: 'r4',
        name: 'Chicago Neighborhood Print Shop Tour',
        description: 'Private guided tour of three specialty print shops in Chicago neighborhoods of your choice.',
        pointCost: 600,
        partnerProvider: 'Chicago Manufacturing Renaissance',
        limited: false,
        image: 'https://via.placeholder.com/150?text=Private+Tour'
      },
      {
        id: 'r5',
        name: 'Chicago Artisan Paper Collection',
        description: 'Curated box of specialty papers from Chicago\'s finest paper makers and suppliers.',
        pointCost: 450,
        partnerProvider: 'Chicago Print Collective',
        limited: false,
        image: 'https://via.placeholder.com/150?text=Paper+Collection'
      }
    ]
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="card">
      <h3 className="card-title">Chicago Print Community</h3>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p>
          Connect with Chicago's vibrant print community, earn rewards, and build valuable local relationships. 
          Participating in Chicago-specific activities earns you bonus points in the Pressly Rewards program.
        </p>
      </div>
      
      {/* Tabs navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'events' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'events' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'events' ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => setActiveTab('events')}
        >
          <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
          Local Events
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'partners' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'partners' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'partners' ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => setActiveTab('partners')}
        >
          <i className="fas fa-handshake" style={{ marginRight: '0.5rem' }}></i>
          Chicago Partners
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'initiatives' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'initiatives' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'initiatives' ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => setActiveTab('initiatives')}
        >
          <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
          Community Initiatives
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'rewards' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'rewards' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'rewards' ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => setActiveTab('rewards')}
        >
          <i className="fas fa-gift" style={{ marginRight: '0.5rem' }}></i>
          Chicago-Exclusive Rewards
        </button>
      </div>
      
      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {communityData.events.map(event => (
              <div 
                key={event.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  height: '150px', 
                  backgroundImage: `url(${event.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-star" style={{ marginRight: '0.25rem', color: '#FFD700' }}></i>
                    {event.pointsReward} points
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{event.name}</h4>
                  <p style={{ marginBottom: '1rem', color: '#666' }}>{event.description}</p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <i className="fas fa-calendar" style={{ width: '20px', color: '#666', marginRight: '0.5rem' }}></i>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-map-marker-alt" style={{ width: '20px', color: '#666', marginRight: '0.5rem' }}></i>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  {event.partners.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>In partnership with:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {event.partners.map((partner, index) => (
                          <span 
                            key={index}
                            style={{
                              backgroundColor: '#f8f9fa',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '3px',
                              fontSize: '0.8rem',
                              border: '1px solid #eee'
                            }}
                          >
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button className="btn" style={{ width: '100%' }}>
                    {event.requiresRegistration ? 'Register Now' : 'Learn More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Partners Tab */}
      {activeTab === 'partners' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p>
              Pressly partners with these Chicago organizations to provide exclusive benefits, events, and opportunities for our community members.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {communityData.partners.map(partner => (
              <div 
                key={partner.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ 
                  padding: '1.5rem', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    flexShrink: 0,
                    backgroundColor: '#f8f9fa',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{partner.name}</h4>
                    <div style={{ fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-map-marker-alt" style={{ marginRight: '0.25rem', color: '#EA4335' }}></i>
                      {partner.location}
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ marginBottom: '1.5rem', color: '#666', flex: 1 }}>{partner.description}</p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Member Benefits</h5>
                    <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                      {partner.benefits.map((benefit, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <a 
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Initiatives Tab */}
      {activeTab === 'initiatives' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p>
              Join these ongoing Chicago print community initiatives to make a difference while earning rewards points.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {communityData.initiatives.map(initiative => (
              <div 
                key={initiative.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  height: '150px', 
                  backgroundImage: `url(${initiative.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#34A853',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {initiative.status}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ 
                    marginBottom: '0.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}>
                    <span>{initiative.name}</span>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      backgroundColor: 'var(--primary)', 
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <i className="fas fa-star" style={{ marginRight: '0.25rem', color: '#FFD700' }}></i>
                      {initiative.pointsForParticipation} points
                    </span>
                  </h4>
                  <p style={{ marginBottom: '1rem', color: '#666' }}>{initiative.description}</p>
                  
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    marginBottom: '1.5rem'
                  }}>
                    <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>How to Participate</h5>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{initiative.howToParticipate}</p>
                  </div>
                  
                  <button className="btn" style={{ width: '100%' }}>
                    Join Initiative
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p>
              Exclusive rewards only available to Pressly members in the Chicago area. Redeem your points for these local experiences and items.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {communityData.localRewards.map(reward => (
              <div 
                key={reward.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  position: 'relative',
                  height: '150px',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={reward.image} 
                    alt={reward.name}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                  
                  {reward.limited && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      left: '0.5rem',
                      backgroundColor: '#EA4335',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '3px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      LIMITED
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1rem' }}>
                  <h5 style={{ marginBottom: '0.5rem' }}>{reward.name}</h5>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem', minHeight: '5rem' }}>
                    {reward.description}
                  </p>
                  
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#666', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-handshake" style={{ marginRight: '0.5rem' }}></i>
                    Partner: {reward.partnerProvider}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #eee'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.1rem',
                      color: 'var(--primary)', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}>
                      {reward.pointCost}
                      <i className="fas fa-star" style={{ marginLeft: '0.25rem', color: '#FBBC05', fontSize: '0.9rem' }}></i>
                    </div>
                    
                    <button className="btn btn-sm">
                      Redeem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Chicago map banner */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        backgroundImage: 'url(https://via.placeholder.com/1200x200?text=Chicago+Map+Background)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Join the Chicago Print Community Today</h3>
        <p style={{ marginBottom: '1.5rem', maxWidth: '600px' }}>
          Connect with Chicago's rich printing heritage and vibrant current scene while earning rewards and building valuable relationships.
        </p>
        <button className="btn btn-lg" style={{ backgroundColor: '#EA4335' }}>
          <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i>
          Update Chicago Community Profile
        </button>
      </div>
    </div>
  );
};

export default ChicagoCommunity;
