import React from 'react';
import GalleryItemCard from './GalleryItemCard';

/**
 * Grid display for gallery items
 * @param {Object} props Component props
 * @param {Array} props.items Gallery items to display
 * @param {boolean} props.loading Whether the gallery is loading
 * @param {string} props.emptyMessage Message to display when there are no items
 * @param {function} props.onItemClick Function to call when an item is clicked
 */
const GalleryGrid = ({ 
  items = [], 
  loading = false, 
  emptyMessage = "No gallery items found",
  onItemClick
}) => {
  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="gallery-empty bg-gray-50 rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <GalleryItemCard 
          key={item.id} 
          item={item}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;