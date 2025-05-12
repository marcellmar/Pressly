import React from 'react';
import { 
  getProfileImageUrl, 
  getDesignImageUrl, 
  getPrinterImageUrl, 
  getGarmentImageUrl, 
  getEcoFriendlyImageUrl 
} from '../../utils/unsplashUtils';
import { UnsplashImage } from '../ui/image';

/**
 * Demo component to showcase the different Unsplash image utilities
 */
const UnsplashDemo = () => {
  // Generate sample seeds
  const generateSeed = (prefix, index) => `${prefix}-${index}`;
  
  // Create image categories
  const imageCategories = [
    {
      title: 'Profile Images',
      description: 'Used for user and designer profiles',
      images: Array(4).fill().map((_, i) => ({
        url: getProfileImageUrl(generateSeed('profile', i), 200),
        caption: `Profile ${i + 1}`,
        seed: generateSeed('profile', i)
      }))
    },
    {
      title: 'Design Images',
      description: 'Used for design/artwork samples',
      images: Array(4).fill().map((_, i) => ({
        url: getDesignImageUrl(generateSeed('design', i), 300, 200),
        caption: `Design ${i + 1}`,
        seed: generateSeed('design', i)
      }))
    },
    {
      title: 'Printer Images',
      description: 'Used for printer/production facilities',
      images: Array(4).fill().map((_, i) => ({
        url: getPrinterImageUrl(generateSeed('printer', i), 300, 200),
        caption: `Printer ${i + 1}`,
        seed: generateSeed('printer', i)
      }))
    },
    {
      title: 'Garment Images',
      description: 'Used for garment/apparel',
      images: Array(4).fill().map((_, i) => ({
        url: getGarmentImageUrl(generateSeed('garment', i), 300, 200),
        caption: `Garment ${i + 1}`,
        seed: generateSeed('garment', i)
      }))
    },
    {
      title: 'Eco-Friendly Images',
      description: 'Used for sustainable/eco-friendly content',
      images: Array(4).fill().map((_, i) => ({
        url: getEcoFriendlyImageUrl(generateSeed('eco', i), 300, 200),
        caption: `Eco-Friendly ${i + 1}`,
        seed: generateSeed('eco', i)
      }))
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Unsplash Image Utilities Demo</h1>
      <p className="mb-8">
        This demo showcases the different types of Unsplash images available through 
        our utility functions. All images are sourced from Unsplash and are consistently
        generated based on seed values.
      </p>
      
      {imageCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-12">
          <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
          <p className="text-gray-600 mb-4">{category.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.images.map((image, imageIndex) => (
              <div key={imageIndex} className="border rounded-lg overflow-hidden">
                <div className="h-40">
                  <UnsplashImage 
                    src={image.url} 
                    alt={image.caption}
                    className="w-full h-full"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{image.caption}</h3>
                  <p className="text-xs text-gray-500">Seed: {image.seed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Attribution</h2>
        <p>
          All images are sourced from Unsplash. In a production environment, 
          be sure to follow <a href="https://unsplash.com/documentation#guidelines--crediting" 
          className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Unsplash's attribution requirements
          </a>.
        </p>
      </div>
    </div>
  );
};

export default UnsplashDemo;
