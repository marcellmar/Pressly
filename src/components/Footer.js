import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--white)',
      borderTop: '1px solid #E5E7EB',
      color: 'var(--gray-dark)'
    }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Pressly</h3>
            <p className="mb-4" style={{ color: 'var(--gray)' }}>
              Connecting designers with local print producers through transparent, sustainable, and hyperlocal supply chains.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--gray-dark)' }}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/smart-match" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  SmartMatch
                </Link>
              </li>
              <li>
                <Link to="/producers" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  Producers
                </Link>
              </li>
              <li>
                <Link to="/features" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Designers/Producers */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--gray-dark)' }}>For Creators</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  Join as Designer
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  Join as Producer
                </Link>
              </li>
              <li>
                <Link to="/features" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/smart-match" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  Find a Producer
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--gray)' }} className="hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--gray-dark)' }}>Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin size={18} className="mr-2" style={{ color: 'var(--primary)' }} />
                <p style={{ color: 'var(--gray)' }}>Chicago, IL 60642</p>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-2" style={{ color: 'var(--primary)' }} />
                <p style={{ color: 'var(--gray)' }}>(312) 555-1234</p>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-2" style={{ color: 'var(--primary)' }} />
                <p style={{ color: 'var(--gray)' }}>info@pressly.io</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 text-center" style={{ color: 'var(--gray)' }}>
          <p>© {new Date().getFullYear()} Pressly. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/privacy" style={{ color: 'var(--primary)' }} className="mx-2">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" style={{ color: 'var(--primary)' }} className="mx-2">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;