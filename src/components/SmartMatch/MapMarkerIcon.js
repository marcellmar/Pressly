import React from 'react';

/**
 * MapMarkerIcon Component
 * 
 * Renders custom markers for Leaflet map
 * Used for user locations and print producers
 */
const MapMarkerIcon = ({ type = 'producer', availability = 'high', size = 'medium' }) => {
  // Determine icon based on type
  let iconClass = 'fas ';
  let iconColor = '';
  
  switch (type) {
    case 'user':
      iconClass += 'fa-user-circle';
      iconColor = 'var(--primary)';
      break;
    case 'producer':
      iconClass += 'fa-print';
      iconColor = availability === 'high' ? '#28a745' : '#ffc107';
      break;
    case 'match':
      iconClass += 'fa-star';
      iconColor = '#ff6b6b';
      break;
    default:
      iconClass += 'fa-map-marker-alt';
      iconColor = 'var(--primary)';
  }
  
  // Determine size
  const sizeMap = {
    small: { width: 20, height: 20, fontSize: 12 },
    medium: { width: 30, height: 30, fontSize: 16 },
    large: { width: 40, height: 40, fontSize: 22 }
  };
  
  const { width, height, fontSize } = sizeMap[size] || sizeMap.medium;
  
  // Styling for the marker
  const styles = {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: type === 'user' ? 'transparent' : 'white',
      borderRadius: '50%',
      boxShadow: type === 'user' ? 'none' : '0 2px 5px rgba(0,0,0,0.2)',
      position: 'relative'
    },
    icon: {
      color: iconColor,
      fontSize: `${fontSize}px`,
    }
  };
  
  return (
    <div style={styles.wrapper}>
      <i className={iconClass} style={styles.icon}></i>
    </div>
  );
};

export default MapMarkerIcon;