import React from 'react';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
