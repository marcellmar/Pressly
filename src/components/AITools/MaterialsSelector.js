import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Slider, 
  Chip,
  Grid,
  LinearProgress,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Info, 
  LocalOffer, 
  Opacity, 
  Nature, 
  Timer
} from '@mui/icons-material';

/**
 * Interface for selecting materials based on AI recommendations
 */
const MaterialsSelector = ({ 
  materials, 
  selectedMaterial, 
  onSelectMaterial,
  sustainabilityMetrics
}) => {
  const [priorityWeights, setPriorityWeights] = useState({
    quality: 25,
    cost: 25,
    sustainability: 25,
    durability: 25
  });
  
  // Update priority weight
  const handleWeightChange = (priority, newValue) => {
    // Adjust other weights to keep total at 100%
    const current = priorityWeights[priority];
    const difference = newValue - current;
    
    const otherPriorities = Object.keys(priorityWeights).filter(p => p !== priority);
    const totalOtherWeight = otherPriorities.reduce((sum, p) => sum + priorityWeights[p], 0);
    
    const newWeights = { ...priorityWeights };
    newWeights[priority] = newValue;
    
    // Distribute the difference proportionally among other priorities
    otherPriorities.forEach(p => {
      const proportion = priorityWeights[p] / totalOtherWeight;
      newWeights[p] = Math.max(0, priorityWeights[p] - (difference * proportion));
    });
    
    setPriorityWeights(newWeights);
    
    // Recalculate material scores based on new weights
    // This would trigger a real recalculation of recommendations in production
  };
  
  // Get color for score
  const getScoreColor = (score) => {
    if (score >= 0.8) return 'success.main';
    if (score >= 0.6) return 'info.main';
    if (score >= 0.4) return 'warning.main';
    return 'error.main';
  };
  
  // Render chip for material property
  const renderPropertyChip = (label, value, icon) => (
    <Tooltip title={`${label}: ${value}`}>
      <Chip
        icon={icon}
        label={value}
        size="small"
        sx={{ mr: 1, mb: 1 }}
      />
    </Tooltip>
  );
  
  // Sort materials by score
  const sortedMaterials = [...materials].sort((a, b) => b.score - a.score);
  
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI-Recommended Materials
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Customize Priorities
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" gutterBottom>
                Print Quality: {priorityWeights.quality}%
              </Typography>
              <Slider
                value={priorityWeights.quality}
                onChange={(e, value) => handleWeightChange('quality', value)}
                min={0}
                max={100}
                step={5}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" gutterBottom>
                Cost: {priorityWeights.cost}%
              </Typography>
              <Slider
                value={priorityWeights.cost}
                onChange={(e, value) => handleWeightChange('cost', value)}
                min={0}
                max={100}
                step={5}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" gutterBottom>
                Sustainability: {priorityWeights.sustainability}%
              </Typography>
              <Slider
                value={priorityWeights.sustainability}
                onChange={(e, value) => handleWeightChange('sustainability', value)}
                min={0}
                max={100}
                step={5}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" gutterBottom>
                Durability: {priorityWeights.durability}%
              </Typography>
              <Slider
                value={priorityWeights.durability}
                onChange={(e, value) => handleWeightChange('durability', value)}
                min={0}
                max={100}
                step={5}
              />
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <RadioGroup
          value={selectedMaterial ? selectedMaterial.id : ''}
          onChange={(e) => {
            const selected = materials.find(m => m.id === e.target.value);
            onSelectMaterial(selected);
          }}
        >
          {sortedMaterials.map((material) => (
            <Box 
              key={material.id} 
              sx={{ 
                mb: 2, 
                p: 1,
                borderRadius: 1,
                bgcolor: selectedMaterial?.id === material.id ? 'action.hover' : 'transparent'
              }}
            >
              <FormControlLabel
                value={material.id}
                control={<Radio />}
                label={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ mr: 1 }}>
                        {material.name}
                      </Typography>
                      <Chip 
                        label={`Match Score: ${Math.round(material.score * 100)}%`}
                        size="small"
                        color={material.score >= 0.8 ? "success" : "primary"}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {material.type.charAt(0).toUpperCase() + material.type.slice(1)} material
                      {material.bestFor && ` - Best for: ${material.bestFor.join(', ')}`}
                    </Typography>
                    
                    <Box sx={{ mt: 1 }}>
                      {renderPropertyChip('Weight', material.properties.weight, <Opacity />)}
                      {renderPropertyChip('Finish', material.properties.finish, <Timer />)}
                      {renderPropertyChip('Cost', material.properties.cost, <LocalOffer />)}
                      {renderPropertyChip('Sustainability', 
                        `${material.properties.sustainability}/100`, <Nature />)}
                    </Box>
                    
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" component="div">
                        Match Details:
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        {Object.entries(material.matchDetails || {}).map(([key, value]) => (
                          <Grid item xs={6} sm={3} key={key}>
                            <Typography variant="caption" component="div">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(value) * 100}
                              sx={{ 
                                height: 8, 
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: getScoreColor(parseFloat(value))
                                }
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', width: '100%' }}
              />
            </Box>
          ))}
        </RadioGroup>
        
        {sustainabilityMetrics && selectedMaterial && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 1, 
              bgcolor: 'success.light',
              color: 'success.contrastText'
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Sustainability Impact
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  Water Savings: {sustainabilityMetrics.waterSavings}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  Carbon Reduction: {sustainabilityMetrics.carbonReduction}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Rating: {sustainabilityMetrics.sustainabilityRating} 
                  ({sustainabilityMetrics.sustainabilityScore}/100)
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialsSelector;