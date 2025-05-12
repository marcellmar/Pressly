import React from 'react';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type || 'text'}
      className={`px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
