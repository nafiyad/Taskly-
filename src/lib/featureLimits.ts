import { FeatureLimit } from '../types';

// Define feature limits for different subscription plans
export const FEATURE_LIMITS: Record<'free' | 'pro', FeatureLimit> = {
  free: {
    tasks: 20,
    habits: 5,
    focusSessions: 5,
    challenges: 1,
    themes: false,
    aiFeatures: false,
    dataExport: false,
    prioritySupport: false
  },
  pro: {
    tasks: Infinity,
    habits: Infinity,
    focusSessions: Infinity,
    challenges: Infinity,
    themes: true,
    aiFeatures: true,
    dataExport: true,
    prioritySupport: true
  }
};

// Check if a user has reached their limit for a specific feature
export const hasReachedLimit = (
  plan: 'free' | 'pro',
  feature: keyof FeatureLimit,
  currentCount: number
): boolean => {
  const limit = FEATURE_LIMITS[plan][feature];
  
  // If the limit is a boolean, return the opposite (true means no limit)
  if (typeof limit === 'boolean') {
    return !limit;
  }
  
  // If the limit is Infinity, the user hasn't reached the limit
  if (limit === Infinity) {
    return false;
  }
  
  // Otherwise, check if the current count has reached the limit
  return currentCount >= limit;
};

// Get the limit for a specific feature
export const getFeatureLimit = (
  plan: 'free' | 'pro',
  feature: keyof FeatureLimit
): number | boolean => {
  return FEATURE_LIMITS[plan][feature];
};

// Check if a feature is available for a plan
export const isFeatureAvailable = (
  plan: 'free' | 'pro',
  feature: keyof FeatureLimit
): boolean => {
  const limit = FEATURE_LIMITS[plan][feature];
  
  if (typeof limit === 'boolean') {
    return limit;
  }
  
  return limit > 0;
};