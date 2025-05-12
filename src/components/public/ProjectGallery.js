import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Image, LayoutGrid, Rows, Eye, X, Star, ArrowRight, ArrowLeft } from 'lucide-react';

const ProjectGallery = ({ items, layout = 'grid' }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  
  // Sort items to put featured items first
  const sortedItems = [...items].sort((a, b) => {
    if (a.displaySettings?.isFeatured && !b.displaySettings?.isFeatured) {
      return -1;
    }
    if (!a.displaySettings?.isFeatured && b.displaySettings?.isFeatured) {
      return 1;
    }
    return a.displayOrder - b.displayOrder;
  });
  
  // Open dialog with selected project
  const openProjectDialog = (project) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };
  
  // Handle navigation in project dialog
  const navigateProject = (direction) => {
    if (!selectedProject) return;
    
    const currentIndex = sortedItems.findIndex(item => item.id === selectedProject.id);
    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % sortedItems.length 
      : (currentIndex - 1 + sortedItems.length) % sortedItems.length;
    
    setSelectedProject(sortedItems[nextIndex]);
  };
  
  return (
    <div>
      {/* Layout toggles */}
      <div className="flex justify-end mb-4">
        <div className="border rounded-md overflow-hidden flex">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-none ${layout === 'grid' ? 'bg-gray-100' : ''}`}
            disabled={layout === 'grid'}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-none ${layout === 'rows' ? 'bg-gray-100' : ''}`}
            disabled={layout === 'rows'}
          >
            <Rows className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Featured projects section */}
      {sortedItems.some(item => item.displaySettings?.isFeatured) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedItems
              .filter(item => item.displaySettings?.isFeatured)
              .map(item => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openProjectDialog(item)}
                >
                  <div className="h-48 md:h-64 bg-gray-100 relative">
                    {item.design?.imageUrl ? (
                      <img
                        src={item.design.imageUrl}
                        alt={item.design.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg">{item.design?.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {item.displaySettings?.caption || item.design?.description}
                    </p>
                    {item.design?.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.design.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
      
      {/* All projects section */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Projects</h2>
        {layout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sortedItems.map(item => (
              <Card 
                key={item.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openProjectDialog(item)}
              >
                <div className="h-40 bg-gray-100 relative">
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
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute bottom-2 right-2 bg-white/80 text-gray-800 hover:bg-white"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium">{item.design?.title}</h3>
                  {item.displaySettings?.caption && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                      {item.displaySettings.caption}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map(item => (
              <Card 
                key={item.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openProjectDialog(item)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 h-48 bg-gray-100 relative">
                    {item.design?.imageUrl ? (
                      <img
                        src={item.design.imageUrl}
                        alt={item.design.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image className="h-12 w-12" />
                      </div>
                    )}
                    {item.displaySettings?.isFeatured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 w-full sm:w-2/3">
                    <h3 className="font-medium text-lg">{item.design?.title}</h3>
                    <p className="text-gray-600 text-sm my-2">
                      {item.displaySettings?.caption || item.design?.description}
                    </p>
                    {item.design?.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.design.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-3 text-primary"
                      style={{ color: 'var(--portfolio-primary)' }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Project Detail Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-w-4xl w-full">
          {selectedProject && (
            <>
              <div className="absolute top-2 right-2 z-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setProjectDialogOpen(false)} 
                  className="h-8 w-8 rounded-full bg-black/10 hover:bg-black/20 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-0">
                <div className="h-64 md:h-96 bg-gray-100 relative">
                  {selectedProject.design?.imageUrl ? (
                    <img
                      src={selectedProject.design.imageUrl}
                      alt={selectedProject.design.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Image className="h-16 w-16" />
                    </div>
                  )}
                  
                  {/* Navigation buttons */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/10 hover:bg-black/20 text-white"
                    onClick={() => navigateProject('prev')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/10 hover:bg-black/20 text-white"
                    onClick={() => navigateProject('next')}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedProject.design?.title}</h2>
                  
                  {selectedProject.displaySettings?.caption && (
                    <div className="text-lg text-gray-600 mb-4 italic">
                      "{selectedProject.displaySettings.caption}"
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-gray-700">
                      {selectedProject.design?.description}
                    </p>
                  </div>
                  
                  {selectedProject.design?.tags && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {selectedProject.design.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button>
                      Contact About This Project
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectGallery;