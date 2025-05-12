import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGalleryItems, deleteGalleryItem } from '../../services/gallery';
import { GalleryManagement } from '../../components/gallery';
import { useAuth } from '../../services/auth/AuthContext';
import { Toast } from '../../components/ui/toast';

const GalleryManagementPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        // In a real app, we would filter by the producer's ID
        const data = await getAllGalleryItems({ producerId: currentUser?.id });
        setItems(data);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
        setError('Failed to load gallery items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleryItems();
  }, [currentUser]);
  
  const handleEdit = (item) => {
    // In a real app, we would navigate to an edit page with the item ID
    navigate(`/dashboard/gallery/edit/${item.id}`);
  };
  
  const handleDelete = async (itemId) => {
    try {
      await deleteGalleryItem(itemId);
      
      // Update the local state
      setItems(items.filter(item => item.id !== itemId));
      
      // Show success message
      Toast({
        title: 'Gallery Item Deleted',
        description: 'The gallery item has been deleted successfully.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      
      // Show error message
      Toast({
        title: 'Error',
        description: 'Failed to delete gallery item. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const handleCreateNew = () => {
    navigate('/dashboard/gallery/upload');
  };
  
  return (
    <div className="gallery-management-page">
      {error && (
        <div className="bg-red-50 rounded-lg p-4 mb-6 text-red-800">
          {error}
        </div>
      )}
      
      <GalleryManagement 
        items={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />
    </div>
  );
};

export default GalleryManagementPage;