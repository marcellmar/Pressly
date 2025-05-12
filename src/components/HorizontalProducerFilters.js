import React from 'react';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';

const HorizontalProducerFilters = ({ onFiltersChange, initialFilters }) => {
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    onFiltersChange({ ...initialFilters, [filterName]: value });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Production capabilities section */}
      <div className="filter-group">
        <h3 className="text-sm font-semibold mb-3">Production Capabilities</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="garmentPrinting"
              checked={initialFilters.garmentPrintingServices}
              onCheckedChange={(checked) => handleFilterChange('garmentPrintingServices', checked)}
            />
            <label htmlFor="garmentPrinting" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Garment Printing</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="screenPrinting"
              checked={initialFilters.screenPrinting}
              onCheckedChange={(checked) => handleFilterChange('screenPrinting', checked)}
            />
            <label htmlFor="screenPrinting" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Screen Printing</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dtgPrinting"
              checked={initialFilters.dtgPrinting}
              onCheckedChange={(checked) => handleFilterChange('dtgPrinting', checked)}
            />
            <label htmlFor="dtgPrinting" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">DTG Printing</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="largeFormatPrinting"
              checked={initialFilters.largeFormatPrinting}
              onCheckedChange={(checked) => handleFilterChange('largeFormatPrinting', checked)}
            />
            <label htmlFor="largeFormatPrinting" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Large Format</label>
          </div>
        </div>
      </div>
      
      {/* Location and Supply Chain */}
      <div className="filter-group">
        <h3 className="text-sm font-semibold mb-3">Location</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="localSupplyChain"
              checked={initialFilters.localSupplyChain}
              onCheckedChange={(checked) => handleFilterChange('localSupplyChain', checked)}
            />
            <label htmlFor="localSupplyChain" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Local Supply Chain</label>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <label htmlFor="maxDistance" className="text-xs">Max Distance</label>
              <span className="text-xs">{initialFilters.maxDistance} miles</span>
            </div>
            <Slider
              id="maxDistance"
              min={5}
              max={50}
              step={5}
              value={[initialFilters.maxDistance]}
              disabled={!initialFilters.localSupplyChain}
              onValueChange={(value) => handleFilterChange('maxDistance', value[0])}
              className="h-3"
            />
          </div>
        </div>
      </div>
      
      {/* Materials and Sustainability */}
      <div className="filter-group">
        <h3 className="text-sm font-semibold mb-3">Sustainability</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recycledMaterials"
                checked={initialFilters.recycledMaterials}
                onCheckedChange={(checked) => handleFilterChange('recycledMaterials', checked)}
              />
              <label htmlFor="recycledMaterials" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Recycled</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="organicMaterials"
                checked={initialFilters.organicMaterials}
                onCheckedChange={(checked) => handleFilterChange('organicMaterials', checked)}
              />
              <label htmlFor="organicMaterials" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Organic</label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fscCertified"
                checked={initialFilters.fscCertified}
                onCheckedChange={(checked) => handleFilterChange('fscCertified', checked)}
              />
              <label htmlFor="fscCertified" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">FSC Certified</label>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <label htmlFor="sustainabilityScore" className="text-xs">Min. Sustainability</label>
              <span className="text-xs">{initialFilters.sustainabilityScore}</span>
            </div>
            <Slider
              id="sustainabilityScore"
              min={0}
              max={100}
              step={10}
              value={[initialFilters.sustainabilityScore]}
              onValueChange={(value) => handleFilterChange('sustainabilityScore', value[0])}
              className="h-3"
            />
          </div>
        </div>
      </div>
      
      {/* Price and Quality */}
      <div className="filter-group">
        <h3 className="text-sm font-semibold mb-3">Price and Quality</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="budgetFriendly"
              checked={initialFilters.budgetFriendly}
              onCheckedChange={(checked) => handleFilterChange('budgetFriendly', checked)}
            />
            <label htmlFor="budgetFriendly" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Budget</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premiumQuality"
              checked={initialFilters.premiumQuality}
              onCheckedChange={(checked) => handleFilterChange('premiumQuality', checked)}
            />
            <label htmlFor="premiumQuality" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Premium</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="digitalPrinting"
              checked={initialFilters.digitalPrinting}
              onCheckedChange={(checked) => handleFilterChange('digitalPrinting', checked)}
            />
            <label htmlFor="digitalPrinting" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Digital</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="finishingServices"
              checked={initialFilters.finishingServices}
              onCheckedChange={(checked) => handleFilterChange('finishingServices', checked)}
            />
            <label htmlFor="finishingServices" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Finishing</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalProducerFilters;