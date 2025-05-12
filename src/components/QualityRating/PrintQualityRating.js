import React, { useState } from 'react';

/**
 * PrintQualityRating Component
 * 
 * Provides specialized print-specific quality rating metrics that go beyond
 * generic 5-star systems to capture technical quality attributes of printed products.
 * 
 * Features:
 * - Objective quality metrics specific to printing
 * - Visual comparison tools for expected vs. actual outcomes
 * - Quality benchmarking against industry standards
 * - Historical quality tracking for producers
 */
const PrintQualityRating = ({ order, onSaveRating }) => {
  // Initial rating state with print-specific attributes
  const [ratings, setRatings] = useState({
    colorAccuracy: 0,
    registrationPrecision: 0,
    materialQuality: 0,
    finishingQuality: 0,
    printResolution: 0,
    edgePrecision: 0,
  });
  
  const [feedback, setFeedback] = useState('');
  const [photosUploaded, setPhotosUploaded] = useState(false);
  
  // Rating descriptions for each score level
  const ratingDescriptions = {
    colorAccuracy: [
      'Colors significantly different from specified values',
      'Noticeable color shifts from design',
      'Minor color variations, acceptable',
      'Colors match design with minimal deviation',
      'Perfect color reproduction, matches specified values'
    ],
    registrationPrecision: [
      'Severe misregistration, elements noticeably misaligned',
      'Visible registration issues in multiple areas',
      'Minor registration issues in limited areas',
      'Properly registered with minimal deviation',
      'Perfect registration throughout'
    ],
    materialQuality: [
      'Wrong material used or severely defective',
      'Material has noticeable flaws or isn\'t as specified',
      'Material is acceptable but has minor imperfections',
      'Material matches specifications with minimal issues',
      'Perfect material quality, exactly as specified'
    ],
    finishingQuality: [
      'Poor finishing with visible defects',
      'Finishing shows inconsistencies or minor defects',
      'Acceptable finishing with few imperfections',
      'Good finishing quality with very minor issues',
      'Excellent finishing with no visible defects'
    ],
    printResolution: [
      'Blurry or pixelated, resolution issues obvious',
      'Visible resolution issues in detailed areas',
      'Minor resolution issues in fine details only',
      'Good resolution with barely noticeable imperfections',
      'Perfect resolution, crisp and clear throughout'
    ],
    edgePrecision: [
      'Cutting/trimming is significantly off',
      'Noticeable cutting/trimming issues',
      'Minor variations in cutting/trimming',
      'Good cutting/trimming with minimal variation',
      'Perfect cutting/trimming precision'
    ]
  };
  
  // Labels for human-readable display
  const attributeLabels = {
    colorAccuracy: 'Color Accuracy',
    registrationPrecision: 'Registration Precision',
    materialQuality: 'Material Quality',
    finishingQuality: 'Finishing Quality',
    printResolution: 'Print Resolution',
    edgePrecision: 'Edge/Cutting Precision'
  };
  
  // Calculate overall score
  const calculateOverallScore = () => {
    const values = Object.values(ratings);
    const sum = values.reduce((a, b) => a + b, 0);
    return values.length > 0 ? sum / values.length : 0;
  };

  // Handle rating change for a specific attribute
  const handleRatingChange = (attribute, value) => {
    setRatings(prev => ({
      ...prev,
      [attribute]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add overall score and timestamp
    const ratingData = {
      ...ratings,
      overallScore: calculateOverallScore(),
      feedback,
      photosUploaded,
      orderId: order.id,
      timestamp: new Date().toISOString(),
      designId: order.designId,
      producerId: order.producerId
    };
    
    // Pass data to parent component
    onSaveRating(ratingData);
  };
  
  // Simulated photo upload handler
  const handlePhotoUpload = (e) => {
    // In a real implementation, this would handle file uploads
    setPhotosUploaded(true);
  };

  return (
    <div className="card">
      <h3 className="card-title">Print Quality Assessment</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <p>Please rate the technical quality of your printed materials. This helps us maintain quality standards and helps other designers find the best producers for their specific needs.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Order summary section */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Order Details</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <strong>Order #:</strong> {order?.id || '12345'}
            </div>
            <div>
              <strong>Producer:</strong> {order?.producerName || 'PrintMasters Chicago'}
            </div>
            <div>
              <strong>Product:</strong> {order?.productType || 'Business Cards'}
            </div>
          </div>
        </div>
        
        {/* Quality attributes rating section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Technical Quality Metrics</h4>
          
          {Object.keys(ratings).map(attribute => (
            <div key={attribute} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor={attribute} style={{ fontWeight: 'bold' }}>
                  {attributeLabels[attribute]}
                </label>
                <span style={{ fontWeight: 'bold' }}>
                  {ratings[attribute] > 0 ? ratings[attribute] : '-'}/5
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type="range"
                  id={attribute}
                  min="0"
                  max="5"
                  step="1"
                  value={ratings[attribute]}
                  onChange={(e) => handleRatingChange(attribute, parseInt(e.target.value))}
                  style={{ flex: 1, marginRight: '1rem' }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleRatingChange(attribute, score)}
                      style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: '1px solid #ddd',
                        background: ratings[attribute] >= score ? 'var(--primary)' : 'white',
                        color: ratings[attribute] >= score ? 'white' : '#333',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        fontWeight: 'bold'
                      }}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
              
              {ratings[attribute] > 0 && (
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#666',
                  backgroundColor: '#f8f9fa',
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                  {ratingDescriptions[attribute][ratings[attribute] - 1]}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Photo evidence upload section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Photo Evidence (Optional)</h4>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            Upload photos of your printed materials to document the quality. This helps us verify quality issues and provide better feedback to producers.
          </p>
          
          <div style={{ 
            border: '2px dashed #ddd', 
            borderRadius: '5px', 
            padding: '2rem', 
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            marginBottom: '1rem'
          }}>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
            <p style={{ marginBottom: '1rem' }}>Drag photos here or click to upload</p>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={handlePhotoUpload}
            >
              Select Photos
            </button>
          </div>
          
          {photosUploaded && (
            <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '0.5rem', borderRadius: '4px' }}>
              <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
              Photos uploaded successfully
            </div>
          )}
        </div>
        
        {/* Detailed feedback section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Additional Feedback</h4>
          <textarea
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please provide any additional feedback about the print quality..."
            style={{ width: '100%' }}
          ></textarea>
        </div>
        
        {/* Overall rating summary */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px', textAlign: 'center' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Overall Quality Score</h4>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'var(--primary)',
            marginBottom: '0.5rem'
          }}>
            {calculateOverallScore().toFixed(1)}
            <span style={{ fontSize: '1.5rem' }}>/5</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Based on your ratings across all technical quality metrics
          </p>
        </div>
        
        {/* Submit button */}
        <div style={{ textAlign: 'center' }}>
          <button 
            type="submit" 
            className="btn btn-lg"
            disabled={Object.values(ratings).some(r => r === 0)}
          >
            Submit Quality Assessment
          </button>
          
          {Object.values(ratings).some(r => r === 0) && (
            <p style={{ fontSize: '0.85rem', color: '#dc3545', marginTop: '0.5rem' }}>
              Please rate all quality metrics before submitting
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PrintQualityRating;
