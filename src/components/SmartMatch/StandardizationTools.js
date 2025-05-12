import React from 'react';

const StandardizationTools = ({ files }) => {
  if (!files || files.length === 0) return null;
  
  // Count files with issues
  const filesWithIssues = files.filter(file => !file.metadata.standardCompliance);

  if (filesWithIssues.length === 0) return null;

  return (
    <div className="card">
      <h3 className="card-title">File Standardization</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <p>
          We've detected {filesWithIssues.length} {filesWithIssues.length === 1 ? 'file' : 'files'} that may need adjustments for optimal printing. Our intelligent tools can automatically fix common issues.
        </p>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Available Corrections</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ margin: 0, padding: '1rem' }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-palette" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Color Conversion
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Convert RGB to CMYK for professional printing
            </p>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} defaultChecked />
                <span>Apply</span>
              </label>
            </div>
          </div>
          
          <div className="card" style={{ margin: 0, padding: '1rem' }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-compress-arrows-alt" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Resolution Optimization
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Adjust resolution to match intended print size
            </p>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} defaultChecked />
                <span>Apply</span>
              </label>
            </div>
          </div>
          
          <div className="card" style={{ margin: 0, padding: '1rem' }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-font" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Font Embedding
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Ensure all fonts are embedded or converted to outlines
            </p>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} defaultChecked />
                <span>Apply</span>
              </label>
            </div>
          </div>
          
          <div className="card" style={{ margin: 0, padding: '1rem' }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-cut" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Bleed & Trim
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Add proper bleed and trim marks to your design
            </p>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} defaultChecked />
                <span>Apply</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <button className="btn">
          <i className="fas fa-magic" style={{ marginRight: '0.5rem' }}></i>
          Apply All Corrections
        </button>
      </div>
    </div>
  );
};

export default StandardizationTools;