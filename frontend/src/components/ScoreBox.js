import React from "react";
import "../styles/OrbitalDoc.css";

const ScoreBox = ({ score }) => {
  if (score === undefined || score === null) return null;


  return (
    
    <div className="orbitaldoc-score-box">
      <p className="orbitaldoc-score-label">Change Score</p>
      <p className="orbitaldoc-score-value">{score}</p>
    </div>
  );
};

export default ScoreBox;
