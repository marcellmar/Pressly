/**
 * Modern Home Page
 * Clean, minimal design inspired by Notion
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

const ModernHome = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🎯',
      title: 'Smart Matching',
      description: 'AI-powered matching finds the perfect printer for your project needs.'
    },
    {
      icon: '⚡',
      title: 'Fast Turnaround',
      description: 'Connect with local printers for same-day or next-day production.'
    },
    {
      icon: '🌍',
      title: 'Sustainable Options',
      description: 'Choose eco-friendly printers and reduce your carbon footprint.'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'Get instant quotes and compare prices from multiple printers.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Printers' },
    { number: '10k+', label: 'Projects Completed' },
    { number: '4.9', label: 'Average Rating' },
    { number: '24hr', label: 'Average Response' }
  ];

  return (
    <div className="modern-home">
      {/* Hero Section */}
      <section style={{ 
        padding: '96px 0',
        background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3.5rem',
            fontWeight: 700,
            marginBottom: '24px',
            lineHeight: 1.1
          }}>
            Print Smarter, Not Harder
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto 48px'
          }}>
            Connect with local print professionals for all your production needs. 
            From business cards to billboards, we make printing simple.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {isAuthenticated ? (
              <>
                <Link to="/smart-match" className="btn btn-primary btn-lg">
                  Start a Project
                </Link>
                <Link to="/producers" className="btn btn-secondary btn-lg">
                  Browse Printers
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/producers" className="btn btn-secondary btn-lg">
                  Explore Printers
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <h2 style={{ 
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--text-primary)'
                }}>
                  {stat.number}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '96px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            Everything you need to print
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ marginBottom: '12px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            How it works
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '64px',
                height: '64px',
                background: 'var(--bg-tertiary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '24px',
                fontWeight: 700
              }}>
                1
              </div>
              <h4>Upload Your Design</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Upload your files and specify your requirements
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '64px',
                height: '64px',
                background: 'var(--bg-tertiary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '24px',
                fontWeight: 700
              }}>
                2
              </div>
              <h4>Get Matched</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Our AI finds the best printers for your project
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '64px',
                height: '64px',
                background: 'var(--bg-tertiary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '24px',
                fontWeight: 700
              }}>
                3
              </div>
              <h4>Print & Deliver</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Approve quotes and get your prints delivered
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '96px 0',
        background: 'var(--bg-secondary)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            Ready to start printing?
          </h2>
          <p style={{ 
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            Join thousands of businesses who trust Pressly for their printing needs.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHome;