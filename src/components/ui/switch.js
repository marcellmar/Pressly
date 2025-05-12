import React, { useState } from 'react';

const Switch = ({ 
  defaultChecked = false, 
  onChange = () => {}, 
  label,
  ...props 
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  
  const handleChange = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onChange(newState);
  };
  
  return (
    <div className="switch-container">
      <label className="switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />
        <span className="slider round"></span>
      </label>
      {label && <span className="switch-label">{label}</span>}
    </div>
  );
};

export { Switch };
