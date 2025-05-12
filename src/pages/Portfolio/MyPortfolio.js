import React, { useEffect } from 'react';
import { usePortfolioContext } from '../../services/portfolio/PortfolioProvider';
import { useDesignContext } from '../../services/designs/DesignProvider';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import PortfolioTab from '../../components/designer/portfolio/PortfolioTab';

const MyPortfolio = () => {
  const { 
    portfolio, 
    portfolioItems, 
    loading, 
    error, 
    clearError,
    createPortfolio
  } = usePortfolioContext();
  
  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);
  
  const { designs } = useDesignContext();

  // Handle creating a portfolio if none exists
  const handleCreatePortfolio = async () => {
    try {
      await createPortfolio({
        title: 'My Design Portfolio',
        description: 'Showcase of my design work',
        themeSettings: {
          primaryColor: '#3a6ea5',
          secondaryColor: '#ff6b6b',
          fontFamily: 'Segoe UI',
          layout: 'grid'
        },
        isPublic: false
      });
    } catch (err) {
      console.error('Error creating portfolio:', err);
      // Error handling
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-md">
        Error: {error}
      </div>
    );
  }

  // If no portfolio exists yet
  if (!portfolio) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Your Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-gray-400"
                >
                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.9L2 4.6A1.999 1.999 0 0 1 4.6 2l5.4 4.6h4l5.4-4.6a2 2 0 0 1 2.6 2.6L21.2 8.4Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No Portfolio Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your design portfolio to showcase your work to clients and collaborators.
              </p>
              
              {designs.length > 0 ? (
                <Button onClick={handleCreatePortfolio}>
                  Create My Portfolio
                </Button>
              ) : (
                <>
                  <p className="text-sm text-amber-600 mb-3">
                    You need to create at least one design before creating a portfolio.
                  </p>
                  <Button href="/designs">
                    Create Designs
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If portfolio exists, render the PortfolioTab component
  return <PortfolioTab />;
};

export default MyPortfolio;