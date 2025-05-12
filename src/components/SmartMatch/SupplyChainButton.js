import React, { useState } from 'react';
import { Recycle, X } from 'lucide-react';
import { Button } from '../ui/button';
import SupplyChainModal from './SupplyChainModal';

/**
 * Supply Chain Button Component
 * 
 * A button that opens a modal displaying detailed information about 
 * a producer's supply chain, material sources, and sustainability metrics.
 */
const SupplyChainButton = ({ producer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        onClick={openModal}
      >
        <Recycle className="h-3 w-3 mr-1" />
        View Supply Chain
      </Button>
      
      <SupplyChainModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        producer={producer}
      />
    </>
  );
};

export default SupplyChainButton;