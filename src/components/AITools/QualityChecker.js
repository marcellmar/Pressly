import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Chip,
  IconButton,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  WarningAmber,
  ErrorOutline,
  Info,
  CheckCircle,
  Fullscreen
} from '@mui/icons-material';

/**
 * Visual quality assurance viewer for highlighting potential print issues
 */
const QualityChecker = ({ 
  designFile, 
  issues, 
  riskScore, 
  riskLevel,
  recommendations 
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showAllIssues, setShowAllIssues] = useState(true);
  const [activeIssueTypes, setActiveIssueTypes] = useState({
    resolution: true,
    color: true,
    layout: true,
    font: true
  });
  const canvasRef = useRef(null);
  
  // Generate image URL for preview
  useEffect(() => {
    if (designFile && designFile instanceof File) {
      const url = URL.createObjectURL(designFile);
      setImageUrl(url);
      
      // Clean up on unmount
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [designFile]);
  
  // Draw image and issue highlights on canvas
  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Draw issue highlights
        if (showAllIssues && issues && issues.length > 0) {
          issues.forEach(issue => {
            // Only show active issue types
            if (!activeIssueTypes[issue.type]) return;
            
            if (issue.location) {
              // Draw highlight rectangle
              ctx.strokeStyle = getSeverityColor(issue.severity);
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 3]);
              ctx.strokeRect(
                issue.location.x,
                issue.location.y,
                issue.location.width,
                issue.location.height
              );
              
              // Draw indicator icon
              ctx.font = '16px Arial';
              ctx.fillStyle = getSeverityColor(issue.severity);
              ctx.fillText('!', 
                issue.location.x + issue.location.width - 10,
                issue.location.y - 5
              );
            }
          });
        }
      };
      
      img.src = imageUrl;
    }
  }, [imageUrl, issues, showAllIssues, activeIssueTypes]);
  
  // Get color based on severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#f44336'; // red
      case 'medium':
        return '#ff9800'; // orange
      case 'low':
        return '#2196f3'; // blue
      default:
        return '#4caf50'; // green
    }
  };
  
  // Get icon based on severity
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ErrorOutline color="error" />;
      case 'medium':
        return <WarningAmber color="warning" />;
      case 'low':
        return <Info color="info" />;
      default:
        return <Info color="info" />;
    }
  };
  
  // Toggle issue type visibility
  const toggleIssueType = (type) => {
    setActiveIssueTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Handle zoom in/out
  const handleZoom = (direction) => {
    if (direction === 'in') {
      setZoom(prev => Math.min(prev + 0.25, 3));
    } else {
      setZoom(prev => Math.max(prev - 0.25, 0.5));
    }
  };
  
  // Get risk level color
  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      case 'Minimal':
        return 'success';
      default:
        return 'info';
    }
  };
  
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Design Quality Check
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          {/* Canvas Preview Area */}
          <Box 
            sx={{ 
              flex: 2, 
              position: 'relative',
              border: '1px solid #ddd',
              borderRadius: 1,
              overflow: 'hidden',
              height: 400
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 10,
                p: 1,
                display: 'flex',
                gap: 0.5,
                bgcolor: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              <Tooltip title="Zoom In">
                <IconButton size="small" onClick={() => handleZoom('in')}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton size="small" onClick={() => handleZoom('out')}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Tooltip title="Full Screen">
                <IconButton size="small">
                  <Fullscreen />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box 
              sx={{ 
                width: '100%', 
                height: '100%', 
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  transform: `scale(${zoom})`,
                  transformOrigin: '0 0',
                  transition: 'transform 0.2s'
                }}
              >
                <canvas 
                  ref={canvasRef} 
                  style={{ maxWidth: '100%', display: 'block' }}
                />
              </Box>
            </Box>
          </Box>
          
          {/* Issues and Recommendations */}
          <Box sx={{ flex: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2
              }}
            >
              <Typography variant="subtitle1">
                Overall Quality:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={`${riskLevel} Risk`}
                  color={getRiskLevelColor(riskLevel)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2">
                  Score: {riskScore}/100
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Filter Issues:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.keys(activeIssueTypes).map((type) => (
                  <Chip
                    key={type}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    color={activeIssueTypes[type] ? 'primary' : 'default'}
                    onClick={() => toggleIssueType(type)}
                    variant={activeIssueTypes[type] ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={showAllIssues}
                  onChange={(e) => setShowAllIssues(e.target.checked)}
                />
              }
              label="Show Issues on Design"
            />
            
            <List sx={{ maxHeight: 250, overflow: 'auto', mt: 2 }}>
              {issues && issues.filter(issue => activeIssueTypes[issue.type]).map((issue, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getSeverityIcon(issue.severity)}
                  </ListItemIcon>
                  <ListItemText
                    primary={issue.description}
                    secondary={issue.impact}
                  />
                </ListItem>
              ))}
              
              {(!issues || issues.length === 0) && (
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="No issues detected" />
                </ListItem>
              )}
            </List>
          </Box>
        </Box>
        
        {recommendations && recommendations.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            
            <List>
              {recommendations.map((rec, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemIcon>
                    <Info color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={rec.title}
                    secondary={
                      <Box component="span">
                        <Typography variant="body2" component="div" gutterBottom>
                          {rec.description || 'Follow these steps to fix issues:'}
                        </Typography>
                        
                        <List dense disablePadding>
                          {rec.steps && rec.steps.map((step, stepIdx) => (
                            <ListItem key={stepIdx} sx={{ py: 0 }}>
                              <ListItemText
                                primary={`• ${step}`}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default QualityChecker;