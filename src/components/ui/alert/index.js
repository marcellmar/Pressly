import React from 'react';

const Alert = ({ children, variant = "default", className = "", ...props }) => {
  const variantClasses = {
    default: "bg-gray-100 border-gray-200 text-gray-800",
    success: "bg-green-100 border-green-200 text-green-800",
    warning: "bg-yellow-100 border-yellow-200 text-yellow-800",
    destructive: "bg-red-100 border-red-200 text-red-800"
  };

  return (
    <div
      className={`flex items-start p-4 border rounded-md ${variantClasses[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ children, className = "", ...props }) => {
  return (
    <h5
      className={`font-medium text-sm ml-2 ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
};

const AlertDescription = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`text-sm ml-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription };