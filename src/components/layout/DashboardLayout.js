import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { 
  Home, 
  FileType, 
  Activity, 
  Archive, 
  Settings, 
  User, 
  Printer, 
  Search,
  Sliders,
  UploadCloud,
  MessageSquare,
  Target,
  Calendar,
  Layers,
  Clock,
  LogOut,
  PieChart,
  Map,
  Truck,
  Sparkles,
  BadgePercent,
  Globe,
  Zap,
  Image,
  ImagePlus
} from 'lucide-react';
import { Button } from '../ui/button';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { currentUser, isAuthenticated, logout } = useAuth();

  const isActive = (path) => {
    return pathname === path;
  };

  const isSubActive = (pattern) => {
    return pathname.includes(pattern);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render navigation based on user role
  const renderNavigation = () => {
    // Common navigation items for all users
    const commonNavItems = (
      <>
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          <Home size={20} />
          Dashboard
        </Link>
        <Link to="/producers" className={isActive('/producers') ? 'active' : ''}>
          <Printer size={20} />
          Find Producers
        </Link>
        <Link to="/orders" className={isSubActive('/orders') ? 'active' : ''}>
          <Archive size={20} />
          Orders
        </Link>
        <Link to="/messages" className={isActive('/messages') ? 'active' : ''}>
          <MessageSquare size={20} />
          Messages
        </Link>
        <Link to="/network" className={isActive('/network') ? 'active' : ''}>
        <Map size={20} />
        Network Map
        </Link>
          <Link to="/mapping-demo" className={isActive('/mapping-demo') ? 'active' : ''}>
            <Map size={20} />
            Mapping Demo
          </Link>
        <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
          <User size={20} />
          Profile
        </Link>
        <Link to="/settings" className={isActive('/settings') ? 'active' : ''}>
          <Settings size={20} />
          Settings
        </Link>

      </>
    );

    // If not authenticated or no user, return common items
    if (!isAuthenticated || !currentUser) {
      return commonNavItems;
    }

    // Designer-specific navigation
    if (currentUser.role === 'designer') {
      return (
        <>
          {commonNavItems}
          <div className="sidebar-separator"></div>
          <div className="sidebar-label">Designer Tools</div>
          <Link to="/designs" className={isActive('/designs') ? 'active' : ''}>
            <FileType size={20} />
            My Designs
          </Link>
          <Link to="/combined-match" className={isActive('/combined-match') ? 'active' : ''}>
            <Zap size={20} />
            <span className="flex items-center">
              SmartMatch
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-md">New</span>
            </span>
          </Link>
          <Link to="/smart-match" className={isActive('/smart-match') ? 'active' : ''}>
            <Target size={20} />
            Classic SmartMatch
          </Link>
          <Link to="/design-optimization" className={isActive('/design-optimization') ? 'active' : ''}>
            <Sparkles size={20} />
            AI Optimization
          </Link>
          <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>
            <Activity size={20} />
            Analytics
          </Link>
          <div className="sidebar-separator"></div>
          <div className="sidebar-label">Enhanced Marketplace</div>
          <Link to="/enhanced-producers" className={isActive('/enhanced-producers') ? 'active' : ''}>
            <BadgePercent size={20} />
            Enhanced Producers
          </Link>
          <Link to="/marketplace" className={isSubActive('/marketplace') ? 'active' : ''}>
            <Globe size={20} />
            Marketplace Hub
          </Link>
        </>
      );
    }

    // Producer-specific navigation
    if (currentUser.role === 'producer') {
      return (
        <>
          {commonNavItems}
          <div className="sidebar-separator"></div>
          <div className="sidebar-label">Producer Tools</div>
          <Link to="/job-queue" className={isActive('/job-queue') ? 'active' : ''}>
            <Search size={20} />
            Job Queue
          </Link>
          <Link to="/analytics" className={isActive('/analytics') || isSubActive('/analytics') ? 'active' : ''}>
            <PieChart size={20} />
            Analytics
          </Link>
          <Link to="/capacity" className={isActive('/capacity') ? 'active' : ''}>
            <Layers size={20} />
            Capacity
          </Link>
          <Link to="/schedule" className={isActive('/schedule') ? 'active' : ''}>
            <Calendar size={20} />
            Schedule
          </Link>
          <Link to="/equipment" className={isActive('/equipment') ? 'active' : ''}>
            <Printer size={20} />
            Equipment
          </Link>
          <Link to="/dashboard/gallery/manage" className={isSubActive('/dashboard/gallery') ? 'active' : ''}>
            <Image size={20} />
            Gallery Management
          </Link>
          <Link to="/dashboard/gallery/upload" className={isActive('/dashboard/gallery/upload') ? 'active' : ''}>
            <ImagePlus size={20} />
            Add Gallery Item
          </Link>
          <Link to="/find-creators" className={isActive('/find-creators') ? 'active' : ''}>
            <User size={20} />
            Find Creators
          </Link>
          <div className="sidebar-separator"></div>
          <div className="sidebar-label">Enhanced Marketplace</div>
          <Link to="/enhanced-producers" className={isActive('/enhanced-producers') ? 'active' : ''}>
            <BadgePercent size={20} />
            Enhanced Producers
          </Link>
          <Link to="/marketplace" className={isActive('/marketplace') ? 'active' : ''}>
            <Globe size={20} />
            Marketplace Hub
          </Link>
        </>
      );
    }

    // Default case - return common items
    return commonNavItems;
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-menu">
          {renderNavigation()}
          
          {/* Logout Button */}
          <div className="sidebar-separator mt-auto"></div>
          <Button 
            variant="ghost" 
            className="sidebar-logout w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;