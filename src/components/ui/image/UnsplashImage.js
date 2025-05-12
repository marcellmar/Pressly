import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { preloadImage, getStaticPlaceholder } from '../../../utils/imageUtils';

/**
 * UnsplashImage component that handles loading states and fallbacks
 * for images sourced from Unsplash
 */
const UnsplashImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  fallbackSrc,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [attempts, setAttempts] = useState(0);
  const [placeholderSrc] = useState(() => getStaticPlaceholder(width || 300, height || 200, 'Loading...'));

  // Update image source if prop changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
    setAttempts(0);
    
    // Try to preload the image
    preloadImage(src)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        handleError();
      });
  }, [src]);

  // Default fallback image if none provided
  const defaultFallback = getStaticPlaceholder(width || 300, height || 200, 'Pressly');
  
  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    // Track attempts to prevent infinite loops
    setAttempts(prev => prev + 1);
    
    // Try with a fallback or default image
    if (fallbackSrc && attempts < 2) {
      // If fallbackSrc is a string, use it directly
      if (typeof fallbackSrc === 'string') {
        setImageSrc(fallbackSrc);
      } 
      // If fallbackSrc is an array, cycle through the options
      else if (Array.isArray(fallbackSrc) && fallbackSrc.length > 0) {
        const index = attempts % fallbackSrc.length;
        setImageSrc(fallbackSrc[index]);
      }
    } else {
      // If all else fails, use the default fallback
      setImageSrc(defaultFallback);
    }
  };

  // Create image style
  const imageStyle = {
    objectFit,
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };

  // Loading skeleton with placeholder
  const loadingSkeleton = (
    <div 
      className="animate-pulse bg-gray-200 rounded"
      style={{ 
        width: width ? `${width}px` : '100%', 
        height: height ? `${height}px` : '100%',
        backgroundImage: `url(${placeholderSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
  );

  return (
    <div className={`relative ${className}`} style={{ minHeight: '50px' }}>
      {isLoading && loadingSkeleton}
      
      <img
        src={imageSrc}
        alt={alt}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

UnsplashImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  fallbackSrc: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
};

export default UnsplashImage;