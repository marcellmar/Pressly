/**
 * Local Business Data Service
 * 
 * This module provides functions to save and retrieve business license data locally,
 * ensuring data is available even when the API is not accessible.
 */

import { fetchPrintingBusinessLicenses, transformLicenseDataToProducers } from './chicagoLicense';
import { getOpenStreetMapProducers, transformOSMDataToProducers } from './openStreetMapData';

const LOCAL_STORAGE_KEY = 'pressly_chicago_business_data';
const LAST_UPDATED_KEY = 'pressly_chicago_business_data_updated';
const CACHE_EXPIRY_DAYS = 7; // Cache expires after 7 days

/**
 * Save business license data to local storage
 * @param {Array} data - The business license data to save
 * @returns {boolean} - Success indicator
 */
export const saveBusinessDataLocally = (data) => {
  try {
    // Store the data and timestamp
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Failed to save business data locally:', error);
    return false;
  }
};

/**
 * Retrieve business license data from local storage
 * @returns {Array|null} - The cached business data or null if not found or expired
 */
export const getLocalBusinessData = () => {
  try {
    // Get timestamp of when data was last updated
    const lastUpdated = localStorage.getItem(LAST_UPDATED_KEY);
    
    // If we have no timestamp, data doesn't exist
    if (!lastUpdated) {
      return null;
    }
    
    // Check if cache has expired
    const lastUpdatedDate = new Date(lastUpdated);
    const expiryDate = new Date(lastUpdatedDate);
    expiryDate.setDate(expiryDate.getDate() + CACHE_EXPIRY_DAYS);
    
    if (new Date() > expiryDate) {
      // Cache has expired, clear it
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LAST_UPDATED_KEY);
      return null;
    }
    
    // Get and parse the data
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawData) {
      return null;
    }
    
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Failed to retrieve local business data:', error);
    return null;
  }
};

/**
 * Clear the local business data cache
 */
export const clearLocalBusinessData = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LAST_UPDATED_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear local business data:', error);
    return false;
  }
};

/**
 * Get combined business data from multiple sources with fallback to local cache
 * @param {Object} params - Parameters for the API request
 * @param {boolean} forceRefresh - Force refresh from API even if local data exists
 * @returns {Promise} - Promise with the combined business data
 */
export const getBusinessData = async (params = {}, forceRefresh = false) => {
  try {
    // First try to get from local storage if not forcing refresh
    if (!forceRefresh) {
      const localData = getLocalBusinessData();
      if (localData) {
        console.log('Using cached business data');
        return localData;
      }
    }
    
    console.log('Fetching business data from multiple sources');
    
    try {
      // Get data from both sources in parallel for faster loading
      console.log('Fetching data from all sources');
      
      // Get data from OpenStreetMap (this is synchronous since it's mock data)
      const osmRawData = getOpenStreetMapProducers();
      const osmData = transformOSMDataToProducers(osmRawData);
      
      let licenseData = [];
      try {
        // Try to fetch from Chicago business license API
        console.log('Fetching data from Chicago business license API');
        const apiData = await fetchPrintingBusinessLicenses(params);
        licenseData = transformLicenseDataToProducers(apiData);
      } catch (apiError) {
        console.warn('Chicago API error, continuing with OSM data only:', apiError);
        // Just continue with OSM data
      }
      
      // Ensure valid location data for all producers
      // Fix any producers that might have missing or invalid location data
      const validateLocationData = (producers) => {
        return producers.map(producer => {
          // Skip if already has valid coordinates
          if (producer.location && 
              typeof producer.location.lat === 'number' && !isNaN(producer.location.lat) &&
              typeof producer.location.lng === 'number' && !isNaN(producer.location.lng)) {
            return producer;
          }
          
          // Create location object if missing
          if (!producer.location) {
            producer.location = {};
          }
          
          // Try to get coordinates from different properties
          if (producer.lat && producer.lng) {
            producer.location.lat = parseFloat(producer.lat);
            producer.location.lng = parseFloat(producer.lng);
          } else if (producer.latitude && producer.longitude) {
            producer.location.lat = parseFloat(producer.latitude);
            producer.location.lng = parseFloat(producer.longitude);
          } else {
            // Create random location in Chicago if all else fails
            console.warn(`Creating random Chicago location for ${producer.name || 'producer'}`);
            producer.location.lat = 41.8781 + (Math.random() * 0.1 - 0.05);
            producer.location.lng = -87.6298 + (Math.random() * 0.1 - 0.05);
          }
          
          // Ensure all location coordinates are numbers
          producer.location.lat = typeof producer.location.lat === 'number' ? 
            producer.location.lat : parseFloat(producer.location.lat);
          producer.location.lng = typeof producer.location.lng === 'number' ? 
            producer.location.lng : parseFloat(producer.location.lng);
            
          // Final validation check
          if (isNaN(producer.location.lat) || isNaN(producer.location.lng)) {
            console.error(`Failed to create valid coordinates for ${producer.name}`);
            // Last resort fallback
            producer.location.lat = 41.8781;
            producer.location.lng = -87.6298;
          }
          
          return producer;
        });
      };
      
      // Validate and fix location data
      const validatedLicenseData = validateLocationData(licenseData);
      const validatedOSMData = validateLocationData(osmData);
      
      // Combine data from all sources - force include all data from various sources
      // This ensures we get all producers, including our hard-coded ones
      const combinedData = [
        ...validatedLicenseData,
        ...validatedOSMData,
      ];
      
      // Log count of producers for debugging
      console.log(`Total producers count: ${combinedData.length} (${validatedLicenseData.length} license + ${validatedOSMData.length} OSM)`);

      // Remove duplicates if any (keeping first instance of each business)
      const deduplicatedData = [];
      const businessNames = new Set();
      
      for (const business of combinedData) {
        if (business.name && !businessNames.has(business.name.toLowerCase())) {
          businessNames.add(business.name.toLowerCase());
          deduplicatedData.push(business);
        }
      }
      
      console.log(`After deduplication: ${deduplicatedData.length} producers`);
      
      // Update the combined data to use the deduplicated list
      const finalData = deduplicatedData;
      
      // Save the final data locally
      saveBusinessDataLocally(finalData);
      
      return finalData;
    } catch (error) {
      console.error('Error fetching from APIs:', error);
      
      // If the APIs fail, try to use OpenStreetMap data as a fallback
      console.log('Falling back to OpenStreetMap data only');
      const osmRawData = getOpenStreetMapProducers();
      const osmData = transformOSMDataToProducers(osmRawData);
      
      // Save the OSM data locally
      saveBusinessDataLocally(osmData);
      
      return osmData;
    }
  } catch (error) {
    console.error('Failed to get business data:', error);
    
    // If everything fails, try to fall back to local data even if forcing refresh
    const localData = getLocalBusinessData();
    if (localData) {
      console.log('All methods failed, using cached business data');
      return localData;
    }
    
    // Last resort - force a direct call to both data sources to get all producers
    console.log('EMERGENCY: Attempting direct data collection from source files');
    
    try {
      // Import both data sources directly
      const osmRawData = getOpenStreetMapProducers();
      const osmData = transformOSMDataToProducers(osmRawData);
      
      // Get license data via alternative method
      const licenseDataDirect = await fetchPrintingBusinessLicenses({ limit: 999 });
      const licenseData = transformLicenseDataToProducers(licenseDataDirect);
      
      // Combine all data
      const emergencyData = [...licenseData, ...osmData];
      console.log(`EMERGENCY: Retrieved ${emergencyData.length} producers directly`);
      
      return emergencyData;
    } catch (finalError) {
      console.error('All data retrieval methods failed:', finalError);
      
      // Absolute last resort - return a minimal set of data
      return [
        {
          id: "emergency-fallback-1",
          name: "Chicago Printing Services",
          rating: "4.5",
          reviews: 27,
          location: {
            lat: 41.8781,
            lng: -87.6298,
            city: "Chicago",
            address: "123 Main St, Chicago, IL 60601",
            neighborhood: "Downtown",
            zip: "60601"
          },
          capabilities: ["Digital Printing", "Offset Printing"],
          availabilityPercent: 75,
          sustainabilityScore: 80,
          verificationSources: ["Emergency Backup Data"]
        }
      ];
    }
  }
};

/**
 * Check if business data needs to be refreshed
 * @returns {boolean} - True if data needs to be refreshed
 */
export const needsRefresh = () => {
  try {
    // Get timestamp of when data was last updated
    const lastUpdated = localStorage.getItem(LAST_UPDATED_KEY);
    
    // If we have no timestamp, data doesn't exist and needs refresh
    if (!lastUpdated) {
      return true;
    }
    
    // Check when data was last updated
    const lastUpdatedDate = new Date(lastUpdated);
    const refreshDate = new Date(lastUpdatedDate);
    refreshDate.setDate(refreshDate.getDate() + 1); // Refresh after 1 day
    
    // If data is older than 1 day, suggest refresh
    return new Date() > refreshDate;
  } catch (error) {
    console.error('Error checking if business data needs refresh:', error);
    return true; // If in doubt, suggest refresh
  }
};

export default {
  getBusinessData,
  saveBusinessDataLocally,
  getLocalBusinessData,
  clearLocalBusinessData,
  needsRefresh
};