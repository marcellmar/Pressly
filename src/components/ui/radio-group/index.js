import React from 'react';

const RadioGroup = ({ children, className = "", ...props }) => {
  return (
    <div
      role="radiogroup"
      className={`space-y-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const RadioGroupItem = ({ 
  id, 
  value, 
  checked, 
  onChange, 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
        {...props}
      />
      <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">
        {children}
      </label>
    </div>
  );
};

export { RadioGroup, RadioGroupItem };