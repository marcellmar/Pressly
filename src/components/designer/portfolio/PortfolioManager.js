import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Switch } from '../../../components/ui/switch';
import { Badge } from '../../../components/ui/badge';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Plus, Search, Star, X, PlusCircle, Edit, Info, Image, GripHorizontal, Check, MoreHorizontal, LayoutGrid, Eye } from 'lucide-react';
import usePortfolio from '../../../hooks/usePortfolio';
import ProjectSelector from './ProjectSelector';

const PortfolioManager = ({ portfolio, portfolioItems }) => {
  const { addDesignToPortfolio, removeDesignFromPortfolio, reorderPortfolioItems } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectingProject, setIsSelectingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectSettings, setProjectSettings] = useState({
    caption: '',
    isFeatured: false
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedItems, setReorderedItems] = useState([]);

  // Initialize reordered items when portfolio items change
  useEffect(() => {
    if (portfolioItems) {
      setReorderedItems([...portfolioItems].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [portfolioItems]);

  // Filter portfolio items based on search query
  const filteredItems = portfolioItems?.filter(item => 
    item.design?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.design?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.design?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.displaySettings?.caption?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setProjectSettings({
      caption: '',
      isFeatured: false
    });
  };

  // Add project to portfolio
  const handleAddProject = async () => {
    if (!selectedProject) return;
    
    await addDesignToPortfolio(selectedProject.id, projectSettings);
    
    // Reset states
    setSelectedProject(null);
    setProjectSettings({
      caption: '',
      isFeatured: false
    });
    setIsSelectingProject(false);
  };

  // Remove project from portfolio
  const handleRemoveProject = async (portfolioItemId) => {
    await removeDesignFromPortfolio(portfolioItemId);
  };

  // Update project settings
  const handleUpdateProject = async () => {
    if (!editingItem) return;
    
    // In a real implementation, you would update the portfolio item here
    // For now, we'll just update the local state
    const updatedItems = portfolioItems.map(item => 
      item.id === editingItem.id 
        ? { ...item, displaySettings: projectSettings }
        : item
    );
    
    // Reset editing state
    setEditingItem(null);
    setProjectSettings({
      caption: '',
      isFeatured: false
    });
  };

  // Save reordered items
  const handleSaveReordering = async () => {
    const itemIds = reorderedItems.map(item => item.id);
    await reorderPortfolioItems(itemIds);
    setIsReordering(false);
  };

  // Move item up in order
  const moveItemUp = (index) => {
    if (index === 0) return;
    
    const newItems = [...reorderedItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    
    setReorderedItems(newItems);
  };

  // Move item down in order
  const moveItemDown = (index) => {
    if (index === reorderedItems.length - 1) return;
    
    const newItems = [...reorderedItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    
    setReorderedItems(newItems);
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={isReordering ? "default" : "outline"}
            onClick={() => setIsReordering(!isReordering)}
          >
            {isReordering ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Done
              </>
            ) : (
              <>
                <GripHorizontal className="h-4 w-4 mr-2" />
                Reorder
              </>
            )}
          </Button>
          <Button onClick={() => setIsSelectingProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Design
          </Button>
        </div>
      </div>

      {/* Portfolio Items List */}
      {portfolioItems && portfolioItems.length > 0 ? (
        <div className={isReordering ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          {(isReordering ? reorderedItems : filteredItems).map((item, index) => (
            <Card key={item.id} className={`overflow-hidden ${isReordering ? "border-2 border-dashed border-gray-300" : ""}`}>
              <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                <div className="flex items-center">
                  {isReordering && (
                    <div className="flex flex-col mr-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItemUp(index)}
                        disabled={index === 0}
                        className="h-6 w-6"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItemDown(index)}
                        disabled={index === reorderedItems.length - 1}
                        className="h-6 w-6"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </Button>
                    </div>
                  )}
                  <span className="font-medium truncate max-w-[200px]">
                    {item.design?.title || 'Untitled Design'}
                  </span>
                  {item.displaySettings?.isFeatured && (
                    <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center">
                  {!isReordering && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingItem(item);
                          setProjectSettings({
                            caption: item.displaySettings?.caption || '',
                            isFeatured: item.displaySettings?.isFeatured || false
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemoveProject(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {isReordering && (
                    <div className="text-gray-500 text-sm">
                      Position: {index + 1}
                    </div>
                  )}
                </div>
              </div>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 h-32 bg-gray-200 relative">
                    {item.design?.imageUrl ? (
                      <img
                        src={item.design.imageUrl}
                        alt={item.design.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 w-full sm:w-2/3">
                    <div className="mb-2">
                      {item.design?.tags && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.design.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.design?.description || 'No description available'}
                      </p>
                    </div>
                    {item.displaySettings?.caption && (
                      <div className="mt-2 text-sm bg-gray-50 p-2 rounded border">
                        <span className="font-medium">Caption: </span>
                        {item.displaySettings.caption}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <LayoutGrid className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-800">No designs in your portfolio yet</h3>
          <p className="text-gray-500 mt-1 mb-4">
            Add your best designs to showcase your work to potential clients.
          </p>
          <Button onClick={() => setIsSelectingProject(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Design
          </Button>
        </div>
      )}
      
      {isReordering && portfolioItems && portfolioItems.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleSaveReordering}>
            <Check className="h-4 w-4 mr-2" />
            Save Order
          </Button>
        </div>
      )}

      {/* Add Design Dialog */}
      <Dialog open={isSelectingProject} onOpenChange={setIsSelectingProject}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add Design to Portfolio</DialogTitle>
            <DialogDescription>
              Select a design from your library to add to your portfolio.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="select">
              <TabsList className="mb-4">
                <TabsTrigger value="select">
                  Select Design
                </TabsTrigger>
                <TabsTrigger value="settings">
                  Display Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="select">
                <ProjectSelector 
                  onSelect={handleProjectSelect}
                  selectedProject={selectedProject}
                />
              </TabsContent>
              
              <TabsContent value="settings">
                {selectedProject ? (
                  <div className="space-y-4">
                    <div className="flex gap-4 mb-4">
                      <div className="w-1/3 bg-gray-100 rounded-md overflow-hidden">
                        {selectedProject.imageUrl ? (
                          <img 
                            src={selectedProject.imageUrl} 
                            alt={selectedProject.title} 
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center text-gray-400">
                            <Image className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="w-2/3">
                        <h3 className="font-medium">{selectedProject.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{selectedProject.description}</p>
                        {selectedProject.tags && (
                          <div className="flex flex-wrap gap-1">
                            {selectedProject.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="caption">Caption (optional)</Label>
                      <Input
                        id="caption"
                        value={projectSettings.caption}
                        onChange={(e) => setProjectSettings({...projectSettings, caption: e.target.value})}
                        placeholder="Add a caption to display with this design"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={projectSettings.isFeatured}
                        onCheckedChange={(checked) => setProjectSettings({...projectSettings, isFeatured: checked})}
                      />
                      <Label htmlFor="featured">Feature this design</Label>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 flex items-start">
                      <Info className="h-4 w-4 mr-2 mt-0.5" />
                      <p>Featured designs will be highlighted at the top of your portfolio.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please select a design first</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSelectingProject(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddProject}
              disabled={!selectedProject}
            >
              Add to Portfolio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Design Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Portfolio Item</DialogTitle>
            <DialogDescription>
              Update how this design appears in your portfolio
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="py-4 space-y-4">
              <div className="flex gap-4 mb-4">
                <div className="w-1/3 bg-gray-100 rounded-md overflow-hidden">
                  {editingItem.design?.imageUrl ? (
                    <img 
                      src={editingItem.design.imageUrl} 
                      alt={editingItem.design.title} 
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center text-gray-400">
                      <Image className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="w-2/3">
                  <h3 className="font-medium">{editingItem.design?.title || 'Untitled Design'}</h3>
                  <p className="text-sm text-gray-600 mb-2">{editingItem.design?.description || 'No description'}</p>
                  {editingItem.design?.tags && (
                    <div className="flex flex-wrap gap-1">
                      {editingItem.design.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-caption">Caption (optional)</Label>
                <Input
                  id="edit-caption"
                  value={projectSettings.caption}
                  onChange={(e) => setProjectSettings({...projectSettings, caption: e.target.value})}
                  placeholder="Add a caption to display with this design"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={projectSettings.isFeatured}
                  onCheckedChange={(checked) => setProjectSettings({...projectSettings, isFeatured: checked})}
                />
                <Label htmlFor="edit-featured">Feature this design</Label>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5" />
                <p>Featured designs will be highlighted at the top of your portfolio.</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProject}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioManager;