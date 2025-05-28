/**
 * Modern Layout Component
 * Clean, minimal design inspired by Notion
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';

const ModernLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, currentUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const user = currentUser;
  const isProducer = user?.role === 'producer';

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/smart-match', label: 'SmartMatch', icon: '🚀' },
    { path: '/producers', label: 'Find Printers', icon: '🖨️' },
    { path: '/gallery', label: 'Gallery', icon: '🎨' },
    { path: '/create', label: 'Create', icon: '➕', auth: true, roles: ['designer', 'consumer'] },
    { path: '/job-queue', label: 'Jobs', icon: '📋', auth: true, roles: ['producer'] },
    { path: '/equipment', label: 'Equipment', icon: '⚙️', auth: true, roles: ['producer'] },
  ];

  const userMenuItems = isProducer ? [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/job-queue', label: 'Job Queue', icon: '📋' },
    { path: '/equipment', label: 'Equipment', icon: '⚙️' },
    { path: '/schedule', label: 'Schedule', icon: '📅' },
    { path: '/capacity', label: 'Capacity', icon: '📊' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/my-portfolio', label: 'Portfolio', icon: '🖼️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/orders', label: 'Orders', icon: '📦' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ] : [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/smart-match', label: 'SmartMatch Studio', icon: '🚀' },
    { path: '/designs', label: 'My Designs', icon: '🎨' },
    { path: '/create', label: 'New Project', icon: '➕' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/orders', label: 'Orders', icon: '📦' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="modern-layout">
      {/* Navigation Header */}
      <nav className="nav">
        <div className="nav-container">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="nav-logo">
              <span style={{ fontSize: '20px' }}>🎯</span>
              <span>Pressly</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-menu">
              {navigationItems.map(item => {
                if (item.auth && !isAuthenticated) return null;
                if (item.roles && user && !item.roles.includes(user.role)) return null;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span style={{ marginRight: '6px' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="search-box" style={{ display: 'none' }}>
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>

            {isAuthenticated && user ? (
              <>
                {/* User Menu */}
                <div className="dropdown" style={{ position: 'relative' }}>
                  <button
                    className="avatar"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--text-primary)',
                      color: 'white',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </button>

                  {showUserMenu && (
                    <>
                      {/* Click outside overlay */}
                      <div 
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 998
                        }}
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="dropdown-menu" style={{ 
                        right: 0, 
                        left: 'auto',
                        top: '48px',
                        minWidth: '200px',
                        zIndex: 999,
                        position: 'absolute',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-xl)',
                        padding: 'var(--space-2)',
                        opacity: 1,
                        visibility: 'visible',
                        transform: 'translateY(0)'
                      }}>
                        <div style={{ 
                          fontWeight: 600,
                          paddingBottom: '8px',
                          padding: 'var(--space-2) var(--space-3)',
                          color: 'var(--text-primary)'
                        }}>
                          {user?.fullName || 'User'}
                          <div style={{ 
                            fontSize: '12px', 
                            color: 'var(--text-secondary)',
                            fontWeight: 400,
                            marginTop: '2px'
                          }}>
                            {user?.email}
                          </div>
                        </div>
                        <div className="divider" style={{ margin: '8px 0' }} />
                        {userMenuItems.map(item => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 16px',
                              color: 'var(--text-primary)',
                              textDecoration: 'none',
                              transition: 'background var(--transition-fast)',
                              borderRadius: 'var(--radius-sm)',
                              border: 'none'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <span>{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <div className="divider" style={{ margin: '8px 0' }} />
                        <button 
                          onClick={handleLogout} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 16px',
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background var(--transition-fast)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '14px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          <span>🚪</span>
                          Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="btn btn-ghost"
                  style={{
                    padding: '8px 16px',
                    color: 'var(--text-primary)',
                    border: 'none',
                    background: 'transparent',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  style={{
                    padding: '8px 20px',
                    background: 'var(--text-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 500,
                    transition: 'opacity var(--transition-fast)'
                  }}
                >
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{ 
                display: 'none',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              {showMobileMenu ? '✕' : '☰'}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mobile-menu" style={{
            position: 'fixed',
            top: '48px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-light)',
            zIndex: 997,
            overflowY: 'auto',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '24px' }}>
              {navigationItems.map(item => {
                if (item.auth && !isAuthenticated) return null;
                if (item.roles && user && !item.roles.includes(user.role)) return null;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="mobile-nav-link"
                    onClick={() => setShowMobileMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 0',
                      color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: location.pathname === item.path ? 600 : 400
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
            
            <div style={{ 
              paddingTop: '24px',
              borderTop: '1px solid var(--border-light)'
            }}>
              {isAuthenticated && user ? (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      padding: '12px 0',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}>
                      {user?.fullName || 'User'}
                      <div style={{ 
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        fontWeight: 400
                      }}>
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  {userMenuItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMobileMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 0',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        fontSize: '16px'
                      }}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 0',
                      color: 'var(--text-primary)',
                      background: 'none',
                      border: 'none',
                      fontSize: '16px',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>🚪</span>
                    Log out
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '16px'
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '16px'
                    }}
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '48px', minHeight: 'calc(100vh - 48px)' }}>
        {children}
      </main>

      {/* Simple Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-light)', 
        padding: '48px 0',
        marginTop: '96px',
        background: 'var(--bg-secondary)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            <div>
              <h6 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Product</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/features" style={{ color: 'var(--text-secondary)', border: 'none' }}>Features</Link>
                <Link to="/pricing" style={{ color: 'var(--text-secondary)', border: 'none' }}>Pricing</Link>
                <Link to="/smart-match" style={{ color: 'var(--text-secondary)', border: 'none' }}>Smart Match</Link>
              </div>
            </div>
            <div>
              <h6 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Company</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/about" style={{ color: 'var(--text-secondary)', border: 'none' }}>About</Link>
                <Link to="/contact" style={{ color: 'var(--text-secondary)', border: 'none' }}>Contact</Link>
                <Link to="/careers" style={{ color: 'var(--text-secondary)', border: 'none' }}>Careers</Link>
              </div>
            </div>
            <div>
              <h6 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Resources</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/help" style={{ color: 'var(--text-secondary)', border: 'none' }}>Help Center</Link>
                <Link to="/blog" style={{ color: 'var(--text-secondary)', border: 'none' }}>Blog</Link>
                <Link to="/developers" style={{ color: 'var(--text-secondary)', border: 'none' }}>Developers</Link>
              </div>
            </div>
            <div>
              <h6 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Legal</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/privacy" style={{ color: 'var(--text-secondary)', border: 'none' }}>Privacy</Link>
                <Link to="/terms" style={{ color: 'var(--text-secondary)', border: 'none' }}>Terms</Link>
                <Link to="/security" style={{ color: 'var(--text-secondary)', border: 'none' }}>Security</Link>
              </div>
            </div>
          </div>
          
          <div style={{ 
            paddingTop: '32px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--text-tertiary)',
            fontSize: '13px'
          }}>
            <p>© 2025 Pressly. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: 'var(--text-tertiary)', border: 'none' }}>Twitter</a>
              <a href="#" style={{ color: 'var(--text-tertiary)', border: 'none' }}>LinkedIn</a>
              <a href="#" style={{ color: 'var(--text-tertiary)', border: 'none' }}>GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLayout;