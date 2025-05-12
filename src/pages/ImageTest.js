import React from 'react';
import { UnsplashImage } from '../components/ui/image';
import { getReliableImageUrl, getTypedPlaceholder } from '../utils/imageUtils';

/**
 * Test page for verifying image loading across Pressly
 */
const ImageTest = () => {
  // Test cases for producer images
  const producerTests = [
    {
      id: 1,
      name: "PrintMasters Inc.",
      index: 0
    },
    {
      id: 2,
      name: "Eco Prints Chicago",
      index: 1
    },
    {
      id: 3,
      name: "Chicago Signs and Screen Printing",
      index: 2
    }
  ];
  
  // Test cases for designer images
  const designerTests = [
    {
      id: 1,
      name: "Alex Rivera",
      index: 0
    },
    {
      id: 2,
      name: "Maya Johnson",
      index: 1
    },
    {
      id: 3,
      name: "David Kim",
      index: 2
    }
  ];
  
  // Test cases for design images
  const designTests = [
    {
      id: 1,
      name: "Summer T-Shirt Design",
      index: 0
    },
    {
      id: 2,
      name: "Event Poster",
      index: 1
    },
    {
      id: 3,
      name: "Business Cards",
      index: 2
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pressly Image Loading Test</h1>
      <p className="text-lg text-gray-600 mb-8">
        This page tests image loading functionality across Pressly to ensure all images display correctly.
      </p>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Producer Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {producerTests.map((producer) => (
            <div key={producer.id} className="border rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-100">
                <UnsplashImage 
                  src={getReliableImageUrl('producer', producer.id, { 
                    width: 400, 
                    height: 300,
                    index: producer.index
                  })}
                  alt={producer.name}
                  className="w-full h-full object-cover"
                  fallbackSrc={getTypedPlaceholder('producer', 400, 300)}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{producer.name}</h3>
                <p className="text-sm text-gray-500">Producer ID: {producer.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Designer Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {designerTests.map((designer) => (
            <div key={designer.id} className="border rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-100">
                <UnsplashImage 
                  src={getReliableImageUrl('designer', designer.id, { 
                    width: 400, 
                    height: 300,
                    index: designer.index
                  })}
                  alt={designer.name}
                  className="w-full h-full object-cover"
                  fallbackSrc={getTypedPlaceholder('designer', 400, 300)}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{designer.name}</h3>
                <p className="text-sm text-gray-500">Designer ID: {designer.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Design Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {designTests.map((design) => (
            <div key={design.id} className="border rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-100">
                <UnsplashImage 
                  src={getReliableImageUrl('design', design.id, { 
                    width: 400, 
                    height: 300,
                    index: design.index
                  })}
                  alt={design.name}
                  className="w-full h-full object-cover"
                  fallbackSrc={getTypedPlaceholder('design', 400, 300)}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{design.name}</h3>
                <p className="text-sm text-gray-500">Design ID: {design.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-8 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Typed Placeholders (Ultimate Fallbacks)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-100">
              <UnsplashImage 
                src={getTypedPlaceholder('producer', 400, 300)}
                alt="Producer Placeholder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">Producer Placeholder</h3>
              <p className="text-sm text-gray-500">Fallback image for producers</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-100">
              <UnsplashImage 
                src={getTypedPlaceholder('designer', 400, 300)}
                alt="Designer Placeholder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">Designer Placeholder</h3>
              <p className="text-sm text-gray-500">Fallback image for designers</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-100">
              <UnsplashImage 
                src={getTypedPlaceholder('design', 400, 300)}
                alt="Design Placeholder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">Design Placeholder</h3>
              <p className="text-sm text-gray-500">Fallback image for designs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTest;