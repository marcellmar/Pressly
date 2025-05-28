import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Users,
  TrendingUp,
  Star,
  Mail,
  BarChart2,
  Layers,
  AlertCircle,
  PieChart,
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
  UserCircle,
  Printer
} from 'lucide-react';

// Import the new KaizenMetrics component
import KaizenMetrics from '../components/KaizenPulse/KaizenMetrics';

// Import the EnvironmentalImpactTracker component
import EnvironmentalImpactTracker from '../components/EnvironmentalImpact/EnvironmentalImpactTracker';

const ProducerDashboard = () => {
  const { currentUser } = useAuth();
  const [capacityUsage, setCapacityUsage] = useState(75);
  const [pendingOrders, setPendingOrders] = useState(4);
  const [completedOrders, setCompletedOrders] = useState(18);
  const [monthlyRevenue, setMonthlyRevenue] = useState(8650);
  const [selectedKaizenMetric, setSelectedKaizenMetric] = useState(null);
  
  // Sample recent orders with ZUO integration
  const recentOrders = [
    {
      id: 54321,
      customer: 'Alex Johnson',
      design: 'Corporate Brochure',
      status: 'in-production',
      dueDate: '2025-04-28',
      orderValue: 750,
      interface_source: 'pressly',
      consumer_simplified: false
    },
    {
      id: 54320,
      customer: 'Samantha Lee',
      design: 'Wedding Invitations',
      status: 'pending',
      dueDate: '2025-05-05',
      orderValue: 450,
      interface_source: 'zuo',
      consumer_simplified: true,
      auto_selected_producer: true
    },
    {
      id: 54319,
      customer: 'Chicago Tech Conference',
      design: 'Event Banners',
      status: 'completed',
      dueDate: '2025-04-15',
      orderValue: 1200,
      interface_source: 'pressly',
      consumer_simplified: false
    },
    {
      id: 54318,
      customer: 'Green Living Co-op',
      design: 'Recycled Product Labels',
      status: 'issue',
      dueDate: '2025-04-22',
      orderValue: 350,
      interface_source: 'zuo',
      consumer_simplified: true,
      auto_selected_producer: false
    }
  ];
  
  // Sample upcoming capacity
  const capacitySchedule = [
    {
      date: '2025-04-22',
      capacityUsed: 85,
      orders: 3
    },
    {
      date: '2025-04-23',
      capacityUsed: 65,
      orders: 2
    },
    {
      date: '2025-04-24',
      capacityUsed: 90,
      orders: 4
    },
    {
      date: '2025-04-25',
      capacityUsed: 40,
      orders: 1
    },
    {
      date: '2025-04-26',
      capacityUsed: 0,
      orders: 0,
      weekend: true
    },
    {
      date: '2025-04-27',
      capacityUsed: 0,
      orders: 0,
      weekend: true
    },
    {
      date: '2025-04-28',
      capacityUsed: 70,
      orders: 3
    }
  ];
  
  // Sample material inventory
  const materialInventory = [
    {
      id: 1,
      name: 'Recycled Cotton Blend (White)',
      quantity: 450,
      unit: 'yards',
      status: 'good',
      reorderDate: null
    },
    {
      id: 2,
      name: 'Organic Canvas (Natural)',
      quantity: 120,
      unit: 'yards',
      status: 'low',
      reorderDate: '2025-04-30'
    },
    {
      id: 3,
      name: 'Eco-Friendly Card Stock',
      quantity: 850,
      unit: 'sheets',
      status: 'good',
      reorderDate: null
    },
    {
      id: 4,
      name: 'Water-Based Ink Set (CMYK)',
      quantity: 5,
      unit: 'gallons',
      status: 'critical',
      reorderDate: '2025-04-25'
    }
  ];
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'in-production': { color: 'bg-blue-100 text-blue-800', icon: <Layers className="h-3 w-3 mr-1" /> },
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
  
  // Inventory status badge
  const InventoryStatusBadge = ({ status }) => {
    const statusConfig = {
      'good': { color: 'bg-green-100 text-green-800' },
      'low': { color: 'bg-yellow-100 text-yellow-800' },
      'critical': { color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig['good'];
    
    return (
      <Badge variant="outline" className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Handle click on a Kaizen metric
  const handleMetricClick = (metric) => {
    setSelectedKaizenMetric(metric);
    // In a real implementation, this would open a detailed view
    console.log("Selected metric:", metric);
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
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">5</span>
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
            <div className="flex space-x-3">
              <Link to="/analytics">
                <Button variant="secondary">
                  <PieChart className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link to="/capacity">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Capacity
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Producer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.fullName || 'Producer'}. Here's a summary of your production status.</p>
        </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <Card>
      <CardContent className="p-6">
      <div className="flex items-center justify-between">
      <div>
      <p className="text-sm font-medium text-gray-500">Capacity Usage</p>
      <h3 className="text-3xl font-bold mt-1">{capacityUsage}%</h3>
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
      <BarChart2 className="h-6 w-6 text-blue-600" />
      </div>
      </div>
      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
      className={`h-full ${
      capacityUsage > 90 
      ? 'bg-red-500' 
      : capacityUsage > 75 
      ? 'bg-yellow-500' 
      : 'bg-green-500'
      }`}
      style={{ width: `${capacityUsage}%` }}
      ></div>
      </div>
      </CardContent>
      </Card>
      
      <Card>
      <CardContent className="p-6">
      <div className="flex items-center justify-between">
      <div>
      <p className="text-sm font-medium text-gray-500">Pending Orders</p>
      <h3 className="text-3xl font-bold mt-1">{pendingOrders}</h3>
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
      
      <Link to="/analytics" className="block group">
      <Card className="h-full transition-colors hover:border-blue-400">
      <CardContent className="p-6">
      <div className="flex items-center justify-between">
      <div>
      <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
      <h3 className="text-3xl font-bold mt-1">${monthlyRevenue.toLocaleString()}</h3>
      </div>
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200">
      <DollarSign className="h-6 w-6 text-purple-600" />
      </div>
      </div>
      </CardContent>
      </Card>
      </Link>
      </div>
      
      {/* Job Queue Action Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 mb-8 shadow-md text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Find New Production Jobs</h2>
            <p className="mb-4">Browse available jobs that match your production capabilities and equipment</p>
          </div>
          <Link to="/job-queue">
            <Button variant="secondary" size="lg" className="whitespace-nowrap">
              <Search className="h-4 w-4 mr-2" />
              View Job Queue
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Add Kaizen Metrics Component */}
      <div className="bg-blue-600 text-white rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-xl font-bold mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Performance Metrics
        </h2>
        <KaizenMetrics 
          producerData={{
            id: 1,
            name: 'Your Print Shop'
          }}
          onMetricClick={handleMetricClick}
        />
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
            name: 'Your Print Shop'
          }}
          userType="producer"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {/* Recent Orders */}
          <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Manage your current print orders from all channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-gray-500">Order ID</th>
                      <th className="pb-3 font-medium text-gray-500">Customer</th>
                      <th className="pb-3 font-medium text-gray-500">Design</th>
                      <th className="pb-3 font-medium text-gray-500">Status</th>
                      <th className="pb-3 font-medium text-gray-500">Due Date</th>
                      <th className="pb-3 font-medium text-gray-500">Value</th>
                      <th className="pb-3 font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3 text-sm">
                          <div className="flex items-center gap-2">
                            #{order.id}
                            {order.interface_source === 'zuo' && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                ZUO
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-sm">
                          <div>
                            {order.customer}
                            {order.consumer_simplified && (
                              <span className="text-xs text-gray-500 block">Consumer Order</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-sm">{order.design}</td>
                        <td className="py-3 text-sm">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-3 text-sm">{order.dueDate}</td>
                        <td className="py-3 text-sm">${order.orderValue}</td>
                        <td className="py-3 text-sm">
                          <Link to={`/orders/${order.id}`}>
                            <Button size="sm" variant="outline">Manage</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between">
              <Link to="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all orders
              </Link>
              <Link to="/job-queue" className="text-green-600 hover:text-green-800 text-sm font-medium">
                Find new jobs
              </Link>
            </CardFooter>
          </Card>
          
          {/* Material Inventory */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-green-600" />
                Sustainable Material Inventory
              </CardTitle>
              <CardDescription>
                Track your eco-friendly printing materials and supplies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-gray-500">Material</th>
                      <th className="pb-3 font-medium text-gray-500">Quantity</th>
                      <th className="pb-3 font-medium text-gray-500">Status</th>
                      <th className="pb-3 font-medium text-gray-500">Reorder Date</th>
                      <th className="pb-3 font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialInventory.map(material => (
                      <tr key={material.id} className="border-b">
                        <td className="py-3 text-sm">{material.name}</td>
                        <td className="py-3 text-sm">{material.quantity} {material.unit}</td>
                        <td className="py-3 text-sm">
                          <InventoryStatusBadge status={material.status} />
                        </td>
                        <td className="py-3 text-sm">{material.reorderDate || 'Not needed'}</td>
                        <td className="py-3 text-sm">
                          <Button size="sm" variant="outline">Update</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50">
              <Link to="/inventory" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Manage inventory
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          {/* Capacity Schedule */}
          <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Upcoming Capacity</CardTitle>
              <CardDescription>
                Next 7 days capacity schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capacitySchedule.map((day, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${day.weekend ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-sm">
                        {day.orders} {day.orders === 1 ? 'order' : 'orders'}
                      </div>
                    </div>
                    {day.weekend ? (
                      <div className="text-sm text-gray-500">Weekend - Not scheduled</div>
                    ) : (
                      <>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              day.capacityUsed > 90 
                                ? 'bg-red-500' 
                                : day.capacityUsed > 75 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${day.capacityUsed}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Capacity</span>
                          <span className="text-xs font-medium">{day.capacityUsed}%</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50">
              <Link to="/capacity" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Update capacity settings
              </Link>
            </CardFooter>
          </Card>
          
          {/* Performance Metrics */}
          <Card className="group border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Leaf className="h-5 w-5 mr-2 text-green-600" />
                    Sustainability Metrics
                  </CardTitle>
                  <CardDescription>
                    Your environmental impact at a glance
                  </CardDescription>
                </div>
                <Link to="/analytics">
                  <Button size="sm" variant="ghost" className="group-hover:bg-blue-50 group-hover:text-blue-600">
                    <PieChart className="h-4 w-4 mr-1" />
                    Full Analytics
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Carbon Footprint Reduction</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Renewable Energy Usage</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Material Waste Reduction</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Water Usage Reduction</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Eco-Friendly Order Growth</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="font-medium">34%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '34%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50">
              <Link to="/eco-analytics" className="text-green-600 hover:text-green-800 text-sm font-medium group-hover:font-semibold">
                View detailed sustainability metrics
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
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

export default ProducerDashboard;