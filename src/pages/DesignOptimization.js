import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography, 
  Box, 
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Upload, 
  Check, 
  CheckCircle, 
  ArrowForward,
  CloudUpload,
  FormatPaint,
  Search, 
  PriceCheck
} from '@mui/icons-material';

// Import AI services
import aiServices from '../services/ai';

// Import AI Tool components
import RecommendationPanel from '../components/AITools/RecommendationPanel';
import MaterialsSelector from '../components/AITools/MaterialsSelector';
import QualityChecker from '../components/AITools/QualityChecker';

/**
 * AI-powered Design Optimization Dashboard
 */
const DesignOptimization = () => {
  // State for design file
  const [designFile, setDesignFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  
  // State for analysis results
  const [designAnalysis, setDesignAnalysis] = useState(null);
  const [productionOptimization, setProductionOptimization] = useState(null);
  const [materialRecommendations, setMaterialRecommendations] = useState(null);
  const [qualityIssues, setQualityIssues] = useState(null);
  const [costEstimates, setCostEstimates] = useState(null);
  
  // Selected material
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  // Define steps for the optimization process
  const steps = [
    'Upload Design',
    'Analyze & Optimize',
    'Review & Export'
  ];

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDesignFile(file);
      setActiveStep(1); // Move to analysis step
    }
  };
  
  // Analyze the design
  const analyzeDesign = async () => {
    if (!designFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Run all analyses in parallel
      const [
        analysis,
        optimization,
        materials,
        issues,
        costs
      ] = await Promise.all([
        aiServices.analyzeDesign(designFile),
        aiServices.optimizeForProduction(designFile),
        aiServices.recommendMaterials(designFile, 'tshirt'),
        aiServices.detectProductionIssues(designFile),
        aiServices.estimateProductionCosts(designFile, {
          productType: 'tshirt',
          material: 'standard',
          quantity: 100
        })
      ]);
      
      // Store results
      setDesignAnalysis(analysis);
      setProductionOptimization(optimization);
      setMaterialRecommendations(materials);
      setQualityIssues(issues);
      setCostEstimates(costs);
      
      // Set initial selected material
      if (materials && materials.recommendations && materials.recommendations.length > 0) {
        setSelectedMaterial(materials.recommendations[0]);
      }
      
      // Move to review step
      setActiveStep(2);
    } catch (err) {
      console.error('Error analyzing design:', err);
      setError('Failed to analyze design. Please try again or contact support.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Reset the process
  const resetProcess = () => {
    setDesignFile(null);
    setDesignAnalysis(null);
    setProductionOptimization(null);
    setMaterialRecommendations(null);
    setQualityIssues(null);
    setCostEstimates(null);
    setSelectedMaterial(null);
    setActiveStep(0);
    setActiveTab(0);
    setError(null);
  };
  
  // Apply a recommendation
  const handleApplyRecommendation = (recommendation) => {
    // In a real implementation, this would modify the design
    console.log('Applying recommendation:', recommendation);
    
    // For now, just mark it as applied by removing it from the list
    setProductionOptimization(prev => ({
      ...prev,
      recommendations: {
        ...prev.recommendations,
        [recommendation.type]: prev.recommendations[recommendation.type]
          .filter(rec => rec.issue !== recommendation.issue)
      }
    }));
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        AI Design Optimization
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        Analyze and enhance your designs for optimal production quality
      </Typography>
      
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      {/* Step 1: Upload Design */}
      {activeStep === 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minHeight: 300,
            justifyContent: 'center'
          }}
        >
          <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Upload Your Design
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Upload your design file to analyze it for production quality and optimization opportunities.
            <br />
            Supported formats: JPG, PNG, SVG, PDF, AI
          </Typography>
          
          <Button
            variant="contained"
            component="label"
            startIcon={<Upload />}
          >
            Select Design File
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/svg+xml,application/pdf,application/illustrator"
              onChange={handleFileUpload}
            />
          </Button>
        </Paper>
      )}
      
      {/* Step 2: Analyze & Optimize */}
      {activeStep === 1 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minHeight: 300,
            justifyContent: 'center'
          }}
        >
          {isAnalyzing ? (
            <>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Analyzing Your Design
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Our AI is analyzing your design for optimization opportunities.
                <br />
                This may take a few moments...
              </Typography>
            </>
          ) : (
            <>
              <FormatPaint sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Ready to Analyze
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                File: {designFile?.name}
                <br />
                Size: {(designFile?.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={resetProcess}
                >
                  Change File
                </Button>
                <Button
                  variant="contained"
                  onClick={analyzeDesign}
                  startIcon={<Search />}
                >
                  Analyze Design
                </Button>
              </Box>
            </>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
        </Paper>
      )}
      
      {/* Step 3: Review & Export */}
      {activeStep === 2 && designAnalysis && (
        <Box>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="optimization tabs"
            >
              <Tab icon={<CheckCircle />} label="Quality Check" />
              <Tab icon={<FormatPaint />} label="Optimization" />
              <Tab icon={<PriceCheck />} label="Materials & Cost" />
            </Tabs>
          </Paper>
          
          {/* Quality Check Tab */}
          {activeTab === 0 && (
            <div>
              {qualityIssues && (
                <QualityChecker
                  designFile={designFile}
                  issues={qualityIssues.issues}
                  riskScore={qualityIssues.riskScore}
                  riskLevel={qualityIssues.riskLevel}
                  recommendations={qualityIssues.recommendations}
                />
              )}
            </div>
          )}
          
          {/* Optimization Tab */}
          {activeTab === 1 && (
            <div>
              {productionOptimization && (
                <RecommendationPanel
                  originalDesign={designAnalysis}
                  recommendations={[
                    ...productionOptimization.recommendations.layout,
                    ...productionOptimization.recommendations.colors,
                    ...productionOptimization.recommendations.materials
                  ]}
                  onApplyRecommendation={handleApplyRecommendation}
                />
              )}
              
              <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Efficiency Score: {productionOptimization?.efficiencyScore}/100
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Potential Savings:
                    </Typography>
                    <Typography variant="body2">
                      Cost: {productionOptimization?.potentialSavings?.cost}
                    </Typography>
                    <Typography variant="body2">
                      Ink Usage: {productionOptimization?.potentialSavings?.inkUsage}
                    </Typography>
                    <Typography variant="body2">
                      Material Waste: {productionOptimization?.potentialSavings?.materialWaste}
                    </Typography>
                    <Typography variant="body2">
                      Production Time: {productionOptimization?.potentialSavings?.productionTime}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Design Analysis:
                    </Typography>
                    <Typography variant="body2">
                      Complexity: {designAnalysis?.analysis?.designComplexity}/100
                    </Typography>
                    <Typography variant="body2">
                      Printability: {designAnalysis?.analysis?.printability}/100
                    </Typography>
                    <Typography variant="body2">
                      Color Profile: {designAnalysis?.analysis?.colorProfile}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </div>
          )}
          
          {/* Materials & Cost Tab */}
          {activeTab === 2 && (
            <div>
              {materialRecommendations && (
                <MaterialsSelector
                  materials={materialRecommendations.recommendations}
                  selectedMaterial={selectedMaterial}
                  onSelectMaterial={setSelectedMaterial}
                  sustainabilityMetrics={materialRecommendations.sustainabilityImpact}
                />
              )}
              
              {costEstimates && (
                <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Cost Estimate
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Summary:
                      </Typography>
                      <Typography variant="body2">
                        Total: ${costEstimates.summary.totalCost}
                      </Typography>
                      <Typography variant="body2">
                        Per Unit: ${costEstimates.summary.unitCost}
                      </Typography>
                      <Typography variant="body2">
                        Quantity: {costEstimates.summary.quantity} units
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Cost Factors:
                      </Typography>
                      {costEstimates.costFactors.map((factor, index) => (
                        <Typography key={index} variant="body2">
                          {factor.factor}: {factor.impact} impact
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Savings Opportunities:
                  </Typography>
                  {costEstimates.savingsOpportunities.map((opportunity, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {opportunity.opportunity}
                      </Typography>
                      <Typography variant="body2">
                        {opportunity.description} (Est. savings: {opportunity.estimatedSavings})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </div>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={resetProcess}>
              Start Over
            </Button>
            <Button 
              variant="contained" 
              endIcon={<ArrowForward />}
              onClick={() => console.log('Exporting design...')}
            >
              Continue to Production
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default DesignOptimization;