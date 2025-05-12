import React, { useState, useEffect } from 'react';
import { useDesignContext } from '../../services/designs/DesignProvider';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { TabsList, Tabs, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { 
  Plus, 
  Search, 
  Image, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Grid, 
  List,
  Tag
} from 'lucide-react';

const Designs = () => {
  const { 
    designs, 
    loading, 
    error, 
    clearError,
    createOrUpdateDesign, 
    removeDesign, 
    filterDesigns 
  } = useDesignContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    imageUrl: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert tags from comma-separated string to array
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const designData = {
        ...formData,
        tags
      };
      
      // If editing, include the ID
      if (editingDesign) {
        designData.id = editingDesign.id;
      }
      
      await createOrUpdateDesign(designData);
      
      // Reset form and state
      setFormData({
        title: '',
        description: '',
        tags: '',
        imageUrl: ''
      });
      setIsCreating(false);
      setEditingDesign(null);
      
    } catch (err) {
      console.error('Error saving design:', err);
      // You could add error handling here (e.g., showing a toast notification)
    }
  };

  // Start editing a design
  const handleEdit = (design) => {
    setEditingDesign(design);
    setFormData({
      title: design.title || '',
      description: design.description || '',
      tags: (design.tags || []).join(', '),
      imageUrl: design.imageUrl || ''
    });
    setIsCreating(true);
  };

  // Delete a design
  const handleDelete = async (designId) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await removeDesign(designId);
      } catch (err) {
        console.error('Error deleting design:', err);
        // Error handling
      }
    }
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      tags: '',
      imageUrl: ''
    });
    setIsCreating(false);
    setEditingDesign(null);
  };

  // Filter designs based on search query
  const filteredDesigns = filterDesigns({ searchQuery });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Designs</h1>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          New Design
        </Button>
      </div>

      {/* Search and View Options */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search designs..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">View:</span>
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList>
              <TabsTrigger value="grid"><Grid className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Design Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingDesign ? 'Edit Design' : 'Create New Design'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="branding, logo, print"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDesign ? 'Update Design' : 'Create Design'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Designs Grid or List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredDesigns.length === 0 ? (
          <div className="col-span-3 text-center py-10 border rounded-md">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mb-4">
              <Image className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No designs found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try adjusting your search query' : 'Create your first design to get started'}
            </p>
            {!isCreating && !searchQuery && (
              <Button onClick={() => setIsCreating(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Design
              </Button>
            )}
          </div>
        ) : (
          filteredDesigns.map(design => (
            <Card key={design.id} className={viewMode === 'list' ? 'flex flex-row' : ''}>
              <div className={viewMode === 'list' ? 'w-1/4' : ''}>
                <div className="h-40 bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center">
                  {design.imageUrl ? (
                    <img 
                      src={design.imageUrl} 
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              </div>
              <div className={viewMode === 'list' ? 'w-3/4' : ''}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{design.title}</span>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(design)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(design.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2 mb-2">{design.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {design.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500 border-t pt-3">
                  Created: {new Date(design.createdAt).toLocaleDateString()}
                </CardFooter>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Designs;