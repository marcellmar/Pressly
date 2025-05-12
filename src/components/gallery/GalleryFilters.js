import React, { useState } from 'react';
import { Search, Filter, Tag, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

/**
 * Filter controls for the gallery
 * @param {Object} props Component props
 * @param {Object} props.filters Current filter values
 * @param {Function} props.onFilterChange Function to call when filters change
 * @param {Array} props.availableMaterials List of available materials to filter by
 * @param {Array} props.availableMethods List of available methods to filter by
 * @param {Array} props.availableTags List of available tags to filter by
 */
const GalleryFilters = ({ 
  filters = {}, 
  onFilterChange,
  availableMaterials = [],
  availableMethods = [],
  availableTags = []
}) => {
  const [searchInput, setSearchInput] = useState(filters.searchQuery || '');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange({
      ...filters,
      searchQuery: searchInput
    });
  };
  
  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    let newValues;
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    onFilterChange({
      ...filters,
      [filterType]: newValues
    });
  };
  
  const handleFeaturedChange = (checked) => {
    onFilterChange({
      ...filters,
      featured: checked
    });
  };
  
  const clearFilters = () => {
    setSearchInput('');
    onFilterChange({
      searchQuery: '',
      materials: [],
      methods: [],
      tags: [],
      featured: false
    });
  };
  
  const hasActiveFilters = () => {
    return (
      (filters.searchQuery && filters.searchQuery.length > 0) ||
      (filters.materials && filters.materials.length > 0) ||
      (filters.methods && filters.methods.length > 0) ||
      (filters.tags && filters.tags.length > 0) ||
      filters.featured === true
    );
  };

  return (
    <div className="gallery-filters mb-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search gallery by title, description, or producer..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button 
          type="button" 
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5 mr-1" />
          Filters
        </Button>
        {hasActiveFilters() && (
          <Button 
            type="button" 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={clearFilters}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </form>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Materials filter */}
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Materials
              </h3>
              <div className="space-y-2">
                {availableMaterials.map((material) => (
                  <div key={material} className="flex items-center">
                    <Checkbox 
                      id={`material-${material}`}
                      checked={(filters.materials || []).includes(material)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('materials', material)
                      }
                    />
                    <Label 
                      htmlFor={`material-${material}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Methods filter */}
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Methods
              </h3>
              <div className="space-y-2">
                {availableMethods.map((method) => (
                  <div key={method} className="flex items-center">
                    <Checkbox 
                      id={`method-${method}`}
                      checked={(filters.methods || []).includes(method)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('methods', method)
                      }
                    />
                    <Label 
                      htmlFor={`method-${method}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {method}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags filter */}
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Tags
              </h3>
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center">
                    <Checkbox 
                      id={`tag-${tag}`}
                      checked={(filters.tags || []).includes(tag)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('tags', tag)
                      }
                    />
                    <Label 
                      htmlFor={`tag-${tag}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Featured filter */}
            <div className="md:col-span-3">
              <div className="flex items-center">
                <Checkbox 
                  id="featured-only"
                  checked={filters.featured === true}
                  onCheckedChange={handleFeaturedChange}
                />
                <Label 
                  htmlFor="featured-only"
                  className="ml-2 text-sm font-medium cursor-pointer"
                >
                  Show only featured items
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryFilters;