import React from 'react';

// Define badgeVariants as a function that returns class names
const badgeVariants = ({ 
  variant = 'default', 
  className = '' 
}) => {
  const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
  };
  
  const variantClass = variants[variant] || variants.default;
  
  return `${baseClass} ${variantClass} ${className}`;
};

const Badge = ({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <div className={badgeVariants({ variant, className })} {...props}>
      {children}
    </div>
  );
};

export { Badge, badgeVariants };
