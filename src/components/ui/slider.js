import React, { useState } from 'react';

const Slider = ({ 
  min = 0, 
  max = 100, 
  step = 1, 
  defaultValue = 50, 
  onChange = () => {},
  label,
  ...props 
}) => {
  const [value, setValue] = useState(defaultValue);
  
  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onChange(newValue);
  };
  
  return (
    <div className="slider-container">
      {label && <label className="slider-label">{label}</label>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider"
        {...props}
      />
      <div className="slider-value">{value}</div>
    </div>
  );
};

export { Slider };
