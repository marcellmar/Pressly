import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { useTheme } from '../services/theme/ThemeContext';
import { Menu, X, User, LogOut, Search, Moon, Sun, Map } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="pressly-header">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              Pressly
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="Search designs, producers, services..."
                  className="input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="icon">
                  <Search className="h-5 w-5" />
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ color: 'var(--primary)' }}
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link to="/" className="nav-item">
              Home
            </Link>
            <Link to="/producers" className="nav-item">
              Producers
            </Link>
            <Link to="/smart-match" className="nav-item">
              Smart Match
            </Link>
            <Link to="/mapping-demo" className="nav-item">
              <Map className="icon" />
              Mapping
            </Link>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="nav-item"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="icon" />
              ) : (
                <Sun className="icon" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to={currentUser?.role === 'designer' ? '/designer-dashboard' : '/producer-dashboard'}
                  className="btn btn-outline btn-sm"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button className="btn btn-sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="nav-item mr-2"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="icon" />
              ) : (
                <Sun className="icon" />
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-sm"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="container mx-auto px-4 py-3 space-y-2">
            {/* Search Bar (Mobile) */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="Search designs, producers, services..."
                  className="input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="icon">
                  <Search className="h-5 w-5" />
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ color: 'var(--primary)' }}
                >
                  Search
                </button>
              </div>
            </form>
            
            <Link 
              to="/" 
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/producers" 
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Producers
            </Link>
            <Link 
              to="/pricing" 
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/smart-match" 
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              SmartMatch
            </Link>
            <Link 
              to="/mapping-demo" 
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Map className="icon" />
              Mapping Demo
            </Link>
            <Link 
              to="/contact" 
              className="nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to={currentUser?.role === 'designer' ? '/designer-dashboard' : '/producer-dashboard'}
                  className="nav-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="icon" />
                  Dashboard
                </Link>
                <button 
                  className="nav-item w-full text-left"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="icon" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-4">
                <Link 
                  to="/login" 
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;