import React from 'react';
import { Button } from '../ui/button';
import { 
  Filter, 
  Clock, 
  Printer, 
  CheckCircle, 
  SortAsc, 
  SortDesc,
  Tag,
  Calendar,
  AlertTriangle,
  BarChart2
} from 'lucide-react';

const JobFilters = ({ filters, onFilterChange }) => {
  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Jobs', icon: <Filter className="h-4 w-4 mr-1" /> },
    { value: 'pending', label: 'Pending', icon: <Clock className="h-4 w-4 mr-1" /> },
    { value: 'accepted', label: 'Accepted', icon: <CheckCircle className="h-4 w-4 mr-1" /> }
  ];
  
  // Design type filter options
  const designTypeOptions = [
    { value: 'all', label: 'All Types', icon: <Tag className="h-4 w-4 mr-1" /> },
    { value: 'apparel', label: 'Apparel & Clothing' },
    { value: 'stationery', label: 'Stationery & Cards' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'large-format', label: 'Large Format' },
    { value: 'menu', label: 'Menu & Restaurant' }
  ];
  
  // Time frame filter options
  const timeFrameOptions = [
    { value: 'all', label: 'All Time Frames', icon: <Calendar className="h-4 w-4 mr-1" /> },
    { value: 'urgent', label: 'Urgent (3 Days)', icon: <AlertTriangle className="h-4 w-4 mr-1" /> },
    { value: 'this_week', label: 'This Week' },
    { value: 'next_week', label: 'Next Week' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'deadline_asc', label: 'Deadline (Soonest)', icon: <SortAsc className="h-4 w-4 mr-1" /> },
    { value: 'deadline_desc', label: 'Deadline (Latest)', icon: <SortDesc className="h-4 w-4 mr-1" /> },
    { value: 'match_desc', label: 'Best Match', icon: <BarChart2 className="h-4 w-4 mr-1" /> },
    { value: 'priority_desc', label: 'Priority (Highest)', icon: <AlertTriangle className="h-4 w-4 mr-1" /> }
  ];
  
  return (
    <div className="job-filters">
      <div className="flex flex-col gap-4">
        {/* Filter section labels */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm font-medium text-gray-500">
          <div>Status</div>
          <div>Design Type</div>
          <div>Time Frame</div>
          <div>Sort By</div>
        </div>
        
        {/* Filter options */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => (
              <Button
                key={option.value}
                size="sm"
                variant={filters.status === option.value ? "default" : "outline"}
                className="whitespace-nowrap"
                onClick={() => onFilterChange({ status: option.value })}
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </div>
          
          {/* Design type filters */}
          <div className="flex flex-col gap-2">
            <select
              value={filters.designType}
              onChange={(e) => onFilterChange({ designType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
            >
              {designTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Time frame filters */}
          <div className="flex flex-col gap-2">
            <select
              value={filters.timeFrame}
              onChange={(e) => onFilterChange({ timeFrame: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
            >
              {timeFrameOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort options */}
          <div className="flex flex-col gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;