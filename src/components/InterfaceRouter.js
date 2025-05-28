/**
 * Interface Router Component
 * 
 * Detects and routes users to appropriate interface (ZUO or Pressly)
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, switchInterface } from '../services/auth/auth';
import { determineInterface, INTERFACE_TYPES } from '../models/userExtensions';
import ZuoConsumerInterface from './zuo/ZuoConsumerInterface';

const InterfaceRouter = ({ children }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentInterface, setCurrentInterface] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectInterface();
  }, [searchParams]);

  const detectInterface = async () => {
    const user = getCurrentUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    // Check URL parameter first
    const urlInterface = searchParams.get('interface');
    if (urlInterface === 'zuo' || urlInterface === 'pressly') {
      const interfaceType = urlInterface === 'zuo' ? 
        INTERFACE_TYPES.ZUO_CONSUMER : 
        INTERFACE_TYPES.PRESSLY_PROFESSIONAL;
      
      // Update user preference
      await switchInterface(interfaceType);
      setCurrentInterface(interfaceType);
    } else {
      // Use user preference or auto-detect
      const detectedInterface = determineInterface(user);
      setCurrentInterface(detectedInterface);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="interface-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show ZUO interface if selected
  if (currentInterface === INTERFACE_TYPES.ZUO_CONSUMER) {
    return <ZuoConsumerInterface />;
  }

  // Show Pressly professional interface
  return children;
};

export default InterfaceRouter;