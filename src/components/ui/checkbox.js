import React from 'react';

const Checkbox = ({ 
  label, 
  checked = false, 
  onChange = () => {}, 
  ...props 
}) => {
  return (
    <div className="checkbox-container">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="checkbox-input"
          {...props}
        />
        <span className="checkbox-custom"></span>
        {label && <span className="checkbox-text">{label}</span>}
      </label>
    </div>
  );
};

export { Checkbox };
