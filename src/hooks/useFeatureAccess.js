/**
 * Feature Access Hook
 * 
 * Provides easy access to user's ZUO level and feature permissions
 */

import { useMemo } from 'react';
import { useAuth } from '../services/auth/AuthContext';
import { calculateZuoLevel, getUnlockedFeatures, hasFeature } from '../models/userExtensions';

export const useFeatureAccess = () => {
  const { currentUser } = useAuth();
  
  return useMemo(() => {
    if (!currentUser) {
      return {
        level: 1,
        features: getUnlockedFeatures(1),
        hasFeature: () => false,
        canAccessProducerMode: false
      };
    }
    
    const level = calculateZuoLevel(currentUser);
    const features = getUnlockedFeatures(level);
    
    return {
      level,
      features,
      hasFeature: (featureName) => hasFeature(currentUser, featureName),
      canAccessProducerMode: features.can_access_producer_mode,
      // Convenience methods
      canChooseProducers: features.can_choose_between_producers,
      canViewOrderHistory: features.can_view_order_history,
      canUseAdvancedEditing: features.can_access_advanced_editing,
      canViewAllProducers: features.can_view_all_producer_details,
      canUseBulkOrdering: features.can_use_bulk_ordering
    };
  }, [currentUser]);
};