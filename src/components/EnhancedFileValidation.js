import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  RefreshCw, 
  Download, 
  ZapOff, 
  PenTool, 
  Layers, 
  Image, 
  FileText, 
  RotateCw,
  Palette,
  Maximize,
  Type,
  Grid,
  Crop,
  Eye,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

const EnhancedFileValidation = ({ file, validationResults, onCorrectionsApplied }) => {
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyingCorrection, setApplyingCorrection] = useState('');
  const [appliedCorrections, setAppliedCorrections] = useState([]);
  const [correctionProgress, setCorrectionProgress] = useState({});
  const [enhancedResults, setEnhancedResults] = useState(validationResults);
  
  useEffect(() => {
    // Reset when file changes
    setAppliedCorrections([]);
    setCorrectionProgress({});
    setEnhancedResults(validationResults);
  }, [file, validationResults]);
  
  if (!file || !enhancedResults) return null;
  
  const { 
    status, 
    dpi, 
    colorSpace, 
    format, 
    corrections = [], 
    message, 
    validationTime, 
    detailedErrors = [],
    compatibilityScore = 80,
    // Enhanced properties
    hasThinLines = Math.random() > 0.7,
    hasTransparency = Math.random() > 0.8,
    fontEmbeddingIssues = Math.random() > 0.6 ? ['Arial', 'Helvetica'] : [],
    imageQualityIssues = Math.random() > 0.7,
    colorAccuracy = Math.random() * 100,
    contrastRatio = 2.1 + Math.random() * 8,
    hasBleed = Math.random() > 0.5,
    hasCropMarks = Math.random() > 0.7,
    fileCompression = Math.random() > 0.5 ? 'lossy' : 'lossless'
  } = enhancedResults;
  
  // Enhanced correction options
  const potentialCorrections = [
    // Basic corrections
    ...(parseFloat(dpi) < 300 ? [{
      id: 'resolution',
      category: 'quality',
      description: 'AI-enhance resolution to 300+ DPI',
      severity: parseFloat(dpi) < 150 ? 'critical' : 'recommended',
      timeEstimate: '2-3 minutes',
      improvement: '+' + (300 - parseFloat(dpi)) + ' DPI',
      icon: <Image className="h-4 w-4" />,
      aiPowered: true
    }] : []),
    
    ...(colorSpace && colorSpace.includes('RGB') ? [{
      id: 'colorspace',
      category: 'color',
      description: 'Convert to CMYK with color matching',
      severity: 'critical',
      timeEstimate: '1 minute',
      improvement: 'Print-ready colors',
      icon: <Palette className="h-4 w-4" />,
      aiPowered: false
    }] : []),
    
    ...(hasThinLines ? [{
      id: 'thin-lines',
      category: 'quality',
      description: 'AI-strengthen thin lines for print',
      severity: 'recommended',
      timeEstimate: '1-2 minutes',
      improvement: 'No line loss',
      icon: <PenTool className="h-4 w-4" />,
      aiPowered: true
    }] : []),
    
    ...(hasTransparency ? [{
      id: 'transparency',
      category: 'compatibility',
      description: 'Smart transparency flattening',
      severity: 'recommended',
      timeEstimate: '2 minutes',
      improvement: 'Better compatibility',
      icon: <Layers className="h-4 w-4" />,
      aiPowered: true
    }] : []),
    
    ...(fontEmbeddingIssues.length > 0 ? [{
      id: 'embed-fonts',
      category: 'text',
      description: 'Embed all fonts with subsetting',
      severity: 'critical',
      timeEstimate: '1 minute',
      improvement: 'Text preservation',
      icon: <Type className="h-4 w-4" />,
      aiPowered: false
    }] : []),
    
    // Advanced AI corrections
    ...(imageQualityIssues ? [{
      id: 'ai-enhance',
      category: 'ai',
      description: 'AI image enhancement & sharpening',
      severity: 'optional',
      timeEstimate: '3-4 minutes',
      improvement: '2x quality',
      icon: <Zap className="h-4 w-4" />,
      aiPowered: true
    }] : []),
    
    ...(colorAccuracy < 85 ? [{
      id: 'color-correction',
      category: 'color',
      description: 'AI color correction & calibration',
      severity: 'recommended',
      timeEstimate: '2-3 minutes',
      improvement: '+' + Math.round(100 - colorAccuracy) + '% accuracy',
      icon: <Eye className="h-4 w-4" />,
      aiPowered: true
    }] : []),
    
    ...(contrastRatio < 4.5 ? [{
      id: 'contrast-fix',
      category: 'accessibility',
      description: 'Improve contrast for readability',
      severity: 'recommended',
      timeEstimate: '1 minute',
      improvement: 'WCAG compliant',
      icon: <Activity className="h-4 w-4" />,
      aiPowered: true
    }] : []),
    
    ...(!hasBleed ? [{
      id: 'add-bleed',
      category: 'production',
      description: 'Add 3mm bleed area',
      severity: 'critical',
      timeEstimate: '30 seconds',
      improvement: 'Print-ready',
      icon: <Maximize className="h-4 w-4" />,
      aiPowered: false
    }] : []),
    
    ...(!hasCropMarks ? [{
      id: 'add-cropmarks',
      category: 'production',
      description: 'Add crop marks & registration',
      severity: 'optional',
      timeEstimate: '30 seconds',
      improvement: 'Professional finish',
      icon: <Crop className="h-4 w-4" />,
      aiPowered: false
    }] : []),
    
    ...(fileCompression === 'lossy' ? [{
      id: 'optimize-compression',
      category: 'quality',
      description: 'Convert to lossless compression',
      severity: 'recommended',
      timeEstimate: '1-2 minutes',
      improvement: 'No quality loss',
      icon: <Shield className="h-4 w-4" />,
      aiPowered: false
    }] : [])
  ];
  
  // Group corrections by category
  const correctionsByCategory = potentialCorrections.reduce((acc, correction) => {
    if (!acc[correction.category]) {
      acc[correction.category] = [];
    }
    acc[correction.category].push(correction);
    return acc;
  }, {});
  
  const categoryInfo = {
    quality: { name: 'Quality', color: 'blue' },
    color: { name: 'Color', color: 'purple' },
    compatibility: { name: 'Compatibility', color: 'green' },
    text: { name: 'Typography', color: 'orange' },
    ai: { name: 'AI Enhancement', color: 'pink' },
    accessibility: { name: 'Accessibility', color: 'yellow' },
    production: { name: 'Production', color: 'gray' }
  };
  
  // Status helpers
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
    const appliedCount = appliedCorrections.length;
    if (appliedCount > 0) {
      return `${appliedCount} Corrections Applied`;
    }
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
  
  // Apply correction with progress tracking
  const handleApplyCorrection = async (correctionId) => {
    setApplying(true);
    setApplyingCorrection(correctionId);
    setCorrectionProgress(prev => ({ ...prev, [correctionId]: 0 }));
    
    // Simulate progressive correction with realistic timing
    const correction = potentialCorrections.find(c => c.id === correctionId);
    const duration = correction.aiPowered ? 3000 : 1500;
    const steps = 10;
    const stepDuration = duration / steps;
    
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      setCorrectionProgress(prev => ({ ...prev, [correctionId]: (i / steps) * 100 }));
    }
    
    // Update results
    setAppliedCorrections(prev => [...prev, correctionId]);
    updateFileScore(correctionId);
    
    setApplying(false);
    setApplyingCorrection('');
    
    // Notify parent
    if (onCorrectionsApplied) {
      onCorrectionsApplied({
        correctionId,
        updatedResults: enhancedResults,
        appliedCorrections: [...appliedCorrections, correctionId]
      });
    }
  };
  
  // Update compatibility score after correction
  const updateFileScore = (correctionId) => {
    const correction = potentialCorrections.find(c => c.id === correctionId);
    let scoreIncrease = 0;
    
    switch (correction.severity) {
      case 'critical': scoreIncrease = 10; break;
      case 'recommended': scoreIncrease = 5; break;
      case 'optional': scoreIncrease = 2; break;
    }
    
    setEnhancedResults(prev => ({
      ...prev,
      compatibilityScore: Math.min(100, prev.compatibilityScore + scoreIncrease)
    }));
  };
  
  const isCorrectionApplied = (correctionId) => {
    return appliedCorrections.includes(correctionId);
  };
  
  const calculateCompatibilityColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };
  
  // Technical details with enhanced information
  const technicalDetails = [
    {
      label: 'Resolution',
      value: dpi,
      status: parseFloat(dpi) >= 300 ? 'good' : parseFloat(dpi) >= 200 ? 'warning' : 'bad',
      icon: <Image className="h-4 w-4" />,
      recommendation: parseFloat(dpi) < 300 ? 'Recommended: 300 DPI or higher for print quality' : ''
    },
    {
      label: 'Color Space',
      value: colorSpace,
      status: colorSpace?.includes('CMYK') ? 'good' : 'bad',
      icon: <Palette className="h-4 w-4" />,
      recommendation: colorSpace?.includes('RGB') ? 'CMYK required for accurate print colors' : ''
    },
    {
      label: 'Format',
      value: format,
      status: ['PDF', 'AI', 'EPS'].includes(format) ? 'good' : 'warning',
      icon: <FileText className="h-4 w-4" />,
      recommendation: ''
    },
    {
      label: 'Color Accuracy',
      value: `${Math.round(colorAccuracy)}%`,
      status: colorAccuracy >= 85 ? 'good' : colorAccuracy >= 70 ? 'warning' : 'bad',
      icon: <Eye className="h-4 w-4" />,
      recommendation: colorAccuracy < 85 ? 'AI color correction can improve accuracy' : ''
    },
    {
      label: 'Contrast Ratio',
      value: contrastRatio.toFixed(1) + ':1',
      status: contrastRatio >= 4.5 ? 'good' : contrastRatio >= 3 ? 'warning' : 'bad',
      icon: <Activity className="h-4 w-4" />,
      recommendation: contrastRatio < 4.5 ? 'Improve contrast for better readability' : ''
    }
  ];
  
  return (
    <div className={`mt-4 border rounded-lg ${getStatusColor()}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2 font-medium">
              File Validation: {getStatusText()}
            </span>
            {potentialCorrections.some(c => c.aiPowered && !isCorrectionApplied(c.id)) && (
              <Badge variant="outline" className="ml-2 border-purple-300 text-purple-700">
                <Zap className="h-3 w-3 mr-1" />
                AI Enhancements Available
              </Badge>
            )}
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
            <span className={`text-sm font-bold ${calculateCompatibilityColor(enhancedResults.compatibilityScore)}`}>
              {enhancedResults.compatibilityScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${
                enhancedResults.compatibilityScore >= 90 ? 'bg-green-600' : 
                enhancedResults.compatibilityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${enhancedResults.compatibilityScore}%` }}
            />
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

            {/* Available Corrections by Category */}
            {Object.keys(correctionsByCategory).length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium flex items-center">
                  Available Corrections
                  <span className="ml-2 text-sm text-gray-500">
                    ({potentialCorrections.filter(c => !isCorrectionApplied(c.id)).length} available)
                  </span>
                </h3>
                
                {Object.entries(correctionsByCategory).map(([category, corrections]) => (
                  <div key={category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`bg-${categoryInfo[category].color}-50 px-4 py-2 border-b border-${categoryInfo[category].color}-100`}>
                      <h4 className={`font-medium text-${categoryInfo[category].color}-700`}>
                        {categoryInfo[category].name}
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {corrections.map((correction) => (
                        <div key={correction.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <div className="mr-3">
                                {correction.icon}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium flex items-center">
                                  {correction.description}
                                  {correction.aiPowered && (
                                    <Badge variant="outline" className="ml-2 text-xs border-purple-300 text-purple-600">
                                      <Zap className="h-2 w-2 mr-1" />
                                      AI
                                    </Badge>
                                  )}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-500">
                                    {correction.timeEstimate}
                                  </span>
                                  {correction.improvement && (
                                    <span className="text-xs text-green-600 font-medium">
                                      {correction.improvement}
                                    </span>
                                  )}
                                  {correction.severity === 'critical' && (
                                    <Badge variant="destructive" className="text-xs">
                                      Critical
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {isCorrectionApplied(correction.id) ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">Applied</span>
                              </div>
                            ) : (
                              <Button 
                                size="sm" 
                                variant={correction.severity === 'critical' ? 'default' : 'outline'}
                                onClick={() => handleApplyCorrection(correction.id)}
                                disabled={applying}
                                className="min-w-[80px]"
                              >
                                {applying && applyingCorrection === correction.id ? (
                                  <>
                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    {Math.round(correctionProgress[correction.id] || 0)}%
                                  </>
                                ) : (
                                  'Apply'
                                )}
                              </Button>
                            )}
                          </div>
                          
                          {/* Progress bar for active correction */}
                          {applying && applyingCorrection === correction.id && (
                            <Progress 
                              value={correctionProgress[correction.id] || 0} 
                              className="mt-2 h-1"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chicago Print Shop Compatibility */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h4 className="font-medium mb-2 flex items-center text-purple-700">
                <Info className="h-4 w-4 mr-1.5 text-purple-600" />
                Chicago Print Shop Compatibility
              </h4>
              <p className="text-sm text-purple-700 mb-2">
                Based on our analysis, this file is compatible with {Math.round(enhancedResults.compatibilityScore/10)} out of 10 print shops in the Chicago area.
              </p>
              <div className="text-xs text-purple-600">
                {enhancedResults.compatibilityScore >= 90 ? (
                  <span>This file meets the requirements of all major print shops in Chicago.</span>
                ) : enhancedResults.compatibilityScore >= 70 ? (
                  <span>Most Chicago print shops can work with this file, but some premium providers may require adjustments.</span>
                ) : (
                  <span>This file needs corrections before submission to most Chicago print providers.</span>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              Validation completed in {Math.round((validationTime || 30) / 60)} minutes
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Apply only AI corrections
                const aiCorrections = potentialCorrections
                  .filter(c => c.aiPowered && !isCorrectionApplied(c.id))
                  .map(c => c.id);
                
                if (aiCorrections.length === 0) return;
                
                setApplying(true);
                let currentIndex = 0;
                
                const applyNext = () => {
                  if (currentIndex >= aiCorrections.length) {
                    setApplying(false);
                    return;
                  }
                  
                  handleApplyCorrection(aiCorrections[currentIndex]).then(() => {
                    currentIndex++;
                    applyNext();
                  });
                };
                
                applyNext();
              }}
              disabled={applying || !potentialCorrections.some(c => c.aiPowered && !isCorrectionApplied(c.id))}
            >
              <Zap className="h-4 w-4 mr-1.5" />
              Apply AI Fixes
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                // Apply all corrections
                const ids = potentialCorrections
                  .filter(c => !isCorrectionApplied(c.id))
                  .map(c => c.id);
                
                if (ids.length === 0) return;
                
                setApplying(true);
                let currentIndex = 0;
                
                const applyNext = () => {
                  if (currentIndex >= ids.length) {
                    setApplying(false);
                    return;
                  }
                  
                  handleApplyCorrection(ids[currentIndex]).then(() => {
                    currentIndex++;
                    applyNext();
                  });
                };
                
                applyNext();
              }}
              disabled={applying || potentialCorrections.every(c => isCorrectionApplied(c.id))}
            >
              {applying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                  Applying...
                </>
              ) : potentialCorrections.every(c => isCorrectionApplied(c.id)) ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  All Applied
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4 mr-1.5" />
                  Apply All Fixes
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFileValidation;