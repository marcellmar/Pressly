import React from "react";

const SustainabilityScore = ({ score, size = "md" }) => {
  // Determine color based on score
  const getScoreClass = (score) => {
    if (score >= 80) return "score-fill-high";
    if (score >= 50) return "score-fill-medium";
    return "score-fill-low";
  };

  // Size variants
  const sizeClasses = {
    sm: {
      container: "mb-2",
      label: "text-xs mb-1",
      barHeight: "h-1.5",
      scoreText: "text-xs",
    },
    md: {
      container: "mb-3",
      label: "text-sm mb-1 font-medium",
      barHeight: "h-2",
      scoreText: "text-sm",
    },
    lg: {
      container: "mb-4",
      label: "text-base mb-2 font-medium",
      barHeight: "h-3",
      scoreText: "text-base",
    },
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={classes.container}>
      <div className="flex justify-between items-center mb-1">
        <span className={classes.label}>Sustainability Score</span>
        <span className={`font-semibold ${classes.scoreText}`}>{score}/100</span>
      </div>
      <div className="sustainability-score">
        <div className={`score-bar ${classes.barHeight}`}>
          <div
            className={`score-fill ${getScoreClass(score)} ${classes.barHeight}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityScore;