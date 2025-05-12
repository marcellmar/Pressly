/**
 * Utility functions for optimizing image loading, processing, and handling errors.
 * Provides both traditional URL-based methods and Canvas-based image processing.
 */

// Free image APIs that don't require authentication
const FREE_IMAGE_APIS = {
  // Picsum Photos - completely free, no attribution required
  picsum: (width, height, id) => `https://picsum.photos/seed/${id || Math.random()}/${width}/${height}`,
  
  // Placeholder.com - generates text placeholders
  placeholder: (width, height, text) => `https://via.placeholder.com/${width}x${height}/${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  
  // Lorem Flickr - random images from Flickr
  loremFlickr: (width, height, category) => `https://loremflickr.com/${width}/${height}/${category || 'business'}`,
  
  // PlaceIMG - categorized placeholder images
  placeImg: (width, height, category) => `https://placeimg.com/${width}/${height}/${category || 'any'}`,
  
  // Placeholder Images (grayscale)
  placekitten: (width, height) => `https://placekitten.com/g/${width}/${height}`,
  
  // Fake image generator
  fakeimg: (width, height, text, bg = '282828', textColor = 'eae0d0') => 
    `https://fakeimg.pl/${width}x${height}/${bg}/${textColor}/?text=${encodeURIComponent(text || 'Image')}`,
};

// Image processing defaults
const DEFAULT_IMAGE_QUALITY = 0.85;
const MAX_WIDTH = 1800;
const MAX_HEIGHT = 1800;

/**
 * Force image preloading to reduce layout shifts
 * @param {string} src - Image URL to preload
 * @returns {Promise} - Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Generate reliable image URLs for different entity types
 * @param {string} entityType - Type of entity ('producer', 'designer', 'design')
 * @param {string|number} id - Entity ID for consistent image generation
 * @param {object} options - Configuration options
 * @returns {string} - Reliable image URL
 */
export const getReliableImageUrl = (entityType, id, options = {}) => {
  const { 
    width = 400, 
    height = 300,
    index = 0
  } = options;
  
  // Create a stable seed from the entity type and ID
  const seed = `${entityType}-${id}-${index}`;
  
  // Pick a service based on entity type for better categorization
  switch (entityType) {
    case 'producer':
      if (index % 3 === 0) {
        return FREE_IMAGE_APIS.picsum(width, height, seed);
      } else if (index % 3 === 1) {
        return FREE_IMAGE_APIS.placeImg(width, height, 'tech');
      } else {
        return FREE_IMAGE_APIS.loremFlickr(width, height, 'business,printing');
      }
    
    case 'designer':
      if (index % 3 === 0) {
        return FREE_IMAGE_APIS.picsum(width, height, `designer-${seed}`);
      } else if (index % 3 === 1) {
        return FREE_IMAGE_APIS.placeImg(width, height, 'people');
      } else {
        return FREE_IMAGE_APIS.loremFlickr(width, height, 'designer,person');
      }
    
    case 'design':
      if (index % 3 === 0) {
        return FREE_IMAGE_APIS.picsum(width, height, `design-${seed}`);
      } else if (index % 3 === 1) {
        return FREE_IMAGE_APIS.placeImg(width, height, 'arch');
      } else {
        return FREE_IMAGE_APIS.loremFlickr(width, height, 'design');
      }
    
    default:
      return FREE_IMAGE_APIS.picsum(width, height, seed);
  }
};

/**
 * Generate multiple fallback image URLs for consistent loading
 * @param {string} entityType - Type of entity ('producer', 'designer', 'design')
 * @param {string|number} id - Entity ID for consistent image generation
 * @param {object} options - Configuration options
 * @returns {Array<string>} - Array of fallback image URLs
 */
export const generateFallbackImages = (entityType, id, options = {}) => {
  const { 
    width = 400, 
    height = 300,
    count = 3
  } = options;
  
  return Array.from({ length: count }, (_, i) => 
    getReliableImageUrl(entityType, id, { width, height, index: i })
  );
};

/**
 * Get static placeholder images that are guaranteed to work
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Optional text to overlay on image
 * @returns {string} - Placeholder image URL
 */
export const getStaticPlaceholder = (width = 400, height = 300, text = 'Image') => {
  // Use placeholder.com which is very reliable
  return FREE_IMAGE_APIS.placeholder(width, height, text);
};

/**
 * Generate a text-based placeholder for entity types
 * @param {string} entityType - Type of entity
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} - Placeholder image URL with appropriate text and colors
 */
export const getTypedPlaceholder = (entityType, width = 400, height = 300) => {
  switch(entityType) {
    case 'producer':
      return FREE_IMAGE_APIS.fakeimg(width, height, 'Print Producer', '3a6ea5', 'ffffff');
    case 'designer':
      return FREE_IMAGE_APIS.fakeimg(width, height, 'Designer', 'ff6b6b', 'ffffff');
    case 'design':
      return FREE_IMAGE_APIS.fakeimg(width, height, 'Design', '28a745', 'ffffff');
    default:
      return FREE_IMAGE_APIS.fakeimg(width, height, 'Pressly', '282828', 'ffffff');
  }
};

/**
 * Check if an image exists without rendering it
 * @param {string} url - URL of the image to check
 * @returns {Promise<boolean>} - Promise that resolves to true if image exists
 */
export const checkImageExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/*******************************************************************
 * Canvas-based Image Processing Methods
 *******************************************************************/

/**
 * Load an image from various sources (URL, File, Blob, or Data URL)
 * @param {string|File|Blob} source - Image source
 * @returns {Promise<HTMLImageElement>} - Promise that resolves with loaded image
 */
export const loadImage = async (source) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    
    if (typeof source === 'string') {
      // If source is a URL or data URL
      img.crossOrigin = 'anonymous';
      img.src = source;
    } else if (source instanceof File || source instanceof Blob) {
      // If source is a File or Blob
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(source);
    } else {
      reject(new Error('Unsupported image source'));
    }
  });
};

/**
 * Resize an image using Canvas
 * @param {HTMLImageElement|string|File|Blob} image - Image to resize
 * @param {Object} options - Resize options
 * @returns {Promise<string>} - Promise that resolves with resized image as data URL
 */
export const resizeImage = async (image, options = {}) => {
  const {
    width = undefined,
    height = undefined,
    maxWidth = MAX_WIDTH,
    maxHeight = MAX_HEIGHT,
    maintainAspectRatio = true,
    quality = DEFAULT_IMAGE_QUALITY,
    format = 'image/jpeg',
    scaleMethod = 'bilinear', // 'bilinear', 'pixelated', 'smooth'
  } = options;
  
  // Load the image if it's not already an HTMLImageElement
  const img = image instanceof HTMLImageElement 
    ? image 
    : await loadImage(image);
  
  // Calculate new dimensions
  let newWidth, newHeight;
  
  if (width && height) {
    // If both width and height are specified
    newWidth = width;
    newHeight = height;
  } else if (width) {
    // If only width is specified
    newWidth = width;
    newHeight = maintainAspectRatio ? (width * img.height / img.width) : img.height;
  } else if (height) {
    // If only height is specified
    newHeight = height;
    newWidth = maintainAspectRatio ? (height * img.width / img.height) : img.width;
  } else {
    // If neither width nor height is specified, use original dimensions
    // but constrain to maxWidth and maxHeight
    newWidth = img.width;
    newHeight = img.height;
  }
  
  // Ensure dimensions don't exceed maximum
  if (newWidth > maxWidth) {
    newHeight = newHeight * (maxWidth / newWidth);
    newWidth = maxWidth;
  }
  
  if (newHeight > maxHeight) {
    newWidth = newWidth * (maxHeight / newHeight);
    newHeight = maxHeight;
  }
  
  // Round dimensions to integers
  newWidth = Math.round(newWidth);
  newHeight = Math.round(newHeight);
  
  // Create canvas with new dimensions
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  const ctx = canvas.getContext('2d');
  
  // Set scaling method
  if (scaleMethod === 'pixelated') {
    ctx.imageSmoothingEnabled = false;
  } else if (scaleMethod === 'smooth') {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  } else {
    // Default bilinear
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
  }
  
  // Draw image to canvas with new dimensions
  ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
  // Return as data URL
  return canvas.toDataURL(format, quality);
};

/**
 * Crop an image using Canvas
 * @param {HTMLImageElement|string|File|Blob} image - Image to crop
 * @param {Object} cropArea - Crop dimensions {x, y, width, height}
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Promise that resolves with cropped image as data URL
 */
export const cropImage = async (image, cropArea, options = {}) => {
  const {
    quality = DEFAULT_IMAGE_QUALITY,
    format = 'image/jpeg'
  } = options;
  
  // Load the image if it's not already an HTMLImageElement
  const img = image instanceof HTMLImageElement 
    ? image 
    : await loadImage(image);
  
  // Validate crop area
  const { x, y, width, height } = cropArea;
  
  if (x < 0 || y < 0 || width <= 0 || height <= 0 || 
      x + width > img.width || y + height > img.height) {
    throw new Error('Invalid crop area: Crop dimensions must be within image bounds');
  }
  
  // Create canvas with crop dimensions
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Draw cropped region to canvas
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
  
  // Return as data URL
  return canvas.toDataURL(format, quality);
};

/**
 * Apply filters to an image using Canvas
 * @param {HTMLImageElement|string|File|Blob} image - Image to process
 * @param {Object} filters - Filter options
 * @returns {Promise<string>} - Promise that resolves with filtered image as data URL
 */
export const applyImageFilters = async (image, filters = {}) => {
  const {
    brightness = 0, // -100 to 100
    contrast = 0,   // -100 to 100
    saturation = 0, // -100 to 100
    hue = 0,        // -180 to 180
    blur = 0,       // 0 to 10
    grayscale = 0,  // 0 to 100
    sepia = 0,      // 0 to 100
    invert = 0,     // 0 to 100
    quality = DEFAULT_IMAGE_QUALITY,
    format = 'image/jpeg'
  } = filters;
  
  // Load the image if it's not already an HTMLImageElement
  const img = image instanceof HTMLImageElement 
    ? image 
    : await loadImage(image);
  
  // Create canvas with image dimensions
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  
  const ctx = canvas.getContext('2d');
  
  // Draw image to canvas
  ctx.drawImage(img, 0, 0);
  
  // Get image data
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  
  // Apply filters to each pixel
  for (let i = 0; i < data.length; i += 4) {
    // Get pixel values
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    
    // Apply brightness
    if (brightness !== 0) {
      const adjustBrightness = brightness * 2.55; // Convert to 0-255 range
      r = Math.max(0, Math.min(255, r + adjustBrightness));
      g = Math.max(0, Math.min(255, g + adjustBrightness));
      b = Math.max(0, Math.min(255, b + adjustBrightness));
    }
    
    // Apply contrast
    if (contrast !== 0) {
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      r = Math.max(0, Math.min(255, factor * (r - 128) + 128));
      g = Math.max(0, Math.min(255, factor * (g - 128) + 128));
      b = Math.max(0, Math.min(255, factor * (b - 128) + 128));
    }
    
    // Apply saturation
    if (saturation !== 0) {
      const satFactor = 1 + saturation / 100;
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      r = Math.max(0, Math.min(255, gray + satFactor * (r - gray)));
      g = Math.max(0, Math.min(255, gray + satFactor * (g - gray)));
      b = Math.max(0, Math.min(255, gray + satFactor * (b - gray)));
    }
    
    // Apply grayscale
    if (grayscale > 0) {
      const grayAmount = grayscale / 100;
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      r = r * (1 - grayAmount) + gray * grayAmount;
      g = g * (1 - grayAmount) + gray * grayAmount;
      b = b * (1 - grayAmount) + gray * grayAmount;
    }
    
    // Apply sepia
    if (sepia > 0) {
      const sepiaAmount = sepia / 100;
      const sepiaR = r * 0.393 + g * 0.769 + b * 0.189;
      const sepiaG = r * 0.349 + g * 0.686 + b * 0.168;
      const sepiaB = r * 0.272 + g * 0.534 + b * 0.131;
      r = r * (1 - sepiaAmount) + sepiaR * sepiaAmount;
      g = g * (1 - sepiaAmount) + sepiaG * sepiaAmount;
      b = b * (1 - sepiaAmount) + sepiaB * sepiaAmount;
    }
    
    // Apply invert
    if (invert > 0) {
      const invertAmount = invert / 100;
      r = r * (1 - invertAmount) + (255 - r) * invertAmount;
      g = g * (1 - invertAmount) + (255 - g) * invertAmount;
      b = b * (1 - invertAmount) + (255 - b) * invertAmount;
    }
    
    // Update pixel values
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  
  // Put modified image data back to canvas
  ctx.putImageData(imageData, 0, 0);
  
  // Apply blur (can't be done with pixel manipulation)
  if (blur > 0) {
    // Create a temporary canvas for blur effect
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw the current state to the temp canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Clear original canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply blur using CSS filter
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';
  }
  
  // Apply hue rotation
  if (hue !== 0) {
    // Create a temporary canvas for hue effect
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw the current state to the temp canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Clear original canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply hue rotation using CSS filter
    ctx.filter = `hue-rotate(${hue}deg)`;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';
  }
  
  // Return as data URL
  return canvas.toDataURL(format, quality);
};

/**
 * Generate a thumbnail from an image
 * @param {HTMLImageElement|string|File|Blob} image - Source image
 * @param {Object} options - Thumbnail options
 * @returns {Promise<string>} - Promise that resolves with thumbnail as data URL
 */
export const generateThumbnail = async (image, options = {}) => {
  const {
    width = 200,
    height = 200,
    maintainAspectRatio = true,
    quality = 0.7,
    format = 'image/jpeg',
    crop = 'center' // 'center', 'top', 'none'
  } = options;
  
  // Load the image if it's not already an HTMLImageElement
  const img = image instanceof HTMLImageElement 
    ? image 
    : await loadImage(image);
  
  // Create canvas for thumbnail
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Determine source and destination dimensions
  let sourceX, sourceY, sourceWidth, sourceHeight;
  let destX = 0, destY = 0, destWidth = width, destHeight = height;
  
  if (maintainAspectRatio) {
    // Calculate aspect ratios
    const sourceRatio = img.width / img.height;
    const destRatio = width / height;
    
    if (crop === 'none') {
      // Fit whole image without cropping (may have empty space)
      if (sourceRatio > destRatio) {
        // Image is wider than thumbnail
        destHeight = width / sourceRatio;
        destY = (height - destHeight) / 2;
      } else {
        // Image is taller than thumbnail
        destWidth = height * sourceRatio;
        destX = (width - destWidth) / 2;
      }
      
      sourceX = 0;
      sourceY = 0;
      sourceWidth = img.width;
      sourceHeight = img.height;
    } else {
      // Crop to fill the thumbnail
      if (sourceRatio > destRatio) {
        // Image is wider than thumbnail, crop sides
        sourceWidth = img.height * destRatio;
        sourceHeight = img.height;
        
        if (crop === 'center') {
          sourceX = (img.width - sourceWidth) / 2;
        } else if (crop === 'top') {
          sourceX = 0;
        } else {
          sourceX = img.width - sourceWidth;
        }
        
        sourceY = 0;
      } else {
        // Image is taller than thumbnail, crop top/bottom
        sourceWidth = img.width;
        sourceHeight = img.width / destRatio;
        
        sourceX = 0;
        
        if (crop === 'center') {
          sourceY = (img.height - sourceHeight) / 2;
        } else if (crop === 'top') {
          sourceY = 0;
        } else {
          sourceY = img.height - sourceHeight;
        }
      }
    }
  } else {
    // Just stretch the image to fit
    sourceX = 0;
    sourceY = 0;
    sourceWidth = img.width;
    sourceHeight = img.height;
  }
  
  // Fill background with white (for transparent images)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  
  // Draw image with calculated dimensions
  ctx.drawImage(
    img,
    sourceX, sourceY, sourceWidth, sourceHeight,
    destX, destY, destWidth, destHeight
  );
  
  // Return as data URL
  return canvas.toDataURL(format, quality);
};

/**
 * Add a watermark to an image
 * @param {HTMLImageElement|string|File|Blob} image - Image to watermark
 * @param {Object} options - Watermark options
 * @returns {Promise<string>} - Promise that resolves with watermarked image as data URL
 */
export const addWatermark = async (image, options = {}) => {
  const {
    text = 'Pressly',
    image: watermarkImage = null,
    position = 'center', // 'center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
    opacity = 0.3,
    rotation = -45,
    fontSize = 36,
    fontFamily = 'Arial',
    fontColor = 'rgba(255, 255, 255, 0.8)',
    repeat = false,
    padding = 20,
    quality = DEFAULT_IMAGE_QUALITY,
    format = 'image/jpeg'
  } = options;
  
  // Load the image if it's not already an HTMLImageElement
  const img = image instanceof HTMLImageElement 
    ? image 
    : await loadImage(image);
  
  // Create canvas with image dimensions
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  
  const ctx = canvas.getContext('2d');
  
  // Draw image to canvas
  ctx.drawImage(img, 0, 0);
  
  // Set watermark styles
  ctx.globalAlpha = opacity;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Determine watermark position
  let x, y;
  
  switch (position) {
    case 'topLeft':
      x = padding + fontSize;
      y = padding + fontSize / 2;
      break;
    case 'topRight':
      x = canvas.width - padding - fontSize;
      y = padding + fontSize / 2;
      break;
    case 'bottomLeft':
      x = padding + fontSize;
      y = canvas.height - padding - fontSize / 2;
      break;
    case 'bottomRight':
      x = canvas.width - padding - fontSize;
      y = canvas.height - padding - fontSize / 2;
      break;
    case 'center':
    default:
      x = canvas.width / 2;
      y = canvas.height / 2;
      break;
  }
  
  // Add image watermark if provided
  if (watermarkImage) {
    const wmImage = watermarkImage instanceof HTMLImageElement 
      ? watermarkImage 
      : await loadImage(watermarkImage);
    
    if (repeat) {
      // Create a pattern for repeating watermark
      const patternCanvas = document.createElement('canvas');
      const spacing = wmImage.width + padding;
      patternCanvas.width = spacing;
      patternCanvas.height = spacing;
      
      const patternCtx = patternCanvas.getContext('2d');
      patternCtx.globalAlpha = opacity;
      patternCtx.translate(spacing / 2, spacing / 2);
      patternCtx.rotate(rotation * Math.PI / 180);
      patternCtx.drawImage(wmImage, -wmImage.width / 2, -wmImage.height / 2);
      
      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Draw single watermark image
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.drawImage(wmImage, -wmImage.width / 2, -wmImage.height / 2);
      ctx.restore();
    }
  } else {
    // Add text watermark
    if (repeat) {
      // Calculate text metrics for spacing
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const spacing = textWidth + padding;
      
      // Create pattern
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = spacing * 2;
      patternCanvas.height = spacing;
      
      const patternCtx = patternCanvas.getContext('2d');
      patternCtx.globalAlpha = opacity;
      patternCtx.font = `${fontSize}px ${fontFamily}`;
      patternCtx.fillStyle = fontColor;
      patternCtx.textAlign = 'center';
      patternCtx.textBaseline = 'middle';
      patternCtx.translate(spacing, spacing / 2);
      patternCtx.rotate(rotation * Math.PI / 180);
      patternCtx.fillText(text, 0, 0);
      
      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Draw single text watermark
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }
  
  // Reset global alpha
  ctx.globalAlpha = 1.0;
  
  // Return as data URL
  return canvas.toDataURL(format, quality);
};

/**
 * Convert an image to grayscale
 * @param {HTMLImageElement|string|File|Blob} image - Image to convert
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Promise that resolves with grayscale image as data URL
 */
export const convertToGrayscale = async (image, options = {}) => {
  // Use the applyImageFilters function with grayscale set to 100%
  return applyImageFilters(image, {
    ...options,
    grayscale: 100
  });
};

/**
 * Optimize an image for web using Canvas
 * @param {HTMLImageElement|string|File|Blob} image - Image to optimize
 * @param {Object} options - Optimization options
 * @returns {Promise<string>} - Promise that resolves with optimized image as data URL
 */
export const optimizeImage = async (image, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = 'image/webp'
  } = options;
  
  // First resize the image to reasonable dimensions
  const resized = await resizeImage(image, {
    maxWidth,
    maxHeight,
    maintainAspectRatio: true,
    quality,
    format
  });
  
  return resized;
};

/**
 * Create a collage from multiple images
 * @param {Array<HTMLImageElement|string|File|Blob>} images - Array of images
 * @param {Object} options - Collage options
 * @returns {Promise<string>} - Promise that resolves with collage as data URL
 */
export const createCollage = async (images, options = {}) => {
  if (!images || images.length === 0) {
    throw new Error('No images provided for collage');
  }
  
  const {
    width = 800,
    height = 800,
    layout = 'grid', // 'grid', 'horizontal', 'vertical', 'pinterest'
    spacing = 10,
    backgroundColor = '#FFFFFF',
    border = 0,
    borderColor = '#000000',
    quality = DEFAULT_IMAGE_QUALITY,
    format = 'image/jpeg'
  } = options;
  
  // Load all images
  const loadedImages = await Promise.all(
    images.map(img => img instanceof HTMLImageElement ? Promise.resolve(img) : loadImage(img))
  );
  
  // Create canvas for collage
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // Calculate layout based on number of images
  const imageCount = loadedImages.length;
  let positions = [];
  
  if (layout === 'grid') {
    // Determine grid dimensions
    const cols = Math.ceil(Math.sqrt(imageCount));
    const rows = Math.ceil(imageCount / cols);
    
    // Calculate cell size
    const cellWidth = (width - spacing * (cols + 1)) / cols;
    const cellHeight = (height - spacing * (rows + 1)) / rows;
    
    // Generate positions
    for (let i = 0; i < imageCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      positions.push({
        x: spacing + col * (cellWidth + spacing),
        y: spacing + row * (cellHeight + spacing),
        width: cellWidth,
        height: cellHeight
      });
    }
  } else if (layout === 'horizontal') {
    // Horizontal strip
    const imgHeight = height - 2 * spacing;
    const imgWidth = (width - spacing * (imageCount + 1)) / imageCount;
    
    for (let i = 0; i < imageCount; i++) {
      positions.push({
        x: spacing + i * (imgWidth + spacing),
        y: spacing,
        width: imgWidth,
        height: imgHeight
      });
    }
  } else if (layout === 'vertical') {
    // Vertical strip
    const imgWidth = width - 2 * spacing;
    const imgHeight = (height - spacing * (imageCount + 1)) / imageCount;
    
    for (let i = 0; i < imageCount; i++) {
      positions.push({
        x: spacing,
        y: spacing + i * (imgHeight + spacing),
        width: imgWidth,
        height: imgHeight
      });
    }
  } else if (layout === 'pinterest') {
    // Pinterest-style layout (variable height)
    const cols = Math.min(4, imageCount);
    const colWidth = (width - spacing * (cols + 1)) / cols;
    const colHeights = Array(cols).fill(spacing);
    
    for (let i = 0; i < imageCount; i++) {
      // Find column with smallest height
      const colIndex = colHeights.indexOf(Math.min(...colHeights));
      
      // Calculate aspect ratio
      const aspectRatio = loadedImages[i].width / loadedImages[i].height;
      
      // Calculate image height based on aspect ratio
      const imgWidth = colWidth;
      const imgHeight = imgWidth / aspectRatio;
      
      // Add position
      positions.push({
        x: spacing + colIndex * (colWidth + spacing),
        y: colHeights[colIndex],
        width: colWidth,
        height: imgHeight
      });
      
      // Update column height
      colHeights[colIndex] += imgHeight + spacing;
    }
  }
  
  // Draw images to canvas
  positions.forEach((pos, index) => {
    if (index >= loadedImages.length) return;
    
    const img = loadedImages[index];
    
    // Draw border if specified
    if (border > 0) {
      ctx.fillStyle = borderColor;
      ctx.fillRect(pos.x - border, pos.y - border, pos.width + 2 * border, pos.height + 2 * border);
    }
    
    // Draw image
    ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
  });
  
  // Return as data URL
  return canvas.toDataURL(format, quality);
};

/**
 * Extract dominant colors from an image
 * @param {HTMLImageElement|string|File|Blob} image - Image to analyze
 * @param {Object} options - Analysis options
 * @returns {Promise<Array>} - Promise that resolves with array of color objects
 */
export const extractDominantColors = async (image, options = {}) => {
  const {
    colorCount = 5,
    quality = 10, // Lower means faster but less accurate
    ignoreWhite = true
  } = options;
  
  // Load the image if it's not already an HTMLImageElement
  const img = image instanceof HTMLImageElement 
    ? image 
    : await loadImage(image);
  
  // Create a small canvas for color analysis
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Scale down image for faster processing
  const scale = Math.min(1, 100 / Math.max(img.width, img.height));
  const width = Math.max(1, Math.floor(img.width * scale));
  const height = Math.max(1, Math.floor(img.height * scale));
  
  canvas.width = width;
  canvas.height = height;
  
  // Draw scaled image
  ctx.drawImage(img, 0, 0, width, height);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  // Create color map
  const colorMap = {};
  
  // Sample pixels
  for (let i = 0; i < pixels.length; i += 4 * quality) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Skip transparent or near-white pixels if ignoreWhite is true
    if (a < 128 || (ignoreWhite && r > 250 && g > 250 && b > 250)) {
      continue;
    }
    
    // Quantize colors to reduce color space
    const quantR = Math.floor(r / 16) * 16;
    const quantG = Math.floor(g / 16) * 16;
    const quantB = Math.floor(b / 16) * 16;
    
    const colorKey = `${quantR},${quantG},${quantB}`;
    
    if (!colorMap[colorKey]) {
      colorMap[colorKey] = {
        r: quantR,
        g: quantG,
        b: quantB,
        count: 0,
        hex: `#${quantR.toString(16).padStart(2, '0')}${quantG.toString(16).padStart(2, '0')}${quantB.toString(16).padStart(2, '0')}`
      };
    }
    
    colorMap[colorKey].count++;
  }
  
  // Convert to array and sort by count
  const colors = Object.values(colorMap).sort((a, b) => b.count - a.count);
  
  // Return top N colors
  return colors.slice(0, colorCount);
};

/**
 * Compare two images and calculate their similarity
 * @param {HTMLImageElement|string|File|Blob} image1 - First image
 * @param {HTMLImageElement|string|File|Blob} image2 - Second image
 * @param {Object} options - Comparison options
 * @returns {Promise<Object>} - Promise that resolves with similarity metrics
 */
export const compareImages = async (image1, image2, options = {}) => {
  const {
    method = 'pixelDifference', // 'pixelDifference', 'histogram', 'perceptual'
    sensitivity = 1.0, // Higher means more sensitive to differences
    size = 64 // Size to resize images for comparison
  } = options;
  
  // Load and resize both images to the same dimensions
  const img1 = await loadImage(image1);
  const img2 = await loadImage(image2);
  
  // Create consistent image data by resizing to same dimensions
  const resizedImg1 = await resizeImage(img1, { width: size, height: size });
  const resizedImg2 = await resizeImage(img2, { width: size, height: size });
  
  // Load resized images
  const compImg1 = await loadImage(resizedImg1);
  const compImg2 = await loadImage(resizedImg2);
  
  // Draw to canvas to get pixel data
  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');
  canvas1.width = canvas2.width = size;
  canvas1.height = canvas2.height = size;
  
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  
  ctx1.drawImage(compImg1, 0, 0, size, size);
  ctx2.drawImage(compImg2, 0, 0, size, size);
  
  const data1 = ctx1.getImageData(0, 0, size, size).data;
  const data2 = ctx2.getImageData(0, 0, size, size).data;
  
  let similarityScore;
  let diffImage;
  
  if (method === 'pixelDifference') {
    // Calculate pixel by pixel difference
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = size;
    diffCanvas.height = size;
    const diffCtx = diffCanvas.getContext('2d');
    const diffData = diffCtx.createImageData(size, size);
    const diffPixels = diffData.data;
    
    let totalDiff = 0;
    
    for (let i = 0; i < data1.length; i += 4) {
      const diff1 = Math.abs(data1[i] - data2[i]);
      const diff2 = Math.abs(data1[i + 1] - data2[i + 1]);
      const diff3 = Math.abs(data1[i + 2] - data2[i + 2]);
      
      const pixelDiff = (diff1 + diff2 + diff3) / 3;
      totalDiff += pixelDiff;
      
      // Create difference visualization
      diffPixels[i] = diffPixels[i + 1] = diffPixels[i + 2] = pixelDiff;
      diffPixels[i + 3] = 255;
    }
    
    diffCtx.putImageData(diffData, 0, 0);
    diffImage = diffCanvas.toDataURL('image/png');
    
    // Calculate similarity score (0-100)
    const maxPossibleDiff = 255 * data1.length / 4;
    similarityScore = 100 - (totalDiff / maxPossibleDiff * 100 * sensitivity);
  } else if (method === 'histogram') {
    // Create histograms
    const hist1 = { r: {}, g: {}, b: {} };
    const hist2 = { r: {}, g: {}, b: {} };
    
    // Initialize histograms
    for (let i = 0; i < 256; i++) {
      hist1.r[i] = hist1.g[i] = hist1.b[i] = 0;
      hist2.r[i] = hist2.g[i] = hist2.b[i] = 0;
    }
    
    // Fill histograms
    for (let i = 0; i < data1.length; i += 4) {
      hist1.r[data1[i]]++;
      hist1.g[data1[i + 1]]++;
      hist1.b[data1[i + 2]]++;
      
      hist2.r[data2[i]]++;
      hist2.g[data2[i + 1]]++;
      hist2.b[data2[i + 2]]++;
    }
    
    // Calculate histogram difference
    let totalDiff = 0;
    
    for (let i = 0; i < 256; i++) {
      totalDiff += Math.abs(hist1.r[i] - hist2.r[i]);
      totalDiff += Math.abs(hist1.g[i] - hist2.g[i]);
      totalDiff += Math.abs(hist1.b[i] - hist2.b[i]);
    }
    
    // Calculate similarity score (0-100)
    const maxPossibleDiff = data1.length / 4 * 3; // 3 channels
    similarityScore = 100 - (totalDiff / maxPossibleDiff * 100 * sensitivity);
    
    // Generate difference visualization
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = size;
    diffCanvas.height = size;
    const diffCtx = diffCanvas.getContext('2d');
    
    diffCtx.fillStyle = `rgba(0, 0, 0, ${1 - similarityScore / 100})`;
    diffCtx.fillRect(0, 0, size, size);
    diffImage = diffCanvas.toDataURL('image/png');
  } else {
    // Perceptual comparison
    // Apply blur to focus on overall structure rather than details
    const blurredCanvas1 = document.createElement('canvas');
    const blurredCanvas2 = document.createElement('canvas');
    blurredCanvas1.width = blurredCanvas2.width = size;
    blurredCanvas1.height = blurredCanvas2.height = size;
    
    const blurCtx1 = blurredCanvas1.getContext('2d');
    const blurCtx2 = blurredCanvas2.getContext('2d');
    
    blurCtx1.filter = 'blur(2px)';
    blurCtx2.filter = 'blur(2px)';
    
    blurCtx1.drawImage(compImg1, 0, 0, size, size);
    blurCtx2.drawImage(compImg2, 0, 0, size, size);
    
    const blurredData1 = blurCtx1.getImageData(0, 0, size, size).data;
    const blurredData2 = blurCtx2.getImageData(0, 0, size, size).data;
    
    // Calculate structural similarity
    let totalDiff = 0;
    
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = size;
    diffCanvas.height = size;
    const diffCtx = diffCanvas.getContext('2d');
    const diffData = diffCtx.createImageData(size, size);
    const diffPixels = diffData.data;
    
    for (let i = 0; i < blurredData1.length; i += 4) {
      const diff1 = Math.abs(blurredData1[i] - blurredData2[i]);
      const diff2 = Math.abs(blurredData1[i + 1] - blurredData2[i + 1]);
      const diff3 = Math.abs(blurredData1[i + 2] - blurredData2[i + 2]);
      
      const pixelDiff = Math.sqrt(diff1 * diff1 + diff2 * diff2 + diff3 * diff3) / Math.sqrt(3 * 255 * 255);
      totalDiff += pixelDiff;
      
      // Create difference visualization with colored areas
      const intensity = pixelDiff * 5; // Amplify differences
      diffPixels[i] = intensity * 255; // Red channel for differences
      diffPixels[i + 1] = 0;
      diffPixels[i + 2] = 0;
      diffPixels[i + 3] = intensity * 255; // Alpha for visibility
    }
    
    diffCtx.putImageData(diffData, 0, 0);
    
    // Composite difference onto image
    diffCtx.globalCompositeOperation = 'destination-over';
    diffCtx.drawImage(compImg1, 0, 0, size, size);
    
    diffImage = diffCanvas.toDataURL('image/png');
    
    // Calculate similarity score (0-100)
    const pixelCount = blurredData1.length / 4;
    similarityScore = 100 - (totalDiff / pixelCount * 100 * sensitivity);
  }
  
  // Ensure score is in 0-100 range
  similarityScore = Math.max(0, Math.min(100, similarityScore));
  
  return {
    similarity: similarityScore.toFixed(2),
    diffImage,
    method
  };
};
