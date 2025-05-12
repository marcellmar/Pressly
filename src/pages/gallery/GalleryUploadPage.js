import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { GalleryUploader } from '../../components/gallery';
import { createGalleryItem } from '../../services/gallery';
import { useAuth } from '../../services/auth/AuthContext';
import { Toast } from '../../components/ui/toast';

const GalleryUploadPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Sample available materials and methods for the uploader
  const availableMaterials = [
    'Recycled Paper', 'Organic Cotton', 'Recycled Cardstock', 'Water-based Inks', 
    '100lb Matte Paper', 'Acid-free Paper', 'Organic Canvas', 'Recyclable Vinyl'
  ];
  
  const availableMethods = [
    'Digital Printing', 'Screen Printing', 'Large Format Printing', 'Die Cutting', 
    'Embossing', 'Giclee Printing', 'Letterpress', 'Risograph'
  ];
  
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add producer info to the gallery item
      const galleryItem = {
        ...formData,
        producerId: currentUser.id,
        producerName: currentUser.businessName || currentUser.fullName,
        designerId: 'user123', // In a real app, this would be the actual designer
        designerName: 'Demo Designer', // In a real app, this would be the actual designer
        featured: false,
        sustainabilityScore: Math.floor(Math.random() * 30) + 70 // Random score between 70-100
      };
      
      await createGalleryItem(galleryItem);
      
      // Show success message
      Toast({
        title: 'Gallery Item Created',
        description: 'Your gallery item has been created successfully.',
        variant: 'success'
      });
      
      // Redirect to gallery management
      navigate('/dashboard/gallery/manage');
    } catch (error) {
      console.error('Error creating gallery item:', error);
      setError('Failed to create gallery item. Please try again.');
      
      // Show error message
      Toast({
        title: 'Error',
        description: 'Failed to create gallery item. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/dashboard/gallery/manage');
  };
  
  return (
    <div className="gallery-upload-page">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Upload className="h-6 w-6 mr-2 text-blue-600" />
            Add New Gallery Item
          </h1>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 rounded-lg p-4 mb-6 text-red-800">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b p-4">
          <h2 className="text-lg font-medium">Showcase Your Work</h2>
          <p className="text-gray-600 text-sm">
            Add details about a completed print project to showcase in the gallery.
          </p>
        </div>
        
        <div className="p-6">
          <GalleryUploader 
            onSubmit={handleSubmit}
            availableMaterials={availableMaterials}
            availableMethods={availableMethods}
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryUploadPage;