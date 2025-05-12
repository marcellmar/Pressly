import React from 'react';

const Avatar = ({ className = "", ...props }) => {
  return (
    <div
      className={`relative inline-block ${className}`}
      {...props}
    />
  );
};

const AvatarImage = ({ 
  src, 
  alt = "", 
  className = "", 
  ...props 
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover rounded-full ${className}`}
      {...props}
    />
  );
};

const AvatarFallback = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Avatar, AvatarImage, AvatarFallback };