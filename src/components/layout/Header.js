import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { 
  UploadCloud, 
  Menu, 
  X, 
  LogOut, 
  User,
  Bell,
  Search,
  Printer,
  ExternalLink,
  CircleUser,
  Palette,
  Layout
} from 'lucide-react';
import { Button } from '../ui/button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUploadClick = () => {
    navigate('/designs');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get role-specific navigation items
  const getRoleSpecificNavItems = () => {
    if (!isAuthenticated || !currentUser) return null;
    
    if (currentUser.role === 'designer') {
      return (
        <>
          <Link to="/designs" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/designs') ? 'font-medium text-blue-600' : ''}`}>
            <Palette className="h-4 w-4 mr-1 inline" />
            Designs
          </Link>
          <Link to="/my-portfolio" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/my-portfolio') ? 'font-medium text-blue-600' : ''}`}>
            <Layout className="h-4 w-4 mr-1 inline" />
            My Portfolio
          </Link>
          <Link to="/smart-match" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/smart-match') ? 'font-medium text-blue-600' : ''}`}>
            SmartMatch
          </Link>
        </>
      );
    } else if (currentUser.role === 'producer') {
      return (
        <>
          <Link to="/capacity" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/capacity') ? 'font-medium text-blue-600' : ''}`}>
            Capacity
          </Link>
          <Link to="/schedule" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/schedule') ? 'font-medium text-blue-600' : ''}`}>
            Schedule
          </Link>
        </>
      );
    }
    
    return null;
  };

  // Get role-specific mobile navigation items
  const getRoleSpecificMobileNavItems = () => {
    if (!isAuthenticated || !currentUser) return null;
    
    if (currentUser.role === 'designer') {
      return (
        <>
          <Link to="/designs" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/designs') ? 'font-medium text-blue-600' : ''}`}
            onClick={() => setMobileMenuOpen(false)}>
            <Palette className="h-4 w-4 mr-1 inline" />
            Designs
          </Link>
          <Link to="/my-portfolio" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/my-portfolio') ? 'font-medium text-blue-600' : ''}`}
            onClick={() => setMobileMenuOpen(false)}>
            <Layout className="h-4 w-4 mr-1 inline" />
            My Portfolio
          </Link>
          <Link to="/smart-match" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/smart-match') ? 'font-medium text-blue-600' : ''}`}
            onClick={() => setMobileMenuOpen(false)}>
            SmartMatch
          </Link>
        </>
      );
    } else if (currentUser.role === 'producer') {
      return (
        <>
          <Link to="/capacity" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/capacity') ? 'font-medium text-blue-600' : ''}`}
            onClick={() => setMobileMenuOpen(false)}>
            Capacity
          </Link>
          <Link to="/schedule" 
            className={`text-gray-700 hover:text-blue-600 ${isActive('/schedule') ? 'font-medium text-blue-600' : ''}`}
            onClick={() => setMobileMenuOpen(false)}>
            Schedule
          </Link>
        </>
      );
    }
    
    return null;
  };

  // Upload button based on role
  const getUploadButton = () => {
    if (!isAuthenticated || !currentUser) return null;
    
    if (currentUser.role === 'designer') {
      return (
        <Button variant="outline" size="sm" onClick={handleUploadClick}>
          <UploadCloud className="h-4 w-4 mr-1" />
          Upload Design
        </Button>
      );
    }
    
    return null;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
            <div className="bg-white p-2 rounded-lg mr-2 border border-blue-100">
              <Printer className="w-8 h-8 text-blue-600" />
            </div>
            <span>Pressly</span>
          </Link>
        
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-6">
                  <Link to="/dashboard" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/dashboard') ? 'font-medium text-blue-600' : ''}`}>
                    Dashboard
                  </Link>
                  
                  {/* Role-specific navigation */}
                  {getRoleSpecificNavItems()}
                  
                  <Link to="/producers" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/producers') ? 'font-medium text-blue-600' : ''}`}>
                    Producers
                  </Link>
                  <Link to="/orders" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/orders') ? 'font-medium text-blue-600' : ''}`}>
                    Orders
                  </Link>
                  <Link to="/messages" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/messages') ? 'font-medium text-blue-600' : ''}`}>
                    Messages
                  </Link>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Role-specific buttons */}
                  {getUploadButton()}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleNotifications} 
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                  
                  <div className="relative">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span className="hidden lg:inline-block">
                        {currentUser?.fullName || 'My Profile'}
                      </span>
                    </Button>
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700">
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden lg:inline-block">Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/about" 
                  className={`text-gray-700 hover:text-blue-600 ${isActive('/about') ? 'font-medium text-blue-600' : ''}`}>
                  About
                </Link>
                <Link to="/pricing" 
                  className={`text-gray-700 hover:text-blue-600 ${isActive('/pricing') ? 'font-medium text-blue-600' : ''}`}>
                  Pricing
                </Link>
                <Link to="/features" 
                  className={`text-gray-700 hover:text-blue-600 ${isActive('/features') ? 'font-medium text-blue-600' : ''}`}>
                  Features
                </Link>
                <Link to="/mapping-demo" 
                  className={`text-gray-700 hover:text-blue-600 ${isActive('/mapping-demo') ? 'font-medium text-blue-600' : ''}`}>
                  Mapping Demo
                </Link>
                <Link to="/contact" 
                  className={`text-gray-700 hover:text-blue-600 ${isActive('/contact') ? 'font-medium text-blue-600' : ''}`}>
                  Contact
                </Link>
                
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              </>
            )}
          </nav>
        
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/dashboard') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  
                  {/* Role-specific navigation */}
                  {getRoleSpecificMobileNavItems()}
                  
                  <Link to="/producers" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/producers') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Producers
                  </Link>
                  <Link to="/orders" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/orders') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Orders
                  </Link>
                  <Link to="/messages" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/messages') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Messages
                  </Link>
                  <Link to="/profile" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/profile') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    My Profile
                  </Link>
                  <button 
                    className="text-left text-gray-700 hover:text-blue-600" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}>
                    Sign Out
                  </button>
                  
                  {currentUser?.role === 'designer' && (
                    <div className="pt-2">
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          handleUploadClick();
                          setMobileMenuOpen(false);
                        }}>
                        <UploadCloud className="h-4 w-4 mr-2" />
                        Upload Design
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link to="/about" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/about') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    About
                  </Link>
                  <Link to="/pricing" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/pricing') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </Link>
                  <Link to="/features" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/features') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Features
                  </Link>
                  <Link to="/mapping-demo" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/mapping-demo') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Mapping Demo
                  </Link>
                  <Link to="/contact" 
                    className={`text-gray-700 hover:text-blue-600 ${isActive('/contact') ? 'font-medium text-blue-600' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </Link>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;