/**
 * Consumer API Service for ZUO Integration
 * 
 * This service handles consumer-specific API endpoints and data transformations
 * for the simplified ZUO interface.
 */

import { getAllProducers } from './producers';
import { calculateZuoLevel, hasFeature } from '../models/userExtensions';
import { getCurrentUser } from './auth/auth';

/**
 * Calculate a fake "AI Match Score" for producers
 * @param {Object} producer - Producer object
 * @param {Object} design - Design requirements
 * @returns {number} - Match score between 0-100
 */
const calculateMatchScore = (producer, design = {}) => {
  let score = 70; // Base score
  
  // Boost for high ratings
  if (producer.rating >= 4.8) score += 10;
  else if (producer.rating >= 4.5) score += 5;
  
  // Boost for fast turnaround
  if (producer.turnaroundDays <= 3) score += 10;
  else if (producer.turnaroundDays <= 7) score += 5;
  
  // Boost for sustainability (if design requires it)
  if (design.requiresSustainability && producer.sustainable) score += 15;
  
  // Randomize slightly for realism
  score += Math.floor(Math.random() * 10) - 5;
  
  return Math.min(100, Math.max(60, score));
};

/**
 * Simplify delivery time for consumers
 * @param {string} turnaround - Original turnaround time
 * @returns {string} - Simplified delivery time
 */
const simplifyDeliveryTime = (turnaround) => {
  const days = parseInt(turnaround);
  if (days <= 2) return 'Express (1-2 days)';
  if (days <= 5) return 'Fast (3-5 days)';
  if (days <= 10) return 'Standard (7-10 days)';
  return 'Extended (10+ days)';
};

/**
 * Generate consumer-friendly description
 * @param {Object} producer - Producer object
 * @returns {string} - Simple description
 */
const generateSimpleDescription = (producer) => {
  const specialties = producer.specialties.slice(0, 2).join(' & ');
  const sustainable = producer.sustainable ? 'Eco-friendly ' : '';
  return `${sustainable}printing specialist in ${specialties}`;
};

/**
 * Map technical status to consumer-friendly language
 * @param {string} status - Technical order status
 * @returns {string} - Consumer-friendly status
 */
const mapStatusToConsumerLanguage = (status) => {
  const statusMap = {
    'pending': 'Order received',
    'confirmed': 'Confirmed',
    'in_production': 'Being made',
    'quality_check': 'Quality check',
    'shipped': 'On the way',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

/**
 * Calculate order progress percentage
 * @param {Object} order - Order object
 * @returns {number} - Progress percentage
 */
const calculateProgressPercentage = (order) => {
  const statusProgress = {
    'pending': 10,
    'confirmed': 25,
    'in_production': 50,
    'quality_check': 75,
    'shipped': 90,
    'delivered': 100,
    'cancelled': 0
  };
  return statusProgress[order.status] || 0;
};

/**
 * Transform producer data for consumer interface
 * @param {Object} producer - Original producer object
 * @param {Object} design - Design requirements (optional)
 * @returns {Object} - Simplified producer data
 */
export const simplifyProducerForConsumer = (producer, design = {}) => ({
  id: producer.id,
  name: producer.businessName.replace(/LLC|Inc|Corp/gi, '').trim(),
  simple_rating: Math.round(producer.rating * 10) / 10,
  delivery_simple: simplifyDeliveryTime(producer.turnaround),
  price_display: producer.priceRange,
  distance_display: `${producer.distance} MI`,
  available_now: producer.availabilityPercent > 30,
  ai_match_score: calculateMatchScore(producer, design),
  consumer_friendly_description: generateSimpleDescription(producer),
  imageUrl: producer.imageUrl,
  sustainable: producer.sustainable,
  // Keep original data for when user wants details
  _original: producer
});

/**
 * Transform order data for consumer interface
 * @param {Object} order - Original order object
 * @returns {Object} - Simplified order data
 */
export const simplifyOrderForConsumer = (order) => ({
  id: order.id,
  status_simple: mapStatusToConsumerLanguage(order.status),
  progress_percentage: calculateProgressPercentage(order),
  delivery_estimate: order.estimated_delivery || 'Calculating...',
  tracking_available: !!order.tracking_number,
  can_contact_producer: false, // Hide complexity initially
  producer_name: order.producer?.businessName?.replace(/LLC|Inc|Corp/gi, '').trim() || 'Producer',
  order_total: order.total || 0,
  items_count: order.items?.length || 0,
  created_date: new Date(order.created_at).toLocaleDateString(),
  // Keep original data for details view
  _original: order
});

/**
 * Get producers filtered for consumer interface
 * @param {Object} filters - Filter options
 * @param {Object} user - Current user
 * @returns {Promise<Array>} - Filtered and simplified producers
 */
export const getConsumerProducers = async (filters = {}) => {
  const user = getCurrentUser();
  const userLevel = calculateZuoLevel(user);
  
  // Get all producers
  let producers = await getAllProducers(filters);
  
  // Filter for consumer-friendly producers
  producers = producers.filter(p => {
    // Only show producers with good ratings for new users
    if (userLevel === 1 && p.rating < 4.5) return false;
    
    // Only show available producers
    if (p.availabilityPercent < 20) return false;
    
    return true;
  });
  
  // Sort by match score (fake AI)
  producers.sort((a, b) => {
    const scoreA = calculateMatchScore(a, filters.design);
    const scoreB = calculateMatchScore(b, filters.design);
    return scoreB - scoreA;
  });
  
  // Limit based on user level
  const maxProducers = userLevel >= 3 ? 4 : userLevel >= 2 ? 2 : 1;
  producers = producers.slice(0, maxProducers);
  
  // Transform for consumer interface
  return producers.map(p => simplifyProducerForConsumer(p, filters.design));
};

/**
 * Create a consumer order with simplified flow
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} - Created order
 */
export const createConsumerOrder = async (orderData) => {
  const user = getCurrentUser();
  
  // Add consumer-specific metadata
  const consumerOrder = {
    ...orderData,
    interface_source: 'zuo',
    consumer_simplified: true,
    user_id: user.id,
    user_level: calculateZuoLevel(user),
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  
  // If auto-select is enabled, pick the best producer
  if (orderData.auto_select_producer) {
    const producers = await getConsumerProducers({ design: orderData.design });
    if (producers.length > 0) {
      consumerOrder.producer_id = producers[0].id;
      consumerOrder.auto_selected_producer = true;
    }
  }
  
  // Mock order creation (in real app, this would call backend)
  const createdOrder = {
    id: generateOrderId(),
    ...consumerOrder,
    estimated_delivery: calculateDeliveryDate(consumerOrder.producer_id),
    total: calculateOrderTotal(consumerOrder)
  };
  
  // Store in localStorage (mock database)
  storeOrder(createdOrder);
  
  // Return simplified version
  return simplifyOrderForConsumer(createdOrder);
};

/**
 * Get consumer's order history
 * @returns {Promise<Array>} - Simplified order history
 */
export const getConsumerOrders = async () => {
  const user = getCurrentUser();
  if (!user) return [];
  
  // Get orders from localStorage (mock database)
  const allOrders = JSON.parse(localStorage.getItem('pressly_orders') || '[]');
  
  // Filter user's orders
  const userOrders = allOrders.filter(order => order.user_id === user.id);
  
  // Sort by date (newest first)
  userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // Transform for consumer interface
  return userOrders.map(order => simplifyOrderForConsumer(order));
};

// Helper functions
const generateOrderId = () => {
  return 'order_' + Math.random().toString(36).substring(2, 15);
};

const calculateDeliveryDate = (producerId) => {
  // Mock delivery calculation
  const days = Math.floor(Math.random() * 7) + 3;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate.toLocaleDateString();
};

const calculateOrderTotal = (order) => {
  // Mock price calculation
  const basePrice = 25;
  const quantity = order.quantity || 1;
  return (basePrice * quantity).toFixed(2);
};

const storeOrder = (order) => {
  const orders = JSON.parse(localStorage.getItem('pressly_orders') || '[]');
  orders.push(order);
  localStorage.setItem('pressly_orders', JSON.stringify(orders));
};