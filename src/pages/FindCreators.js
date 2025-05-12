import React, { useState, useEffect } from 'react';
import '../styles/FindCreators.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { 
  Search, 
  Filter, 
  MapPin, 
  Sliders,
  Star,
  Palette,
  Award,
  Calendar,
  X,
  User,
  BriefcaseBusiness,
  Clock
} from 'lucide-react';
import { getProfileImageUrl, getDesignImageUrl } from '../utils/unsplashUtils';
import { UnsplashImage } from '../components/ui/image';
import { generateFallbackImages, getReliableImageUrl, getTypedPlaceholder } from '../utils/imageUtils';

// Create the FindCreators component
const FindCreators = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [designStyles, setDesignStyles] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [location, setLocation] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  
  // Sample designers data
  const [designers] = useState([
    { 
      id: 1, 
      name: 'Alex Rivera', 
      rating: 4.9, 
      reviews: 42,
      location: {
        city: 'Chicago',
        neighborhood: 'Logan Square'
      },
      distance: 3.2,
      styles: ['Minimalist', 'Corporate', 'Elegant'],
      industries: ['Fashion', 'Technology', 'Retail'],
      projectTypes: ['Brand Identity', 'Clothing Design', 'Marketing Materials'],
      availabilityPercent: 65,
      turnaround: '5-7 business days',
      profileImg: getReliableImageUrl('designer', 'alex-rivera', { width: 300, height: 300 }),
      portfolioSamples: [
        getReliableImageUrl('design', 'alex-design-1', { width: 600, height: 400, index: 0 }),
        getReliableImageUrl('design', 'alex-design-2', { width: 600, height: 400, index: 1 }),
        getReliableImageUrl('design', 'alex-design-3', { width: 600, height: 400, index: 2 })
      ]
    },
    { 
      id: 2, 
      name: 'Maya Johnson', 
      rating: 4.8, 
      reviews: 36,
      location: {
        city: 'Chicago',
        neighborhood: 'Wicker Park'
      },
      distance: 4.5,
      styles: ['Bold', 'Modern', 'Vibrant'],
      industries: ['Music', 'Entertainment', 'Hospitality'],
      projectTypes: ['Album Art', 'Merchandise', 'Event Materials'],
      availabilityPercent: 30,
      turnaround: '7-10 business days',
      profileImg: getReliableImageUrl('designer', 'maya-johnson', { width: 300, height: 300 }),
      portfolioSamples: [
        getReliableImageUrl('design', 'maya-design-1', { width: 600, height: 400, index: 0 }),
        getReliableImageUrl('design', 'maya-design-2', { width: 600, height: 400, index: 1 }),
        getReliableImageUrl('design', 'maya-design-3', { width: 600, height: 400, index: 2 })
      ]
    },
    { 
      id: 3, 
      name: 'Jamal Washington', 
      rating: 4.7, 
      reviews: 29,
      location: {
        city: 'Chicago',
        neighborhood: 'Hyde Park'
      },
      distance: 6.1,
      styles: ['Illustrative', 'Artistic', 'Hand-drawn'],
      industries: ['Publishing', 'Education', 'Non-profit'],
      projectTypes: ['Book Covers', 'Illustrations', 'Educational Materials'],
      availabilityPercent: 85,
      turnaround: '3-5 business days',
      profileImg: getReliableImageUrl('designer', 'jamal-washington', { width: 300, height: 300 }),
      portfolioSamples: [
        getReliableImageUrl('design', 'jamal-design-1', { width: 600, height: 400, index: 0 }),
        getReliableImageUrl('design', 'jamal-design-2', { width: 600, height: 400, index: 1 }),
        getReliableImageUrl('design', 'jamal-design-3', { width: 600, height: 400, index: 2 })
      ]
    },
    { 
      id: 4, 
      name: 'Sarah Chen', 
      rating: 4.9, 
      reviews: 51,
      location: {
        city: 'Chicago',
        neighborhood: 'River North'
      },
      distance: 2.8,
      styles: ['Luxury', 'Sophisticated', 'Refined'],
      industries: ['Luxury Goods', 'Jewelry', 'High Fashion'],
      projectTypes: ['Branding', 'Packaging', 'Product Design'],
      availabilityPercent: 40,
      turnaround: '10-14 business days',
      profileImg: getReliableImageUrl('designer', 'sarah-chen', { width: 300, height: 300 }),
      portfolioSamples: [
        getReliableImageUrl('design', 'sarah-design-1', { width: 600, height: 400, index: 0 }),
        getReliableImageUrl('design', 'sarah-design-2', { width: 600, height: 400, index: 1 }),
        getReliableImageUrl('design', 'sarah-design-3', { width: 600, height: 400, index: 2 })
      ]
    },
    { 
      id: 5, 
      name: 'Marcus Taylor', 
      rating: 4.6, 
      reviews: 27,
      location: {
        city: 'Chicago',
        neighborhood: 'Pilsen'
      },
      distance: 3.7,
      styles: ['Urban', 'Street', 'Contemporary'],
      industries: ['Streetwear', 'Sports', 'Urban Culture'],
      projectTypes: ['Apparel Design', 'Accessories', 'Pattern Design'],
      availabilityPercent: 70,
      turnaround: '4-6 business days',
      profileImg: getReliableImageUrl('designer', 'marcus-taylor', { width: 300, height: 300 }),
      portfolioSamples: [
        getReliableImageUrl('design', 'marcus-design-1', { width: 600, height: 400, index: 0 }),
        getReliableImageUrl('design', 'marcus-design-2', { width: 600, height: 400, index: 1 }),
        getReliableImageUrl('design', 'marcus-design-3', { width: 600, height: 400, index: 2 })
      ]
    },
    { 
      id: 6, 
      name: 'Emma Rodriguez', 
      rating: 4.8, 
      reviews: 38,
      location: {
        city: 'Chicago',
        neighborhood: 'Humboldt Park'
      },
      distance: 4.1,
      styles: ['Sustainable', 'Eco-friendly', 'Natural'],
      industries: ['Sustainable Brands', 'Organic Products', 'Eco-Lifestyle'],
      projectTypes: ['Sustainable Packaging', 'Eco-Branding', 'Green Marketing'],
      availabilityPercent: 55,
      turnaround: '7-10 business days',
      profileImg: getReliableImageUrl('designer', 'emma-rodriguez', { width: 300, height: 300 }),
      portfolioSamples: [
        getReliableImageUrl('design', 'emma-design-1', { width: 600, height: 400, index: 0 }),
        getReliableImageUrl('design', 'emma-design-2', { width: 600, height: 400, index: 1 }),
        getReliableImageUrl('design', 'emma-design-3', { width: 600, height: 400, index: 2 })
      ]
    },
    { 
      id: 7, 
      name: 'David Kim', 
      rating: 4.7, 
      reviews: 33,
      location: {
        city: 'Chicago',
        neighborhood: 'Lincoln Park'
      },
      distance: 2.9,
      styles: ['Digital', 'Tech-forward', 'Futuristic'],
      industries: ['Tech Startups', 'Software', 'Digital Products'],
      projectTypes: ['UI/UX Design', 'Web Design', 'App Interfaces'],
      availabilityPercent: 25,
      turnaround: '5-8 business days',
      profileImg: getReliableImageUrl('designer', 'david-kim', { width: 300, height: 300 }),
      portfolioSamples: [
        getReliableImageUrl('design', 'david-design-1', { width: 600, height: 400, index: 0 }),
        getReliableImageUrl('design', 'david-design-2', { width: 600, height: 400, index: 1 }),
        getReliableImageUrl('design', 'david-design-3', { width: 600, height: 400, index: 2 })
      ]
    }
  ]);
  
  // Extract unique values for filter options
  useEffect(() => {
    const allStyles = new Set();
    const allIndustries = new Set();
    const allProjectTypes = new Set();
    
    designers.forEach(designer => {
      designer.styles.forEach(style => allStyles.add(style));
      designer.industries.forEach(industry => allIndustries.add(industry));
      designer.projectTypes.forEach(type => allProjectTypes.add(type));
    });
    
    setDesignStyles(Array.from(allStyles));
    setIndustries(Array.from(allIndustries));
    setProjectTypes(Array.from(allProjectTypes));
  }, [designers]);
  
  // State for selected filters
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState([]);
  
  // Toggle filter selection
  const handleStyleToggle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };
  
  const handleIndustryToggle = (industry) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };
  
  const handleProjectTypeToggle = (type) => {
    if (selectedProjectTypes.includes(type)) {
      setSelectedProjectTypes(selectedProjectTypes.filter(t => t !== type));
    } else {
      setSelectedProjectTypes([...selectedProjectTypes, type]);
    }
  };
  
  // Filter designers based on search and filter selections
  const filteredDesigners = designers.filter(designer => {
    // Filter by search query
    const matchesSearch = 
      designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.styles.some(style => style.toLowerCase().includes(searchQuery.toLowerCase())) ||
      designer.industries.some(industry => industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
      designer.projectTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by design styles
    const matchesStyles = 
      selectedStyles.length === 0 ||
      selectedStyles.every(style => designer.styles.includes(style));
    
    // Filter by industries
    const matchesIndustries = 
      selectedIndustries.length === 0 ||
      selectedIndustries.every(industry => designer.industries.includes(industry));
    
    // Filter by project types
    const matchesProjectTypes = 
      selectedProjectTypes.length === 0 ||
      selectedProjectTypes.every(type => designer.projectTypes.includes(type));
    
    // Filter by location
    const matchesLocation = 
      location === 'all' ||
      (location === 'within-5' && designer.distance <= 5) ||
      (location === 'within-10' && designer.distance <= 10) ||
      (location === 'within-20' && designer.distance <= 20);
    
    // Filter by availability
    const matchesAvailability = 
      availabilityFilter === 'all' ||
      (availabilityFilter === 'high' && designer.availabilityPercent >= 70) ||
      (availabilityFilter === 'medium' && designer.availabilityPercent >= 40 && designer.availabilityPercent < 70) ||
      (availabilityFilter === 'low' && designer.availabilityPercent < 40);
    
    return matchesSearch && matchesStyles && matchesIndustries && 
           matchesProjectTypes && matchesLocation && matchesAvailability;
  });
  
  // Sort designers
  const sortedDesigners = [...filteredDesigners].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      case 'availability':
        return b.availabilityPercent - a.availabilityPercent;
      default:
        return 0;
    }
  });
  
  // Handle designer selection for detailed view
  const handleDesignerSelect = (designer) => {
    setSelectedDesigner(designer);
    
    // Scroll to designer details
    const element = document.getElementById('designer-details');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Find Designers</h1>
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  onClick={() => setFiltersVisible(!filtersVisible)}
                >
                  <Filter size={16} />
                  {filtersVisible ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            </div>
      
            <div className="bg-white rounded-lg p-4 shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search designers, styles, or industries..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      <option value="within-5">Within 5 miles</option>
                      <option value="within-10">Within 10 miles</option>
                      <option value="within-20">Within 20 miles</option>
                    </select>
                  </div>
                  <div>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="rating">Highest Rating</option>
                      <option value="distance">Closest Distance</option>
                      <option value="availability">Most Available</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
      
            {/* Active Filters */}
            {(selectedStyles.length > 0 || selectedIndustries.length > 0 || selectedProjectTypes.length > 0) && (
              <div className="bg-white rounded-lg p-4 shadow mb-6">
                <h3 className="font-medium mb-3">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStyles.map((style, index) => (
                    <div key={`style-${index}`} className="flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm">
                      <Palette size={14} className="mr-1.5" />
                      {style}
                      <button 
                        className="ml-1.5 hover:text-red-500"
                        onClick={() => handleStyleToggle(style)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {selectedIndustries.map((industry, index) => (
                    <div key={`industry-${index}`} className="flex items-center px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm">
                      <BriefcaseBusiness size={14} className="mr-1.5" />
                      {industry}
                      <button 
                        className="ml-1.5 hover:text-red-500"
                        onClick={() => handleIndustryToggle(industry)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {selectedProjectTypes.map((type, index) => (
                    <div key={`project-${index}`} className="flex items-center px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm">
                      <Award size={14} className="mr-1.5" />
                      {type}
                      <button 
                        className="ml-1.5 hover:text-red-500"
                        onClick={() => handleProjectTypeToggle(type)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
      
            {filtersVisible && (
              <div className="bg-white rounded-lg p-4 shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Palette size={16} className="mr-2 text-blue-600" />
                      Design Styles
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {designStyles.slice(0, 6).map((style, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`style-${index}`} 
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                            checked={selectedStyles.includes(style)}
                            onChange={() => handleStyleToggle(style)}
                          />
                          <label htmlFor={`style-${index}`} className="ml-2 truncate text-gray-700">
                            {style}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <BriefcaseBusiness size={16} className="mr-2 text-purple-600" />
                      Industries
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {industries.slice(0, 6).map((industry, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`industry-${index}`} 
                            className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" 
                            checked={selectedIndustries.includes(industry)}
                            onChange={() => handleIndustryToggle(industry)}
                          />
                          <label htmlFor={`industry-${index}`} className="ml-2 truncate text-gray-700">
                            {industry}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Award size={16} className="mr-2 text-amber-600" />
                      Project Types
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {projectTypes.slice(0, 6).map((type, index) => (
                        <div key={index} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`project-${index}`} 
                            className="h-4 w-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500" 
                            checked={selectedProjectTypes.includes(type)}
                            onChange={() => handleProjectTypeToggle(type)}
                          />
                          <label htmlFor={`project-${index}`} className="ml-2 truncate text-gray-700">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Clock size={16} className="mr-2 text-gray-600" />
                      Availability
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="availability-all" 
                          name="availability" 
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          checked={availabilityFilter === 'all'}
                          onChange={() => setAvailabilityFilter('all')}
                        />
                        <label htmlFor="availability-all" className="ml-2 text-gray-700">All</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="availability-high" 
                          name="availability" 
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          checked={availabilityFilter === 'high'}
                          onChange={() => setAvailabilityFilter('high')}
                        />
                        <label htmlFor="availability-high" className="ml-2 text-green-600">High (70%+)</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="availability-medium" 
                          name="availability" 
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          checked={availabilityFilter === 'medium'}
                          onChange={() => setAvailabilityFilter('medium')}
                        />
                        <label htmlFor="availability-medium" className="ml-2 text-amber-600">Medium (40-70%)</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="availability-low" 
                          name="availability" 
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          checked={availabilityFilter === 'low'}
                          onChange={() => setAvailabilityFilter('low')}
                        />
                        <label htmlFor="availability-low" className="ml-2 text-red-600">Low (&lt;40%)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Content Panel */}
            <div>
              {selectedDesigner ? (
                <div className="bg-white rounded-lg shadow p-6" id="designer-details">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Designer Details</h3>
                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 text-sm font-medium"
                      onClick={() => setSelectedDesigner(null)}
                    >
                      Back to Results
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="flex flex-col items-center">
                        <div className="h-40 w-40 rounded-full overflow-hidden mb-4">
                        <UnsplashImage 
                        src={selectedDesigner.profileImg} 
                        alt={selectedDesigner.name}
                        className="w-full h-full"
                        fallbackSrc={[
                          ...generateFallbackImages('designer', selectedDesigner.id, { width: 300, height: 300, count: 1 }),
                          getTypedPlaceholder('designer', 300, 300)
                        ]}
                            />
                        </div>
                        
                        <h2 className="text-xl font-semibold mb-2">{selectedDesigner.name}</h2>
                        
                        <div className="flex items-center mb-3">
                          <Star size={16} className="text-warning mr-1" />
                          <span className="font-medium">{selectedDesigner.rating}</span>
                          <span className="text-sm text-gray ml-1">({selectedDesigner.reviews} reviews)</span>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          <MapPin size={16} className="text-gray mr-1" />
                          <span className="text-sm">{selectedDesigner.location.neighborhood}, {selectedDesigner.location.city}</span>
                        </div>
                        
                        <span className="text-sm text-gray">{selectedDesigner.distance} miles away</span>
                        
                        <div className="w-full mt-4">
                          <h4 className="text-sm font-medium mb-2">Availability</h4>
                          <div className="producer-capacity">
                            <div className="capacity-bar-wrapper">
                              <div 
                                className={`capacity-bar ${selectedDesigner.availabilityPercent >= 70 ? 'capacity-high' : selectedDesigner.availabilityPercent >= 40 ? 'capacity-medium' : 'capacity-low'}`} 
                                style={{ width: `${selectedDesigner.availabilityPercent}%` }}
                              ></div>
                            </div>
                            <span className={`capacity-value font-medium ${selectedDesigner.availabilityPercent >= 70 ? 'text-success' : selectedDesigner.availabilityPercent >= 40 ? 'text-warning' : 'text-error'}`}>{selectedDesigner.availabilityPercent}%</span>
                          </div>
                        </div>
                        
                        <div className="w-full mt-4">
                          <h4 className="text-sm font-medium mb-2">Typical Turnaround</h4>
                          <div className="flex items-center">
                            <Clock size={16} className="text-gray mr-1" />
                            <span>{selectedDesigner.turnaround}</span>
                          </div>
                        </div>
                        
                        <div className="w-full flex gap-2 mt-6">
                          <button className="btn btn-primary flex-1">Contact</button>
                          <button className="btn btn-outline flex-1">Save</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Design Styles</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedDesigner.styles.map((style, index) => (
                              <span key={index} className="badge bg-primary-light text-primary">
                                <Palette size={16} className="mr-1" />
                                {style}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Industries</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedDesigner.industries.map((industry, index) => (
                              <span key={index} className="badge bg-secondary-light text-secondary">
                                <BriefcaseBusiness size={16} className="mr-1" />
                                {industry}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Project Types</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedDesigner.projectTypes.map((type, index) => (
                              <span key={index} className="badge bg-accent-light text-accent">
                                <Award size={16} className="mr-1" />
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Portfolio Samples</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {selectedDesigner.portfolioSamples.map((sample, index) => (
                              <div key={index} className="rounded-md overflow-hidden h-48">
                              <UnsplashImage 
                              src={sample} 
                              alt={`Portfolio sample ${index + 1}`}
                              className="w-full h-full"
                              fallbackSrc={[
                                ...generateFallbackImages('design', `${selectedDesigner.id}-${index}`, { width: 600, height: 400, count: 1 }),
                                getTypedPlaceholder('design', 600, 400)
                              ]}
                              />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-gray-600 mb-4">
                    Found {sortedDesigners.length} designers
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedDesigners.map(designer => (
                      <div key={designer.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md hover:-translate-y-1 transition duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden">
                            <UnsplashImage 
                            src={designer.profileImg} 
                            alt={designer.name}
                            className="w-full h-full"
                            fallbackSrc={[
                              ...generateFallbackImages('designer', designer.id, { width: 100, height: 100, count: 1 }),
                              getTypedPlaceholder('designer', 100, 100)
                            ]}
                            />
                            </div>
                            <div>
                              <h3 className="designer-name">{designer.name}</h3>
                              <div className="designer-rating flex items-center">
                                <Star size={14} className="text-warning mr-1" />
                                <span className="font-medium">{designer.rating}</span>
                                <span className="text-xs text-gray ml-1">({designer.reviews})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="designer-portfolio mb-3">
                          <div className="grid grid-cols-3 gap-1 h-28">
                            {designer.portfolioSamples.slice(0, 3).map((sample, index) => (
                              <div key={index} className="rounded-md overflow-hidden">
                              <UnsplashImage 
                              src={sample} 
                              alt={`Portfolio sample ${index + 1}`}
                              className="w-full h-full"
                              fallbackSrc={[
                                ...generateFallbackImages('design', `${designer.id}-${index}`, { width: 200, height: 200, count: 1 }),
                                getTypedPlaceholder('design', 200, 200)
                              ]}
                              />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="designer-meta flex justify-between items-center mb-3">
                          <div className="designer-location flex items-center">
                            <MapPin size={14} />
                            <span className="text-xs ml-1">{designer.location.neighborhood}</span>
                          </div>
                          <div className="text-xs text-gray">
                            {designer.distance} miles away
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {designer.styles.slice(0, 3).map((style, index) => (
                            <span key={index} className="badge badge-sm badge-outline bg-primary-light text-primary text-xs">
                              {style}
                            </span>
                          ))}
                          {designer.styles.length > 3 && (
                            <span className="badge badge-sm badge-outline text-xs">
                              +{designer.styles.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="designer-capacity mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Availability</span>
                            <span className={`font-medium ${designer.availabilityPercent >= 70 ? 'text-success' : designer.availabilityPercent >= 40 ? 'text-warning' : 'text-error'}`}>{designer.availabilityPercent}%</span>
                          </div>
                          <div className="capacity-bar-wrapper">
                            <div 
                              className={`capacity-bar ${designer.availabilityPercent >= 70 ? 'capacity-high' : designer.availabilityPercent >= 40 ? 'capacity-medium' : 'capacity-low'}`} 
                              style={{ width: `${designer.availabilityPercent}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs mb-4">
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{designer.turnaround}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button 
                            className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                            onClick={() => handleDesignerSelect(designer)}
                          >
                            View Profile
                          </button>
                          <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                            Contact
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {sortedDesigners.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-5">
                        <Palette size={48} className="text-blue-600" />
                      </div>
                      <h3 className="text-xl font-medium mb-3">No Designers Found</h3>
                      <p className="text-gray-600 mb-5 max-w-md mx-auto">
                        We couldn't find any designers matching your current filters. Try broadening your search criteria to discover more creative talent.
                      </p>
                      <button 
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium flex items-center justify-center mx-auto"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedStyles([]);
                          setSelectedIndustries([]);
                          setSelectedProjectTypes([]);
                          setLocation('all');
                          setAvailabilityFilter('all');
                        }}
                      >
                        <Filter size={16} className="mr-2" />
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FindCreators;