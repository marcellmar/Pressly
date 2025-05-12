import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, RefreshCw, Download, ZapOff, PenTool, Layers, Image, FileText, RotateCw } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const FileValidation = ({ file, validationResults }) => {
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyingCorrection, setApplyingCorrection] = useState('');
  const [appliedCorrections, setAppliedCorrections] = useState([]);
  
  useEffect(() => {
    // Reset applied corrections when file changes
    setAppliedCorrections([]);
  }, [file]);
  
  if (!file || !validationResults) return null;
  
  const { 
    status, 
    dpi, 
    colorSpace, 
    format, 
    corrections = [], 
    message, 
    validationTime, 
    detailedErrors = [],
    compatibilityScore = 80
  } = validationResults;
  
  // Status can be: 'success', 'warning', 'error', 'corrected'
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'corrected':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'corrected':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Print-Ready';
      case 'warning':
        return 'Needs Attention';
      case 'error':
        return 'Not Print-Ready';
      case 'corrected':
        return 'Auto-Corrected';
      default:
        return 'Validating';
    }
  };
  
  // Generate human-readable validation time
  const formatValidationTime = (time) => {
    if (time < 60) {
      return `${time} seconds`;
    } else {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes} min ${seconds} sec`;
    }
  };

  // Get technical details to display
  const technicalDetails = [
    {
      label: 'Resolution',
      value: dpi,
      status: parseFloat(dpi) >= 300 ? 'good' : parseFloat(dpi) >= 200 ? 'warning' : 'bad',
      icon: <Image className="h-4 w-4" />,
      recommendation: parseFloat(dpi) < 300 ? 'Recommended: 300 DPI or higher for print quality' : '',
      canFix: parseFloat(dpi) < 150, // Can only enhance very low resolution 
      fix: 'Upscale resolution for better print quality',
      fixTime: '2-3 minutes'
    },
    {
      label: 'Color Space',
      value: colorSpace,
      status: colorSpace === 'CMYK' || colorSpace === 'CMYK (Converted)' ? 'good' : 'warning',
      icon: <PenTool className="h-4 w-4" />,
      recommendation: colorSpace !== 'CMYK' && colorSpace !== 'CMYK (Converted)' ? 'Recommended: CMYK color space for print' : '',
      canFix: colorSpace === 'RGB',
      fix: 'Convert RGB to CMYK color space',
      fixTime: '1 minute'
    },
    {
      label: 'Format',
      value: format,
      status: ['PDF', 'EPS', 'TIFF', 'AI', 'SVG'].includes(format.toUpperCase()) ? 'good' : 'neutral',
      icon: <FileText className="h-4 w-4" />,
      recommendation: !['PDF', 'EPS', 'TIFF', 'AI', 'SVG'].includes(format.toUpperCase()) ? 
        'Consider using PDF, TIFF, EPS, or AI for best print quality' : '',
      canFix: ['JPG', 'JPEG', 'PNG', 'GIF'].includes(format.toUpperCase()),
      fix: `Convert ${format.toUpperCase()} to PDF format`,
      fixTime: '1-2 minutes'
    },
    {
      label: 'Transparency',
      value: validationResults.hasTransparency ? 'Detected' : 'None',
      status: validationResults.hasTransparency ? 'warning' : 'good',
      icon: <Layers className="h-4 w-4" />,
      recommendation: validationResults.hasTransparency ? 'Transparencies may cause issues with some printing methods' : '',
      canFix: validationResults.hasTransparency,
      fix: 'Flatten transparency for optimal printing',
      fixTime: '2 minutes'
    }
  ];

  // Potential automated corrections to offer
  const potentialCorrections = [
    ...(colorSpace === 'RGB' ? [{
      id: 'rgb-to-cmyk',
      description: 'Convert RGB color space to CMYK for optimal print quality',
      severity: 'recommended',
      timeEstimate: '1 minute',
      icon: <PenTool className="h-4 w-4" />
    }] : []),
    ...(parseFloat(dpi) < 150 ? [{
      id: 'low-resolution',
      description: 'Enhance resolution for better printing results (limited improvement)',
      severity: 'recommended',
      timeEstimate: '2-3 minutes',
      icon: <Image className="h-4 w-4" />
    }] : []),
    ...(validationResults.hasThinLines ? [{
      id: 'thin-lines',
      description: 'Strengthen thin lines (below 0.25pt) that may disappear during printing',
      severity: 'recommended',
      timeEstimate: '1-2 minutes',
      icon: <PenTool className="h-4 w-4" />
    }] : []),
    ...(validationResults.hasTransparency ? [{
      id: 'transparency',
      description: 'Flatten transparency for consistent printing results',
      severity: 'recommended',
      timeEstimate: '2 minutes',
      icon: <Layers className="h-4 w-4" />
    }] : []),
    ...(validationResults.fontEmbeddingIssues && validationResults.fontEmbeddingIssues.length > 0 ? [{
      id: 'embed-fonts',
      description: 'Embed all fonts to ensure consistent text appearance',
      severity: 'critical',
      timeEstimate: '1 minute',
      icon: <FileText className="h-4 w-4" />
    }] : [])
  ];
  
  const calculateCompatibilityColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  // Handle applying corrections
  const handleApplyCorrection = (correctionId) => {
    setApplying(true);
    setApplyingCorrection(correctionId);
    
    // Simulate applying the correction
    setTimeout(() => {
      // Add to applied corrections
      setAppliedCorrections(prev => [...prev, correctionId]);
      setApplying(false);
      setApplyingCorrection('');
    }, 2000);
  };

  // Check if a correction has been applied
  const isCorrectionApplied = (correctionId) => {
    return appliedCorrections.includes(correctionId);
  };
  
  return (
    <div className={`mt-4 border rounded-lg ${getStatusColor()}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2 font-medium">
              File Validation: {getStatusText()}
            </span>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-600 hover:text-blue-500"
          >
            {expanded ? 'Show Less' : 'Show Details'}
          </button>
        </div>

        {/* Compatibility Score */}
        <div className="mt-2 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Print Compatibility</span>
            <span className={`text-sm font-bold ${calculateCompatibilityColor(compatibilityScore)}`}>
              {compatibilityScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${compatibilityScore >= 90 ? 'bg-green-600' : compatibilityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${compatibilityScore}%` }}
            ></div>
          </div>
        </div>
        
        {expanded && (
          <div className="space-y-4">
            {/* Technical Details */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium">Technical Specifications</h3>
              </div>
              <div className="divide-y">
                {technicalDetails.map((detail, index) => (
                  <div key={index} className="p-3 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="bg-gray-100 p-1.5 rounded-full mr-2">
                          {detail.icon}
                        </span>
                        <span className="font-medium">{detail.label}</span>
                      </div>
                      <span className={
                        detail.status === 'good' ? 'text-green-600' : 
                        detail.status === 'warning' ? 'text-yellow-600' : 
                        detail.status === 'bad' ? 'text-red-600' : 'text-gray-600'
                      }>
                        {detail.value}
                      </span>
                    </div>
                    {detail.recommendation && (
                      <div className="mt-1 text-xs text-gray-600 ml-9">
                        {detail.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-corrections already applied */}
            {corrections && corrections.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium mb-2 flex items-center text-blue-700">
                  <CheckCircle className="h-4 w-4 mr-1.5 text-blue-600" />
                  Auto-Corrections Applied
                </h4>
                <ul className="space-y-1.5">
                  {corrections.map((correction, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start">
                      <span className="mr-2 text-blue-400">•</span>
                      <span>{correction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Issues that need attention */}
            {detailedErrors && detailedErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-medium mb-2 flex items-center text-red-700">
                  <AlertTriangle className="h-4 w-4 mr-1.5 text-red-600" />
                  Issues Requiring Attention
                </h4>
                <ul className="space-y-1.5">
                  {detailedErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-start">
                      <span className="mr-2 text-red-400">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional corrections available */}
            {potentialCorrections.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h3 className="font-medium">Available Auto-Corrections</h3>
                </div>
                <div className="p-2 divide-y divide-gray-100">
                  {potentialCorrections.map((correction, index) => (
                    <div key={index} className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {correction.icon}
                          <div className="ml-2">
                            <p className="text-sm font-medium">{correction.description}</p>
                            <p className="text-xs text-gray-500">
                              {isCorrectionApplied(correction.id) ? (
                                <span className="text-green-600 font-medium">✓ Applied</span>
                              ) : (
                                <>Estimated time: {correction.timeEstimate}</>
                              )}
                            </p>
                          </div>
                        </div>
                        {!isCorrectionApplied(correction.id) && (
                          <Button 
                            size="sm" 
                            variant={correction.severity === 'critical' ? 'default' : 'outline'}
                            onClick={() => handleApplyCorrection(correction.id)}
                            disabled={applying}
                          >
                            {applying && applyingCorrection === correction.id ? (
                              <>
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              <>Apply</>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chicago-specific print recommendations */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h4 className="font-medium mb-2 flex items-center text-purple-700">
                <Info className="h-4 w-4 mr-1.5 text-purple-600" />
                Chicago Print Shop Compatibility
              </h4>
              <p className="text-sm text-purple-700 mb-2">
                Based on our analysis, this file is compatible with {Math.round(compatibilityScore/10)} out of 10 print shops in the Chicago area.
              </p>
              <div className="text-xs text-purple-600">
                {compatibilityScore >= 90 ? (
                  <span>This file meets the requirements of all major print shops in Chicago.</span>
                ) : compatibilityScore >= 70 ? (
                  <span>Most Chicago print shops can work with this file, but some premium providers may require adjustments.</span>
                ) : (
                  <span>This file needs corrections before submission to most Chicago print providers.</span>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              Validation completed in {formatValidationTime(validationTime || 30)}
            </div>
          </div>
        )}
        
        {!expanded && message && (
          <div className="mt-2 text-sm text-gray-600">
            {message}
          </div>
        )}
      </div>
      
      {expanded && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" />
            Download Report
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              // Apply all recommended corrections
              const ids = potentialCorrections
                .filter(c => !isCorrectionApplied(c.id))
                .map(c => c.id);
              
              if (ids.length === 0) return;
              
              setApplying(true);
              
              // Simulate applying all corrections sequentially
              let currentIndex = 0;
              const applyNext = () => {
                if (currentIndex >= ids.length) {
                  setApplying(false);
                  return;
                }
                
                setApplyingCorrection(ids[currentIndex]);
                setTimeout(() => {
                  setAppliedCorrections(prev => [...prev, ids[currentIndex]]);
                  currentIndex++;
                  applyNext();
                }, 1000);
              };
              
              applyNext();
            }}
            disabled={applying || potentialCorrections.every(c => isCorrectionApplied(c.id))}
          >
            {applying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                Applying Corrections...
              </>
            ) : potentialCorrections.every(c => isCorrectionApplied(c.id)) ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1.5" />
                All Corrections Applied
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4 mr-1.5" />
                Apply All Fixes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileValidation;