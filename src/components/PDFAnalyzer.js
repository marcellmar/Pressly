import React, { useState, useEffect } from 'react';
import { PDFAnalysisService } from '../services/fileAnalysis';
import PDFDropzone from './PDFDropzone';
import '../styles/pdfAnalysis.css';

/**
 * Component for analyzing PDF files and displaying the results
 */
const PDFAnalyzer = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('metadata');

  // Reset active tab when analysis changes
  useEffect(() => {
    if (analysis) {
      setActiveTab('metadata');
    }
  }, [analysis]);

  /**
   * Handle file selection
   */
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  /**
   * Analyze the selected PDF file
   */
  const analyzeFile = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await PDFAnalysisService.analyzePDF(file);
      setAnalysis(result);
      
      // Call the optional callback with the results
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('PDF analysis failed:', err);
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Render a specific section of the analysis results
   */
  const renderAnalysisSection = (title, data) => {
    if (!data) return null;

    return (
      <div className="analysis-section">
        <h3>{title}</h3>
        <div className="analysis-content">
          {typeof data === 'object' ? (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <p>{data}</p>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render analysis issues with appropriate styling
   */
  const renderQualityIssues = (issues) => {
    if (!issues || issues.length === 0) {
      return (
        <div className="alert alert-success">
          No quality issues detected. This PDF appears to be print-ready.
        </div>
      );
    }

    return (
      <div className="quality-issues">
        <div className="alert alert-warning">
          {issues.length} quality {issues.length === 1 ? 'issue' : 'issues'} detected:
        </div>
        <ul className="issues-list">
          {issues.map((issue, index) => (
            <li key={index} className={`issue-severity-${issue.severity}`}>
              <strong>{issue.message}</strong>
              <p>{issue.details}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  /**
   * Render a simplified summary of the analysis
   */
  const renderSummary = () => {
    if (!analysis) return null;

    const summary = PDFAnalysisService.generatePDFSummary(analysis);

    return (
      <div className="analysis-summary">
        <h3>PDF Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">File Name:</span>
            <span className="summary-value">{summary.filename}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">File Size:</span>
            <span className="summary-value">{summary.fileSize}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Pages:</span>
            <span className="summary-value">{summary.pageCount}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Dimensions:</span>
            <span className="summary-value">{summary.dimensions}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Color Model:</span>
            <span className="summary-value">{summary.colorModel}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Images:</span>
            <span className="summary-value">{summary.imageCount} (min {summary.lowestImageResolution})</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Print Ready:</span>
            <span className={`summary-value ${summary.printReady ? 'text-success' : 'text-danger'}`}>
              {summary.printReady ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Printing Method:</span>
            <span className="summary-value">{summary.recommendedPrinting}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Paper Type:</span>
            <span className="summary-value">{summary.recommendedPaperType}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Complexity:</span>
            <span className={`summary-value complexity-${summary.productionComplexity.toLowerCase()}`}>
              {summary.productionComplexity}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pdf-analyzer">
      <PDFDropzone onPDFSelected={(pdfFile) => {
        setFile(pdfFile);
        setError(null);
      }} />

      {file && (
        <div className="selected-file">
          <p>
            <i className="fas fa-file-pdf"></i> {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
          <button
            onClick={analyzeFile}
            disabled={isAnalyzing}
            className="btn"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze PDF'}
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div className="analyzing-indicator">
          <div className="spinner"></div>
          <p>Analyzing PDF file... This may take a moment for large files.</p>
        </div>
      )}

      {analysis && !isAnalyzing && (
        <div className="analysis-results">
          {renderSummary()}
          
          {renderQualityIssues(analysis.qualityIssues)}

          <div className="analysis-details">
            <h3>Detailed Analysis</h3>
            <div className="details-tabs">
              <button 
                className={`tab-button ${activeTab === 'metadata' ? 'active' : ''}`}
                onClick={() => setActiveTab('metadata')}
              >
                Metadata
              </button>
              <button 
                className={`tab-button ${activeTab === 'pages' ? 'active' : ''}`}
                onClick={() => setActiveTab('pages')}
              >
                Pages
              </button>
              <button 
                className={`tab-button ${activeTab === 'fonts' ? 'active' : ''}`}
                onClick={() => setActiveTab('fonts')}
              >
                Fonts
              </button>
              <button 
                className={`tab-button ${activeTab === 'colors' ? 'active' : ''}`}
                onClick={() => setActiveTab('colors')}
              >
                Colors
              </button>
              <button 
                className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
                onClick={() => setActiveTab('images')}
              >
                Images
              </button>
              <button 
                className={`tab-button ${activeTab === 'printSpecs' ? 'active' : ''}`}
                onClick={() => setActiveTab('printSpecs')}
              >
                Print Specs
              </button>
            </div>

            <div className={`tab-content ${activeTab === 'metadata' ? 'active' : ''}`}>
              {renderAnalysisSection('Metadata', analysis.metadata)}
            </div>
            <div className={`tab-content ${activeTab === 'pages' ? 'active' : ''}`}>
              {renderAnalysisSection('Page Information', analysis.pageInfo)}
            </div>
            <div className={`tab-content ${activeTab === 'fonts' ? 'active' : ''}`}>
              {renderAnalysisSection('Font Information', analysis.fontInfo)}
            </div>
            <div className={`tab-content ${activeTab === 'colors' ? 'active' : ''}`}>
              {renderAnalysisSection('Color Information', analysis.colorInfo)}
            </div>
            <div className={`tab-content ${activeTab === 'images' ? 'active' : ''}`}>
              {renderAnalysisSection('Image Information', analysis.imageInfo)}
            </div>
            <div className={`tab-content ${activeTab === 'printSpecs' ? 'active' : ''}`}>
              {renderAnalysisSection('Print Specifications', analysis.printSpecs)}
              {renderAnalysisSection('Printing Requirements', analysis.printingRequirements)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFAnalyzer;