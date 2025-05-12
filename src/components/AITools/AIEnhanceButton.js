import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Sparkles, AlertCircle } from 'lucide-react';

/**
 * AI Enhancement Button Component
 * Provides a button to trigger AI analysis and enhancement of a design
 */
const AIEnhanceButton = ({ 
  designFile, 
  disabled = false, 
  onAnalysisStart, 
  onAnalysisComplete,
  onError
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Handles click to start analysis
  const handleAnalyze = async () => {
    if (!designFile || disabled) return;
    
    try {
      setIsAnalyzing(true);
      
      // Notify parent component that analysis is starting
      if (onAnalysisStart) {
        onAnalysisStart();
      }
      
      // In a real implementation, this would call the AI service for analysis
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock analysis results
      const analysisResults = {
        completed: true,
        timestamp: new Date().toISOString(),
        enhancements: [
          { type: 'resolution', description: 'Increased resolution for better print quality' },
          { type: 'color', description: 'Optimized color profile for print' }
        ]
      };
      
      // Notify parent component that analysis is complete
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResults);
      }
    } catch (error) {
      console.error('Error analyzing design:', error);
      
      // Notify parent component of the error
      if (onError) {
        onError(error);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Button
      variant={isAnalyzing ? "outline" : "default"}
      onClick={handleAnalyze}
      disabled={disabled || isAnalyzing || !designFile}
      className="relative"
    >
      {isAnalyzing ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          AI Enhance
        </>
      )}
      
      {!designFile && !disabled && (
        <div className="absolute -top-1 -right-1 h-3 w-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </div>
      )}
    </Button>
  );
};

export default AIEnhanceButton;