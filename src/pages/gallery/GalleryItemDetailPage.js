import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGalleryItemById } from '../../services/gallery';
import { GalleryItemDetail } from '../../components/gallery';

const GalleryItemDetailPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        setLoading(true);
        const data = await getGalleryItemById(itemId);
        setItem(data);
      } catch (error) {
        console.error('Error fetching gallery item:', error);
        setError('Gallery item not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    
    if (itemId) {
      fetchGalleryItem();
    }
  }, [itemId]);
  
  const handleBack = () => {
    navigate('/gallery');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !item) {
    return (
      <div className="bg-red-50 rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-red-800">{error || 'Gallery item not found'}</h3>
        <div className="mt-6">
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Go Back to Gallery
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="gallery-item-detail-page">
      <GalleryItemDetail item={item} onBack={handleBack} />
    </div>
  );
};

export default GalleryItemDetailPage;