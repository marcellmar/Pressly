/**
 * ZUO Level Progress Component
 * 
 * Shows user's progression through ZUO levels
 */

import React from 'react';

const ZuoLevelProgress = ({ level, progress }) => {
  const levelNames = {
    1: 'Starter',
    2: 'Regular',
    3: 'Power User',
    4: 'Producer Ready'
  };

  const levelIcons = {
    1: '🌱',
    2: '🌿',
    3: '🌳',
    4: '🏆'
  };

  return (
    <div className="zuo-level-progress">
      <div className="level-badge">
        <span className="level-icon">{levelIcons[level]}</span>
        <span className="level-name">{levelNames[level]}</span>
      </div>
      
      {progress.next_level && (
        <div className="level-progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress.progress_percentage}%` }}
          ></div>
          <span className="progress-text">
            {progress.orders_to_next_level} to next level
          </span>
        </div>
      )}
    </div>
  );
};

export default ZuoLevelProgress;