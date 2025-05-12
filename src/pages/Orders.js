import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Check, Clock, AlertTriangle, TruckIcon, Printer } from 'lucide-react';
import OrderDetails from '../components/Orders/OrderDetails';
import RecentOrders from '../components/Orders/RecentOrders';

const Orders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample orders data based on user role
  const mockDesignerOrders = [
    {
      id: 'order123',
      name: 'Spring Marketing Campaign Posters',
      producer: 'PrintMasters Inc.',
      producerLocation: 'Chicago, IL',
      status: 'in_production',
      date: '2025-04-05',
      unreadMessages: 1,
      paymentStatus: 'paid',
      amount: 1375.00,
      designName: 'Spring Marketing Posters',
      quantity: 500,
      estimatedCompletion: '2025-04-12'
    },
    {
      id: 'order124',
      name: 'Business Cards - CEO Edition',
      producer: 'Quality Prints',
      producerLocation: 'Chicago, IL',
      status: 'design_approved',
      date: '2025-04-02',
      unreadMessages: 0,
      paymentStatus: 'paid',
      amount: 120.00,
      designName: 'Business Cards - Premium',
      quantity: 250,
      estimatedCompletion: '2025-04-08'
    },
    {
      id: 'order125',
      name: 'Annual Report - 2024',
      producer: 'Corporate Print Solutions',
      producerLocation: 'Chicago, IL',
      status: 'completed',
      date: '2025-03-28',
      unreadMessages: 0,
      paymentStatus: 'paid',
      amount: 2450.00,
      designName: 'Annual Report 2024',
      quantity: 200,
      estimatedCompletion: '2025-03-27'
    },
    {
      id: 'order126',
      name: 'Employee T-Shirts - Summer Edition',
      producer: 'Eco Printing Solutions',
      producerLocation: 'Chicago, IL',
      status: 'quality_check',
      date: '2025-04-04',
      unreadMessages: 2,
      paymentStatus: 'paid',
      amount: 875.50,
      designName: 'Employee T-Shirts',
      quantity: 75,
      estimatedCompletion: '2025-04-10'
    },
    {
      id: 'order127',
      name: 'Event Banners - Conference',
      producer: 'Banner Experts',
      producerLocation: 'Chicago, IL',
      status: 'ready_for_pickup',
      date: '2025-04-03',
      unreadMessages: 0,
      paymentStatus: 'paid',
      amount: 560.00,
      designName: 'Conference Banners',
      quantity: 8,
      estimatedCompletion: '2025-04-05'
    }
  ];
  
  const mockProducerOrders = [
    {
      id: 'order123',
      name: 'Spring Marketing Campaign Posters',
      designer: 'Sarah Design Studio',
      designerLocation: 'San Francisco, CA',
      status: 'in_production',
      date: '2025-04-05',
      unreadMessages: 0,
      paymentStatus: 'paid',
      amount: 1375.00,
      designName: 'Spring Marketing Posters',
      quantity: 500,
      estimatedCompletion: '2025-04-12'
    },
    {
      id: 'order126',
      name: 'Restaurant Menu Redesign',
      designer: 'FoodFocus Design',
      designerLocation: 'Chicago, IL',
      status: 'order_placed',
      date: '2025-04-07',
      unreadMessages: 2,
      paymentStatus: 'pending',
      amount: 320.00,
      designName: 'Restaurant Menu',
      quantity: 50,
      estimatedCompletion: '2025-04-14'
    },
    {
      id: 'order127',
      name: 'Conference Badges',
      designer: 'Event Graphics Inc.',
      designerLocation: 'New York, NY',
      status: 'ready_for_pickup',
      date: '2025-04-01',
      unreadMessages: 0,
      paymentStatus: 'paid',
      amount: 225.00,
      designName: 'Conference Badges',
      quantity: 150,
      estimatedCompletion: '2025-04-03'
    },
    {
      id: 'order128',
      name: 'Corporate Brochures',
      designer: 'Business Brand Studio',
      designerLocation: 'Chicago, IL',
      status: 'quality_check',
      date: '2025-04-06',
      unreadMessages: 1,
      paymentStatus: 'paid',
      amount: 980.00,
      designName: 'Corporate Brochure 2025',
      quantity: 500,
      estimatedCompletion: '2025-04-11'
    },
    {
      id: 'order129',
      name: 'Product Labels - Premium Line',
      designer: 'Label Design Pro',
      designerLocation: 'Austin, TX',
      status: 'completed',
      date: '2025-03-29',
      unreadMessages: 0,
      paymentStatus: 'paid',
      amount: 540.00,
      designName: 'Premium Product Labels',
      quantity: 1000,
      estimatedCompletion: '2025-04-01'
    }
  ];
  
  useEffect(() => {
    // In a real app, you would fetch orders from your API
    // For this demo, we'll just use the mock data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (currentUser?.role === 'designer') {
        setOrders(mockDesignerOrders);
      } else if (currentUser?.role === 'producer') {
        setOrders(mockProducerOrders);
      } else {
        // Default to designer for demo purposes
        setOrders(mockDesignerOrders);
      }
      setLoading(false);
    }, 600);
  }, [currentUser]);

  // Filter orders based on activeFilter and searchQuery
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (activeFilter !== 'all' && order.status !== activeFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const name = order.name.toLowerCase();
      const producer = (order.producer || order.designer || '').toLowerCase();
      
      if (!name.includes(query) && !producer.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  // Helper function to get status badge details
  const getStatusBadgeDetails = (status) => {
    const statusConfig = {
      order_placed: { label: 'Order Placed', icon: <Clock className="h-3 w-3 mr-1" />, color: 'bg-gray-100 text-gray-800' },
      design_approved: { label: 'Design Approved', icon: <Check className="h-3 w-3 mr-1" />, color: 'bg-blue-100 text-blue-800' },
      in_production: { label: 'In Production', icon: <Printer className="h-3 w-3 mr-1" />, color: 'bg-yellow-100 text-yellow-800' },
      quality_check: { label: 'Quality Check', icon: <AlertTriangle className="h-3 w-3 mr-1" />, color: 'bg-purple-100 text-purple-800' },
      ready_for_pickup: { label: 'Ready for Pickup', icon: <TruckIcon className="h-3 w-3 mr-1" />, color: 'bg-indigo-100 text-indigo-800' },
      shipped: { label: 'Shipped', icon: <TruckIcon className="h-3 w-3 mr-1" />, color: 'bg-indigo-100 text-indigo-800' },
      delivered: { label: 'Delivered', icon: <Check className="h-3 w-3 mr-1" />, color: 'bg-green-100 text-green-800' },
      completed: { label: 'Completed', icon: <Check className="h-3 w-3 mr-1" />, color: 'bg-green-100 text-green-800' }
    };
    
    return statusConfig[status] || { label: status.replace('_', ' '), icon: null, color: 'bg-gray-100 text-gray-800' };
  };

  // Handle view order details
  const handleViewOrder = (orderId) => {
    setSelectedOrder(orderId);
  };

  // Back to order list
  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-gray-600">
          {currentUser?.role === 'designer' 
            ? 'Track and manage your production orders' 
            : 'Manage incoming print orders from designers'}
        </p>
      </div>
      
      {selectedOrder ? (
        <div>
          <Button 
            onClick={handleBackToList} 
            variant="outline" 
            className="mb-4"
          >
            Back to Orders
          </Button>
          <OrderDetails 
            orderId={selectedOrder} 
            onClose={handleBackToList} 
          />
        </div>
      ) : (
        <>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button 
                variant={activeFilter === 'all' ? "default" : "outline"} 
                className="whitespace-nowrap"
                onClick={() => setActiveFilter('all')}
              >
                All Orders
              </Button>
              <Button 
                variant={activeFilter === 'in_production' ? "default" : "outline"} 
                className="whitespace-nowrap"
                onClick={() => setActiveFilter('in_production')}
              >
                <Printer className="h-4 w-4 mr-1" />
                In Production
              </Button>
              <Button 
                variant={activeFilter === 'ready_for_pickup' ? "default" : "outline"} 
                className="whitespace-nowrap"
                onClick={() => setActiveFilter('ready_for_pickup')}
              >
                <Check className="h-4 w-4 mr-1" />
                Ready for Pickup
              </Button>
              <Button 
                variant={activeFilter === 'completed' ? "default" : "outline"} 
                className="whitespace-nowrap"
                onClick={() => setActiveFilter('completed')}
              >
                <Check className="h-4 w-4 mr-1" />
                Completed
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin inline-block mb-4"></div>
              <p className="text-lg font-medium">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-1">No orders found</h3>
              <p className="text-gray-500">
                {searchQuery ? 
                  'Try adjusting your search or filters to see more results' : 
                  'You don\'t have any orders matching the selected filter'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {currentUser?.role === 'designer' ? 'Producer' : 'Designer'}
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map(order => {
                      const status = getStatusBadgeDetails(order.status);
                      
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-gray-900">{order.name}</div>
                                <div className="text-sm text-gray-500">
                                  {order.quantity} units · {order.estimatedCompletion}
                                </div>
                              </div>
                              {order.unreadMessages > 0 && (
                                <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                  {order.unreadMessages} new
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {currentUser?.role === 'designer' ? order.producer : order.designer}
                            </div>
                            <div className="text-sm text-gray-500">
                              {currentUser?.role === 'designer' ? order.producerLocation : order.designerLocation}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`flex items-center ${status.color}`}>
                              {status.icon}
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            ${order.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <Button 
                              onClick={() => handleViewOrder(order.id)} 
                              size="sm"
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;