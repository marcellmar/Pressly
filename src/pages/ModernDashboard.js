/**
 * Modern Dashboard
 * Clean, organized dashboard in Notion style
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { getCurrentUser } from '../services/auth/auth';

const ModernDashboard = () => {
  const { isAuthenticated } = useAuth();
  const user = getCurrentUser();
  const isProducer = user?.role === 'producer';

  // Sample data
  const recentActivity = [
    { id: 1, type: 'order', title: 'Business Cards - Order #2847', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'message', title: 'New message from Print Pro LLC', time: '5 hours ago', status: 'new' },
    { id: 3, type: 'order', title: 'Poster Design - Order #2846', time: '1 day ago', status: 'completed' }
  ];

  const quickActions = isProducer ? [
    { icon: '📋', title: 'Job Queue', description: 'Check incoming job requests', link: '/job-queue' },
    { icon: '⚙️', title: 'Equipment', description: 'Manage your printing equipment', link: '/equipment' },
    { icon: '📅', title: 'Schedule', description: 'Manage production schedule', link: '/schedule' },
    { icon: '📊', title: 'Capacity', description: 'Monitor production capacity', link: '/capacity' },
    { icon: '📈', title: 'Analytics', description: 'View performance metrics', link: '/analytics' },
    { icon: '💬', title: 'Messages', description: '3 unread messages', link: '/messages' }
  ] : [
    { icon: '➕', title: 'New Project', description: 'Start a new print project', link: '/create' },
    { icon: '🚀', title: 'SmartMatch Studio', description: 'Analyze, optimize & match', link: '/smart-match' },
    { icon: '🎨', title: 'My Designs', description: 'Manage your design files', link: '/designs' },
    { icon: '📦', title: 'My Orders', description: 'Track your print orders', link: '/orders' },
    { icon: '💬', title: 'Messages', description: '2 unread messages', link: '/messages' },
    { icon: '🔍', title: 'Browse Printers', description: 'Explore print shops', link: '/producers' }
  ];

  // For non-authenticated users, show a public dashboard
  if (!isAuthenticated) {
    return (
      <div className="modern-dashboard" style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 48px)' }}>
        <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
          {/* Welcome Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h1 style={{ marginBottom: '16px' }}>Welcome to Pressly</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              Your printing marketplace dashboard
            </p>
          </div>

          {/* Platform Stats */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '64px'
          }}>
            <div className="card">
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px' }}>500+</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Active Printers</p>
              </div>
            </div>
            <div className="card">
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px' }}>24hr</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Average Response</p>
              </div>
            </div>
            <div className="card">
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px' }}>4.9</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Average Rating</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Get Started</h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <Link to="/create" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>➕</div>
                <h3>Start a Project</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Upload your design and get matched with printers
                </p>
              </Link>
              <Link to="/producers" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3>Browse Printers</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Explore our network of professional printers
                </p>
              </Link>
              <Link to="/register" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
                <h3>Create Account</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Join to unlock all features and track projects
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user dashboard
  return (
    <div className="modern-dashboard" style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 48px)' }}>
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ marginBottom: '8px' }}>
            Welcome back, {user?.fullName || 'User'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {isProducer ? 'Active Jobs' : 'Active Orders'}
                </p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>12</h2>
                <p style={{ color: 'var(--accent-green)', fontSize: '13px', marginTop: '8px' }}>
                  ↑ 20% from last month
                </p>
              </div>
              <div style={{ 
                width: '48px',
                height: '48px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📦
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {isProducer ? 'Revenue' : 'Total Spent'}
                </p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>$4,832</h2>
                <p style={{ color: 'var(--accent-green)', fontSize: '13px', marginTop: '8px' }}>
                  ↑ 12% from last month
                </p>
              </div>
              <div style={{ 
                width: '48px',
                height: '48px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                💰
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {isProducer ? 'Avg Response Time' : 'Projects Completed'}
                </p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{isProducer ? '2.4h' : '47'}</h2>
                <p style={{ color: 'var(--accent-green)', fontSize: '13px', marginTop: '8px' }}>
                  {isProducer ? '↓ 0.5h from last month' : '↑ 8 from last month'}
                </p>
              </div>
              <div style={{ 
                width: '48px',
                height: '48px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {isProducer ? '⏱️' : '✅'}
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {isProducer ? 'Customer Rating' : 'Saved on Printing'}
                </p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{isProducer ? '4.9' : '$892'}</h2>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '8px' }}>
                  {isProducer ? 'Based on 127 reviews' : 'Through smart matching'}
                </p>
              </div>
              <div style={{ 
                width: '48px',
                height: '48px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {isProducer ? '⭐' : '💡'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '24px'
        }}>
          {/* Quick Actions */}
          <div>
            <h2 style={{ marginBottom: '24px' }}>Quick Actions</h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {quickActions.map((action, index) => (
                <Link 
                  key={index} 
                  to={action.link}
                  className="card"
                  style={{ 
                    display: 'flex',
                    gap: '16px',
                    textDecoration: 'none',
                    border: 'none'
                  }}
                >
                  <div style={{ 
                    fontSize: '32px',
                    flexShrink: 0
                  }}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>{action.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 style={{ marginBottom: '24px' }}>Recent Activity</h2>
            <div className="card" style={{ padding: 0 }}>
              {recentActivity.map((activity, index) => (
                <div 
                  key={activity.id}
                  style={{ 
                    padding: '16px 24px',
                    borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border-light)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{ 
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: activity.status === 'new' ? 'var(--accent-red)' : 
                               activity.status === 'pending' ? 'var(--accent-orange)' : 
                               'var(--accent-green)',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, marginBottom: '4px' }}>{activity.title}</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>{activity.time}</p>
                  </div>
                </div>
              ))}
              <Link 
                to="/orders" 
                style={{ 
                  display: 'block',
                  padding: '16px 24px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none'
                }}
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ marginBottom: '24px' }}>Requires Your Attention</h2>
          <div className="card" style={{ 
            background: '#fff4e6',
            borderColor: 'var(--accent-orange)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ marginBottom: '8px' }}>Quote Request - Business Cards</h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  You have 48 hours to respond to this quote request from John Doe.
                </p>
              </div>
              <Link to="/orders/2847" className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Producer Specific Features */}
        {isProducer && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ marginBottom: '24px' }}>Production Management</h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {/* Equipment Status */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Equipment Status</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>HP Indigo 7900</span>
                    <span style={{ color: 'var(--accent-green)' }}>● Operational</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Mimaki CJV150-160</span>
                    <span style={{ color: 'var(--accent-orange)' }}>● Maintenance</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Roland VersaCAMM</span>
                    <span style={{ color: 'var(--accent-green)' }}>● Operational</span>
                  </div>
                </div>
                <Link to="/equipment" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                  Manage Equipment →
                </Link>
              </div>

              {/* Capacity Overview */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Today's Capacity</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Digital Printing</span>
                      <span>75%</span>
                    </div>
                    <div style={{ 
                      height: '8px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: '75%',
                        height: '100%',
                        background: 'var(--accent-blue)'
                      }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Large Format</span>
                      <span>40%</span>
                    </div>
                    <div style={{ 
                      height: '8px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: '40%',
                        height: '100%',
                        background: 'var(--accent-green)'
                      }} />
                    </div>
                  </div>
                </div>
                <Link to="/capacity" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                  View Full Capacity →
                </Link>
              </div>

              {/* Schedule Overview */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Upcoming Jobs</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 500 }}>9:00 AM - Business Cards</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>500 units • 2 hours</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 500 }}>11:00 AM - Posters</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>50 units • 1.5 hours</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>2:00 PM - Brochures</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>1000 units • 3 hours</div>
                  </div>
                </div>
                <Link to="/schedule" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                  Manage Schedule →
                </Link>
              </div>
            </div>

            {/* Portfolio Management for Producers */}
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ marginBottom: '16px' }}>Portfolio & Gallery</h3>
              <div className="card" style={{ 
                background: 'var(--bg-tertiary)',
                border: 'none'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500 }}>Portfolio Items</span>
                    <span>24 items</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500 }}>Gallery Views</span>
                    <span>1,247 this month</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>Inquiries</span>
                    <span>8 new leads</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link to="/my-portfolio" className="btn btn-primary btn-sm">
                    Manage Portfolio
                  </Link>
                  <Link to="/gallery" className="btn btn-secondary btn-sm">
                    View Gallery
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats for Producers */}
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ marginBottom: '16px' }}>Business Insights</h3>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div className="card" style={{ 
                  background: 'var(--bg-tertiary)',
                  border: 'none',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                  <div style={{ fontWeight: 600 }}>Profile Views</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>342</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>This week</div>
                </div>
                <div className="card" style={{ 
                  background: 'var(--bg-tertiary)',
                  border: 'none',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                  <div style={{ fontWeight: 600 }}>Quote Conversion</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>68%</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Success rate</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Designer Specific Features */}
        {!isProducer && isAuthenticated && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ marginBottom: '24px' }}>Design Tools & Resources</h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {/* Recent Designs */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Recent Designs</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 500 }}>Business Card Design v3.pdf</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Modified 2 hours ago</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 500 }}>Event Poster Final.ai</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Modified yesterday</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>Brochure Layout.psd</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Modified 3 days ago</div>
                  </div>
                </div>
                <Link to="/designs" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                  View All Designs →
                </Link>
              </div>

              {/* Smart Match Preview */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Recommended Printers</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 500 }}>Print Pro LLC</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      ⭐ 4.9 • 0.8 miles • Business cards specialist
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 500 }}>Quick Print Chicago</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      ⭐ 4.8 • 1.2 miles • Same-day service
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>Eco Print Solutions</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      ⭐ 4.7 • 2.5 miles • Sustainable materials
                    </div>
                  </div>
                </div>
                <Link to="/smart-match" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                  Find Your Match →
                </Link>
              </div>

              {/* Design Tips */}
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Design Tips</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    padding: '12px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>💡 Pro Tip</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Always convert text to outlines before sending to print to ensure font consistency.
                    </div>
                  </div>
                  <div style={{ 
                    padding: '12px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>🎨 Color Mode</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Use CMYK color mode for print projects, not RGB.
                    </div>
                  </div>
                </div>
                <Link to="/smart-match?mode=ai" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                  Optimize Your Designs →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernDashboard;