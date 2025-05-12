import React from 'react';
import { UnsplashImage } from './index';
import { generateFallbackImages } from '../../../utils/imageUtils';

/**
 * Test component to verify image loading behavior
 */
const ImageTest = () => {
  // Test cases with various scenarios
  const testCases = [
    {
      name: 'Valid Producer Image',
      src: 'https://source.unsplash.com/random/400x300/?printing,shop',
      fallbacks: generateFallbackImages('producer', 'test-1', { width: 400, height: 300 })
    },
    {
      name: 'Invalid URL with Designer Fallbacks',
      src: 'https://invalid-url-that-will-fail-to-load.com/image.jpg',
      fallbacks: generateFallbackImages('designer', 'test-2', { width: 400, height: 300 })
    },
    {
      name: 'Designer Portfolio Image',
      src: 'https://source.unsplash.com/random/400x300/?design,portfolio',
      fallbacks: generateFallbackImages('design', 'test-3', { width: 400, height: 300 })
    },
    {
      name: 'Single String Fallback',
      src: 'https://invalid-url-example.com/image.jpg',
      fallbacks: 'https://source.unsplash.com/random/400x300/?fallback'
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCases.map((test, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-3">{test.name}</h2>
            <div className="h-48 bg-gray-50 rounded overflow-hidden mb-3">
              <UnsplashImage
                src={test.src}
                alt={`Test image ${index + 1}`}
                className="w-full h-full"
                fallbackSrc={test.fallbacks}
              />
            </div>
            <div className="text-sm text-gray-600">
              <div><strong>Primary Source:</strong> {test.src}</div>
              <div>
                <strong>Fallbacks:</strong>
                {Array.isArray(test.fallbacks) ? (
                  <ul className="list-disc pl-5 mt-1">
                    {test.fallbacks.map((url, i) => (
                      <li key={i} className="truncate">{url}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="ml-2">{test.fallbacks}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;