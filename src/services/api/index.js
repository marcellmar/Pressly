/**
 * API Services Index
 * Exports all API integration services
 */

import aiApi from './aiApi';
import producersApi from './producersApi';

export {
  aiApi,
  producersApi
};

export default {
  ai: aiApi,
  producers: producersApi
};