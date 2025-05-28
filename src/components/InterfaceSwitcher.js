/**
 * Interface Switcher Component
 * 
 * Allows users to switch between ZUO and Pressly interfaces
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { switchInterface } from '../services/auth/auth';
import { INTERFACE_TYPES } from '../models/userExtensions';
import './InterfaceSwitcher.css';

const InterfaceSwitcher = ({ current, userLevel, onSwitch }) => {
  const navigate = useNavigate();

  const handleSwitch = async (interfaceType) => {
    // Update user preference
    await switchInterface(interfaceType);
    
    // Call parent callback if provided
    if (onSwitch) {
      onSwitch(interfaceType);
    }
    
    // Reload to apply new interface
    if (interfaceType === INTERFACE_TYPES.ZUO_CONSUMER) {
      navigate('/dashboard?interface=zuo');
    } else {
      navigate('/dashboard?interface=pressly');
    }
  };

  // Only show switcher for eligible users
  if (userLevel < 4 && current === INTERFACE_TYPES.ZUO_CONSUMER) {
    return null;
  }

  return (
    <div className="interface-switcher">
      <div className="switcher-toggle">
        <button
          className={`switcher-option ${current === INTERFACE_TYPES.ZUO_CONSUMER ? 'active' : ''}`}
          onClick={() => handleSwitch(INTERFACE_TYPES.ZUO_CONSUMER)}
          title="Simple consumer interface"
        >
          <span className="icon">🎯</span>
          <span className="label">ZUO</span>
          <span className="description">Simple</span>
        </button>
        
        <button
          className={`switcher-option ${current === INTERFACE_TYPES.PRESSLY_PROFESSIONAL ? 'active' : ''}`}
          onClick={() => handleSwitch(INTERFACE_TYPES.PRESSLY_PROFESSIONAL)}
          title="Professional marketplace"
        >
          <span className="icon">💼</span>
          <span className="label">Pressly</span>
          <span className="description">Pro</span>
        </button>
      </div>
    </div>
  );
};

export default InterfaceSwitcher;