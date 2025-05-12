import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/pressly-theme.css';

/**
 * Canvas-based analytics chart component
 * Provides interactive data visualization with better performance than CSS/SVG-based charts
 */
const CanvasAnalyticsChart = ({
  data,
  type = 'bar', // 'bar', 'line', 'pie', 'area', 'scatter'
  width = 800,
  height = 400,
  colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--warning)', 'var(--info)'],
  title = '',
  labels = [],
  showLegend = true,
  showTooltip = true,
  animate = true,
  backgroundColor = 'white',
  gridColor = '#f0f0f0',
  textColor = 'var(--gray-dark)',
  borderRadius = 5,
  padding = { top: 40, right: 30, bottom: 50, left: 60 },
  xAxisLabel = '',
  yAxisLabel = '',
  onClick = null,
  stacked = false,
  formatTooltip = null,
  formatYAxis = value => value
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [hoveredElement, setHoveredElement] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(animate ? 0 : 1);
  const [processedData, setProcessedData] = useState(null);
  const [cssVariables, setCssVariables] = useState({});
  
  // Extract CSS variables for chart colors
  useEffect(() => {
    const extractCSSVariable = (variable) => {
      if (!variable.startsWith('var(--')) return variable;
      
      const varName = variable.replace('var(--', '').replace(')', '');
      return getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`).trim();
    };
    
    const extractedColors = colors.map(color => extractCSSVariable(color));
    const extracted = {
      chartColors: extractedColors,
      textColor: extractCSSVariable(textColor),
      gridColor: extractCSSVariable(gridColor),
      backgroundColor: extractCSSVariable(backgroundColor)
    };
    
    setCssVariables(extracted);
  }, [colors, textColor, gridColor, backgroundColor]);
  
  // Format data for rendering
  useEffect(() => {
    let processed;
    
    if (!data || data.length === 0) {
      processed = null;
    } else if (Array.isArray(data[0])) {
      // Multi-series data
      processed = {
        series: data,
        seriesNames: labels.length >= data.length ? labels.slice(0, data.length) : data.map((_, i) => `Series ${i + 1}`),
        maxValue: stacked 
          ? Math.max(...data[0].map((_, colIndex) => 
              data.reduce((sum, row) => sum + (row[colIndex] || 0), 0)
            ))
          : Math.max(...data.flat())
      };
    } else {
      // Single series data
      processed = {
        series: [data],
        seriesNames: [labels[0] || 'Series 1'],
        maxValue: Math.max(...data)
      };
    }
    
    setProcessedData(processed);
  }, [data, labels, stacked]);
  
  // Animation effect
  useEffect(() => {
    if (!animate || !processedData) {
      setAnimationProgress(1);
      return;
    }
    
    setAnimationProgress(0);
    let start;
    const duration = 800; // Animation duration in ms
    
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    const animationId = window.requestAnimationFrame(step);
    
    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [animate, processedData]);
  
  // Render chart when data changes or animation progresses
  useEffect(() => {
    if (!canvasRef.current || !processedData || !cssVariables.chartColors) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = cssVariables.backgroundColor || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Define chart area with padding
    const chartArea = {
      x: padding.left,
      y: padding.top,
      width: canvas.width - padding.left - padding.right,
      height: canvas.height - padding.top - padding.bottom
    };
    
    // Draw title
    if (title) {
      ctx.font = '18px sans-serif';
      ctx.fillStyle = cssVariables.textColor || '#333';
      ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width / 2, 25);
    }
    
    // Get data for rendering
    const { series, seriesNames, maxValue } = processedData;
    
    // Adjusted maxValue for better visualization (add 10% padding)
    const adjustedMaxValue = maxValue * 1.1;
    
    // Draw based on chart type
    switch (type) {
      case 'bar':
        drawBarChart(ctx, chartArea, series, seriesNames, adjustedMaxValue);
        break;
      case 'line':
        drawLineChart(ctx, chartArea, series, seriesNames, adjustedMaxValue);
        break;
      case 'area':
        drawAreaChart(ctx, chartArea, series, seriesNames, adjustedMaxValue);
        break;
      case 'pie':
        drawPieChart(ctx, chartArea, series[0], seriesNames);
        break;
      case 'scatter':
        drawScatterChart(ctx, chartArea, series, seriesNames, adjustedMaxValue);
        break;
      default:
        drawBarChart(ctx, chartArea, series, seriesNames, adjustedMaxValue);
    }
    
    // Draw axes
    drawAxes(ctx, chartArea, series[0].length, adjustedMaxValue);
    
    // Draw legend
    if (showLegend) {
      drawLegend(ctx, series, seriesNames);
    }
    
  }, [processedData, animationProgress, cssVariables, type, width, height, padding, title, showLegend, xAxisLabel, yAxisLabel, stacked]);
  
  /**
   * Draw bar chart
   */
  const drawBarChart = (ctx, chartArea, series, seriesNames, maxValue) => {
    const { x, y, width, height } = chartArea;
    const dataLength = series[0].length;
    const seriesCount = series.length;
    
    const barSpacing = 0.2; // 20% of the available width is spacing
    const groupWidth = width / dataLength;
    
    // Calculate bar width based on number of series
    let barWidth;
    if (stacked) {
      barWidth = groupWidth * (1 - barSpacing);
    } else {
      barWidth = (groupWidth * (1 - barSpacing)) / seriesCount;
    }
    
    // Draw bars for each series
    series.forEach((data, seriesIndex) => {
      ctx.fillStyle = cssVariables.chartColors[seriesIndex % cssVariables.chartColors.length];
      
      data.forEach((value, dataIndex) => {
        const barHeight = (value / maxValue) * height * animationProgress;
        
        // Calculate bar position
        let barX;
        if (stacked) {
          barX = x + (dataIndex * groupWidth) + (groupWidth * barSpacing / 2);
        } else {
          barX = x + (dataIndex * groupWidth) + (seriesIndex * barWidth) + (groupWidth * barSpacing / 2);
        }
        
        // For stacked bar charts, calculate y based on previous series
        let barY;
        if (stacked && seriesIndex > 0) {
          const previousHeight = series
            .slice(0, seriesIndex)
            .reduce((sum, seriesData) => sum + (seriesData[dataIndex] / maxValue) * height * animationProgress, 0);
          barY = y + height - barHeight - previousHeight;
        } else {
          barY = y + height - barHeight;
        }
        
        // Draw the bar with rounded corners
        roundRect(ctx, barX, barY, barWidth, barHeight, borderRadius, true);
        
        // Store bar info for tooltips and click handling
        if (animationProgress === 1) {
          const barInfo = {
            type: 'bar',
            x: barX,
            y: barY,
            width: barWidth,
            height: barHeight,
            dataIndex,
            seriesIndex,
            value,
            seriesName: seriesNames[seriesIndex]
          };
          
          // Check if mouse is hovering over this bar
          if (hoveredElement && 
              hoveredElement.x >= barX && 
              hoveredElement.x <= barX + barWidth &&
              hoveredElement.y >= barY && 
              hoveredElement.y <= barY + barHeight) {
            
            // Highlight the hovered bar
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            roundRect(ctx, barX, barY, barWidth, barHeight, borderRadius, false, true);
            
            // Show tooltip
            if (showTooltip) {
              const content = formatTooltip 
                ? formatTooltip(value, seriesNames[seriesIndex], dataIndex)
                : `${seriesNames[seriesIndex]}: ${value}`;
              
              setTooltip({
                visible: true,
                x: barX + barWidth / 2,
                y: barY - 10,
                content
              });
            }
          }
        }
      });
    });
  };
  
  /**
   * Draw line chart
   */
  const drawLineChart = (ctx, chartArea, series, seriesNames, maxValue) => {
    const { x, y, width, height } = chartArea;
    const dataLength = series[0].length;
    
    // Draw lines for each series
    series.forEach((data, seriesIndex) => {
      ctx.strokeStyle = cssVariables.chartColors[seriesIndex % cssVariables.chartColors.length];
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      
      // Start path
      ctx.beginPath();
      
      // Draw points and lines
      data.forEach((value, dataIndex) => {
        const pointX = x + (dataIndex / (dataLength - 1)) * width;
        const pointY = y + height - (value / maxValue) * height * animationProgress;
        
        if (dataIndex === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
        
        // Add point markers
        if (animationProgress === 1) {
          ctx.fillStyle = cssVariables.chartColors[seriesIndex % cssVariables.chartColors.length];
          ctx.beginPath();
          ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Check if mouse is hovering over this point
          if (hoveredElement) {
            const distance = Math.sqrt(
              Math.pow(hoveredElement.x - pointX, 2) + 
              Math.pow(hoveredElement.y - pointY, 2)
            );
            
            if (distance <= 8) {
              // Highlight the hovered point
              ctx.fillStyle = 'white';
              ctx.strokeStyle = cssVariables.chartColors[seriesIndex % cssVariables.chartColors.length];
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
              ctx.fill();
              
              // Show tooltip
              if (showTooltip) {
                const content = formatTooltip 
                  ? formatTooltip(value, seriesNames[seriesIndex], dataIndex)
                  : `${seriesNames[seriesIndex]}: ${value}`;
                
                setTooltip({
                  visible: true,
                  x: pointX,
                  y: pointY - 15,
                  content
                });
              }
            }
          }
        }
      });
      
      // Stroke the line
      ctx.stroke();
    });
  };
  
  /**
   * Draw area chart
   */
  const drawAreaChart = (ctx, chartArea, series, seriesNames, maxValue) => {
    const { x, y, width, height } = chartArea;
    const dataLength = series[0].length;
    
    // Draw from bottom to top for proper stacking
    for (let seriesIndex = series.length - 1; seriesIndex >= 0; seriesIndex--) {
      const data = series[seriesIndex];
      const color = cssVariables.chartColors[seriesIndex % cssVariables.chartColors.length];
      
      ctx.fillStyle = hexToRgba(color, 0.7);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      // Start path
      ctx.beginPath();
      
      // Move to starting position at the bottom
      ctx.moveTo(x, y + height);
      
      // For stacked areas, calculate previous series values
      const getStackedValue = (dataIndex, currentIndex) => {
        if (!stacked || currentIndex === 0) return 0;
        
        return series
          .slice(currentIndex + 1)
          .reduce((sum, seriesData) => sum + seriesData[dataIndex], 0);
      };
      
      // Draw bottom line from left to right
      data.forEach((value, dataIndex) => {
        const stackedValue = getStackedValue(dataIndex, seriesIndex);
        const pointX = x + (dataIndex / (dataLength - 1)) * width;
        const pointY = y + height - ((value + stackedValue) / maxValue) * height * animationProgress;
        
        ctx.lineTo(pointX, pointY);
      });
      
      // Complete the path back to the bottom-right, then to bottom-left
      const lastDataIndex = data.length - 1;
      const lastStackedValue = getStackedValue(lastDataIndex, seriesIndex);
      const bottomY = stacked 
        ? y + height - (lastStackedValue / maxValue) * height * animationProgress 
        : y + height;
      
      ctx.lineTo(x + width, bottomY);
      
      const firstStackedValue = getStackedValue(0, seriesIndex);
      const startBottomY = stacked 
        ? y + height - (firstStackedValue / maxValue) * height * animationProgress
        : y + height;
      
      ctx.lineTo(x, startBottomY);
      
      // Fill the area
      ctx.fill();
      
      // Draw the top line for clarity
      ctx.beginPath();
      data.forEach((value, dataIndex) => {
        const stackedValue = getStackedValue(dataIndex, seriesIndex);
        const pointX = x + (dataIndex / (dataLength - 1)) * width;
        const pointY = y + height - ((value + stackedValue) / maxValue) * height * animationProgress;
        
        if (dataIndex === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
        
        // Add hover effects for full animation
        if (animationProgress === 1) {
          // Check if mouse is hovering over this point
          if (hoveredElement) {
            const distance = Math.sqrt(
              Math.pow(hoveredElement.x - pointX, 2) + 
              Math.pow(hoveredElement.y - pointY, 2)
            );
            
            if (distance <= 8) {
              // Highlight the hovered point
              ctx.fillStyle = 'white';
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fill();
              
              // Show tooltip
              if (showTooltip) {
                const content = formatTooltip 
                  ? formatTooltip(value, seriesNames[seriesIndex], dataIndex)
                  : `${seriesNames[seriesIndex]}: ${value}`;
                
                setTooltip({
                  visible: true,
                  x: pointX,
                  y: pointY - 15,
                  content
                });
              }
            }
          }
        }
      });
      
      ctx.stroke();
    }
  };
  
  /**
   * Draw pie chart
   */
  const drawPieChart = (ctx, chartArea, data, seriesNames) => {
    const { x, y, width, height } = chartArea;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) / 2 * 0.8;
    
    // Calculate total value for percentages
    const total = data.reduce((sum, value) => sum + value, 0);
    
    let startAngle = -Math.PI / 2; // Start from the top
    
    // Draw pie slices
    data.forEach((value, index) => {
      // Skip if value is zero or negative
      if (value <= 0) return;
      
      const sliceAngle = (value / total) * Math.PI * 2 * animationProgress;
      const endAngle = startAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;
      
      // Draw the slice
      ctx.fillStyle = cssVariables.chartColors[index % cssVariables.chartColors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
      
      // Draw slice border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (animationProgress === 1) {
        // Check if mouse is hovering over this slice
        if (hoveredElement) {
          const dx = hoveredElement.x - centerX;
          const dy = hoveredElement.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check if point is within the pie radius
          if (distance <= radius) {
            // Calculate angle of the mouse point
            let mouseAngle = Math.atan2(dy, dx);
            if (mouseAngle < 0) mouseAngle += Math.PI * 2;
            
            // Adjust to match our starting point (top)
            mouseAngle = (mouseAngle + Math.PI / 2) % (Math.PI * 2);
            
            // Check if the mouse angle is within this slice
            if (mouseAngle >= startAngle && mouseAngle <= endAngle) {
              // Highlight the hovered slice
              ctx.fillStyle = cssVariables.chartColors[index % cssVariables.chartColors.length];
              ctx.globalAlpha = 0.8;
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.arc(centerX, centerY, radius * 1.05, startAngle, endAngle);
              ctx.closePath();
              ctx.fill();
              ctx.globalAlpha = 1;
              
              // Show tooltip
              if (showTooltip) {
                const percentage = ((value / total) * 100).toFixed(1);
                const content = formatTooltip 
                  ? formatTooltip(value, seriesNames[0], index)
                  : `${seriesNames[0]} ${index + 1}: ${value} (${percentage}%)`;
                
                const tooltipX = centerX + Math.cos(midAngle) * (radius * 0.6);
                const tooltipY = centerY + Math.sin(midAngle) * (radius * 0.6);
                
                setTooltip({
                  visible: true,
                  x: tooltipX,
                  y: tooltipY,
                  content
                });
              }
            }
          }
        }
        
        // Add percentage labels
        const percentage = ((value / total) * 100).toFixed(0);
        if (percentage >= 5) { // Only show label if slice is big enough
          const labelRadius = radius * 0.7;
          const labelX = centerX + Math.cos(midAngle) * labelRadius;
          const labelY = centerY + Math.sin(midAngle) * labelRadius;
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${percentage}%`, labelX, labelY);
        }
      }
      
      startAngle = endAngle;
    });
  };
  
  /**
   * Draw scatter chart
   */
  const drawScatterChart = (ctx, chartArea, series, seriesNames, maxValue) => {
    const { x, y, width, height } = chartArea;
    const dataLength = series[0].length;
    
    // Draw scatter points for each series
    series.forEach((data, seriesIndex) => {
      const color = cssVariables.chartColors[seriesIndex % cssVariables.chartColors.length];
      ctx.fillStyle = color;
      
      data.forEach((value, dataIndex) => {
        const pointX = x + (dataIndex / (dataLength - 1)) * width;
        const pointY = y + height - (value / maxValue) * height * animationProgress;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Add hover effects for full animation
        if (animationProgress === 1) {
          // Check if mouse is hovering over this point
          if (hoveredElement) {
            const distance = Math.sqrt(
              Math.pow(hoveredElement.x - pointX, 2) + 
              Math.pow(hoveredElement.y - pointY, 2)
            );
            
            if (distance <= 8) {
              // Highlight the hovered point
              ctx.fillStyle = 'white';
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
              ctx.fill();
              
              // Show tooltip
              if (showTooltip) {
                const content = formatTooltip 
                  ? formatTooltip(value, seriesNames[seriesIndex], dataIndex)
                  : `${seriesNames[seriesIndex]}: ${value}`;
                
                setTooltip({
                  visible: true,
                  x: pointX,
                  y: pointY - 15,
                  content
                });
              }
            }
          }
        }
      });
    });
  };
  
  /**
   * Draw axes with grid lines and labels
   */
  const drawAxes = (ctx, chartArea, dataLength, maxValue) => {
    const { x, y, width, height } = chartArea;
    
    ctx.strokeStyle = cssVariables.gridColor || '#e0e0e0';
    ctx.fillStyle = cssVariables.textColor || '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis line
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.stroke();
    
    // Y-axis line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.stroke();
    
    // Draw grid lines and labels
    const gridLines = 5; // Number of horizontal grid lines
    
    // Draw horizontal grid lines and labels
    for (let i = 0; i <= gridLines; i++) {
      const yPos = y + height - (i / gridLines) * height;
      const value = (i / gridLines) * maxValue;
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(x, yPos);
      ctx.lineTo(x + width, yPos);
      ctx.stroke();
      
      // Y-axis label
      ctx.textAlign = 'right';
      ctx.fillText(formatYAxis(value), x - 10, yPos + 4);
    }
    
    // Draw vertical grid lines and labels for the X-axis
    for (let i = 0; i < dataLength; i++) {
      const xPos = x + (i / (dataLength - 1)) * width;
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(xPos, y);
      ctx.lineTo(xPos, y + height);
      ctx.stroke();
      
      // X-axis label
      ctx.textAlign = 'center';
      ctx.fillText(labels[i] || `${i + 1}`, xPos, y + height + 20);
    }
    
    // Draw axis labels
    if (xAxisLabel) {
      ctx.textAlign = 'center';
      ctx.fillText(xAxisLabel, x + width / 2, y + height + 40);
    }
    
    if (yAxisLabel) {
      ctx.save();
      ctx.translate(x - 40, y + height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(yAxisLabel, 0, 0);
      ctx.restore();
    }
  };
  
  /**
   * Draw legend
   */
  const drawLegend = (ctx, series, seriesNames) => {
    const seriesCount = series.length;
    const legendX = padding.left;
    const legendY = height - 20;
    const itemWidth = (width - padding.left - padding.right) / seriesCount;
    
    seriesNames.forEach((name, index) => {
      const x = legendX + itemWidth * index;
      
      // Draw color box
      ctx.fillStyle = cssVariables.chartColors[index % cssVariables.chartColors.length];
      ctx.fillRect(x, legendY, 15, 15);
      
      // Draw name
      ctx.fillStyle = cssVariables.textColor || '#333';
      ctx.textAlign = 'left';
      ctx.fillText(name, x + 20, legendY + 12);
    });
  };
  
  /**
   * Draw a rectangle with rounded corners
   */
  const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
    if (typeof radius === 'undefined') radius = 5;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  };
  
  /**
   * Convert hex color to rgba
   */
  const hexToRgba = (hex, alpha = 1) => {
    // Remove the hash if it exists
    hex = hex.replace('#', '');
    
    // Handle shorthand hex (#fff)
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  /**
   * Handle mouse move to update hover state
   */
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setHoveredElement({ x, y });
  };
  
  /**
   * Handle mouse leave to hide tooltip
   */
  const handleMouseLeave = () => {
    setHoveredElement(null);
    setTooltip({ visible: false });
  };
  
  /**
   * Handle click on chart elements
   */
  const handleClick = (e) => {
    if (!canvasRef.current || !onClick || !hoveredElement) return;
    
    // Pass the clicked data point to the onClick handler
    if (onClick && tooltip.visible) {
      onClick({
        x: hoveredElement.x,
        y: hoveredElement.y,
        dataIndex: tooltip.dataIndex,
        seriesIndex: tooltip.seriesIndex,
        value: tooltip.value
      });
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="canvas-analytics-chart"
      style={{ 
        position: 'relative', 
        width, 
        height, 
        backgroundColor,
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      
      {tooltip.visible && (
        <div 
          className="chart-tooltip"
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y - 35,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '5px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 100,
            whiteSpace: 'nowrap'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

CanvasAnalyticsChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
  ]).isRequired,
  type: PropTypes.oneOf(['bar', 'line', 'pie', 'area', 'scatter']),
  width: PropTypes.number,
  height: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  showLegend: PropTypes.bool,
  showTooltip: PropTypes.bool,
  animate: PropTypes.bool,
  backgroundColor: PropTypes.string,
  gridColor: PropTypes.string,
  textColor: PropTypes.string,
  borderRadius: PropTypes.number,
  padding: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  onClick: PropTypes.func,
  stacked: PropTypes.bool,
  formatTooltip: PropTypes.func,
  formatYAxis: PropTypes.func
};

export default CanvasAnalyticsChart;