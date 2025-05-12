import React from 'react';
import Header from './Header';
import Footer from '../Footer';
import { useAuth } from '../../services/auth/AuthContext';
import { Link } from 'react-router-dom';
import { ExternalLink, CircleUser } from 'lucide-react';

const MainLayout = ({ children, hideTopBanner = false }) => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top navigation banner */}
      {!hideTopBanner && (
        <div className="bg-blue-600 text-white py-3 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Pressly Platform v2.4.0</span>
              <Link to="/feature-showcase" className="text-white/90 hover:text-white text-sm flex items-center gap-1">
                <span>What's New</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex gap-4">
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="text-white/90 hover:text-white text-sm">Sign In</Link>
                  <Link to="/register" className="text-white/90 hover:text-white text-sm">Create Account</Link>
                </>
              )}
              {isAuthenticated && (
                <Link to="/profile" className="text-white/90 hover:text-white text-sm flex items-center gap-1">
                  <CircleUser className="w-4 h-4" />
                  <span>My Account</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
