/**
 * Unified Home Page
 * Modern home page that serves both consumers and professionals
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import './UnifiedHome.css';

const UnifiedHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="unified-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Print production
              <span className="hero-highlight"> made simple</span>
            </h1>
            <p className="hero-subtitle">
              Connect with local print shops, upload your designs, and get professional results. 
              Whether you need one shirt or thousands.
            </p>
            <div className="hero-actions">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                Get started free
              </button>
              <Link to="/producers" className="btn btn-secondary btn-lg">
                Browse printers
              </Link>
            </div>
            <p className="hero-note">
              No credit card required • Free to start • Pay only for orders
            </p>
          </div>
          
          <div className="hero-visual">
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop" 
                alt="Print production workspace"
                className="hero-image"
              />
              <div className="hero-stats">
                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Print shops</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Orders completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">
              Get your designs printed in three simple steps
            </p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Upload your design</h3>
              <p className="step-description">
                Upload any image, PDF, or create simple text designs right in your browser
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Choose a printer</h3>
              <p className="step-description">
                We match you with the best local print shops based on your needs and location
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Receive your order</h3>
              <p className="step-description">
                Track your order in real-time and get it delivered or pick it up locally
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-container">
          <div className="features-grid">
            <div className="feature-large">
              <h2 className="feature-title">For everyone</h2>
              <p className="feature-description">
                Whether you're ordering custom t-shirts for your team or launching a clothing brand, 
                Pressly adapts to your needs.
              </p>
              <div className="feature-benefits">
                <div className="benefit">
                  <svg className="benefit-icon" width="20" height="20" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>No minimum orders</span>
                </div>
                <div className="benefit">
                  <svg className="benefit-icon" width="20" height="20" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Transparent pricing</span>
                </div>
                <div className="benefit">
                  <svg className="benefit-icon" width="20" height="20" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Local production</span>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="feature-card-title">Smart matching</h3>
              <p className="feature-card-description">
                Our AI matches your project with the perfect print shop based on capabilities, location, and availability
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="feature-card-title">Quality guaranteed</h3>
              <p className="feature-card-description">
                All print shops are vetted and rated by real customers to ensure consistent quality
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="feature-card-title">Eco-friendly options</h3>
              <p className="feature-card-description">
                Choose sustainable materials and support local businesses to reduce your carbon footprint
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="user-types-section">
        <div className="section-container">
          <div className="user-types-grid">
            <div className="user-type-card">
              <h3 className="user-type-title">For individuals</h3>
              <p className="user-type-description">
                Perfect for personal projects, events, and gifts
              </p>
              <ul className="user-type-features">
                <li>Simple upload process</li>
                <li>No design skills needed</li>
                <li>Order as few as 1 item</li>
                <li>Track orders easily</li>
              </ul>
              <Link to="/create" className="btn btn-secondary">
                Start creating
              </Link>
            </div>
            
            <div className="user-type-card highlighted">
              <div className="highlight-badge">Most popular</div>
              <h3 className="user-type-title">For businesses</h3>
              <p className="user-type-description">
                Scale your merchandise and marketing materials
              </p>
              <ul className="user-type-features">
                <li>Bulk ordering discounts</li>
                <li>Multiple print shops</li>
                <li>Brand consistency tools</li>
                <li>Priority support</li>
              </ul>
              <Link to="/register?type=business" className="btn btn-primary">
                Get started
              </Link>
            </div>
            
            <div className="user-type-card">
              <h3 className="user-type-title">For print shops</h3>
              <p className="user-type-description">
                Join our network and grow your business
              </p>
              <ul className="user-type-features">
                <li>Access new customers</li>
                <li>Manage capacity</li>
                <li>Automated workflows</li>
                <li>Payment protection</li>
              </ul>
              <Link to="/register?type=producer" className="btn btn-secondary">
                Apply now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to start printing?</h2>
          <p className="cta-subtitle">
            Join thousands of satisfied customers who trust Pressly for their printing needs
          </p>
          <div className="cta-actions">
            <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
              Get started free
            </button>
            <Link to="/contact" className="btn btn-ghost btn-lg">
              Contact sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnifiedHome;