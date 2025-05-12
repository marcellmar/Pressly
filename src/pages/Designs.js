import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  PlusCircle, 
  Search, 
  ChevronDown, 
  Filter, 
  Edit2, 
  Trash, 
  Eye,
  CheckCircle,
  Clock,
  X,
  Upload,
  Image,
  PenTool,
  Download,
  Copy,
  Printer,
  Share2,
  List
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Designs = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredDesign, setHoveredDesign] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // New design form state
  const [newDesign, setNewDesign] = useState({
    title: '',
    description: '',
    size: '',
    colors: '',
    materials: ''
  });
  
  // Function to generate free image URLs from Picsum
  const getRandomImageUrl = (id, width = 400, height = 300) => {
    return `https://picsum.photos/seed/${id}/${width}/${height}`;
  };

  // Function to get relevant free images based on design type
  const getRelevantImageUrl = (design) => {
    // Try to get keywords from tags and title
    const tags = design.tags || [];
    const title = design.title || '';
    const keywords = [...tags, ...title.split(' ')].join(',');
    
    // Use Picsum Photos for consistent placeholder images
    return getRandomImageUrl(design.id + '-' + title.replace(/\s+/g, '-').toLowerCase());
  };

  // Sample designs data
  const [designs, setDesigns] = useState([
    {
      id: 1,
      title: 'Summer Collection T-Shirt',
      description: 'Lightweight, eco-friendly t-shirt design for summer collection.',
      status: 'active',
      created_at: '2025-03-15T09:00:00Z',
      updated_at: '2025-03-20T14:30:00Z',
      imageUrl: null, // Will be set in useEffect
      size: '8.5x11 inches',
      colors: 'CMYK Full Color',
      materials: '100% Organic Cotton',
      tags: ['summer', 'eco-friendly', 't-shirt', 'lightweight'],
      progressStage: 80 // Percentage of completion in workflow
    },
    {
      id: 2,
      title: 'Chicago Skyline Poster',
      description: 'Minimalist Chicago skyline design for eco-friendly posters.',
      status: 'draft',
      created_at: '2025-04-02T11:45:00Z',
      updated_at: '2025-04-05T10:15:00Z',
      imageUrl: null,
      size: '18x24 inches',
      colors: 'Black and Blue',
      materials: 'Recycled Matte Paper',
      tags: ['chicago', 'skyline', 'poster', 'minimalist'],
      progressStage: 30
    },
    {
      id: 3,
      title: 'Organic Food Market Packaging',
      description: 'Sustainable packaging designs for local organic food market.',
      status: 'in-production',
      created_at: '2025-03-28T08:20:00Z',
      updated_at: '2025-04-01T16:40:00Z',
      imageUrl: null,
      size: 'Various Sizes',
      colors: 'Green and Earth Tones',
      materials: 'Compostable Packaging',
      tags: ['organic', 'food', 'packaging', 'sustainable'],
      progressStage: 60
    },
    {
      id: 4,
      title: 'Festival Wristbands',
      description: 'Custom wristband designs for music festival.',
      status: 'archived',
      created_at: '2025-02-10T14:30:00Z',
      updated_at: '2025-02-15T09:45:00Z',
      imageUrl: null,
      size: '1x8 inches',
      colors: 'Vibrant Gradient',
      materials: 'Recycled Synthetic Fabric',
      tags: ['festival', 'wristband', 'music', 'vibrant'],
      progressStage: 100
    },
    {
      id: 5,
      title: 'Sustainable Business Cards',
      description: 'Eco-friendly business card designs for creative professionals.',
      status: 'ready',
      created_at: '2025-04-10T10:20:00Z',
      updated_at: '2025-04-12T15:30:00Z',
      imageUrl: null,
      size: '3.5x2 inches',
      colors: 'Monochrome',
      materials: 'Seed Paper',
      tags: ['business cards', 'sustainable', 'eco-friendly', 'monochrome'],
      progressStage: 90
    },
    {
      id: 6,
      title: 'Holiday Greeting Cards',
      description: 'Seasonal greeting cards with winter themes.',
      status: 'draft',
      created_at: '2025-04-08T11:10:00Z',
      updated_at: '2025-04-10T09:25:00Z',
      imageUrl: null,
      size: '5x7 inches',
      colors: 'Red and Gold',
      materials: 'Recycled Card Stock',
      tags: ['holiday', 'greeting cards', 'winter', 'seasonal'],
      progressStage: 20
    },
    {
      id: 7,
      title: 'Corporate Annual Report',
      description: 'Clean, modern design for annual report with sustainability focus.',
      status: 'completed',
      created_at: '2025-03-01T10:20:00Z',
      updated_at: '2025-03-15T15:30:00Z',
      imageUrl: null,
      size: '8.5x11 inches',
      colors: 'Blue and White',
      materials: 'Recycled Glossy Paper',
      tags: ['corporate', 'report', 'business', 'modern'],
      progressStage: 100
    },
    {
      id: 8,
      title: 'Eco-Friendly Product Labels',
      description: 'Set of minimalist product labels for sustainable home goods.',
      status: 'ready',
      created_at: '2025-04-01T09:30:00Z',
      updated_at: '2025-04-10T14:20:00Z',
      imageUrl: null,
      size: 'Various Sizes',
      colors: 'Earth Tones',
      materials: 'Recycled Label Paper',
      tags: ['labels', 'product', 'eco-friendly', 'minimal'],
      progressStage: 95
    }
  ]);
  
  // File upload state
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Initialize design images on component mount
  useEffect(() => {
    // Set images for all designs that don't have one
    setDesigns(designs.map(design => {
      if (!design.imageUrl) {
        return {
          ...design,
          imageUrl: getRelevantImageUrl(design)
        };
      }
      return design;
    }));
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDesign({
      ...newDesign,
      [name]: value
    });
  };
  
  // Handle tags input
  const handleTagsInput = (e) => {
    const tagsValue = e.target.value;
    const tagsArray = tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    setNewDesign({
      ...newDesign,
      tags: tagsArray
    });
  };
  
  // Handle file upload
  const handleFileAnalyzed = (fileInfo) => {
    setIsUploading(true);
    setDesignFile(fileInfo);
    
    // Generate preview for the uploaded file
    if (fileInfo && fileInfo.file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setDesignPreview(e.target.result);
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(fileInfo.file);
    }
    
    // Add to recent uploads
    setRecentUploads(prevUploads => [fileInfo, ...prevUploads].slice(0, 5));
  };
  
  // Handle create design submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode && selectedDesign) {
      // Update existing design
      const updatedDesigns = designs.map(design => 
        design.id === selectedDesign.id 
          ? { 
              ...design, 
              ...newDesign, 
              updated_at: new Date().toISOString(),
              imageUrl: designPreview || design.imageUrl
            } 
          : design
      );
      
      setDesigns(updatedDesigns);
    } else {
      // Create new design
      const newId = Math.max(...designs.map(d => d.id), 0) + 1;
      const newDesignEntry = {
        id: newId,
        ...newDesign,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        imageUrl: designPreview || getRandomImageUrl(newId + '-' + (newDesign.title || 'default').replace(/\s+/g, '-').toLowerCase()),
        tags: newDesign.tags || [],
        progressStage: 30 // Start at 30% for draft status
      };
      
      setDesigns([newDesignEntry, ...designs]);
    }
    
    // Reset form
    setShowCreateForm(false);
    setIsEditMode(false);
    setSelectedDesign(null);
    setNewDesign({
      title: '',
      description: '',
      size: '',
      colors: '',
      materials: '',
      tags: []
    });
    setDesignFile(null);
    setDesignPreview(null);
  };
  
  // Handle design edit
  const handleEdit = (design) => {
    setSelectedDesign(design);
    setIsEditMode(true);
    
    // Populate form with selected design
    setNewDesign({
      title: design.title,
      description: design.description,
      size: design.size,
      colors: design.colors,
      materials: design.materials,
      tags: design.tags || []
    });
    
    setShowCreateForm(true);
  };
  
  // Handle design duplication
  const handleDuplicate = (design) => {
    const duplicatedDesign = {
      ...design,
      id: designs.length + 1,
      title: `${design.title} (Copy)`,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setDesigns([duplicatedDesign, ...designs]);
  };
  
  // Handle design deletion
  const handleDelete = (designId) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      setDesigns(designs.filter(design => design.id !== designId));
    }
  };
  
  // Handle status change
  const handleStatusChange = (designId, newStatus) => {
    // Define the progress stage based on the new status
    const progressMap = {
      'draft': 30,
      'ready': 50,
      'active': 70,
      'in-production': 85,
      'completed': 100,
      'archived': 100
    };
    
    setDesigns(designs.map(design => 
      design.id === designId ? {
        ...design, 
        status: newStatus,
        progressStage: progressMap[newStatus] || design.progressStage,
        updated_at: new Date().toISOString()
      } : design
    ));
  };
  
  // Filter designs based on search and status
  const filteredDesigns = designs.filter(design => {
    const matchesSearch = 
      design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (design.tags && design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesStatus = statusFilter === 'all' || design.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Get progress bar color based on status
  const getProgressColorClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-400';
      case 'archived':
        return 'bg-gray-400';
      case 'in-production':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-teal-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  // Get status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'active': { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'draft': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-3 w-3 mr-1" /> },
      'archived': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <X className="h-3 w-3 mr-1" /> },
      'in-production': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Printer className="h-3 w-3 mr-1" /> },
      'ready': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'completed': { color: 'bg-teal-100 text-teal-800 border-teal-200', icon: <CheckCircle className="h-3 w-3 mr-1" /> }
    };
    
    const config = statusConfig[status] || statusConfig['draft'];
    
    return (
      <Badge variant="outline" className={`flex items-center ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  // Group designs by status for statistics
  const designStats = {
    total: designs.length,
    active: designs.filter(d => d.status === 'active').length,
    draft: designs.filter(d => d.status === 'draft').length,
    ready: designs.filter(d => d.status === 'ready').length,
    inProduction: designs.filter(d => d.status === 'in-production').length,
    completed: designs.filter(d => d.status === 'completed').length,
    archived: designs.filter(d => d.status === 'archived').length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Desktop navigation for designs page */}
      <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full">
        <div className="hidden md:flex mb-6 bg-gray-100 p-2 rounded-lg">
          <TabsList className="flex-1">
            <TabsTrigger value="all" className="flex-1">
              All Designs ({designStats.total})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1">
              Active ({designStats.active})
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex-1">
              Drafts ({designStats.draft})
            </TabsTrigger>
            <TabsTrigger value="ready" className="flex-1">
              Ready
            </TabsTrigger>
            <TabsTrigger value="in-production" className="flex-1">
              In Production
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completed
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex-1">
              Archived ({designStats.archived})
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center ml-4">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <><List className="h-4 w-4 mr-2" /> List View</>
              ) : (
                <><Image className="h-4 w-4 mr-2" /> Grid View</>
              )}
            </Button>
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => navigate('/smart-match')}
            >
              <Printer className="h-4 w-4 mr-2" />
              Find Producers
            </Button>
          </div>
        </div>
      </Tabs>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">My Designs</h1>
        <div className="flex space-x-2">
          <Button onClick={() => {
            setIsEditMode(false);
            setNewDesign({
              title: '',
              description: '',
              size: '',
              colors: '',
              materials: '',
              tags: []
            });
            setShowCreateForm(true);
          }}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Design
          </Button>
          <Button variant="outline" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
            {showAdvancedOptions ? 'Hide Options' : 'Show More Options'}
          </Button>
        </div>
      </div>
      
      {/* Advanced Options */}
      {showAdvancedOptions && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Uploads</h3>
                <div className="space-y-2">
                  {recentUploads.length > 0 ? (
                    recentUploads.map((file, index) => (
                      <div key={index} className="flex items-center text-sm p-2 bg-gray-50 rounded-md">
                        <Image className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No recent uploads</div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Bulk Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Batch Upload
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Designs
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Design Templates</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <PenTool className="h-4 w-4 mr-2" />
                    Browse Templates
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Copy className="h-4 w-4 mr-2" />
                    Import from Library
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Create/Edit Design Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Design' : 'Create New Design'}</CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Update your design details below'
                : 'Upload your design and fill in the details below'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Design File</h3>
                {!isEditMode && (
                <div className="relative">
                {isUploading ? (
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                ) : designPreview ? (
                <div className="relative h-48 overflow-hidden bg-gray-50 rounded-md mb-4">
                <img 
                src={designPreview} 
                alt="Design preview"
                className="w-full h-full object-contain"
                />
                <Button 
                className="absolute bottom-2 right-2"
                size="sm"
                variant="secondary"
                onClick={() => setDesignPreview(null)}
                >
                <X className="h-4 w-4 mr-1" />
                Remove
                </Button>
                </div>
                ) : (
                <FileUpload 
                    onFileAnalyzed={handleFileAnalyzed}
                      /* Enhanced file upload capabilities */
                        maxSize={100 * 1024 * 1024} /* Increase max size to 100MB for professional designers */
                          />
                        )}
                      </div>
                    )}
                
                {isEditMode && (
                  <div className="relative h-48 overflow-hidden bg-gray-50 rounded-md mb-4">
                    {selectedDesign && (designPreview || selectedDesign.imageUrl) ? (
                      <img 
                        src={designPreview || selectedDesign.imageUrl} 
                        alt={selectedDesign.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Image className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    <Button 
                      className="absolute bottom-2 right-2"
                      size="sm"
                      variant="secondary"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Replace Image
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="design-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Design Title
                    </label>
                    <input 
                      type="text" 
                      id="design-title" 
                      name="title" 
                      value={newDesign.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="design-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea 
                      id="design-description" 
                      name="description" 
                      value={newDesign.description}
                      onChange={handleInputChange}
                      rows="4" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="design-tags" className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input 
                      type="text" 
                      id="design-tags" 
                      name="tags" 
                      value={newDesign.tags ? newDesign.tags.join(', ') : ''}
                      onChange={handleTagsInput}
                      placeholder="e.g., sustainable, print, chicago" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="design-size" className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <input 
                      type="text" 
                      id="design-size" 
                      name="size" 
                      value={newDesign.size}
                      onChange={handleInputChange}
                      placeholder="e.g., 8.5x11 inches" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="design-colors" className="block text-sm font-medium text-gray-700 mb-1">
                      Colors
                    </label>
                    <input 
                      type="text" 
                      id="design-colors" 
                      name="colors" 
                      value={newDesign.colors}
                      onChange={handleInputChange}
                      placeholder="e.g., CMYK, RGB, Pantone" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="design-materials" className="block text-sm font-medium text-gray-700 mb-1">
                      Recommended Materials
                    </label>
                    <input 
                      type="text" 
                      id="design-materials" 
                      name="materials" 
                      value={newDesign.materials}
                      onChange={handleInputChange}
                      placeholder="e.g., 100lb Gloss, Canvas, Cotton" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  {isEditMode && (
                    <div>
                      <label htmlFor="design-status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="design-status"
                        name="status"
                        value={selectedDesign ? selectedDesign.status : 'draft'}
                        onChange={(e) => handleStatusChange(selectedDesign.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="draft">Draft</option>
                        <option value="ready">Ready</option>
                        <option value="active">Active</option>
                        <option value="in-production">In Production</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setIsEditMode(false);
                    setSelectedDesign(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? 'Update Design' : 'Save Design'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="w-full pl-10 p-2 border border-gray-300 rounded-md"
            placeholder="Search designs by title, description, or tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Mobile filter dropdown - hidden on desktop */}
        <div className="md:hidden w-full">
          <div className="relative">
            <select 
              id="design-filter"
              className="appearance-none w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Designs</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="in-production">In Production</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Mobile navigation button - appears only on mobile */}
        <div className="md:hidden w-full">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/smart-match')}
          >
            Find Producers
          </Button>
        </div>
      </div>
      
      {/* Designs Grid/List View */}
      {filteredDesigns.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map(design => (
              <Card 
                key={design.id} 
                className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg group relative"
              >
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  {design.imageUrl ? (
                    <img 
                      src={design.imageUrl} 
                      alt={design.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={design.status} />
                  </div>
                  
                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100"
                        onClick={() => handleEdit(design)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100"
                        onClick={() => navigate(`/smart-match?design=${design.id}`)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100"
                        onClick={() => handleDelete(design.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar showing design workflow stage */}
                <div className="h-1 w-full bg-gray-200">
                  <div 
                    className={`h-full transition-all duration-500 ${getProgressColorClass(design.status)}`} 
                    style={{ width: `${design.progressStage}%` }}
                  ></div>
                </div>
                
                <CardHeader className="pb-2 flex-grow">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{design.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {design.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-1 text-sm text-gray-700">
                    {design.size && (
                      <div className="flex">
                        <span className="font-medium w-20">Size:</span>
                        <span>{design.size}</span>
                      </div>
                    )}
                    {design.colors && (
                      <div className="flex">
                        <span className="font-medium w-20">Colors:</span>
                        <span>{design.colors}</span>
                      </div>
                    )}
                    {design.materials && (
                      <div className="flex">
                        <span className="font-medium w-20">Materials:</span>
                        <span>{design.materials}</span>
                      </div>
                    )}
                  </div>
                  
                  {design.tags && design.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {design.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center mt-3 text-xs text-gray-500">
                    <span>Created: {formatDate(design.created_at)}</span>
                    <span className="mx-2">•</span>
                    <span>Updated: {formatDate(design.updated_at)}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-between py-3 mt-auto">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(design)}>
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 p-0 flex justify-center hover:bg-blue-50 transition-colors"
                      onClick={() => handleDuplicate(design)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 p-0 flex justify-center hover:bg-blue-50 transition-colors"
                      onClick={() => navigate(`/smart-match?design=${design.id}`)}
                    >
                      <Printer className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 p-0 flex justify-center hover:bg-blue-50 transition-colors"
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-8 p-0 flex justify-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => handleDelete(design.id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {filteredDesigns.map(design => (
              <Card key={design.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 h-32 md:h-auto">
                    {design.imageUrl ? (
                      <img 
                        src={design.imageUrl} 
                        alt={design.title}
                        className="w-full h-32 md:h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-32 md:h-full bg-gray-100">
                        <Image className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">{design.title}</h3>
                      <StatusBadge status={design.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{design.description}</p>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
                      {design.size && (
                        <div className="flex">
                          <span className="font-medium w-20">Size:</span>
                          <span>{design.size}</span>
                        </div>
                      )}
                      {design.colors && (
                        <div className="flex">
                          <span className="font-medium w-20">Colors:</span>
                          <span>{design.colors}</span>
                        </div>
                      )}
                      {design.materials && (
                        <div className="flex">
                          <span className="font-medium w-20">Materials:</span>
                          <span>{design.materials}</span>
                        </div>
                      )}
                      <div className="flex">
                        <span className="font-medium w-20">Created:</span>
                        <span>{formatDate(design.created_at)}</span>
                      </div>
                    </div>
                    
                    {design.tags && design.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {design.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(design)}>
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDuplicate(design)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/smart-match?design=${design.id}`)}
                      >
                        <Printer className="h-3 w-3 mr-1" />
                        Print
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(design.id)}
                      >
                        <Trash className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <PenTool className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Designs Found</h3>
          {searchQuery || statusFilter !== 'all' ? (
            <p className="text-gray-500">
              Try adjusting your search or filter settings
            </p>
          ) : (
            <p className="text-gray-500">
              Create your first design to get started
            </p>
          )}
          {!showCreateForm && (
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="mt-4"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Design
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Designs;