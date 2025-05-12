import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { Search, Image, CheckCircle, Filter } from 'lucide-react';

// Mocked designs for demonstration purposes
// In a real application, these would come from an API call
const MOCK_DESIGNS = [
  {
    id: 'd-1',
    title: 'Brew & Bean Brand Identity',
    description: 'Complete brand package including logo, business cards, and packaging design',
    imageUrl: 'https://images.unsplash.com/photo-1581318569634-76bfabd10d9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['branding', 'logo', 'packaging'],
    createdAt: '2023-11-10T18:25:43.511Z'
  },
  {
    id: 'd-2',
    title: 'Harmonic Convergence Festival',
    description: 'Poster design for annual music festival featuring electronic and indie artists',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['poster', 'event', 'music'],
    createdAt: '2023-12-05T14:30:22.300Z'
  },
  {
    id: 'd-3',
    title: 'Quantum Tech Website',
    description: 'Complete website redesign for AI startup focusing on user experience and modern aesthetics',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['web', 'UI/UX', 'tech'],
    createdAt: '2024-01-18T09:12:37.814Z'
  },
  {
    id: 'd-4',
    title: 'Sustainable Fashion Catalog',
    description: 'Print catalog design for eco-friendly clothing line featuring minimalist aesthetics',
    imageUrl: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['print', 'fashion', 'catalog'],
    createdAt: '2024-02-10T15:45:20.120Z'
  },
  {
    id: 'd-5',
    title: 'Urban Eats Food Truck Branding',
    description: 'Complete visual identity for a gourmet food truck, including logo, menu, and vehicle wrap',
    imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['branding', 'food', 'logo'],
    createdAt: '2024-02-28T11:20:15.332Z'
  },
  {
    id: 'd-6',
    title: 'Mindful App UI Design',
    description: 'User interface design for meditation and mindfulness mobile application',
    imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['UI/UX', 'mobile', 'app'],
    createdAt: '2024-03-15T10:05:30.450Z'
  }
];

const ProjectSelector = ({ onSelect, selectedProject }) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    sortBy: 'newest',
    timeFrame: 'all'
  });

  // Fetch designs (mock)
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setDesigns(MOCK_DESIGNS);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Extract all unique tags
  const allTags = [...new Set(designs.flatMap(design => design.tags || []))];

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filter, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [filter]: value
    });
  };

  // Filter and sort designs
  const filteredDesigns = designs
    .filter(design => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Tag filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => design.tags?.includes(tag));
      
      // Time frame filter
      let matchesTimeFrame = true;
      if (selectedFilters.timeFrame !== 'all') {
        const designDate = new Date(design.createdAt);
        const now = new Date();
        const diffInDays = Math.floor((now - designDate) / (1000 * 60 * 60 * 24));
        
        if (selectedFilters.timeFrame === 'last30' && diffInDays > 30) {
          matchesTimeFrame = false;
        } else if (selectedFilters.timeFrame === 'last90' && diffInDays > 90) {
          matchesTimeFrame = false;
        }
      }
      
      return matchesSearch && matchesTags && matchesTimeFrame;
    })
    .sort((a, b) => {
      // Sort by selected order
      if (selectedFilters.sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (selectedFilters.sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (selectedFilters.sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-1/2">
          <details className="w-full">
            <summary className="bg-gray-50 rounded-md px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </div>
              <span className="text-xs text-gray-500">
                {selectedTags.length > 0 && `${selectedTags.length} tags selected`}
                {selectedFilters.timeFrame !== 'all' && (selectedTags.length > 0 ? ' · ' : '') + 'Time frame'}
              </span>
            </summary>
            <div className="p-4 border border-gray-200 rounded-md mt-2 bg-white">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge 
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Sort By</h4>
                  <RadioGroup value={selectedFilters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="newest" id="sort-newest" />
                      <Label htmlFor="sort-newest">Newest First</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oldest" id="sort-oldest" />
                      <Label htmlFor="sort-oldest">Oldest First</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alphabetical" id="sort-alpha" />
                      <Label htmlFor="sort-alpha">Alphabetical</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Time Frame</h4>
                  <RadioGroup value={selectedFilters.timeFrame} onValueChange={(value) => handleFilterChange('timeFrame', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="time-all" />
                      <Label htmlFor="time-all">All Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="last30" id="time-30" />
                      <Label htmlFor="time-30">Last 30 Days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="last90" id="time-90" />
                      <Label htmlFor="time-90">Last 90 Days</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
      
      {/* Design Selection */}
      <div className="border rounded-md overflow-hidden bg-white max-h-[400px] overflow-y-auto">
        {filteredDesigns.length > 0 ? (
          <RadioGroup value={selectedProject?.id} onValueChange={(value) => {
            const project = designs.find(d => d.id === value);
            onSelect(project);
          }}>
            {filteredDesigns.map(design => (
              <div 
                key={design.id} 
                className={`p-4 flex gap-4 border-b hover:bg-gray-50 cursor-pointer ${selectedProject?.id === design.id ? 'bg-blue-50' : ''}`}
                onClick={() => onSelect(design)}
              >
                <RadioGroupItem value={design.id} id={`design-${design.id}`} className="sr-only" />
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {design.imageUrl ? (
                    <img 
                      src={design.imageUrl} 
                      alt={design.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Image className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <Label htmlFor={`design-${design.id}`} className="font-medium">
                      {design.title}
                    </Label>
                    {selectedProject?.id === design.id && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{design.description}</p>
                  {design.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {design.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="h-10 w-10 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">No designs found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedProject && (
        <div className="bg-blue-50 p-4 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1" />
          <div>
            <h4 className="font-medium">Selected Design</h4>
            <p className="text-sm">{selectedProject.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;