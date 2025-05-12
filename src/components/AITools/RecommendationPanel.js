import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Divider, Chip } from '@mui/material';
import { CheckCircle, ErrorOutline, Info, Warning } from '@mui/icons-material';

/**
 * Interactive panel showing AI-generated recommendations for design improvements
 */
const RecommendationPanel = ({ 
  originalDesign, 
  recommendations, 
  onApplyRecommendation,
  onDismissRecommendation
}) => {
  const [activeTab, setActiveTab] = useState('layout');
  
  // Group recommendations by type
  const groupedRecommendations = recommendations.reduce((groups, rec) => {
    const group = rec.type || 'other';
    if (!groups[group]) groups[group] = [];
    groups[group].push(rec);
    return groups;
  }, {});
  
  // Count recommendations by type
  const counts = Object.keys(groupedRecommendations).reduce((count, key) => {
    count[key] = groupedRecommendations[key].length;
    return count;
  }, {});
  
  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ErrorOutline color="error" />;
      case 'medium':
        return <Warning color="warning" />;
      case 'low':
        return <Info color="info" />;
      default:
        return <Info color="info" />;
    }
  };
  
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Design Recommendations
        </Typography>
        
        <Box sx={{ display: 'flex', mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          {Object.keys(groupedRecommendations).map((type) => (
            <Button 
              key={type}
              variant={activeTab === type ? "contained" : "text"}
              size="small"
              onClick={() => setActiveTab(type)}
              sx={{ mr: 1 }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <Chip 
                size="small" 
                label={counts[type]} 
                sx={{ ml: 1, height: 20 }} 
              />
            </Button>
          ))}
        </Box>
        
        <Box>
          {groupedRecommendations[activeTab]?.map((rec, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ mr: 1, mt: 0.5 }}>
                  {getSeverityIcon(rec.severity)}
                </Box>
                <Box>
                  <Typography variant="subtitle1">
                    {rec.issue || rec.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {rec.recommendation || rec.impact}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                {onDismissRecommendation && (
                  <Button 
                    size="small" 
                    onClick={() => onDismissRecommendation(rec)}
                  >
                    Dismiss
                  </Button>
                )}
                {onApplyRecommendation && (
                  <Button 
                    size="small" 
                    variant="contained" 
                    startIcon={<CheckCircle />}
                    onClick={() => onApplyRecommendation(rec)}
                    sx={{ ml: 1 }}
                  >
                    Apply Fix
                  </Button>
                )}
              </Box>
              
              {index < groupedRecommendations[activeTab].length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </Box>
          ))}
          
          {(!groupedRecommendations[activeTab] || 
            groupedRecommendations[activeTab].length === 0) && (
            <Box sx={{ py: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No {activeTab} recommendations available
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecommendationPanel;