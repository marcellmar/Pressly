import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import './tooltip.css';
import PropTypes from 'prop-types';

// Create context for tooltip state
const TooltipContext = createContext({
  open: false,
  setOpen: () => {},
  content: null,
  setContent: () => {},
  position: 'top',
  setPosition: () => {},
  triggerRect: null,
  setTriggerRect: () => {}
});

/**
 * TooltipProvider component to provide context for tooltip functionality
 */
export const TooltipProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [position, setPosition] = useState('top');
  const [triggerRect, setTriggerRect] = useState(null);

  const value = {
    open,
    setOpen,
    content,
    setContent,
    position,
    setPosition,
    triggerRect,
    setTriggerRect
  };

  return (
    <TooltipContext.Provider value={value}>
      {children}
    </TooltipContext.Provider>
  );
};

TooltipProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Tooltip component that wraps TooltipTrigger and TooltipContent
 */
export const Tooltip = ({ children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="tooltip-root">
      {React.Children.map(children, child => {
        return React.cloneElement(child, { open, setOpen });
      })}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool
};

/**
 * TooltipTrigger component - the element that triggers the tooltip
 */
export const TooltipTrigger = ({ children, asChild = false, open, setOpen }) => {
  const { setTriggerRect } = useContext(TooltipContext);
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const triggerProps = {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave,
  };

  if (asChild) {
    return React.cloneElement(children, triggerProps);
  }

  return (
    <span className="tooltip-trigger" {...triggerProps}>
      {children}
    </span>
  );
};

TooltipTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  asChild: PropTypes.bool,
  open: PropTypes.bool,
  setOpen: PropTypes.func
};

/**
 * TooltipContent component - the content displayed in the tooltip
 */
export const TooltipContent = ({ children, className = '', side = 'top', align = 'center' }) => {
  const { open, triggerRect } = useContext(TooltipContext);
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    if (open && tooltipRef.current && triggerRect) {
      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Position calculation - using simpler positioning for greater stability
      // Default to middle top positioning (most common)      
      // First position the tooltip in the center, then adjust based on side
      const triggerCenterX = triggerRect.left + (triggerRect.width / 2);
      const triggerCenterY = triggerRect.top + (triggerRect.height / 2);
      
      let top, left;
      
      // Apply positioning based on side
      switch (side) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerCenterX - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerCenterX - (tooltipRect.width / 2);
          break;
        case 'left':
          left = triggerRect.left - tooltipRect.width - 8;
          top = triggerCenterY - (tooltipRect.height / 2);
          break;
        case 'right':
          left = triggerRect.right + 8;
          top = triggerCenterY - (tooltipRect.height / 2);
          break;
        default:
          // Default to top
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerCenterX - (tooltipRect.width / 2);
      }
      
      // Make sure tooltip stays within viewport
      // Prevent going offscreen to the left
      if (left < 10) left = 10;
      // Prevent going offscreen to the right
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      // Prevent going offscreen at the top
      if (top < 10) {
        // If tooltip would go off the top, position it below the trigger instead
        top = triggerRect.bottom + 8;
      }
      
      // Apply positioning
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }
  }, [open, triggerRect, side, align]);
  
  if (!open) return null;
  
  return (
    <div 
      ref={tooltipRef}
      className={`tooltip tooltip-${side} ${className}`}
      role="tooltip"
    >
      {children}
    </div>
  );
};

TooltipContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  side: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  align: PropTypes.oneOf(['start', 'center', 'end'])
};

// Also export the simple Tooltip component for backward compatibility
const SimpleTooltip = ({ children, content, position = 'top', className = '' }) => {
  // For simplicity, use the TooltipProvider pattern for the simple tooltip as well
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={React.isValidElement(children)}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={position} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

SimpleTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string
};

export default SimpleTooltip;
