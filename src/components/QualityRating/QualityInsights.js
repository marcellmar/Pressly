import React, { useState } from 'react';

/**
 * QualityInsights Component
 * 
 * Visualizes print quality data collected across the platform to:
 * 1. Show quality trends for specific producers
 * 2. Compare quality metrics across different print methods and materials
 * 3. Identify producers with exceptional quality in specific areas
 * 4. Track quality improvements over time
 */
const QualityInsights = ({ producerId, designerId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6m');
  
  // Sample quality data for demonstration
  // In a real implementation, this would come from an API
  const qualityData = {
    overview: {
      overallScore: 4.3,
      totalRatings: 47,
      qualityRank: 'A',
      detailedScores: {
        colorAccuracy: 4.5,
        registrationPrecision: 4.2,
        materialQuality: 4.7,
        finishingQuality: 4.1,
        printResolution: 4.6,
        edgePrecision: 3.7
      },
      strengthAreas: ['Color Accuracy', 'Material Quality', 'Print Resolution'],
      improvementAreas: ['Edge Precision', 'Finishing Quality']
    },
    trends: {
      monthly: [
        { month: 'Nov', score: 3.9 },
        { month: 'Dec', score: 4.0 },
        { month: 'Jan', score: 4.2 },
        { month: 'Feb', score: 4.3 },
        { month: 'Mar', score: 4.4 },
        { month: 'Apr', score: 4.3 }
      ],
      byProductType: [
        { type: 'Business Cards', score: 4.6 },
        { type: 'Brochures', score: 4.2 },
        { type: 'Posters', score: 4.5 },
        { type: 'Flyers', score: 4.0 },
        { type: 'Packaging', score: 3.9 }
      ]
    },
    benchmark: {
      industryAverage: 3.8,
      topPerformerAverage: 4.6,
      marketPosition: 85, // percentile
      chicagoAverage: 3.9,
      neighborhoodComparison: 112 // percent of neighborhood average
    },
    recentReviews: [
      {
        id: 'r1',
        orderId: 'O12347',
        designName: 'Corporate Annual Report',
        overallScore: 4.8,
        date: '2023-04-01',
        comment: 'Exceptional color accuracy and material quality. The print resolution exceeded my expectations.',
        highlights: ['Color Accuracy', 'Material Quality']
      },
      {
        id: 'r2',
        orderId: 'O12338',
        designName: 'Event Poster Series',
        overallScore: 4.2,
        date: '2023-03-24',
        comment: 'Great quality overall, but there were some minor issues with the edge cutting on two of the posters.',
        highlights: ['Print Resolution'],
        issues: ['Edge Precision']
      },
      {
        id: 'r3',
        orderId: 'O12326',
        designName: 'Restaurant Menu',
        overallScore: 4.5,
        date: '2023-03-18',
        comment: 'Beautiful print quality and perfect registration. The lamination was applied evenly and looks professional.',
        highlights: ['Registration Precision', 'Finishing Quality']
      }
    ]
  };
  
  // Quality attribute icons and colors
  const attributeConfig = {
    colorAccuracy: { icon: 'palette', color: '#4285F4' },
    registrationPrecision: { icon: 'layer-group', color: '#EA4335' },
    materialQuality: { icon: 'scroll', color: '#FBBC05' },
    finishingQuality: { icon: 'paint-roller', color: '#34A853' },
    printResolution: { icon: 'search-plus', color: '#8F44AD' },
    edgePrecision: { icon: 'cut', color: '#F39C12' }
  };
  
  // Function to render quality rating stars
  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', color: '#FFC107' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <i 
            key={i}
            className={`fas fa-${rating >= i ? 'star' : rating >= i - 0.5 ? 'star-half-alt' : 'star'}`}
            style={{ marginRight: '2px' }}
          ></i>
        ))}
        <span style={{ marginLeft: '5px', color: '#555', fontSize: '0.9rem' }}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };
  
  return (
    <div className="card">
      <h3 className="card-title">Print Quality Insights</h3>
      
      {/* Tabs navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
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
            borderBottom: activeTab === 'trends' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'trends' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'trends' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('trends')}
        >
          Quality Trends
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'benchmark' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'benchmark' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'benchmark' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('benchmark')}
        >
          Benchmark
        </button>
        <button 
          style={{ 
            padding: '0.75rem 1rem', 
            background: 'none', 
            border: 'none',
            borderBottom: activeTab === 'reviews' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'reviews' ? 'var(--primary)' : '#666',
            fontWeight: activeTab === 'reviews' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('reviews')}
        >
          Recent Reviews
        </button>
      </div>
      
      {/* Time range selector */}
      <div style={{ display: 'flex', marginBottom: '1.5rem', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
          <button 
            style={{ 
              padding: '0.4rem 0.8rem', 
              background: timeRange === '3m' ? 'var(--primary)' : 'white', 
              color: timeRange === '3m' ? 'white' : '#666',
              border: 'none',
              cursor: 'pointer',
              borderRight: '1px solid #ddd'
            }}
            onClick={() => setTimeRange('3m')}
          >
            3M
          </button>
          <button 
            style={{ 
              padding: '0.4rem 0.8rem', 
              background: timeRange === '6m' ? 'var(--primary)' : 'white', 
              color: timeRange === '6m' ? 'white' : '#666',
              border: 'none',
              cursor: 'pointer',
              borderRight: '1px solid #ddd'
            }}
            onClick={() => setTimeRange('6m')}
          >
            6M
          </button>
          <button 
            style={{ 
              padding: '0.4rem 0.8rem', 
              background: timeRange === '1y' ? 'var(--primary)' : 'white', 
              color: timeRange === '1y' ? 'white' : '#666',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => setTimeRange('1y')}
          >
            1Y
          </button>
        </div>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'flex', marginBottom: '2rem' }}>
            {/* Summary card */}
            <div style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              marginRight: '1rem'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>OVERALL QUALITY SCORE</div>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                color: 'var(--primary)',
                marginBottom: '0.5rem'
              }}>
                {qualityData.overview.overallScore.toFixed(1)}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                {renderStars(qualityData.overview.overallScore)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Based on {qualityData.overview.totalRatings} quality ratings
              </div>
            </div>
            
            {/* Quality rank card */}
            <div style={{ 
              width: '150px', 
              textAlign: 'center', 
              padding: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px' 
            }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>QUALITY RANK</div>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                color: '#34A853',
                marginBottom: '0.5rem'
              }}>
                {qualityData.overview.qualityRank}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Top 15% in Chicago
              </div>
            </div>
          </div>
          
          {/* Detailed scores */}
          <h4 style={{ marginBottom: '1rem' }}>Quality Attributes</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {Object.entries(qualityData.overview.detailedScores).map(([key, score]) => (
              <div key={key} style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                backgroundColor: '#f8f9fa',
                border: '1px solid #eee'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: attributeConfig[key].color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.75rem',
                    color: 'white'
                  }}>
                    <i className={`fas fa-${attributeConfig[key].icon}`}></i>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '4px', 
                    overflow: 'hidden',
                    flex: 1,
                    marginRight: '0.75rem'
                  }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${(score / 5) * 100}%`, 
                        backgroundColor: attributeConfig[key].color
                      }}
                    ></div>
                  </div>
                  <div style={{ fontWeight: 'bold', width: '30px' }}>
                    {score.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Strengths and improvement areas */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-medal" style={{ marginRight: '0.5rem', color: '#FBBC05' }}></i>
                Strength Areas
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {qualityData.overview.strengthAreas.map((area, index) => (
                  <li 
                    key={index}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: index < qualityData.overview.strengthAreas.length - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <i className="fas fa-check-circle" style={{ marginRight: '0.75rem', color: '#34A853' }}></i>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-arrow-up" style={{ marginRight: '0.5rem', color: '#EA4335' }}></i>
                Areas for Improvement
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {qualityData.overview.improvementAreas.map((area, index) => (
                  <li 
                    key={index}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: index < qualityData.overview.improvementAreas.length - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <i className="fas fa-exclamation-circle" style={{ marginRight: '0.75rem', color: '#EA4335' }}></i>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Quality action buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn">
              <i className="fas fa-download" style={{ marginRight: '0.5rem' }}></i>
              Download Quality Report
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-share-alt" style={{ marginRight: '0.5rem' }}></i>
              Share Report
            </button>
          </div>
        </div>
      )}
      
      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Quality Score Trends</h4>
            <div style={{ height: '250px', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#666'
              }}>
                <i className="fas fa-chart-line" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', color: '#ddd' }}></i>
                <p>Quality trend visualization would appear here</p>
                <p style={{ fontSize: '0.9rem' }}>Shows how quality scores have changed over time</p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '1rem' }}>Monthly Average Scores</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Month</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Score</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityData.trends.monthly.map((item, index, arr) => {
                    const prevScore = index > 0 ? arr[index - 1].score : null;
                    const change = prevScore ? item.score - prevScore : 0;
                    return (
                      <tr key={item.month}>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{item.month}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                          {item.score.toFixed(1)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          {change !== 0 && (
                            <span style={{ 
                              color: change > 0 ? '#34A853' : '#EA4335',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end'
                            }}>
                              <i className={`fas fa-arrow-${change > 0 ? 'up' : 'down'}`} style={{ marginRight: '0.25rem' }}></i>
                              {Math.abs(change).toFixed(1)}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '1rem' }}>Scores by Product Type</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Product Type</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityData.trends.byProductType.map((item) => (
                    <tr key={item.type}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{item.type}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <div style={{ 
                            width: '100px',
                            height: '8px', 
                            backgroundColor: '#e9ecef', 
                            borderRadius: '4px', 
                            overflow: 'hidden',
                            marginRight: '0.75rem'
                          }}>
                            <div 
                              style={{ 
                                height: '100%', 
                                width: `${(item.score / 5) * 100}%`, 
                                backgroundColor: 'var(--primary)'
                              }}
                            ></div>
                          </div>
                          <div style={{ fontWeight: 'bold', width: '30px' }}>
                            {item.score.toFixed(1)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Benchmark Tab */}
      {activeTab === 'benchmark' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>MARKET POSITION</div>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: 'var(--primary)',
                marginBottom: '0.5rem'
              }}>
                {qualityData.benchmark.marketPosition}<span style={{ fontSize: '1.5rem' }}>%</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Percentile among all Chicago producers
              </div>
            </div>
            
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>COMPARED TO AREA AVERAGE</div>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#34A853',
                marginBottom: '0.5rem'
              }}>
                {qualityData.benchmark.neighborhoodComparison}<span style={{ fontSize: '1.5rem' }}>%</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Of local neighborhood average
              </div>
            </div>
          </div>
          
          <h4 style={{ marginBottom: '1rem' }}>Comparison to Market</h4>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '150px', fontSize: '0.9rem' }}>Your Score</div>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px', 
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(qualityData.overview.overallScore / 5) * 100}%`, 
                      backgroundColor: 'var(--primary)'
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: `${(qualityData.overview.overallScore / 5) * 100}%`,
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  {qualityData.overview.overallScore.toFixed(1)}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '150px', fontSize: '0.9rem' }}>Chicago Average</div>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px', 
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(qualityData.benchmark.chicagoAverage / 5) * 100}%`, 
                      backgroundColor: '#FBBC05'
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: `${(qualityData.benchmark.chicagoAverage / 5) * 100}%`,
                    transform: 'translateX(-50%)',
                    backgroundColor: '#FBBC05',
                    color: 'white',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  {qualityData.benchmark.chicagoAverage.toFixed(1)}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '150px', fontSize: '0.9rem' }}>Top Performers</div>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px', 
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(qualityData.benchmark.topPerformerAverage / 5) * 100}%`, 
                      backgroundColor: '#34A853'
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: `${(qualityData.benchmark.topPerformerAverage / 5) * 100}%`,
                    transform: 'translateX(-50%)',
                    backgroundColor: '#34A853',
                    color: 'white',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  {qualityData.benchmark.topPerformerAverage.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#e8f5e9', 
            borderRadius: '8px',
            border: '1px solid #c8e6c9',
            marginBottom: '1.5rem'
          }}>
            <h5 style={{ color: '#2e7d32', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-award" style={{ marginRight: '0.5rem' }}></i>
              Quality Achievement
            </h5>
            <p style={{ color: '#2e7d32' }}>
              This producer ranks in the <strong>top 15%</strong> of all Chicago print producers for overall quality. 
              They particularly excel in color accuracy and material quality, with scores in the top 10% for these specific attributes.
            </p>
          </div>
        </div>
      )}
      
      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Recent Quality Reviews</h4>
          <div style={{ marginBottom: '1.5rem' }}>
            {qualityData.recentReviews.map((review, index) => (
              <div 
                key={review.id} 
                style={{ 
                  marginBottom: index < qualityData.recentReviews.length - 1 ? '1.5rem' : 0,
                  padding: '1.5rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h5 style={{ marginBottom: '0.25rem' }}>{review.designName}</h5>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      Order #{review.orderId} • {review.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      {renderStars(review.overallScore)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      Overall Quality Score
                    </div>
                  </div>
                </div>
                
                <p style={{ marginBottom: '1rem' }}>{review.comment}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {review.highlights && review.highlights.map((highlight, i) => (
                    <span 
                      key={i}
                      style={{
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <i className="fas fa-check-circle" style={{ marginRight: '0.25rem' }}></i>
                      {highlight}
                    </span>
                  ))}
                  
                  {review.issues && review.issues.map((issue, i) => (
                    <span 
                      key={i}
                      style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <i className="fas fa-exclamation-circle" style={{ marginRight: '0.25rem' }}></i>
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityInsights;
