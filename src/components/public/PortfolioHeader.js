import React from 'react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Share2, Mail, Link, Download } from 'lucide-react';

const PortfolioHeader = ({ portfolio, designer }) => {
  // Get designer's initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'D';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar/Logo */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage 
                src={designer?.profileImageUrl} 
                alt={designer?.brandName || designer?.fullName} 
              />
              <AvatarFallback className="text-2xl font-bold" style={{ backgroundColor: 'var(--portfolio-primary)', color: 'white' }}>
                {getInitials(designer?.fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Designer Info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold mb-1">{designer?.brandName || designer?.fullName}</h1>
            
            <div className="text-lg text-gray-600 mb-3">{portfolio.title}</div>
            
            {portfolio.description && (
              <p className="text-gray-700 mb-4 max-w-3xl">{portfolio.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {portfolio.tags && portfolio.tags.map((tag, index) => (
                <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {tag}
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Button size="sm" className="flex items-center" style={{ 
              backgroundColor: 'var(--portfolio-primary)'
            }}>
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        {/* Portfolio Stats */}
        <div className="flex justify-center md:justify-start gap-6 mt-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">{portfolio.items?.length || 0}</span> Projects
          </div>
          <div>
            <span className="font-medium">{portfolio.testimonials?.length || 0}</span> Testimonials
          </div>
          {designer.location && (
            <div>{designer.location}</div>
          )}
          <div>
            Member since <span className="font-medium">
              {new Date(designer.joinedAt || portfolio.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortfolioHeader;