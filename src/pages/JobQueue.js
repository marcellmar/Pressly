import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import JobCard from '../components/Orders/JobCard';
import JobFilters from '../components/Orders/JobFilters';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TruckIcon, 
  Printer,
  BarChart2,
  Sliders 
} from 'lucide-react';

const JobQueue = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    designType: 'all',
    timeFrame: 'all',
    sortBy: 'deadline_asc'
  });

  // Mock data for available jobs
  const mockJobs = [
    {
      id: 'job101',
      designName: 'Summer T-Shirt Collection',
      designer: {
        id: 'designer201',
        name: 'FashionForward Studio',
        location: 'Chicago, IL',
        rating: 4.8
      },
      designType: 'apparel',
      requirements: {
        size: 'Standard adult sizes S-XXL',
        colors: 'Full color, 6 colors maximum',
        material: 'Organic cotton blend',
        quantity: 150,
        specialInstructions: 'Vibrant colors needed, wash-resistant printing'
      },
      deadline: '2025-05-01',
      submitted: '2025-04-20',
      estimatedHours: 8,
      status: 'pending',
      priority: 'medium',
      matchScore: 93
    },
    {
      id: 'job102',
      designName: 'Local Bakery Packaging',
      designer: {
        id: 'designer202',
        name: 'PackageDesign Co',
        location: 'Evanston, IL',
        rating: 4.6
      },
      designType: 'packaging',
      requirements: {
        size: '6" x 4" x 2" boxes',
        colors: 'Three-color print, matte finish',
        material: 'Recycled cardboard',
        quantity: 500,
        specialInstructions: 'Food-safe inks required, window cutout on top'
      },
      deadline: '2025-04-29',
      submitted: '2025-04-18',
      estimatedHours: 4,
      status: 'pending',
      priority: 'high',
      matchScore: 87
    },
    {
      id: 'job103',
      designName: 'Annual Conference Banners',
      designer: {
        id: 'designer203',
        name: 'EventSpace Graphics',
        location: 'Chicago, IL',
        rating: 4.9
      },
      designType: 'large-format',
      requirements: {
        size: '4ft x 8ft standing banners',
        colors: 'Full color with gradient backgrounds',
        material: 'Vinyl with reinforced edges',
        quantity: 10,
        specialInstructions: 'Must be weather resistant, includes pole pocket at top and bottom'
      },
      deadline: '2025-05-05',
      submitted: '2025-04-21',
      estimatedHours: 6,
      status: 'pending',
      priority: 'medium',
      matchScore: 95
    },
    {
      id: 'job104',
      designName: 'Tech Startup Business Cards',
      designer: {
        id: 'designer204',
        name: 'Minimal Design Studio',
        location: 'Oak Park, IL',
        rating: 4.7
      },
      designType: 'stationery',
      requirements: {
        size: 'Standard 3.5" x 2"',
        colors: 'Black and one spot color (PMS 3567)',
        material: 'Soft touch 16pt cardstock',
        quantity: 250,
        specialInstructions: 'Needs edge painting in electric blue'
      },
      deadline: '2025-04-27',
      submitted: '2025-04-19',
      estimatedHours: 2,
      status: 'pending',
      priority: 'urgent',
      matchScore: 82
    },
    {
      id: 'job105',
      designName: 'Wedding Invitation Suite',
      designer: {
        id: 'designer205',
        name: 'Elegant Paper Co',
        location: 'Naperville, IL',
        rating: 5.0
      },
      designType: 'stationery',
      requirements: {
        size: '5" x 7" main invitation with 3.5" x 5" RSVP card',
        colors: 'Gold foil and navy ink',
        material: 'Cotton 120lb paper with matching envelopes',
        quantity: 75,
        specialInstructions: 'Letterpress printing needed, handmade paper preferred'
      },
      deadline: '2025-05-10',
      submitted: '2025-04-22',
      estimatedHours: 5,
      status: 'pending',
      priority: 'medium',
      matchScore: 78
    },
    {
      id: 'job106',
      designName: 'Restaurant Menu Update',
      designer: {
        id: 'designer206',
        name: 'Culinary Designs',
        location: 'Chicago, IL',
        rating: 4.7
      },
      designType: 'menu',
      requirements: {
        size: '8.5" x 11" bi-fold',
        colors: 'CMYK full color',
        material: 'Water-resistant premium paper',
        quantity: 100,
        specialInstructions: 'Must have protective coating for cleaning/sanitizing'
      },
      deadline: '2025-04-26',
      submitted: '2025-04-20',
      estimatedHours: 3,
      status: 'pending',
      priority: 'urgent',
      matchScore: 90
    }
  ];
  
  useEffect(() => {
    // In a real app, we would fetch jobs from an API
    setLoading(true);
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 800);
  }, []);
  
  // Apply filters and search query to jobs
  useEffect(() => {
    let result = [...jobs];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(job => 
        job.designName.toLowerCase().includes(query) || 
        job.designer.name.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(job => job.status === filters.status);
    }
    
    // Apply design type filter
    if (filters.designType !== 'all') {
      result = result.filter(job => job.designType === filters.designType);
    }
    
    // Apply time frame filter
    if (filters.timeFrame !== 'all') {
      const today = new Date();
      const oneWeek = new Date();
      oneWeek.setDate(today.getDate() + 7);
      
      if (filters.timeFrame === 'urgent') {
        // Jobs due within 3 days
        const threeDays = new Date();
        threeDays.setDate(today.getDate() + 3);
        result = result.filter(job => new Date(job.deadline) <= threeDays);
      } else if (filters.timeFrame === 'this_week') {
        // Jobs due this week
        result = result.filter(job => new Date(job.deadline) <= oneWeek);
      } else if (filters.timeFrame === 'next_week') {
        // Jobs due next week
        const nextWeekStart = new Date(oneWeek);
        const nextWeekEnd = new Date(oneWeek);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
        result = result.filter(job => {
          const dueDate = new Date(job.deadline);
          return dueDate > oneWeek && dueDate <= nextWeekEnd;
        });
      }
    }
    
    // Apply sorting
    if (filters.sortBy === 'deadline_asc') {
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (filters.sortBy === 'deadline_desc') {
      result.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else if (filters.sortBy === 'match_desc') {
      result.sort((a, b) => b.matchScore - a.matchScore);
    } else if (filters.sortBy === 'priority_desc') {
      const priorityMap = { 'urgent': 3, 'high': 2, 'medium': 1, 'low': 0 };
      result.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
    }
    
    setFilteredJobs(result);
  }, [jobs, searchQuery, filters]);

  // Handle accepting a job
  const handleAcceptJob = (jobId) => {
    // In a real app, we would make an API call to accept the job
    // Here we just update our local state for demonstration
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    
    // Update filtered jobs
    setFilteredJobs(prevFiltered => prevFiltered.filter(job => job.id !== jobId));
    
    // Show success notification (implement based on your notification system)
    alert('Job accepted successfully! It has been moved to your Orders.');
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Job Queue</h1>
        <p className="text-gray-600">
          Browse available print jobs that match your production capabilities
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">
          <div className="stats-summary flex flex-wrap gap-4">
            <div className="stat p-4 bg-blue-50 rounded-lg flex items-center">
              <div className="stat-icon mr-3 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Printer className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Available Jobs</div>
                <div className="text-xl font-bold">{jobs.length}</div>
              </div>
            </div>
            
            <div className="stat p-4 bg-yellow-50 rounded-lg flex items-center">
              <div className="stat-icon mr-3 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Urgent Jobs</div>
                <div className="text-xl font-bold">
                  {jobs.filter(job => job.priority === 'urgent').length}
                </div>
              </div>
            </div>
            
            <div className="stat p-4 bg-green-50 rounded-lg flex items-center">
              <div className="stat-icon mr-3 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Match Rate</div>
                <div className="text-xl font-bold">
                  {jobs.length > 0 
                    ? Math.round(jobs.reduce((sum, job) => sum + job.matchScore, 0) / jobs.length) 
                    : 0}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="search-container relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <JobFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin inline-block mb-4"></div>
          <p className="text-lg font-medium">Loading available jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-1">No matching jobs found</h3>
          <p className="text-gray-500">
            {searchQuery || filters.status !== 'all' || filters.designType !== 'all' || filters.timeFrame !== 'all' 
              ? 'Try adjusting your filters or search query'
              : 'There are no jobs available at the moment'}
          </p>
        </div>
      ) : (
        <div className="job-queue-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onAccept={handleAcceptJob} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobQueue;