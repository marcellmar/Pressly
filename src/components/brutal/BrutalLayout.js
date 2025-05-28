/**
 * BRUTAL LAYOUT
 * No comfort. No compromise.
 * Binary decisions only.
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';

const BrutalLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // BINARY: IN OR OUT
  const primaryActions = isAuthenticated ? [
    { path: '/dashboard', label: 'WORK' },
    { path: '/create', label: 'CREATE' },
    { path: '/decide', label: 'DECIDE' }
  ] : [
    { path: '/login', label: 'IN' },
    { path: '/register', label: 'START' }
  ];

  return (
    <div className="brutal-layout">
      {/* HEADER: IDENTITY + ACTION */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            PRESSLY
          </Link>

          <div className="nav-links">
            {primaryActions.map(action => (
              <Link
                key={action.path}
                to={action.path}
                className={`nav-link ${location.pathname === action.path ? 'active' : ''}`}
              >
                {action.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button onClick={handleLogout} className="nav-link">
                OUT
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT: ONE THING AT A TIME */}
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>

      {/* FOOTER: TRUTH */}
      <footer className="footer">
        <div className="footer-content">
          <p>DECIDE. ACT. MOVE.</p>
          <p>&copy; 2025 PRESSLY. NO EXCUSES.</p>
        </div>
      </footer>
    </div>
  );
};

export default BrutalLayout;