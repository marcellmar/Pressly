/**
 * User Model Extensions for ZUO-Pressly Integration
 * 
 * This file extends the existing user model to support dual-platform functionality
 * with progressive feature unlocking and consumer/professional interfaces.
 */

// User interface preferences
export const INTERFACE_TYPES = {
  ZUO_CONSUMER: 'zuo_consumer',
  PRESSLY_PROFESSIONAL: 'pressly_professional'
};

// ZUO user levels
export const ZUO_LEVELS = {
  BASIC_CONSUMER: 1,      // New users, single producer, simplified flow
  RETURNING_USER: 2,      // 3+ orders, can choose between 2 producers
  POWER_USER: 3,          // 5+ orders, advanced features, 4 producers
  PRODUCER_ELIGIBLE: 4    // 10+ orders, can switch to producer mode
};

// Extended user schema fields
export const USER_EXTENSIONS = {
  // Interface preferences
  interface_preference: INTERFACE_TYPES.ZUO_CONSUMER,
  zuo_level: ZUO_LEVELS.BASIC_CONSUMER,
  unlock_features: [],
  consumer_orders_count: 0,
  producer_mode_eligible: false,
  last_interface_used: 'zuo',
  simplified_onboarding: true,
  
  // Additional tracking
  first_order_date: null,
  last_order_date: null,
  total_spent: 0,
  preferred_producers: [],
  design_preferences: {
    colors: [],
    styles: [],
    materials: []
  },
  
  // Progressive feature flags
  features: {
    can_create_basic_orders: true,
    can_view_single_producer: true,
    can_choose_between_producers: false,
    can_view_order_history: false,
    can_access_advanced_editing: false,
    can_view_all_producer_details: false,
    can_use_bulk_ordering: false,
    can_access_producer_mode: false,
    can_switch_to_producer_dashboard: false
  }
};

/**
 * Calculate ZUO level based on user activity
 * @param {Object} user - User object
 * @returns {number} - ZUO level (1-4)
 */
export const calculateZuoLevel = (user) => {
  const orderCount = user.consumer_orders_count || 0;
  
  if (orderCount >= 10) return ZUO_LEVELS.PRODUCER_ELIGIBLE;
  if (orderCount >= 5) return ZUO_LEVELS.POWER_USER;
  if (orderCount >= 3) return ZUO_LEVELS.RETURNING_USER;
  return ZUO_LEVELS.BASIC_CONSUMER;
};

/**
 * Get unlocked features based on user level
 * @param {number} level - ZUO level
 * @returns {Object} - Feature access object
 */
export const getUnlockedFeatures = (level) => {
  const features = {
    // Level 1: Basic consumer (always available)
    can_create_basic_orders: true,
    can_view_single_producer: true,
    
    // Level 2: Returning user
    can_choose_between_producers: level >= ZUO_LEVELS.RETURNING_USER,
    can_view_order_history: level >= ZUO_LEVELS.RETURNING_USER,
    
    // Level 3: Power user
    can_access_advanced_editing: level >= ZUO_LEVELS.POWER_USER,
    can_view_all_producer_details: level >= ZUO_LEVELS.POWER_USER,
    can_use_bulk_ordering: level >= ZUO_LEVELS.POWER_USER,
    
    // Level 4: Producer eligible
    can_access_producer_mode: level >= ZUO_LEVELS.PRODUCER_ELIGIBLE,
    can_switch_to_producer_dashboard: level >= ZUO_LEVELS.PRODUCER_ELIGIBLE
  };
  
  return features;
};

/**
 * Determine if user should see ZUO or Pressly interface
 * @param {Object} user - User object
 * @returns {string} - Interface type
 */
export const determineInterface = (user) => {
  // Always respect user preference if set
  if (user.interface_preference) {
    return user.interface_preference;
  }
  
  // New users default to ZUO
  if (!user.consumer_orders_count || user.consumer_orders_count === 0) {
    return INTERFACE_TYPES.ZUO_CONSUMER;
  }
  
  // Existing designers/producers stay in Pressly
  if (user.role === 'producer' || user.role === 'designer') {
    return INTERFACE_TYPES.PRESSLY_PROFESSIONAL;
  }
  
  // Default to ZUO for consumers
  return INTERFACE_TYPES.ZUO_CONSUMER;
};

/**
 * Update user after completing an order
 * @param {Object} user - User object
 * @returns {Object} - Updated user object
 */
export const updateUserProgress = (user) => {
  const updatedUser = { ...user };
  
  // Increment order count
  updatedUser.consumer_orders_count = (user.consumer_orders_count || 0) + 1;
  
  // Update dates
  if (!updatedUser.first_order_date) {
    updatedUser.first_order_date = new Date().toISOString();
  }
  updatedUser.last_order_date = new Date().toISOString();
  
  // Recalculate level
  const newLevel = calculateZuoLevel(updatedUser);
  updatedUser.zuo_level = newLevel;
  
  // Update features
  updatedUser.features = getUnlockedFeatures(newLevel);
  
  // Check producer eligibility
  if (newLevel === ZUO_LEVELS.PRODUCER_ELIGIBLE) {
    updatedUser.producer_mode_eligible = true;
  }
  
  return updatedUser;
};

/**
 * Extend existing user object with ZUO fields
 * @param {Object} user - Existing user object
 * @returns {Object} - Extended user object
 */
export const extendUserWithZuoFields = (user) => {
  const level = calculateZuoLevel(user);
  
  return {
    ...user,
    ...USER_EXTENSIONS,
    zuo_level: level,
    features: getUnlockedFeatures(level),
    interface_preference: determineInterface(user)
  };
};

/**
 * Check if user has unlocked a specific feature
 * @param {Object} user - User object
 * @param {string} feature - Feature name
 * @returns {boolean} - Whether feature is unlocked
 */
export const hasFeature = (user, feature) => {
  return user.features?.[feature] === true;
};

/**
 * Get feature unlock progress
 * @param {Object} user - User object
 * @returns {Object} - Progress information
 */
export const getFeatureProgress = (user) => {
  const currentLevel = user.zuo_level || ZUO_LEVELS.BASIC_CONSUMER;
  const orderCount = user.consumer_orders_count || 0;
  
  return {
    current_level: currentLevel,
    current_orders: orderCount,
    next_level: currentLevel < 4 ? currentLevel + 1 : null,
    orders_to_next_level: currentLevel === 1 ? 3 - orderCount :
                          currentLevel === 2 ? 5 - orderCount :
                          currentLevel === 3 ? 10 - orderCount : 0,
    progress_percentage: currentLevel === 1 ? (orderCount / 3) * 100 :
                        currentLevel === 2 ? (orderCount / 5) * 100 :
                        currentLevel === 3 ? (orderCount / 10) * 100 : 100
  };
};