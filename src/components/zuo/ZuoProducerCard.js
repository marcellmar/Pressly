/**
 * ZUO Producer Card Component
 * 
 * Simplified producer display for consumer interface
 */

import React from 'react';

const ZuoProducerCard = ({ producer, selected, onSelect }) => {
  return (
    <div 
      className={`zuo-producer-card ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {/* AI Match Badge */}
      {producer.ai_match_score >= 80 && (
        <div className="zuo-ai-badge">
          <span className="icon">✨</span> Best Match
        </div>
      )}

      {/* Producer Image */}
      <div className="zuo-producer-image">
        <img src={producer.imageUrl} alt={producer.name} />
      </div>

      {/* Producer Info */}
      <div className="zuo-producer-info">
        <h3>{producer.name}</h3>
        <p className="description">{producer.consumer_friendly_description}</p>
        
        {/* Key Metrics */}
        <div className="zuo-producer-metrics">
          <div className="metric">
            <span className="icon">⭐</span>
            <span>{producer.simple_rating}</span>
          </div>
          <div className="metric">
            <span className="icon">🚚</span>
            <span>{producer.delivery_simple}</span>
          </div>
          <div className="metric">
            <span className="icon">📍</span>
            <span>{producer.distance_display}</span>
          </div>
          {producer.sustainable && (
            <div className="metric eco">
              <span className="icon">🌱</span>
              <span>Eco</span>
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="zuo-price-range">
          {producer.price_display}
        </div>

        {/* Availability */}
        {producer.available_now ? (
          <div className="zuo-availability available">
            <span className="dot"></span> Available Now
          </div>
        ) : (
          <div className="zuo-availability busy">
            <span className="dot"></span> Busy
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="zuo-selected-check">
          <span>✓</span>
        </div>
      )}
    </div>
  );
};

export default ZuoProducerCard;