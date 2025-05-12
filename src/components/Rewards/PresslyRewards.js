import React, { useState } from 'react';

/**
 * PresslyRewards Component
 * 
 * A comprehensive rewards system for both designers and producers that
 * incentivizes platform activity, quality work, and community participation.
 * 
 * Features:
 * - Points-based rewards for platform activities
 * - Quality-based multipliers for exceptional print jobs
 * - Chicago-specific rewards and partnerships
 * - Activity streak bonuses
 * - Tiered loyalty program
 */
const PresslyRewards = ({ userType = 'designer', userId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample rewards data for demonstration
  // In a real implementation, this would come from an API
  const rewardsData = {
    points: userType === 'designer' ? 1275 : 2140,
    level: userType === 'designer' ? 'Silver' : 'Gold',
    nextLevel: userType === 'designer' ? 'Gold' : 'Platinum',
    pointsToNextLevel: userType === 'designer' ? 725 : 860,
    recentActivity: [
      { 
        id: 'a1', 
        action: userType === 'designer' ? 'Design Uploaded' : 'Completed Order', 
        points: userType === 'designer' ? 50 : 100, 
        date: '2023-04-01' 
      },
      { 
        id: 'a2', 
        action: userType === 'designer' ? 'Order Completed' : 'On-time Delivery', 
        points: userType === 'designer' ? 100 : 75, 
        date: '2023-03-27' 
      },
      { 
        id: 'a3', 
        action: 'Quality Rating 4.8/5', 
        points: 120, 
        date: '2023-03-27' 
      },
      { 
        id: 'a4', 
        action: userType === 'designer' ? 'Producer Review Written' : 'Designer Review Written', 
        points: 25, 
        date: '2023-03-27' 
      },
      { 
        id: 'a5', 
        action: 'Weekly Activity Streak', 
        points: 50, 
        date: '2023-03-26' 
      }
    ],
    availableRewards: [
      {
        id: 'r1',
        name: userType === 'designer' ? 'Priority Matching' : 'Featured Producer Status',
        description: userType === 'designer' 
          ? 'Get priority in the producer matching queue for your next design'
          : 'Featured placement in designer search results for one week',
        pointCost: 500,
        available: true
      },
      {
        id: 'r2',
        name: 'Chicago Print Week VIP Pass',
        description: 'Exclusive access to Chicago Print Week events and demonstrations',
        pointCost: 1000,
        available: true,
        chicagoSpecific: true
      },
      {
        id: 'r3',
        name: userType === 'designer' ? 'Free Paper Sample Kit' : 'Production Material Discount',
        description: userType === 'designer'
          ? 'Premium paper sample kit from Chicago suppliers'
          : '15% discount on next material order with participating suppliers',
        pointCost: 300,
        available: true
      },
      {
        id: 'r4',
        name: 'Chicago Printer\'s Row Festival Tickets',
        description: 'Two tickets to the annual Printer\'s Row Literature Festival',
        pointCost: 750,
        available: true,
        chicagoSpecific: true
      },
      {
        id: 'r5',
        name: userType === 'designer' ? 'Design Feature' : 'Shop Feature',
        description: userType === 'designer'
          ? 'Featured placement in the Pressly design gallery'
          : 'Featured spotlight in the monthly producer showcase',
        pointCost: 400,
        available: true
      }
    ],
    levels: [
      { name: 'Bronze', minPoints: 0, benefits: ['Basic Matching', 'Standard Support'] },
      { name: 'Silver', minPoints: 1000, benefits: ['5% Platform Fee Discount', 'Priority Support'] },
      { name: 'Gold', minPoints: 2000, benefits: ['10% Platform Fee Discount', 'Premium Support', 'Early Access to Features'] },
      { name: 'Platinum', minPoints: 3000, benefits: ['15% Platform Fee Discount', 'Dedicated Account Manager', 'Exclusive Events Access', 'Custom Promotional Opportunities'] }
    ],
    pointsOpportunities: userType === 'designer' ? [
      { action: 'Upload Design', points: 50, frequency: 'Per Design' },
      { action: 'Complete Order', points: 100, frequency: 'Per Order' },
      { action: 'Quality Rating Above 4.5', points: 120, frequency: 'Per Rating' },
      { action: 'Write Producer Review', points: 25, frequency: 'Per Review' },
      { action: 'Weekly Activity Streak', points: 50, frequency: 'Weekly' },
      { action: 'Refer a Designer', points: 200, frequency: 'Per Referral' },
      { action: 'Refer a Producer', points: 300, frequency: 'Per Referral' },
      { action: 'First Chicago Producer Order', points: 150, frequency: 'One-time', chicagoSpecific: true },
      { action: 'Profile Completion', points: 100, frequency: 'One-time' },
      { action: 'Community Forum Contribution', points: 20, frequency: 'Per Contribution' }
    ] : [
      { action: 'Complete Order', points: 100, frequency: 'Per Order' },
      { action: 'On-time Delivery', points: 75, frequency: 'Per Order' },
      { action: 'Quality Rating Above 4.5', points: 120, frequency: 'Per Rating' },
      { action: 'Write Designer Review', points: 25, frequency: 'Per Review' },
      { action: 'Weekly Capacity Updates', points: 50, frequency: 'Weekly' },
      { action: 'Refer a Producer', points: 200, frequency: 'Per Referral' },
      { action: 'Refer a Designer', points: 300, frequency: 'Per Referral' },
      { action: 'First-time Chicago Designer', points: 150, frequency: 'Per Designer', chicagoSpecific: true },
      { action: 'Profile Completion', points: 100, frequency: 'One-time' },
      { action: 'Community Knowledge Sharing', points: 30, frequency: 'Per Article' }
    ]
  };
  
  // Calculate level progress percentage
  const getCurrentLevelProgress = () => {
    const currentLevel = rewardsData.levels.find(level => level.name === rewardsData.level);
    const nextLevel = rewardsData.levels.find(level => level.name === rewardsData.nextLevel);
    
    if (!currentLevel || !nextLevel) return 0;
    
    const levelRange = nextLevel.minPoints - currentLevel.minPoints;
    const pointsInLevel = rewardsData.points - currentLevel.minPoints;
    
    return Math.min(100, Math.round((pointsInLevel / levelRange) * 100));
  };
  
  // Level progress percentage
  const levelProgressPercentage = getCurrentLevelProgress();
  
  return (
    <div className="card">
      <h3 className="card-title">Pressly Rewards Program</h3>
      
      {/* Points summary header */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1.5rem', 
        marginBottom: '2rem', 
        backgroundColor: '#f8f9fa', 
        padding: '1.5rem', 
        borderRadius: '8px' 
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>YOUR POINTS</div>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'var(--primary)',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            {rewardsData.points}
            <i className="fas fa-star" style={{ fontSize: '1.5rem', marginLeft: '0.5rem', color: '#FBBC05' }}></i>
          </div>
          <button className="btn btn-sm">
            <i className="fas fa-gift" style={{ marginRight: '0.5rem' }}></i>
            Redeem Points
          </button>
        </div>
        
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>CURRENT LEVEL</div>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: getLevelColor(rewardsData.level),
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            {rewardsData.level}
            {getLevelIcon(rewardsData.level)}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            {rewardsData.pointsToNextLevel} points to {rewardsData.nextLevel}
          </div>
          <div style={{ 
            height: '8px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '4px', 
            overflow: 'hidden',
            marginTop: '0.5rem' 
          }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${levelProgressPercentage}%`, 
                backgroundColor: getLevelColor(rewardsData.level),
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'overview' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'rewards' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'rewards' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'rewards' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('rewards')}
        >
          Available Rewards
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'levels' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'levels' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'levels' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('levels')}
        >
          Membership Levels
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'opportunities' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'opportunities' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'opportunities' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('opportunities')}
        >
          Earn Points
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Recent Activity</h4>
            <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
              {rewardsData.recentActivity.map((activity, index) => (
                <div 
                  key={activity.id}
                  style={{
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: index < rewardsData.recentActivity.length - 1 ? '1px solid #eee' : 'none'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{activity.action}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{activity.date}</div>
                  </div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}>
                    +{activity.points}
                    <i className="fas fa-star" style={{ marginLeft: '0.25rem', color: '#FBBC05', fontSize: '0.85rem' }}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Featured Rewards</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {rewardsData.availableRewards.slice(0, 3).map(reward => (
                <div 
                  key={reward.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #eee',
                    position: 'relative'
                  }}
                >
                  {reward.chicagoSpecific && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: '#34A853',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '3px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      CHICAGO
                    </div>
                  )}
                  
                  <h5 style={{ marginBottom: '0.5rem' }}>{reward.name}</h5>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#666' }}>
                    {reward.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: 'var(--primary)', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}>
                      {reward.pointCost}
                      <i className="fas fa-star" style={{ marginLeft: '0.25rem', color: '#FBBC05', fontSize: '0.85rem' }}></i>
                    </div>
                    
                    <button 
                      className="btn btn-sm"
                      disabled={rewardsData.points < reward.pointCost}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#e8f5e9', 
            borderRadius: '8px',
            border: '1px solid #c8e6c9'
          }}>
            <h4 style={{ marginBottom: '0.75rem', color: '#2e7d32', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-lightbulb" style={{ marginRight: '0.5rem' }}></i>
              Points Boost Opportunity
            </h4>
            <p style={{ color: '#2e7d32', marginBottom: '1rem' }}>
              {userType === 'designer'
                ? 'Connect with a Chicago-based print producer for the first time and earn 150 bonus points!'
                : 'Work with a first-time Chicago designer and earn 150 bonus points!'}
            </p>
            <button className="btn" style={{ backgroundColor: '#2e7d32' }}>
              {userType === 'designer'
                ? 'Find Chicago Producers'
                : 'Connect with Chicago Designers'}
            </button>
          </div>
        </div>
      )}
      
      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p>
              Use your earned points to redeem exclusive rewards and benefits. Chicago-specific rewards help you connect with the local print community.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {rewardsData.availableRewards.map(reward => (
              <div 
                key={reward.id}
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #eee',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div style={{ height: '8px', backgroundColor: getLevelColor(rewardsData.level) }}></div>
                
                <div style={{ padding: '1.5rem' }}>
                  {reward.chicagoSpecific && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: '#34A853',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '3px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      CHICAGO
                    </div>
                  )}
                  
                  <h4 style={{ marginBottom: '0.75rem' }}>{reward.name}</h4>
                  <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', minHeight: '3rem' }}>
                    {reward.description}
                  </p>
                  
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
                      fontSize: '1.2rem',
                      color: 'var(--primary)', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}>
                      {reward.pointCost}
                      <i className="fas fa-star" style={{ marginLeft: '0.25rem', color: '#FBBC05', fontSize: '1rem' }}></i>
                    </div>
                    
                    <button 
                      className={`btn ${rewardsData.points >= reward.pointCost ? '' : 'btn-outline'}`}
                      disabled={rewardsData.points < reward.pointCost}
                    >
                      {rewardsData.points >= reward.pointCost ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Levels Tab */}
      {activeTab === 'levels' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p>
              The Pressly Rewards program features multiple membership levels with increasing benefits. Your current level is <strong>{rewardsData.level}</strong>.
            </p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', position: 'relative', marginBottom: '2rem' }}>
              <div style={{ 
                position: 'absolute', 
                height: '4px', 
                backgroundColor: '#e9ecef', 
                top: '2rem', 
                left: '0', 
                right: '0',
                zIndex: 0
              }}></div>
              
              {rewardsData.levels.map((level, index) => {
                const isCurrentLevel = level.name === rewardsData.level;
                const isPastLevel = rewardsData.points >= level.minPoints;
                
                return (
                  <div 
                    key={level.name} 
                    style={{ 
                      flex: 1, 
                      position: 'relative', 
                      zIndex: 1, 
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ 
                      width: '4rem', 
                      height: '4rem', 
                      borderRadius: '50%', 
                      backgroundColor: isPastLevel ? getLevelColor(level.name) : '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      border: isCurrentLevel ? '2px solid var(--primary)' : 'none',
                      boxShadow: isCurrentLevel ? '0 0 0 4px rgba(58, 110, 165, 0.2)' : 'none'
                    }}>
                      {isPastLevel ? getLevelIcon(level.name, '1.5rem') : (
                        <div style={{ color: '#aaa', fontWeight: 'bold' }}>{index + 1}</div>
                      )}
                    </div>
                    <div style={{ fontWeight: isCurrentLevel ? 'bold' : 'normal' }}>
                      {level.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {level.minPoints} Points
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <h4 style={{ marginBottom: '1rem' }}>Level Benefits</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {rewardsData.levels.map(level => {
              const isCurrentLevel = level.name === rewardsData.level;
              const isPastLevel = rewardsData.points >= level.minPoints;
              const isFutureLevel = !isPastLevel;
              
              return (
                <div 
                  key={level.name}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: isCurrentLevel ? `2px solid ${getLevelColor(level.name)}` : '1px solid #eee',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ 
                    backgroundColor: getLevelColor(level.name), 
                    color: 'white', 
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h5 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                      {getLevelIcon(level.name, '1rem', 'white')}
                      <span style={{ marginLeft: '0.5rem' }}>{level.name} Level</span>
                    </h5>
                    {isCurrentLevel && (
                      <span style={{ 
                        fontSize: '0.8rem', 
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '3px'
                      }}>
                        CURRENT
                      </span>
                    )}
                  </div>
                  
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.75rem' }}>
                      {level.minPoints} points required
                    </div>
                    
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0,
                      opacity: isFutureLevel ? 0.6 : 1
                    }}>
                      {level.benefits.map((benefit, index) => (
                        <li 
                          key={index}
                          style={{
                            padding: '0.5rem 0',
                            borderBottom: index < level.benefits.length - 1 ? '1px solid #eee' : 'none',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <i className="fas fa-check-circle" style={{ marginRight: '0.75rem', color: getLevelColor(level.name) }}></i>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    
                    {isFutureLevel && (
                      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <span style={{ 
                          fontSize: '0.9rem', 
                          color: '#666',
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>
                          You need {level.minPoints - rewardsData.points} more points
                        </span>
                        <button className="btn btn-sm btn-outline">
                          See How to Earn Points
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p>
              There are many ways to earn Pressly Rewards points. Here are all the activities that can boost your points balance.
            </p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Points Earning Opportunities</h4>
            <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'minmax(200px, 1fr) auto auto', 
                padding: '0.75rem 1rem',
                fontWeight: 'bold',
                borderBottom: '1px solid #ddd'
              }}>
                <div>Activity</div>
                <div style={{ textAlign: 'center' }}>Points</div>
                <div style={{ textAlign: 'right' }}>Frequency</div>
              </div>
              
              {rewardsData.pointsOpportunities.map((opportunity, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(200px, 1fr) auto auto',
                    padding: '0.75rem 1rem',
                    borderBottom: index < rewardsData.pointsOpportunities.length - 1 ? '1px solid #eee' : 'none',
                    backgroundColor: opportunity.chicagoSpecific ? 'rgba(52, 168, 83, 0.05)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {opportunity.chicagoSpecific && (
                      <span style={{
                        backgroundColor: '#34A853',
                        color: 'white',
                        padding: '0.1rem 0.3rem',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        marginRight: '0.5rem'
                      }}>
                        CHI
                      </span>
                    )}
                    {opportunity.action}
                  </div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    +{opportunity.points}
                    <i className="fas fa-star" style={{ marginLeft: '0.25rem', color: '#FBBC05', fontSize: '0.85rem' }}></i>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>
                    {opportunity.frequency}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#e8f5e9', 
            borderRadius: '8px',
            border: '1px solid #c8e6c9'
          }}>
            <h4 style={{ marginBottom: '0.75rem', color: '#2e7d32', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i>
              Chicago Community Bonuses
            </h4>
            <p style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>
              As part of our commitment to the Chicago print community, we offer special point bonuses for local activities:
            </p>
            <ul style={{ color: '#2e7d32', paddingLeft: '1.5rem' }}>
              <li>Attend Chicago print industry meetups (+50 points)</li>
              <li>Participate in Chicago Print Week events (+100 points)</li>
              <li>Join neighborhood print shop tours (+75 points per tour)</li>
              <li>Share Chicago print industry knowledge (+30 points)</li>
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <button className="btn" style={{ backgroundColor: '#2e7d32' }}>
                View Chicago Events
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for level colors and icons
function getLevelColor(level) {
  switch (level) {
    case 'Bronze':
      return '#CD7F32';
    case 'Silver':
      return '#A7A7AD';
    case 'Gold':
      return '#FFD700';
    case 'Platinum':
      return '#E5E4E2';
    default:
      return '#A7A7AD';
  }
}

function getLevelIcon(level, size = '1rem', color = null) {
  let icon;
  
  switch (level) {
    case 'Bronze':
      icon = 'award';
      break;
    case 'Silver':
      icon = 'medal';
      break;
    case 'Gold':
      icon = 'trophy';
      break;
    case 'Platinum':
      icon = 'crown';
      break;
    default:
      icon = 'award';
  }
  
  return (
    <i 
      className={`fas fa-${icon}`} 
      style={{ 
        marginRight: '0.25rem', 
        fontSize: size,
        color: color || undefined
      }}
    ></i>
  );
}

export default PresslyRewards;
