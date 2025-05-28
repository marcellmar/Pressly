/**
 * Unified Layout Component
 * Modern, minimal layout that serves both consumers and professionals
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { getCurrentUser } from '../../services/auth/auth';
import './UnifiedLayout.css';

const UnifiedLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const user = getCurrentUser();
  const isProducer = user?.role === 'producer';
  const isDesigner = user?.role === 'designer';
  const isConsumer = user?.role === 'consumer';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigationItems = [
    // Always visible
    { path: '/', label: 'Home', show: true },
    { path: '/producers', label: 'Find Printers', show: true },
    { path: '/gallery', label: 'Gallery', show: true },
    
    // Consumer items
    { path: '/create', label: 'Create', show: !isProducer || isConsumer },
    
    // Designer items
    { path: '/designs', label: 'Designs', show: isAuthenticated },
    { path: '/smart-match', label: 'Smart Match', show: isAuthenticated },
    
    // Producer items
    { path: '/job-queue', label: 'Jobs', show: isProducer },
    { path: '/capacity', label: 'Capacity', show: isProducer },
    { path: '/find-creators', label: 'Find Creators', show: isProducer },
    
    // Authenticated items
    { path: '/orders', label: 'Orders', show: isAuthenticated },
    { path: '/dashboard', label: 'Dashboard', show: isAuthenticated },
    { path: '/messages', label: 'Messages', show: isAuthenticated },
  ].filter(item => item.show);

  return (
    <div className="unified-layout">
      {/* Navigation Header */}
      <nav className="unified-nav">
        <div className="nav-container">
          <div className="nav-left">
            {/* Logo */}
            <Link to="/" className="nav-logo">
              <span className="logo-text">Pressly</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-links desktop-only">
              {navigationItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="nav-right">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="user-menu">
                  <button
                    className="user-menu-trigger"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <span className="user-avatar">
                      {user.fullName?.charAt(0) || 'U'}
                    </span>
                    <span className="user-name desktop-only">{user.fullName}</span>
                    <svg className="chevron-icon" width="12" height="12" viewBox="0 0 12 12">
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown">
                      <Link to="/profile" className="dropdown-item">
                        Profile
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        Settings
                      </Link>
                      <Link to="/messages" className="dropdown-item">
                        Messages
                      </Link>
                      {isAuthenticated && (
                        <Link to="/my-portfolio" className="dropdown-item">
                          My Portfolio
                        </Link>
                      )}
                      <div className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item">
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle mobile-only"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mobile-menu">
            {navigationItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="unified-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="unified-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-title">Product</h3>
              <ul className="footer-links">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/smart-match">Smart Match</Link></li>
                <li><Link to="/producers">Find Printers</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/marketplace">Marketplace</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Resources</h3>
              <ul className="footer-links">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/network">Network Map</Link></li>
                <li><Link to="/job-queue">Job Board</Link></li>
                <li><Link to="/design-optimization">AI Tools</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Legal</h3>
              <ul className="footer-links">
                <li><Link to="/privacy">Privacy</Link></li>
                <li><Link to="/terms">Terms</Link></li>
                <li><Link to="/security">Security</Link></li>
                <li><Link to="/cookies">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Pressly. All rights reserved.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedLayout;