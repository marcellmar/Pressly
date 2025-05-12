import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../services/auth/AuthContext';
import usePortfolio from '../../../hooks/usePortfolio';
import PortfolioManager from './PortfolioManager';
import ThemeSelector from './ThemeSelector';
import PublishControls from './PublishControls';
import SharingOptions from './SharingOptions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { AlertCircle, CheckCircle, Share2, Palette, Layout, Eye, PenTool, Settings, Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';

const PortfolioTab = () => {
  const { currentUser } = useAuth();
  const {
    portfolio,
    portfolioItems,
    loading,
    error,
    clearError,
    createPortfolio,
    updatePortfolio,
    fetchPortfolioStats,
    stats
  } = usePortfolio();

  const [form, setForm] = useState({
    title: '',
    description: '',
    themeSettings: {
      primaryColor: '#3a6ea5',
      secondaryColor: '#ff6b6b',
      fontFamily: 'Segoe UI',
      layout: 'grid'
    },
    isPublic: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '' });
  const [activeTab, setActiveTab] = useState('designs');

  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Initialize form with portfolio data if it exists
  useEffect(() => {
    if (portfolio) {
      setForm({
        title: portfolio.title || '',
        description: portfolio.description || '',
        themeSettings: portfolio.themeSettings || form.themeSettings,
        isPublic: portfolio.isPublic || false
      });
    }
  }, [portfolio]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle theme settings changes
  const handleThemeChange = (themeSettings) => {
    setForm(prev => ({
      ...prev,
      themeSettings: {
        ...prev.themeSettings,
        ...themeSettings
      }
    }));
  };

  // Handle publish status changes
  const handlePublishChange = (isPublic) => {
    setForm(prev => ({
      ...prev,
      isPublic
    }));
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      setSaveStatus({ success: false, message: '' });
      
      let result;
      if (portfolio) {
        // Update existing portfolio
        result = await updatePortfolio(form);
      } else {
        // Create new portfolio
        result = await createPortfolio(form);
      }
      
      if (result) {
        setSaveStatus({ 
          success: true, 
          message: portfolio ? 'Portfolio updated successfully!' : 'Portfolio created successfully!' 
        });
        setIsEditing(false);
      }
    } catch (err) {
      setSaveStatus({ 
        success: false, 
        message: `Error: ${err.message || 'Failed to save portfolio'}` 
      });
    }
  };

  // If loading, show a loading indicator
  if (loading && !portfolio) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">
              {portfolio ? (
                <>
                  {portfolio.title || 'My Portfolio'}
                  {portfolio.isPublic && (
                    <span className="ml-2 text-sm font-normal bg-green-100 text-green-800 px-2 py-1 rounded-full inline-flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </span>
                  )}
                </>
              ) : (
                'Create Your Portfolio'
              )}
            </CardTitle>
            <CardDescription>
              {portfolio ? 'Manage your design portfolio and showcase your work' : 'Start building your professional design portfolio'}
            </CardDescription>
          </div>
          {portfolio && !isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Settings
              </Button>
              <Button 
                size="sm" 
                onClick={() => window.open(`/portfolio/${portfolio.id}`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Portfolio
              </Button>
            </div>
          ) : null}
        </div>
        
        {/* Status messages */}
        {saveStatus.message && (
          <Alert variant={saveStatus.success ? "success" : "destructive"} className="mt-4">
            {saveStatus.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{saveStatus.success ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>
              {saveStatus.message}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        {/* Portfolio settings form - visible in edit mode or when creating a new portfolio */}
        {(!portfolio || isEditing) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Portfolio Settings</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Portfolio Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="e.g., My Design Portfolio"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your portfolio and design expertise"
                  className="w-full"
                  rows={3}
                />
              </div>
              
              <ThemeSelector 
                themeSettings={form.themeSettings} 
                onChange={handleThemeChange} 
              />
              
              <PublishControls 
                isPublic={form.isPublic} 
                onChange={handlePublishChange} 
                portfolioId={portfolio?.id}
              />
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    if (!portfolio) {
                      // Reset form if creating new portfolio
                      setForm({
                        title: '',
                        description: '',
                        themeSettings: {
                          primaryColor: '#3a6ea5',
                          secondaryColor: '#ff6b6b',
                          fontFamily: 'Segoe UI',
                          layout: 'grid'
                        },
                        isPublic: false
                      });
                    } else {
                      // Reset to portfolio values if editing
                      setForm({
                        title: portfolio.title || '',
                        description: portfolio.description || '',
                        themeSettings: portfolio.themeSettings || form.themeSettings,
                        isPublic: portfolio.isPublic || false
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {portfolio ? 'Save Changes' : 'Create Portfolio'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio content management - visible only when portfolio exists */}
        {portfolio && !isEditing && (
          <Tabs defaultValue="designs" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="designs" className="flex items-center">
                <PenTool className="h-4 w-4 mr-2" />
                Designs
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="sharing" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Sharing
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center">
                <Layout className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="designs">
              <PortfolioManager 
                portfolio={portfolio}
                portfolioItems={portfolioItems}
              />
            </TabsContent>
            
            <TabsContent value="appearance">
              <div className="p-4 border rounded-lg">
                <ThemeSelector 
                  themeSettings={portfolio.themeSettings} 
                  onChange={handleThemeChange}
                  onSave={() => updatePortfolio({ 
                    themeSettings: form.themeSettings 
                  })}
                  viewOnly={false}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="sharing">
              <SharingOptions 
                portfolio={portfolio}
                onPublishChange={(isPublic) => {
                  handlePublishChange(isPublic);
                  updatePortfolio({ isPublic });
                }}
              />
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Portfolio Analytics</h3>
                  <Button variant="outline" size="sm" onClick={fetchPortfolioStats}>
                    Refresh Stats
                  </Button>
                </div>
                
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold">{stats.views}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Unique Visitors</p>
                      <p className="text-2xl font-bold">{stats.uniqueVisitors}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                    </div>
                    
                    <div className="col-span-3">
                      <h4 className="font-medium mb-2">Top Referrers</h4>
                      <div className="space-y-2">
                        {stats.topReferrers.map((referrer, index) => (
                          <div key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                            <span>{referrer.source}</span>
                            <span className="font-medium">{referrer.count} visits</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No analytics data available yet</p>
                    <Button onClick={fetchPortfolioStats}>
                      Load Analytics
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      {portfolio && (
        <CardFooter className="bg-gray-50 mt-6">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(portfolio.updatedAt).toLocaleDateString()}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default PortfolioTab;