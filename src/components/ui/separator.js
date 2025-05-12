import React from 'react';
import PropTypes from 'prop-types';

/**
 * Separator component used to visually separate content
 */
const Separator = ({ 
  orientation = 'horizontal', 
  className = '',
  decorative = true,
  ...props 
}) => {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={`bg-border ${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
      } ${className}`}
      {...props}
    />
  );
};

Separator.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
  decorative: PropTypes.bool
};

export { Separator };