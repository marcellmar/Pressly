/**
 * SmartMatch Studio Test Component
 * Simple version to test button visibility
 */

import React, { useState } from 'react';
import { ChevronRight, Upload, BarChart, Sparkles, Target } from 'lucide-react';

const SmartMatchStudioTest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const steps = [
    { id: 1, label: 'Upload', icon: Upload },
    { id: 2, label: 'Analyze', icon: BarChart },
    { id: 3, label: 'Optimize', icon: Sparkles },
    { id: 4, label: 'Match', icon: Target }
  ];

  const handleAnalyze = () => {
    // Simulate analysis
    setAnalysisResults({
      overall: { score: 65, issues: [] },
      files: [
        { name: 'test-file.pdf', analysis: {} }
      ]
    });
    setCurrentStep(2);
  };

  return (
    <div style={{ padding: '48px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1>SmartMatch Studio Test</h1>
      
      {/* Progress Steps */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '48px' }}>
        {steps.map(step => (
          <div key={step.id} style={{
            padding: '8px 16px',
            background: step.id === currentStep ? '#333' : '#ddd',
            color: step.id === currentStep ? 'white' : '#333',
            borderRadius: '4px',
            cursor: 'pointer'
          }} onClick={() => setCurrentStep(step.id)}>
            {step.label}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {currentStep === 1 && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
          <h2>Step 1: Upload Files</h2>
          <button 
            onClick={handleAnalyze}
            style={{
              padding: '12px 24px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '24px'
            }}
          >
            Simulate File Upload & Analyze
          </button>
        </div>
      )}

      {/* Step 2: Analysis */}
      {currentStep === 2 && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
          <h2>Step 2: Analysis Results</h2>
          
          {!analysisResults ? (
            <p>Loading analysis...</p>
          ) : (
            <div>
              <p>Score: {analysisResults.overall?.score || 'N/A'}</p>
              <p>Files: {analysisResults.files?.length || 0}</p>
              
              <div style={{ marginTop: '24px', padding: '16px', background: '#ffd', border: '2px solid #333' }}>
                <strong>Button Test Area:</strong>
                <div style={{ marginTop: '16px' }}>
                  
                  {/* Primary buttons based on score */}
                  {(analysisResults.overall?.score || 0) < 80 ? (
                    <div>
                      <button
                        onClick={() => setCurrentStep(3)}
                        style={{
                          padding: '12px 24px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '12px'
                        }}
                      >
                        Optimize Design
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        style={{
                          padding: '12px 24px',
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Skip to Matching
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCurrentStep(4)}
                      style={{
                        padding: '12px 24px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Find Producers
                    </button>
                  )}
                  
                  {/* Fallback button */}
                  <div style={{ marginTop: '16px' }}>
                    <button
                      onClick={() => setCurrentStep(4)}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        color: '#333',
                        border: '1px solid #333',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Continue to Matching (Fallback)
                      <ChevronRight size={16} style={{ marginLeft: '4px', display: 'inline' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Optimize */}
      {currentStep === 3 && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
          <h2>Step 3: Optimization</h2>
          <button 
            onClick={() => setCurrentStep(4)}
            style={{
              padding: '12px 24px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '24px'
            }}
          >
            Apply & Continue
          </button>
        </div>
      )}

      {/* Step 4: Match */}
      {currentStep === 4 && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
          <h2>Step 4: Producer Matching</h2>
          <p>Matching complete!</p>
        </div>
      )}
    </div>
  );
};

export default SmartMatchStudioTest;