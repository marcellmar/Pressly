import React, { useState } from 'react';
import PDFAnalyzer from '../components/PDFAnalyzer';
import '../styles/pdfAnalysis.css';

/**
 * Page component for PDF analysis features
 */
const PDFAnalysisPage = () => {
  const [analysisResult, setAnalysisResult] = useState(null);

  /**
   * Handle analysis completion
   */
  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    console.log('Analysis complete:', result);
  };

  /**
   * Find recommended producers based on PDF analysis
   */
  const findRecommendedProducers = () => {
    // This would typically involve using the SmartMatch service
    // to find appropriate producers based on the analysis results
    alert('This feature would connect to the SmartMatch service to find ideal producers for your PDF.');
  };

  return (
    <div className="container">
      <section className="pdf-analysis-page">
        <div className="page-header">
          <h1>PDF Analysis Tool</h1>
          <p className="subtitle">
            Upload your PDF design file to analyze it for print readiness and get personalized producer recommendations.
          </p>
        </div>

        <div className="card">
          <h2>Analyze Your PDF</h2>
          <p>
            Our intelligent PDF analyzer will check your file for common print issues, 
            extract specifications, and help you find the perfect producer for your project.
          </p>
          
          <PDFAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          
          {analysisResult && (
            <div className="action-buttons">
              <button 
                className="btn btn-primary" 
                onClick={findRecommendedProducers}
              >
                Find Recommended Producers
              </button>
              
              <button 
                className="btn btn-outline"
                onClick={() => setAnalysisResult(null)}
              >
                Clear Results
              </button>
            </div>
          )}
        </div>

        <div className="analysis-info-cards">
          <div className="card info-card">
            <h3><i className="fas fa-check-circle"></i> Print Readiness Check</h3>
            <p>
              We analyze your file for common printing issues including resolution, 
              color spaces, fonts, and bleed setup.
            </p>
          </div>
          
          <div className="card info-card">
            <h3><i className="fas fa-search"></i> File Specifications</h3>
            <p>
              We extract key specifications like dimensions, color models, and image 
              resolutions to ensure proper printing.
            </p>
          </div>
          
          <div className="card info-card">
            <h3><i className="fas fa-users"></i> Smart Producer Matching</h3>
            <p>
              Based on your file analysis, we'll recommend producers with the right 
              capabilities for your specific project needs.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .pdf-analysis-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .subtitle {
          color: #666;
          font-size: 1.1rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .analysis-info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .info-card {
          text-align: center;
          padding: 1.5rem;
        }
        
        .info-card h3 {
          color: var(--primary);
          margin-bottom: 1rem;
        }
        
        .info-card i {
          margin-right: 0.5rem;
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .action-buttons button {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default PDFAnalysisPage;
