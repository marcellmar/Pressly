import React, { useState } from 'react';
import './SupplyChainStyles.css';
import { 
  MapPin, 
  X, 
  Recycle, 
  Box, 
  TruckIcon, 
  Check, 
  Info, 
  AlertTriangle 
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { UnsplashImage } from '../ui/image';
import { getReliableImageUrl, getTypedPlaceholder } from '../../utils/imageUtils';

/**
 * Supply Chain Modal Component
 * 
 * Displays detailed information about the material sources, local partnerships,
 * and sustainability metrics for a matched producer.
 */
const SupplyChainModal = ({ isOpen, onClose, producer }) => {
  const [activeTab, setActiveTab] = useState('materials');
  
  if (!isOpen) return null;

  // Default data if producer doesn't have specific supply chain information
  const supplyChainData = producer?.supplyChain || {
    materialSources: [
      { name: 'Chicago Organic Textiles', type: 'organic cotton', location: 'Chicago, IL', distance: '5 miles', tags: ['Organic'] },
      { name: 'Chicago Garment District', type: 'garment fabrics', location: 'Chicago, IL', distance: '4 miles', tags: [] }
    ],
    sustainabilityScore: producer?.sustainabilityScore || 92,
    localPartnerships: [
      { name: 'Local Craftsman Guild', type: 'Skilled workforce', distance: '2 miles' },
      { name: 'Chicago Materials Recycling', type: 'Waste reduction', distance: '3 miles' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chicago Garment Printers Supply Chain</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="rounded-lg overflow-hidden h-40 w-full sm:w-1/3">
              <UnsplashImage 
                src={getReliableImageUrl('producer', producer.id || 'chain', { width: 400, height: 300 })}
                alt={producer?.name || 'Producer'}
                className="w-full h-full"
                fallbackSrc={getTypedPlaceholder('producer', 400, 300)}
              />
            </div>
            <div className="w-full sm:w-2/3">
              <p className="text-gray-600">
                View material sources, local partnerships, and sustainability information
              </p>

              {/* Sustainability Score */}
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Sustainability Score</h3>
                  <span className={`text-2xl font-bold ${
                    supplyChainData.sustainabilityScore >= 90 ? 'text-green-600' : 
                    supplyChainData.sustainabilityScore >= 70 ? 'text-blue-600' :
                    supplyChainData.sustainabilityScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {supplyChainData.sustainabilityScore}/100
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      supplyChainData.sustainabilityScore >= 90 ? 'bg-green-500' : 
                      supplyChainData.sustainabilityScore >= 70 ? 'bg-blue-500' :
                      supplyChainData.sustainabilityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${supplyChainData.sustainabilityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button 
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'materials' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('materials')}
            >
              Material Sources
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'partnerships' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('partnerships')}
            >
              Local Partnerships
            </button>
          </div>

          {/* Material Sources Tab */}
          {activeTab === 'materials' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Material Sources</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {supplyChainData.materialSources.map((source, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-12 w-12 rounded overflow-hidden">
                          <UnsplashImage 
                            src={getReliableImageUrl('general', `material-${source.name}-${index}`, { width: 100, height: 100 })}
                            alt={source.name}
                            className="w-full h-full object-cover"
                            fallbackSrc={getTypedPlaceholder('general', 100, 100, source.name)}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-gray-600 text-sm">
                            {source.type}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-gray-50">
                        <MapPin className="h-3 w-3 mr-1" />
                        {source.distance}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {source.location}
                    </p>
                    
                    {source.tags && source.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {source.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} className={tag === 'Organic' ? 'bg-green-100 text-green-800' : ''}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Local Partnerships Tab */}
          {activeTab === 'partnerships' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Local Partnerships</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {supplyChainData.localPartnerships.map((partner, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-12 w-12 rounded overflow-hidden">
                          <UnsplashImage 
                            src={getReliableImageUrl('general', `partner-${partner.name}-${index}`, { width: 100, height: 100 })}
                            alt={partner.name}
                            className="w-full h-full object-cover"
                            fallbackSrc={getTypedPlaceholder('general', 100, 100, partner.name)}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{partner.name}</h4>
                          <p className="text-gray-600 text-sm">{partner.type}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-gray-50">
                        <MapPin className="h-3 w-3 mr-1" />
                        {partner.distance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={onClose} variant="outline" className="mr-2">
            Close
          </Button>
          <Button className="bg-primary text-white">
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainModal;