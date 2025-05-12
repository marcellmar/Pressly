import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ToastProvider } from '../../components/ui/toast/toast-provider';
import EnhancedProducerManager from '../../components/producers/EnhancedProducerManager';
import ProducerAvailabilityChart from '../../components/producers/ProducerAvailabilityChart';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';

// Import sample producers from the original Producers page
// In a real application, this would be fetched from an API
import { getPrinterImageUrl, getEcoFriendlyImageUrl } from '../../utils/unsplashUtils';

/**
 * Enhanced Producers page that uses our new API services
 */
const EnhancedProducers = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Toast provider for notifications */}
      <ToastProvider />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Find Print Producers</h1>
          <p className="text-gray-600 mt-1">Connect with local printing services that match your project needs</p>
        </div>
        <div>
          <Button className="bg-blue-600 hover:bg-blue-700">Add New Producer</Button>
        </div>
      </div>
      
      {/* Use our enhanced producer manager component */}
      <EnhancedProducerManager />
    </div>
  );
};

export default EnhancedProducers;
