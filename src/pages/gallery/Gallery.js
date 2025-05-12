import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Filter, Image, Home, Leaf } from 'lucide-react';
import { GalleryGrid, GalleryFilters } from '../../components/gallery';
import { getAllGalleryItems } from '../../services/gallery';

const Gallery = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchQuery: '',
    materials: [],
    methods: [],
    tags: [],
    featured: false
  });
  
  // Sample available filters based on mock data
  const availableMaterials = [
    'Recycled Paper', 'Organic Cotton', 'Recycled Cardstock', 'Water-based Inks', 
    '100lb Matte Paper', 'Acid-free Paper', 'Organic Canvas', 'Recyclable Vinyl'
  ];
  
  const availableMethods = [
    'Digital Printing', 'Screen Printing', 'Large Format Printing', 'Die Cutting', 
    'Embossing', 'Giclee Printing', 'Letterpress', 'Risograph'
  ];
  
  const availableTags = [
    'Corporate', 'Brochure', 'Apparel', 'Organic', 'Eco-friendly', 'Banner', 
    'Event', 'Business Cards', 'Minimalist', 'Art', 'Fine Art', 'Bags'
  ];
  
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const data = await getAllGalleryItems(filters);
        setItems(data);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGalleryItems();
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleItemClick = (item) => {
    navigate(`/gallery/${item.id}`);
  };
  
  return (
    <div className="gallery-page">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ImageIcon className="h-8 w-8 mr-2 text-blue-600" />
              Design Gallery
            </h1>
            <p className="text-gray-600 mt-1">
              Discover inspiring printing projects from our community of producers
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="flex items-center text-sm font-medium">
                <span className="mr-2 text-gray-700">Items Found:</span>
                <span className="text-blue-600">{items.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Image className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">Browse the Gallery</h2>
        </div>
        <p className="text-gray-700 mb-4">
          Explore real projects created by our network of producers. Get inspired and
          find the perfect printing partner for your next design project.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white bg-opacity-70 rounded-lg p-3 flex items-start">
            <Filter className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Find Your Perfect Style</h3>
              <p className="text-gray-600">Filter by materials, methods, and more to discover projects that match your vision.</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-3 flex items-start">
            <Home className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Connect with Local Producers</h3>
              <p className="text-gray-600">Every gallery item links to a local producer ready to bring your designs to life.</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-3 flex items-start">
            <Leaf className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Sustainable Choices</h3>
              <p className="text-gray-600">Look for sustainability scores to make eco-conscious production decisions.</p>
            </div>
          </div>
        </div>
      </div>
      
      <GalleryFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        availableMaterials={availableMaterials}
        availableMethods={availableMethods}
        availableTags={availableTags}
      />
      
      <GalleryGrid 
        items={items}
        loading={loading}
        onItemClick={handleItemClick}
        emptyMessage="No gallery items found matching your filters."
      />
    </div>
  );
};

export default Gallery;