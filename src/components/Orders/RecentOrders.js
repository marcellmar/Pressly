import React, { useState, useEffect } from 'react';
import OrderDetails from './OrderDetails';

const RecentOrders = ({ userRole }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Sample orders data
  const mockDesignerOrders = [
    {
      id: 'order123',
      name: 'Spring Marketing Campaign Posters',
      producer: 'PrintMasters Inc.',
      status: 'in_production',
      date: '2025-04-05',
      unreadMessages: 1
    },
    {
      id: 'order124',
      name: 'Business Cards - CEO Edition',
      producer: 'Quality Prints',
      status: 'design_approved',
      date: '2025-04-02',
      unreadMessages: 0
    },
    {
      id: 'order125',
      name: 'Annual Report - 2024',
      producer: 'Corporate Print Solutions',
      status: 'completed',
      date: '2025-03-28',
      unreadMessages: 0
    }
  ];
  
  const mockProducerOrders = [
    {
      id: 'order123',
      name: 'Spring Marketing Campaign Posters',
      designer: 'Sarah Design Studio',
      status: 'in_production',
      date: '2025-04-05',
      unreadMessages: 0
    },
    {
      id: 'order126',
      name: 'Restaurant Menu Redesign',
      designer: 'FoodFocus Design',
      status: 'order_placed',
      date: '2025-04-07',
      unreadMessages: 2
    },
    {
      id: 'order127',
      name: 'Conference Badges',
      designer: 'Event Graphics Inc.',
      status: 'ready_for_pickup',
      date: '2025-04-01',
      unreadMessages: 0
    }
  ];
  
  useEffect(() => {
    // In a real app, you would fetch orders from your API
    // For this demo, we'll just use the mock data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (userRole === 'designer') {
        setOrders(mockDesignerOrders);
      } else if (userRole === 'producer') {
        setOrders(mockProducerOrders);
      }
      setLoading(false);
    }, 800);
  }, [userRole]);
  
  // Helper function to get status badge style
  const getStatusBadgeStyle = (status) => {
    const statusStyles = {
      order_placed: { bg: '#e9ecef', color: '#495057' },
      design_approved: { bg: '#d1ecf1', color: '#0c5460' },
      in_production: { bg: '#fff3cd', color: '#856404' },
      quality_check: { bg: '#d4edda', color: '#155724' },
      ready_for_pickup: { bg: '#cce5ff', color: '#004085' },
      shipped: { bg: '#cce5ff', color: '#004085' },
      delivered: { bg: '#d4edda', color: '#155724' },
      completed: { bg: '#d4edda', color: '#155724' },
      on_hold: { bg: '#f8d7da', color: '#721c24' },
      cancelled: { bg: '#f8d7da', color: '#721c24' }
    };
    
    return statusStyles[status] || { bg: '#e9ecef', color: '#495057' };
  };
  
  // Helper function to get friendly status name
  const getStatusName = (status) => {
    const statusNames = {
      order_placed: 'Order Placed',
      design_approved: 'Design Approved',
      in_production: 'In Production',
      quality_check: 'Quality Check',
      ready_for_pickup: 'Ready for Pickup',
      shipped: 'Shipped',
      delivered: 'Delivered',
      completed: 'Completed',
      on_hold: 'On Hold',
      cancelled: 'Cancelled'
    };
    
    return statusNames[status] || status;
  };
  
  const handleViewOrder = (orderId) => {
    setSelectedOrder(orderId);
  };
  
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };
  
  return (
    <div className="recent-orders">
      <h2 style={{ marginBottom: '1.5rem' }}>Recent Orders</h2>
      
      {selectedOrder ? (
        <OrderDetails 
          orderId={selectedOrder} 
          onClose={handleCloseOrderDetails} 
        />
      ) : (
        <>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <i className="fas fa-box-open" style={{ fontSize: '3rem', color: '#adb5bd', marginBottom: '1rem', display: 'block' }}></i>
              <h3 style={{ marginBottom: '0.5rem' }}>No Orders Yet</h3>
              <p style={{ color: '#6c757d' }}>
                {userRole === 'designer' 
                  ? 'Start by creating a design and finding a producer.' 
                  : 'You don\'t have any production orders yet.'}
              </p>
            </div>
          ) : (
            <div className="table-container" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Order Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                      {userRole === 'designer' ? 'Producer' : 'Designer'}
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {order.name}
                          {order.unreadMessages > 0 && (
                            <span style={{ 
                              display: 'inline-block',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              fontSize: '0.75rem',
                              textAlign: 'center',
                              lineHeight: '20px',
                              marginLeft: '0.5rem'
                            }}>
                              {order.unreadMessages}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {userRole === 'designer' ? order.producer : order.designer}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          backgroundColor: getStatusBadgeStyle(order.status).bg,
                          color: getStatusBadgeStyle(order.status).color
                        }}>
                          {getStatusName(order.status)}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{order.date}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleViewOrder(order.id)} 
                          className="btn"
                          style={{ 
                            padding: '0.25rem 0.5rem', 
                            fontSize: '0.875rem'
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentOrders;