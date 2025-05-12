import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageCenter from '../MessagingSystem/MessageCenter';

const OrderDetails = ({ orderId, onClose }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  // Sample order data
  const mockOrder = {
    id: orderId || 'order123',
    name: 'Spring Marketing Campaign Posters',
    status: 'in_production',
    createdAt: '2025-04-05T14:30:00Z',
    updatedAt: '2025-04-07T09:15:00Z',
    estimatedCompletion: '2025-04-12T16:00:00Z',
    designer: {
      id: 'designer456',
      name: 'Sarah Design Studio',
      email: 'sarah@sarahdesign.com',
      phone: '(555) 123-4567',
      address: '123 Creative Way, San Francisco, CA 94107'
    },
    producer: {
      id: 'producer789',
      name: 'PrintMasters Inc.',
      email: 'orders@printmasters.com',
      phone: '(555) 987-6543',
      address: '456 Printing Ave, Chicago, IL 60603'
    },
    design: {
      id: 'design101',
      title: 'Spring Marketing Campaign Posters',
      description: 'Series of 4 promotional posters highlighting spring product line',
      specifications: {
        size: '24x36 inches',
        colors: 'CMYK full color',
        materials: '100lb gloss poster paper'
      }
    },
    production: {
      quantity: 500,
      unitPrice: 2.75,
      totalPrice: 1375.00,
      printMethod: 'Offset printing',
      finishOptions: ['Gloss coating'],
      notes: 'Needs to be bundled in sets of 50 for distribution'
    },
    shipping: {
      method: 'Ground',
      trackingNumber: '',
      estimatedDelivery: '2025-04-15',
      address: '800 Market St, San Francisco, CA 94102',
      recipient: 'Marketing Department, Attn: John Smith'
    },
    timeline: [
      {
        status: 'order_placed',
        timestamp: '2025-04-05T14:30:00Z',
        note: 'Order received and confirmed'
      },
      {
        status: 'design_approved',
        timestamp: '2025-04-06T11:45:00Z',
        note: 'Design files approved by production team'
      },
      {
        status: 'in_production',
        timestamp: '2025-04-07T09:15:00Z',
        note: 'Order moved to production queue'
      }
    ]
  };
  
  useEffect(() => {
    // In a real app, you would fetch the order details from your API
    // For this demo, we'll just use the mock data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 800);
  }, [orderId]);
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Helper function to format timestamps
  const formatTimestamp = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
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
  
  if (loading) {
    return (
      <div className="order-details-loading" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="order-details-error" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Order not found or there was an error loading the details.</p>
        <button onClick={onClose} className="btn" style={{ marginTop: '1rem' }}>
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="order-details" style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>{order.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: getStatusBadgeStyle(order.status).bg,
              color: getStatusBadgeStyle(order.status).color,
              marginRight: '1rem'
            }}>
              {getStatusName(order.status)}
            </span>
            <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>
              Order #{order.id}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="btn" style={{ backgroundColor: 'transparent', border: '1px solid #ddd', color: '#333' }}>
          Close
        </button>
      </div>
      
      <div className="order-tabs" style={{ borderBottom: '1px solid #dee2e6', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', marginBottom: '-1px' }}>
          {['details', 'timeline', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none',
                color: activeTab === tab ? 'var(--primary)' : '#6c757d',
                fontWeight: activeTab === tab ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 'details' && (
        <div className="order-details-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Design Information</h3>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Title</p>
                <p>{order.design.title}</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Description</p>
                <p>{order.design.description}</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Specifications</p>
                <p>Size: {order.design.specifications.size}</p>
                <p>Colors: {order.design.specifications.colors}</p>
                <p>Materials: {order.design.specifications.materials}</p>
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Production Information</h3>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Quantity</p>
                <p>{order.production.quantity} units</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Pricing</p>
                <p>Unit Price: ${order.production.unitPrice.toFixed(2)}</p>
                <p>Total Price: ${order.production.totalPrice.toFixed(2)}</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Print Method</p>
                <p>{order.production.printMethod}</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Finish Options</p>
                <p>{order.production.finishOptions.join(', ')}</p>
              </div>
              {order.production.notes && (
                <div className="detail-group" style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Production Notes</p>
                  <p>{order.production.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Designer Information</h3>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Name</p>
                <p>{order.designer.name}</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Contact Information</p>
                <p>Email: {order.designer.email}</p>
                <p>Phone: {order.designer.phone}</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Address</p>
                <p>{order.designer.address}</p>
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Producer Information</h3>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Name</p>
                <p>{order.producer.name}</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Contact Information</p>
                <p>Email: {order.producer.email}</p>
                <p>Phone: {order.producer.phone}</p>
              </div>
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Address</p>
                <p>{order.producer.address}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Shipping Information</h3>
            <div className="detail-group" style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Method</p>
              <p>{order.shipping.method}</p>
            </div>
            {order.shipping.trackingNumber && (
              <div className="detail-group" style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Tracking Number</p>
                <p>{order.shipping.trackingNumber}</p>
              </div>
            )}
            <div className="detail-group" style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Estimated Delivery</p>
              <p>{order.shipping.estimatedDelivery}</p>
            </div>
            <div className="detail-group" style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Shipping Address</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.recipient}</p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'timeline' && (
        <div className="order-timeline">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Order Timeline</h3>
          
          <div className="timeline-container" style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* Vertical line */}
            <div style={{ 
              position: 'absolute', 
              left: '8px', 
              top: '0', 
              bottom: '0', 
              width: '2px', 
              backgroundColor: '#dee2e6' 
            }}></div>
            
            {order.timeline.map((event, index) => (
              <div 
                key={index} 
                className="timeline-item" 
                style={{ 
                  position: 'relative', 
                  marginBottom: index === order.timeline.length - 1 ? '0' : '2rem',
                  paddingBottom: index === order.timeline.length - 1 ? '0' : '1rem'
                }}
              >
                {/* Timeline dot */}
                <div style={{ 
                  position: 'absolute', 
                  left: '-2rem', 
                  top: '0', 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  backgroundColor: index === order.timeline.length - 1 ? 'var(--primary)' : '#6c757d',
                  border: '2px solid white'
                }}></div>
                
                <div className="timeline-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: '0', fontSize: '1rem', fontWeight: '600' }}>
                      {getStatusName(event.status)}
                    </h4>
                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  {event.note && <p style={{ margin: '0', color: '#555' }}>{event.note}</p>}
                </div>
              </div>
            ))}
            
            {/* Estimated completion */}
            <div 
              className="timeline-item timeline-future" 
              style={{ 
                position: 'relative', 
                marginTop: '1rem', 
                paddingTop: '1rem', 
                borderTop: '1px dashed #dee2e6'
              }}
            >
              {/* Timeline dot */}
              <div style={{ 
                position: 'absolute', 
                left: '-2rem', 
                top: '1rem', 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                backgroundColor: '#e9ecef',
                border: '2px solid white'
              }}></div>
              
              <div className="timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#6c757d' }}>
                    Estimated Completion
                  </h4>
                  <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                    {formatTimestamp(order.estimatedCompletion)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'messages' && (
        <div className="order-messages">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Order Communication</h3>
          <MessageCenter 
            orderId={order.id} 
            designerId={order.designer.id} 
            producerId={order.producer.id} 
          />
        </div>
      )}
    </div>
  );
};

export default OrderDetails;