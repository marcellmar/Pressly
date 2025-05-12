import React from 'react';

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      className={`block text-sm font-medium mb-1 ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});

Label.displayName = 'Label';

export { Label };
