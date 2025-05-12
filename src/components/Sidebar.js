import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { 
  Home,
  Printer,
  ShoppingBag,
  MessageSquare,
  User,
  Settings,
  FileText,
  Target,
  BarChart,
  Map,
  ChevronDown,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import '../styles/pressly-theme.css';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const userType = currentUser?.role || 'designer'; // Default to designer if not specified

  // Helper function to check if a path is active
  const isActive = (routes) => {
    if (Array.isArray(routes)) {
      return routes.some(route => path === route || path.startsWith(route));
    }
    return path === routes || path.startsWith(routes);
  };

  return (
    <div className="pressly-sidebar">
      {/* Sidebar Header/Logo */}
      <div className="sidebar-logo">
        <Printer className="sidebar-logo-icon h-8 w-8" />
        <h1 className="sidebar-logo-text">Pressly</h1>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-section">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/dashboard" 
              className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/producers" 
              className={`nav-item ${isActive('/producers') ? 'active' : ''}`}
            >
              <Printer className="h-5 w-5" />
              <span>Find Producers</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/orders" 
              className={`nav-item ${isActive('/orders') ? 'active' : ''}`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/messages" 
              className={`nav-item ${isActive('/messages') ? 'active' : ''}`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Designer Tools Section */}
      {userType === 'designer' && (
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Designer Tools</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/designs" 
                className={`nav-item ${isActive('/designs') ? 'active' : ''}`}
              >
                <FileText className="h-5 w-5" />
                <span>My Designs</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/smart-match" 
                className={`nav-item ${isActive('/smart-match') ? 'active' : ''}`}
              >
                <Target className="h-5 w-5" />
                <span>SmartMatch</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/analytics" 
                className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}
              >
                <BarChart className="h-5 w-5" />
                <span>Analytics</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/mapping-demo" 
                className={`nav-item ${isActive('/mapping-demo') ? 'active' : ''}`}
              >
                <Map className="h-5 w-5" />
                <span>Mapping</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Producer Tools Section */}
      {userType === 'producer' && (
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Producer Tools</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/capacity" 
                className={`nav-item ${isActive('/capacity') ? 'active' : ''}`}
              >
                <BarChart className="h-5 w-5" />
                <span>Capacity Management</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/equipment" 
                className={`nav-item ${isActive('/equipment') ? 'active' : ''}`}
              >
                <Printer className="h-5 w-5" />
                <span>Equipment</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/producer-analytics" 
                className={`nav-item ${isActive('/producer-analytics') ? 'active' : ''}`}
              >
                <BarChart className="h-5 w-5" />
                <span>Analytics</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/mapping-demo" 
                className={`nav-item ${isActive('/mapping-demo') ? 'active' : ''}`}
              >
                <Map className="h-5 w-5" />
                <span>Mapping</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Sidebar Footer/Logout */}
      <div className="sidebar-footer">
        <button 
          onClick={logout}
          className="btn btn-outline w-full text-gray-600 hover:text-red-500 hover:border-red-500 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;