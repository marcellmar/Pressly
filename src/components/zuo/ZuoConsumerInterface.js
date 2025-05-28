/**
 * ZUO Consumer Interface Component
 * 
 * Main container for the simplified consumer experience
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth/auth';
import { calculateZuoLevel, getFeatureProgress } from '../../models/userExtensions';
import ZuoCreationFlow from './ZuoCreationFlow';
import ZuoOrderHistory from './ZuoOrderHistory';
import ZuoLevelProgress from './ZuoLevelProgress';
import './ZuoInterface.css';

const ZuoConsumerInterface = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('create');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    
    // Show onboarding for first-time users
    if (currentUser.consumer_orders_count === 0 && currentUser.simplified_onboarding) {
      setShowOnboarding(true);
    }
  }, [navigate]);

  if (!user) return null;

  const userLevel = calculateZuoLevel(user);
  const progress = getFeatureProgress(user);

  return (
    <div className="zuo-interface">
      {/* Simplified Header */}
      <header className="zuo-header">
        <div className="zuo-header-content">
          <h1 className="zuo-logo">ZUO</h1>
          <div className="zuo-user-info">
            <span className="zuo-user-name">Hi, {user.fullName.split(' ')[0]}!</span>
            <ZuoLevelProgress level={userLevel} progress={progress} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="zuo-main">
        {showOnboarding && (
          <div className="zuo-onboarding">
            <h2>Welcome to ZUO!</h2>
            <p>The simplest way to bring your designs to life.</p>
            <button 
              className="zuo-btn-primary"
              onClick={() => setShowOnboarding(false)}
            >
              Get Started
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="zuo-nav-tabs">
          <button 
            className={`zuo-tab ${activeView === 'create' ? 'active' : ''}`}
            onClick={() => setActiveView('create')}
          >
            Create New
          </button>
          {userLevel >= 2 && (
            <button 
              className={`zuo-tab ${activeView === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveView('orders')}
            >
              My Orders
            </button>
          )}
        </div>

        {/* Content Views */}
        <div className="zuo-content">
          {activeView === 'create' && (
            <ZuoCreationFlow user={user} />
          )}
          {activeView === 'orders' && userLevel >= 2 && (
            <ZuoOrderHistory user={user} />
          )}
        </div>
      </main>

      {/* Feature Unlock Notification */}
      {progress.orders_to_next_level > 0 && (
        <div className="zuo-unlock-notification">
          <p>
            {progress.orders_to_next_level} more order{progress.orders_to_next_level > 1 ? 's' : ''} to unlock new features!
          </p>
        </div>
      )}

      {/* Interface Switcher for eligible users */}
      {user.producer_mode_eligible && (
        <button 
          className="zuo-switch-interface"
          onClick={() => navigate('/dashboard?interface=pressly')}
          title="Switch to Producer Mode"
        >
          <span className="icon">🔄</span>
          Producer Mode
        </button>
      )}
    </div>
  );
};

export default ZuoConsumerInterface;