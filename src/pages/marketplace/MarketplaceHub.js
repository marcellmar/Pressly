import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { 
  Search, 
  Filter, 
  Link, 
  Map, 
  Calendar, 
  TrendingUp, 
  Users, 
  Printer, 
  Palette, 
  Clock, 
  Sparkles 
} from 'lucide-react';

/**
 * MarketplaceHub - Central hub for all marketplace activities
 * Connects designers with producers and provides tools for collaboration
 */
const MarketplaceHub = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [marketplaceStats, setMarketplaceStats] = useState({
    activeDesigners: 0,
    activeProducers: 0,
    pendingRequests: 0,
    recentMatches: 0,
    marketplaceHealth: 0
  });
  
  // Simulated data for featured producers and designers
  const featuredProducers = [
    {
      id: 1,
      name: "Rowboat Creative",
      location: "Chicago, IL",
      specialty: "DTG Printing",
      availabilityPercent: 75,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "Eco Printing Solutions",
      location: "Portland, OR",
      specialty: "Sustainable Printing",
      availabilityPercent: 45,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1586770802437-a4ae726695ad?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      name: "Textile Experts",
      location: "Los Angeles, CA",
      specialty: "Fabric Printing",
      availabilityPercent: 60,
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1581091870952-9e93a02bade4?w=600&auto=format&fit=crop&q=60"
    }
  ];
  
  const featuredDesigners = [
    {
      id: 1,
      name: "Jessica Morgan",
      location: "New York, NY",
      specialty: "Streetwear",
      completedProjects: 37,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1599566219227-2efe0c9b7f5f?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "Marcus Reed",
      location: "Austin, TX",
      specialty: "Minimalist",
      completedProjects: 24,
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      name: "Alicia Zhang",
      location: "San Francisco, CA",
      specialty: "Sustainable Fashion",
      completedProjects: 42,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1596900779744-2bdc4a90509a?w=600&auto=format&fit=crop&q=60"
    }
  ];
  
  // Simulated data for marketplace trends
  const trends = [
    { name: "Eco-friendly printing", growth: "+24%", category: "sustainability" },
    { name: "Custom jackets", growth: "+18%", category: "apparel" },
    { name: "Local production", growth: "+32%", category: "logistics" },
    { name: "On-demand orders", growth: "+27%", category: "business" },
    { name: "Sustainable materials", growth: "+41%", category: "sustainability" }
  ];
  
  // Simulated data for upcoming marketplace events
  const events = [
    { 
      id: 1, 
      title: "Sustainable Printing Workshop", 
      date: "May 15, 2025", 
      location: "Online", 
      type: "Workshop" 
    },
    { 
      id: 2, 
      title: "Chicago Printing Expo", 
      date: "June 10-12, 2025", 
      location: "McCormick Place, Chicago", 
      type: "Expo" 
    },
    { 
      id: 3, 
      title: "Designer-Producer Networking", 
      date: "May 28, 2025", 
      location: "West Loop, Chicago", 
      type: "Networking" 
    }
  ];

  // Simulate loading marketplace data
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      // Simulate API call
      setTimeout(() => {
        setMarketplaceStats({
          activeDesigners: 487,
          activeProducers: 128,
          pendingRequests: 43,
          recentMatches: 76,
          marketplaceHealth: 87
        });
        setLoading(false);
      }, 1500);
    };
    
    fetchMarketplaceData();
  }, []);
  
  // Handle navigation to different marketplace sections
  const navigateToSection = (section) => {
    if (section === 'producers') {
      navigate('/enhanced-producers');
    } else if (section === 'designs') {
      navigate('/designs');
    } else if (section === 'smart-match') {
      navigate('/smart-match');
    } else if (section === 'network') {
      navigate('/network');
    } else {
      console.log(`Navigate to ${section}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Marketplace Hub</h1>
          <p className="text-gray-600 mt-1">
            Your central command for all printing marketplace activities
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigateToSection('help')}
            className="flex items-center gap-1"
          >
            <Link className="h-4 w-4" />
            <span>Resources</span>
          </Button>
          <Button 
            onClick={() => navigateToSection(currentUser?.role === 'designer' ? 'smart-match' : 'find-creators')}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-4 w-4" />
            <span>{currentUser?.role === 'designer' ? 'Find Producers' : 'Find Designers'}</span>
          </Button>
        </div>
      </div>

      {/* Marketplace Tabs */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="trends">Trends & Events</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Marketplace Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="text-sm text-gray-500">Active Designers</div>
              <div className="mt-1 text-2xl font-semibold">
                {loading ? '...' : marketplaceStats.activeDesigners}
              </div>
              <div className="text-xs text-green-600 mt-1">+12% this month</div>
            </div>
            
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="text-sm text-gray-500">Active Producers</div>
              <div className="mt-1 text-2xl font-semibold">
                {loading ? '...' : marketplaceStats.activeProducers}
              </div>
              <div className="text-xs text-green-600 mt-1">+8% this month</div>
            </div>
            
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="text-sm text-gray-500">Pending Requests</div>
              <div className="mt-1 text-2xl font-semibold">
                {loading ? '...' : marketplaceStats.pendingRequests}
              </div>
              <div className="text-xs text-blue-600 mt-1">View all</div>
            </div>
            
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="text-sm text-gray-500">Recent Matches</div>
              <div className="mt-1 text-2xl font-semibold">
                {loading ? '...' : marketplaceStats.recentMatches}
              </div>
              <div className="text-xs text-blue-600 mt-1">Last 30 days</div>
            </div>
            
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="text-sm text-gray-500">Marketplace Health</div>
              <div className="mt-1 text-2xl font-semibold">
                {loading ? '...' : `${marketplaceStats.marketplaceHealth}%`}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${loading ? 0 : marketplaceStats.marketplaceHealth}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => navigateToSection('producers')} 
                className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Printer className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-center text-sm">Find Producers</span>
              </button>
              
              <button 
                onClick={() => navigateToSection('designs')} 
                className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Palette className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-center text-sm">Manage Designs</span>
              </button>
              
              <button 
                onClick={() => navigateToSection('smart-match')} 
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Sparkles className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-center text-sm">Smart Match</span>
              </button>
              
              <button 
                onClick={() => navigateToSection('network')} 
                className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Map className="h-8 w-8 text-amber-600 mb-2" />
                <span className="text-center text-sm">Network Map</span>
              </button>
            </div>
          </div>
          
          {/* Featured Section - Shows different content based on user role */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {currentUser?.role === 'designer' ? 'Featured Producers' : 'Featured Designers'}
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => navigateToSection(currentUser?.role === 'designer' ? 'producers' : 'find-creators')}
                className="text-sm"
              >
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(currentUser?.role === 'designer' ? featuredProducers : featuredDesigners).map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigateToSection(currentUser?.role === 'designer' ? 'producers' : 'find-creators')}
                >
                  <div 
                    className="h-32 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  ></div>
                  
                  <div className="p-4">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{item.location}</div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                        {item.specialty}
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-amber-500 mr-1">★</span>
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    </div>
                    
                    {currentUser?.role === 'designer' ? (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-1">Availability</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.availabilityPercent > 50 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${item.availabilityPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 text-sm">
                        <span className="text-gray-500">Completed:</span> {item.completedProjects} projects
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Discover</h2>
            <p className="text-gray-500 mb-4">
              Explore the marketplace to find the perfect match for your projects.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigateToSection('producers')}
              >
                <Printer className="h-10 w-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-medium mb-1">Find Producers</h3>
                <p className="text-gray-500 text-sm mb-3">
                  Connect with local and global printing services that match your project needs.
                </p>
                <div className="text-blue-600 text-sm">Browse producers →</div>
              </div>
              
              <div 
                className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigateToSection('smart-match')}
              >
                <Sparkles className="h-10 w-10 text-purple-600 mb-3" />
                <h3 className="text-lg font-medium mb-1">Smart Match</h3>
                <p className="text-gray-500 text-sm mb-3">
                  Let our algorithm match your project with the perfect production partner.
                </p>
                <div className="text-purple-600 text-sm">Start matching →</div>
              </div>
              
              <div 
                className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigateToSection('network')}
              >
                <Map className="h-10 w-10 text-green-600 mb-3" />
                <h3 className="text-lg font-medium mb-1">Network Map</h3>
                <p className="text-gray-500 text-sm mb-3">
                  Visualize the printing network and find opportunities near you.
                </p>
                <div className="text-green-600 text-sm">View map →</div>
              </div>
              
              <div 
                className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigateToSection(currentUser?.role === 'designer' ? 'designs' : 'capacity')}
              >
                <Clock className="h-10 w-10 text-amber-600 mb-3" />
                <h3 className="text-lg font-medium mb-1">
                  {currentUser?.role === 'designer' ? 'Manage Designs' : 'Manage Capacity'}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {currentUser?.role === 'designer' 
                    ? 'Organize your design portfolio and track production status.'
                    : 'Update your availability and production capabilities.'
                  }
                </p>
                <div className="text-amber-600 text-sm">
                  {currentUser?.role === 'designer' ? 'View designs →' : 'Update capacity →'}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="text-sm text-gray-500">Today, 10:45 AM</div>
                <div className="font-medium">New quote request received</div>
                <div className="text-sm text-gray-700">A new quote request for your design "Summer Collection" has been received.</div>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <div className="text-sm text-gray-500">Yesterday, 3:22 PM</div>
                <div className="font-medium">Design approved for production</div>
                <div className="text-sm text-gray-700">Your design "Event Poster" has been approved and is scheduled for production.</div>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="text-sm text-gray-500">Apr 21, 2025</div>
                <div className="font-medium">New producer joined your area</div>
                <div className="text-sm text-gray-700">A new producer specializing in embroidery has joined the network in Chicago.</div>
              </div>
              
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <div className="text-sm text-gray-500">Apr 20, 2025</div>
                <div className="font-medium">Order status updated</div>
                <div className="text-sm text-gray-700">Your order #12345 has been shipped and is expected to arrive on Apr 24.</div>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <div className="text-sm text-gray-500">Apr 18, 2025</div>
                <div className="font-medium">Quote accepted</div>
                <div className="text-sm text-gray-700">Your quote for "Business Cards" has been accepted by the client.</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="ghost" className="text-sm">View all activity</Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marketplace Trends */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Marketplace Trends</h2>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              
              <div className="space-y-3">
                {trends.map((trend, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{trend.name}</div>
                      <div className="text-xs text-gray-500 mt-1 uppercase">{trend.category}</div>
                    </div>
                    <div className="text-green-600 font-medium">{trend.growth}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              
              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id} 
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{event.date}</div>
                        <div className="text-sm text-gray-500">{event.location}</div>
                      </div>
                      <div className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                        {event.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="ghost" className="text-sm">View all events</Button>
              </div>
            </div>
          </div>
          
          {/* Community Highlights */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Community Highlights</h2>
              <Users className="h-5 w-5 text-amber-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=600&auto=format&fit=crop&q=60" 
                  alt="Community highlight" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="font-medium">Success Story: Eco Printing</div>
                  <div className="text-sm text-gray-500 mt-1">
                    How one designer reduced waste by 40% using our network.
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1567721913486-6585f069b332?w=600&auto=format&fit=crop&q=60" 
                  alt="Community highlight" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="font-medium">Chicago Printing Network</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Local producers collaborate for faster turnaround times.
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?w=600&auto=format&fit=crop&q=60" 
                  alt="Community highlight" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="font-medium">Designer Spotlight</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Meet Jessica, whose designs have transformed local businesses.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceHub;
