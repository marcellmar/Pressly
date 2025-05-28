/**
 * Unified Dashboard
 * Adaptive dashboard that serves consumers, designers, and producers
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { getCurrentUser } from '../services/auth/auth';
import './UnifiedDashboard.css';

// Import role-specific components
import DesignerDashboard from './DesignerDashboard';
import ProducerDashboard from './ProducerDashboard';

const UnifiedDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState('auto');
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const isConsumer = currentUser.role === 'consumer';
  const isDesigner = currentUser.role === 'designer';
  const isProducer = currentUser.role === 'producer';

  // Determine which dashboard to show
  const getDashboardComponent = () => {
    // Manual override
    if (viewMode !== 'auto') {
      switch (viewMode) {
        case 'consumer':
          return <ConsumerDashboard user={currentUser} />;
        case 'designer':
          return <DesignerDashboard />;
        case 'producer':
          return <ProducerDashboard />;
        default:
          break;
      }
    }

    // Auto mode - show based on role
    if (isProducer) {
      return <ProducerDashboard />;
    } else if (isDesigner) {
      return <DesignerDashboard />;
    } else {
      return <ConsumerDashboard user={currentUser} />;
    }
  };

  // View switcher for admin users
  const canSwitchViews = currentUser.role === 'admin';

  return (
    <div className="unified-dashboard">
      {canSwitchViews && (
        <div className="view-switcher">
          <span className="switcher-label">View as:</span>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            className="view-select"
          >
            <option value="auto">Auto (Current Role)</option>
            <option value="consumer">Consumer</option>
            <option value="designer">Designer</option>
            <option value="producer">Producer</option>
          </select>
        </div>
      )}
      
      {getDashboardComponent()}
    </div>
  );
};

// Consumer Dashboard Component
const ConsumerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: user.consumer_orders_count || 0,
    savedDesigns: 0,
    favoriteProducers: 0
  });

  useEffect(() => {
    // Load user data
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // In a real app, this would fetch from API
    setRecentOrders([
      {
        id: 'order-001',
        design: 'Team Shirts',
        producer: 'Local Print Co',
        status: 'in-production',
        date: '2025-05-20',
        progress: 65
      },
      {
        id: 'order-002',
        design: 'Event Banners',
        producer: 'Quick Prints',
        status: 'completed',
        date: '2025-05-15',
        progress: 100
      }
    ]);
  };

  return (
    <div className="consumer-dashboard">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h1 className="dashboard-title">Welcome back, {user.fullName?.split(' ')[0]}!</h1>
        <p className="dashboard-subtitle">
          Your dashboard for managing print orders and designs
        </p>
      </section>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          onClick={() => navigate('/create')} 
          className="action-card primary"
        >
          <div className="action-icon">+</div>
          <h3>Create New</h3>
          <p>Start a new print project</p>
        </button>
        
        <Link to="/producers" className="action-card">
          <div className="action-icon">🔍</div>
          <h3>Find Printers</h3>
          <p>Browse local print shops</p>
        </Link>
        
        <Link to="/orders" className="action-card">
          <div className="action-icon">📦</div>
          <h3>My Orders</h3>
          <p>Track your print orders</p>
        </Link>
        
        <Link to="/designs" className="action-card">
          <div className="action-icon">🎨</div>
          <h3>Saved Designs</h3>
          <p>Manage your designs</p>
        </Link>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <section className="recent-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/orders" className="view-all">View all →</Link>
          </div>
          <div className="orders-grid">
            {recentOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h4>{order.design}</h4>
                  <span className={`status-badge ${order.status}`}>
                    {order.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="order-producer">{order.producer}</p>
                <p className="order-date">{order.date}</p>
                <div className="order-progress">
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill-small"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{order.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.savedDesigns}</div>
          <div className="stat-label">Saved Designs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.favoriteProducers}</div>
          <div className="stat-label">Favorite Printers</div>
        </div>
      </section>

      {/* Get Started Prompt */}
      {stats.totalOrders === 0 && (
        <div className="upgrade-prompt">
          <h3>Get Started</h3>
          <p>Create your first order and discover local print shops!</p>
          <button onClick={() => navigate('/create')} className="btn btn-primary">
            Create an Order
          </button>
        </div>
      )}
    </div>
  );
};

export default UnifiedDashboard;