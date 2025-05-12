import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicPortfolio } from '../../services/portfolio';
import PortfolioHeader from '../../components/public/PortfolioHeader';
import ProjectGallery from '../../components/public/ProjectGallery';
import ContactSection from '../../components/public/ContactSection';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Grid3X3, MessageSquare, Home, Heart, Star, Loader, AlertCircle } from 'lucide-react';

const PublicPortfolio = () => {
  const { portfolioSlug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');

  // Fetch portfolio data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPublicPortfolio(portfolioSlug);
        setPortfolio(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio. It may be private or not exist.');
        setLoading(false);
      }
    };

    fetchData();
  }, [portfolioSlug]);

  // Apply theme settings from portfolio
  useEffect(() => {
    if (portfolio?.themeSettings) {
      const theme = portfolio.themeSettings;
      
      // Apply theme to root element or a specific container
      const root = document.documentElement;
      
      // Set custom CSS variables
      root.style.setProperty('--portfolio-primary', theme.primaryColor || '#3a6ea5');
      root.style.setProperty('--portfolio-secondary', theme.secondaryColor || '#ff6b6b');
      root.style.setProperty('--portfolio-font', theme.fontFamily || 'Segoe UI, sans-serif');
      
      // Set the font family for the entire page
      document.body.style.fontFamily = theme.fontFamily || 'Segoe UI, sans-serif';
      
      // Clean up when component unmounts
      return () => {
        root.style.removeProperty('--portfolio-primary');
        root.style.removeProperty('--portfolio-secondary');
        root.style.removeProperty('--portfolio-font');
        document.body.style.fontFamily = '';
      };
    }
  }, [portfolio]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-500" />
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link to="/">
                <Button>
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ 
      fontFamily: portfolio.themeSettings?.fontFamily || 'Segoe UI, sans-serif'
    }}>
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ 
        backgroundImage: `linear-gradient(to right, ${portfolio.themeSettings?.primaryColor || '#3a6ea5'}, ${portfolio.themeSettings?.secondaryColor || '#ff6b6b'})`
      }}>
        <div className="container mx-auto px-4 py-2">
          <Link to="/" className="text-white hover:text-white/80 flex items-center text-sm">
            <Home className="h-3 w-3 mr-1" />
            Back to Pressly
          </Link>
        </div>
      </div>
      
      {/* Portfolio Header */}
      <PortfolioHeader 
        portfolio={portfolio} 
        designer={portfolio.designer} 
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white rounded-lg shadow-sm">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="projects" className="data-[state=active]:border-b-2" style={{ 
                borderColor: 'var(--portfolio-primary)' 
              }}>
                <Grid3X3 className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:border-b-2" style={{ 
                borderColor: 'var(--portfolio-primary)' 
              }}>
                <Star className="h-4 w-4 mr-2" />
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:border-b-2" style={{ 
                borderColor: 'var(--portfolio-primary)' 
              }}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="projects" className="m-0">
                <ProjectGallery 
                  items={portfolio.items} 
                  layout={portfolio.themeSettings?.layout || 'grid'} 
                />
              </TabsContent>
              
              <TabsContent value="testimonials" className="m-0">
                {portfolio.testimonials && portfolio.testimonials.length > 0 ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Client Testimonials</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {portfolio.testimonials.map(testimonial => (
                        <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 relative">
                          <div className="flex items-start gap-4">
                            <div className="absolute top-4 right-4 flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <div>
                              <blockquote className="text-gray-700 italic mb-4">
                                "{testimonial.content}"
                              </blockquote>
                              <div className="mt-4">
                                <p className="font-medium">{testimonial.clientName}</p>
                                <p className="text-sm text-gray-500">{testimonial.clientTitle}</p>
                                {testimonial.projectTitle && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    For project: {testimonial.projectTitle}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">No Testimonials Yet</h3>
                    <p className="text-gray-500 mt-2">
                      This designer hasn't received any testimonials yet.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="contact" className="m-0">
                <ContactSection 
                  designer={portfolio.designer} 
                  portfolio={portfolio} 
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-white hover:text-gray-300 flex items-center">
                <span className="font-bold text-xl">Pressly</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Heart className="h-4 w-4 mr-2" />
                Like This Portfolio
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Star className="h-4 w-4 mr-2" />
                Leave a Testimonial
              </Button>
            </div>
            
            <div className="text-gray-400 text-sm mt-4 md:mt-0">
              Powered by Pressly
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortfolio;