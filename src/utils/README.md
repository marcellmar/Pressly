# Pressly Image Usage Guidelines

## Unsplash Integration

This project uses [Unsplash](https://unsplash.com) as the primary source for images throughout the application. The implementation includes utility functions and components to make working with Unsplash images easier and more consistent.

## Image Utilities

### Location
`src/utils/unsplashUtils.js` contains utility functions for generating consistent Unsplash URLs.

### Available Functions

1. **getUnsplashUrl** - Base function for generating Unsplash URLs
   ```js
   getUnsplashUrl(category, seed, width, height)
   ```

2. **getProfileImageUrl** - For user/designer profile images
   ```js
   getProfileImageUrl(seed, size)
   ```

3. **getDesignImageUrl** - For design/artwork images
   ```js
   getDesignImageUrl(seed, width, height)
   ```

4. **getPrinterImageUrl** - For printer/production facility images
   ```js
   getPrinterImageUrl(seed, width, height)
   ```

5. **getGarmentImageUrl** - For garment/apparel images
   ```js
   getGarmentImageUrl(seed, width, height)
   ```

6. **getEcoFriendlyImageUrl** - For eco-friendly/sustainable themed images
   ```js
   getEcoFriendlyImageUrl(seed, width, height)
   ```

## Image Component

### Location
`src/components/ui/image/UnsplashImage.js` provides a React component for handling Unsplash images.

### Features
- Loading states with skeleton placeholder
- Error handling with fallback images
- Consistent styling and transitions

### Usage
```jsx
import { UnsplashImage } from '../components/ui/image';

// Basic usage
<UnsplashImage 
  src={imageUrl} 
  alt="Image description" 
  className="w-full h-full" 
/>

// With custom dimensions
<UnsplashImage 
  src={imageUrl} 
  alt="Image description" 
  width={300}
  height={200}
/>

// With custom fallback
<UnsplashImage 
  src={imageUrl} 
  alt="Image description" 
  fallbackSrc="path/to/fallback.jpg"
/>
```

## Best Practices

1. **Always Use Seeds**: When generating Unsplash URLs, always use a consistent "seed" (like ID or unique string) to ensure the same image is displayed each time for a given entity.

2. **Use Appropriate Categories**: Select the appropriate utility function based on the content type (profile, design, printer, etc.).

3. **Specify Alt Text**: Always provide meaningful alt text for accessibility.

4. **Optimize Size**: Only request the image dimensions you need to improve performance.

5. **Use the UnsplashImage Component**: Prefer the UnsplashImage component over standard img tags for consistent loading behavior and error handling.

## Attribution

When using Unsplash images in a production environment, make sure to follow [Unsplash's attribution requirements](https://unsplash.com/documentation#guidelines--crediting).
