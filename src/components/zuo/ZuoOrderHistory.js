/**
 * ZUO Order History Component
 * 
 * Simplified order tracking for consumers
 */

import React, { useState, useEffect } from 'react';
import { getConsumerOrders } from '../../services/consumerApi';

const ZuoOrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const userOrders = await getConsumerOrders();
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="zuo-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="zuo-empty-state">
        <div className="empty-icon">📦</div>
        <h3>No orders yet</h3>
        <p>Your orders will appear here once you create them</p>
      </div>
    );
  }

  return (
    <div className="zuo-order-history">
      <h2>Your Orders</h2>
      
      <div className="zuo-orders-list">
        {orders.map((order) => (
          <div key={order.id} className="zuo-order-card">
            {/* Order Header */}
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id.slice(-6)}</h3>
                <p className="order-date">{order.created_date}</p>
              </div>
              <div className="order-status">
                <span className={`status-badge ${order._original?.status || 'pending'}`}>
                  {order.status_simple}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="order-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${order.progress_percentage}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {order.progress_percentage}% Complete
              </p>
            </div>

            {/* Order Details */}
            <div className="order-details">
              <div className="detail-row">
                <span className="label">Printer:</span>
                <span className="value">{order.producer_name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Items:</span>
                <span className="value">{order.items_count}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total:</span>
                <span className="value">${order.order_total}</span>
              </div>
              <div className="detail-row">
                <span className="label">Delivery:</span>
                <span className="value">{order.delivery_estimate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="order-actions">
              {order.tracking_available && (
                <button className="zuo-btn-secondary">
                  Track Order
                </button>
              )}
              <button className="zuo-btn-text">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZuoOrderHistory;