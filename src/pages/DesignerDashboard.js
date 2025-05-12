import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Star,
  Mail,
  MapPin,
  Printer,
  BarChart,
  Leaf,
  ChevronRight,
  ExternalLink,
  Search,
  Heart,
  Home,
  Settings,
  LogOut,
  BellRing,
  ChevronDown,
  UserCircle
} from 'lucide-react';

// Import the Environmental Impact Tracker
import EnvironmentalImpactTracker from '../components/EnvironmentalImpact/EnvironmentalImpactTracker';

// Import the Portfolio Tab
import PortfolioTab from '../components/designer/portfolio/PortfolioTab';

const DesignerDashboard = () => {
  const { currentUser } = useAuth();
  const [activeDesigns, setActiveDesigns] = useState(5);
  const [ordersInProgress, setOrdersInProgress] = useState(3);
  const [completedOrders, setCompletedOrders] = useState(12);
  const [averageRating, setAverageRating] = useState(4.8);
  
  // Sample recent orders
  const recentOrders = [
    {
      id: 12345,
      producer: 'PrintMasters Inc.',
      design: 'Summer T-Shirt Design',
      status: 'in-production',
      date: '2025-04-01',
      location: 'Chicago, IL'
    },
    {
      id: 12344,
      producer: 'Quality Prints',
      design: 'Event Poster',
      status: 'pending',
      date: '2025-03-28',
      location: 'Chicago, IL'
    },
    {
      id: 12343,
      producer: 'PrintMasters Inc.',
      design: 'Business Cards',
      status: 'completed',
      date: '2025-03-15',
      location: 'Chicago, IL'
    }
  ];
  
  // Sample recent messages
  const recentMessages = [
    {
      id: 1,
      sender: 'PrintMasters Inc.',
      date: '2025-04-02',
      content: 'Your order #12345 is now in production. Expected completion date is April 8th.'
    },
    {
      id: 2,
      sender: 'Quality Prints',
      date: '2025-03-28',
      content: 'We\'ve received your order #12344. We\'ll need to discuss some details about the paper quality before proceeding.'
    }
  ];
  
  // Sample recommended producers with enhanced sustainability metrics
  const recommendedProducers = [
    {
      id: 1,
      name: 'Eco Printing Solutions',
      rating: 4.9,
      reviews: 45,
      capabilities: 'Specializes in eco-friendly materials and sustainable printing processes.',
      sustainabilityScore: 95,
      location: 'Logan Square, Chicago',
      carbonSavings: 86.4
    },
    {
      id: 2,
      name: 'Digital Press Masters',
      rating: 4.7,
      reviews: 32,
      capabilities: 'High-volume digital printing with quick turnaround times.',
      sustainabilityScore: 80,
      location: 'West Loop, Chicago',
      carbonSavings: 42.6
    },
    {
      id: 3,
      name: 'Specialty Textiles',
      rating: 4.8,
      reviews: 27,
      capabilities: 'Custom fabric printing for apparel and home decor.',
      sustainabilityScore: 85,
      location: 'Wicker Park, Chicago',
      carbonSavings: 53.8
    }
  ];
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'in-production': { color: 'bg-blue-100 text-blue-800', icon: <Printer className="h-3 w-3 mr-1" /> },
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3 mr-1" /> },
      'issue': { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    
    return (
      <Badge variant="outline" className={`flex items-center ${config.color}`}>
        {config.icon}
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top navigation banner */}
      <div className="bg-blue-600 text-white py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Pressly Platform v2.4.0</span>
            <Link to="/feature-showcase" className="text-white/90 hover:text-white text-sm flex items-center gap-1">
              <span>What's New</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/messages" className="text-white/90 hover:text-white text-sm flex items-center gap-1">
              <BellRing className="w-4 h-4" />
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Link>
            <div className="flex items-center gap-1 cursor-pointer group relative">
              <UserCircle className="w-5 h-5 text-white/90" />
              <span className="text-white/90 hover:text-white text-sm">{currentUser?.fullName || 'User'}</span>
              <ChevronDown className="w-3 h-3 text-white/90" />
              <div className="absolute hidden group-hover:block right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <UserCircle className="w-4 h-4 inline mr-2" />Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="w-4 h-4 inline mr-2" />Settings
                </Link>
                <div className="border-t border-gray-100"></div>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut className="w-4 h-4 inline mr-2" />Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-1">
              <Link to="/" className="flex items-center py-3 px-4 text-gray-500 hover:text-blue-600">
                <Home className="w-5 h-5" />
              </Link>
              <span className="text-gray-300">/</span>
              <Link to="/dashboard" className="py-3 px-4 text-blue-600 border-b-2 border-blue-600 font-medium">
                Dashboard
              </Link>
            </div>
            <div className="flex gap-2">
              <Link to="/analytics">
                <Button variant="outline" className="mr-2">
                  <BarChart className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link to="/designs">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Design
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Designer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.fullName || 'Designer'}. Here's an overview of your activity.</p>
        </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Designs</p>
                <h3 className="text-3xl font-bold mt-1">{activeDesigns}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Orders in Progress</p>
                <h3 className="text-3xl font-bold mt-1">{ordersInProgress}</h3>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                <h3 className="text-3xl font-bold mt-1">{completedOrders}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <h3 className="text-3xl font-bold mt-1">{averageRating}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact Tracker */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg text-white p-6 mb-8 shadow-md">
        <h2 className="text-xl font-bold mb-3 flex items-center">
          <Leaf className="w-5 h-5 mr-2" />
          Environmental Impact
        </h2>
        <EnvironmentalImpactTracker 
          userData={{
            id: 1,
            name: 'Designer User'
          }}
          userType="designer"
        />
      </div>

      {/* Portfolio Tab */}
      <div className="mb-8">
        <PortfolioTab />
      </div>
      
      {/* Analytics Card with Link */}
      <Card className="mt-8 mb-8 border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>
            Get insights about your designs and market trends
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-2/3 mb-4 md:mb-0">
              <h3 className="text-lg font-medium mb-2">Track Your Design Performance</h3>
              <p className="text-gray-600 mb-4">
                Get detailed insights about your best-selling designs, conversion rates, 
                customer feedback, and market trends to help grow your business.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-blue-100 text-blue-800">
                  Design Performance
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  Conversion Metrics
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  Revenue Tracking
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Customer Feedback
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-800">
                  Market Trends
                </Badge>
              </div>
            </div>
            <div>
              <Link to="/analytics">
                <Button size="lg" className="w-full md:w-auto">
                  <BarChart className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Orders */}
      <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Track the status of your recent print orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-gray-500">Order ID</th>
                  <th className="pb-3 font-medium text-gray-500">Producer</th>
                  <th className="pb-3 font-medium text-gray-500">Design</th>
                  <th className="pb-3 font-medium text-gray-500">Status</th>
                  <th className="pb-3 font-medium text-gray-500">Date</th>
                  <th className="pb-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 text-sm">#{order.id}</td>
                    <td className="py-3 text-sm">{order.producer}</td>
                    <td className="py-3 text-sm">{order.design}</td>
                    <td className="py-3 text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 text-sm">{order.date}</td>
                    <td className="py-3 text-sm">
                      <Link to={`/orders/${order.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50">
          <Link to="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all orders
          </Link>
        </CardFooter>
      </Card>
      
      {/* Recent Messages */}
      <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>
            Communication with your producers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMessages.map(message => (
              <Card key={message.id} className="overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                  <div className="font-medium">{message.sender}</div>
                  <div className="text-sm text-gray-500">{message.date}</div>
                </div>
                <CardContent className="p-4">
                  <p>{message.content}</p>
                </CardContent>
                <CardFooter className="px-4 py-3 border-t">
                  <Link to="/messages" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Reply
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50">
          <Link to="/messages" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all messages
          </Link>
        </CardFooter>
      </Card>
      
      {/* Recommended Producers */}
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-green-600" />
            Eco-Friendly Recommended Producers
          </CardTitle>
          <CardDescription>
            Chicago producers that match your style and environmental requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedProducers.map(producer => (
              <Card key={producer.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{producer.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{producer.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({producer.reviews} reviews)</span>
                  </div>
                  <div className="flex items-start mb-3">
                    <MapPin className="h-4 w-4 text-gray-500 mr-1 mt-1" />
                    <span className="text-sm text-gray-600">{producer.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{producer.capabilities}</p>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Sustainability Score</span>
                      <span className="text-xs font-semibold">{producer.sustainabilityScore}/100</span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          producer.sustainabilityScore > 90 
                            ? 'bg-green-500' 
                            : producer.sustainabilityScore > 75 
                              ? 'bg-blue-500' 
                              : 'bg-yellow-500'
                        }`}
                        style={{ width: `${producer.sustainabilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-4 bg-green-50 p-2 rounded-md flex items-center">
                    <Leaf className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-xs text-green-700">Saves ~{producer.carbonSavings} kg CO₂ per order</span>
                  </div>
                  <div className="flex justify-between">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Profile
                    </Button>
                    <Button size="sm" className="text-xs">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Printer className="w-8 h-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold">Pressly</span>
            </div>
            <div className="flex gap-8">
              <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy</Link>
              <Link to="/terms" className="text-gray-300 hover:text-white">Terms</Link>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Pressly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DesignerDashboard;